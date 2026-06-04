document.addEventListener('DOMContentLoaded', () => {
    // Require auth and role
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (!username || role !== 'ustoz') {
        // Not authorized
        document.body.innerHTML = '<div class="container mt-5"><h3>Ruxsat berilmagan. Admin sifatida tizimga kiring.</h3><a href="singIn.html" class="btn btn-primary mt-3">Kirish</a></div>';
        return;
    }

    const addBtn = document.getElementById('addBtn');
    const cancelBtn = document.getElementById('cancelEdit');
    const error = document.getElementById('error');
    const success = document.getElementById('success');
    const studentsTableBody = document.querySelector('#studentsTable tbody');

    let editingId = null; // null when adding new, otherwise id being edited

    function renderTable() {
        const merged = window.Students || [];
        studentsTableBody.innerHTML = '';
        merged.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.id}</td>
                <td>${s.fio}</td>
                <td>${s.kurs}</td>
                <td>${s.group || ''}</td>
                <td>
                    <button class="btn btn-sm btn-info edit-btn" data-id="${s.id}">Tahrirlash</button>
                </td>
            `;
            studentsTableBody.append(tr);
        });

        // attach edit handlers
        document.querySelectorAll('.edit-btn').forEach(b => {
            b.addEventListener('click', (ev) => {
                const id = ev.currentTarget.getAttribute('data-id');
                startEdit(Number(id));
            });
        });
    }

    function startEdit(id) {
        const student = (window.Students || []).find(s => Number(s.id) === Number(id));
        if (!student) return;
        editingId = Number(id);
        document.getElementById('fio').value = student.fio || '';
        document.getElementById('kurs').value = student.kurs || '';
        document.getElementById('group').value = student.group || '';
        document.getElementById('rasm').value = student.rasm || '';
        document.getElementById('tiniq').value = student.tiniq || '';

        addBtn.textContent = 'Saqlash';
        cancelBtn.classList.remove('d-none');
        error.classList.add('d-none');
        success.classList.add('d-none');
    }

    function resetForm() {
        editingId = null;
        document.getElementById('fio').value = '';
        document.getElementById('kurs').value = '';
        document.getElementById('group').value = '';
        document.getElementById('rasm').value = '';
        document.getElementById('tiniq').value = '';
        addBtn.textContent = "Qo'shish";
        cancelBtn.classList.add('d-none');
        error.classList.add('d-none');
        success.classList.add('d-none');
    }

    function saveNewOrEdit() {
        const fio = document.getElementById('fio').value.trim();
        const kurs = document.getElementById('kurs').value.trim();
        const group = document.getElementById('group').value.trim();
        const rasm = document.getElementById('rasm').value.trim();
        const tiniq = document.getElementById('tiniq').value.trim();

        error.classList.add('d-none');
        success.classList.add('d-none');

        if (!fio || !kurs) {
            error.textContent = "Ism va kurs maydonlari majburiy.";
            error.classList.remove('d-none');
            return;
        }

        // handle add
        if (editingId === null) {
            const saved = JSON.parse(localStorage.getItem('addedStudents') || '[]');
            const allExisting = [...(window.Students || []), ...saved];
            let maxId = allExisting.reduce((m, s) => Math.max(m, Number(s.id) || 0), 0);
            const newId = maxId + 1;

            const newStudent = {
                id: newId,
                fio,
                kurs,
                group: group || '',
                rasm: rasm || 'https://via.placeholder.com/150',
                tiniq: tiniq || rasm || 'https://via.placeholder.com/600'
            };

            saved.push(newStudent);
            localStorage.setItem('addedStudents', JSON.stringify(saved));

            success.textContent = "Yangi o'quvchi muvaffaqiyatli qo'shildi.";
            success.classList.remove('d-none');
        } else {
            // editing existing
            const id = editingId;

            // First, check if this id exists in addedStudents (newly added locally)
            const added = JSON.parse(localStorage.getItem('addedStudents') || '[]');
            const addedIdx = added.findIndex(a => Number(a.id) === Number(id));
            if (addedIdx >= 0) {
                // update the addedStudents entry
                added[addedIdx] = Object.assign({}, added[addedIdx], { fio, kurs, group, rasm: rasm || added[addedIdx].rasm, tiniq: tiniq || added[addedIdx].tiniq });
                localStorage.setItem('addedStudents', JSON.stringify(added));
            } else {
                // store in editedStudents so it overrides base Students
                const edited = JSON.parse(localStorage.getItem('editedStudents') || '[]');
                const editIdx = edited.findIndex(e => Number(e.id) === Number(id));
                const payload = { id, fio, kurs, group, rasm: rasm || '', tiniq: tiniq || '' };
                if (editIdx >= 0) {
                    edited[editIdx] = Object.assign({}, edited[editIdx], payload);
                } else {
                    edited.push(payload);
                }
                localStorage.setItem('editedStudents', JSON.stringify(edited));
            }

            success.textContent = "O'quvchi ma'lumotlari yangilandi.";
            success.classList.remove('d-none');
        }

        // Refresh data
        setTimeout(() => {
            // Re-run storage merge by reloading the page to pick up changes
            window.location.reload();
        }, 600);
    }

    addBtn.addEventListener('click', saveNewOrEdit);
    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetForm();
    });

    // initial render
    renderTable();

    // --- Create new user (admin only) ---
    const createUserBtn = document.getElementById('createUserBtn');
    const userError = document.getElementById('userError');
    const userSuccess = document.getElementById('userSuccess');

    createUserBtn.addEventListener('click', (e) => {
        e.preventDefault();
        userError.classList.add('d-none');
        userSuccess.classList.add('d-none');

        const name = document.getElementById('newName').value.trim();
        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value.trim();
        const role = document.getElementById('newRole').value;

        if (!username || !password) {
            userError.textContent = 'Username va parol kiritilishi shart.';
            userError.classList.remove('d-none');
            return;
        }

        // Check uniqueness across database Users and registeredUsers
        const saved = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const allUsers = [...Users, ...saved];
        if (allUsers.find(u => u.username === username)) {
            userError.textContent = 'Bu username allaqachon mavjud.';
            userError.classList.remove('d-none');
            return;
        }

        const newUser = {
            id: Date.now(),
            name: name,
            username: username,
            password: password,
            role: role
        };

        saved.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(saved));

        userSuccess.textContent = 'Yangi foydalanuvchi yaratildi. U hozirgina tizimga kirishi mumkin.';
        userSuccess.classList.remove('d-none');

        // clear inputs
        document.getElementById('newName').value = '';
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('newRole').value = "o'quvchi";
    });
});
