document.addEventListener("DOMContentLoaded", () => {
    const studentsRow = document.getElementById("students-row");
    if (!studentsRow) return;

    Students.forEach(student => {
        if (student.kurs !== "front-end") return;

        let col3 = document.createElement("div");
        col3.classList.add("col");

        col3.innerHTML = `
            <div class="card h-100 shadow-sm" style="cursor:pointer;" onclick="goToSinglePage(${student.id})">
                <div class="row g-0">
                    <div class="col-md-4 d-flex align-items-center">
                        <img src="${student.rasm}" class="img-fluid rounded-start ms-2" alt="O'quvchi rasmi">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <p class="card-text text-muted mb-1">${student.kurs}</p>
                            <h5 class="card-title">${student.fio}</h5>
                            <p class="card-text text-secondary small">${student.group}</p>
                            <p class="card-text text-primary fw-bold mb-0">O'quvchi haqida -></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        studentsRow.append(col3);
    });
});

function goToSinglePage(id) {
    const username = localStorage.getItem("username");
    if (!username) {
        window.location.href = "singIn.html";
    } else {
        window.location.href = "singlePage.html?id=" + id;
    }
}
