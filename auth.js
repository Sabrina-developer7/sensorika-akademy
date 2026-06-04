document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});

function updateNavbar() {
    const authBtn = document.getElementById("authBtn");
    if (!authBtn) return;

    const username = localStorage.getItem("username");

    // If logged in, try to find the user's role (from Users or saved registeredUsers)
    if (username) {
        const saved = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        const allUsers = [...Users, ...saved];
        const me = allUsers.find(u => u.username === username) || {};
        const role = me.role || localStorage.getItem("role") || '';

        let adminLink = '';
        if (role === "ustoz") {
            adminLink = `<a href="admin.html" class="btn btn-warning text-dark me-2">Admin panel</a>`;
        }

        authBtn.innerHTML = `
            ${adminLink}
            <span class="text-white fw-semibold me-2" style="font-size:15px;">👤 ${username}</span>
            <button class="btn btn-danger px-3 fw-semibold" onclick="logout()">Profildan chiqish</button>
        `;
    } else {
        authBtn.innerHTML = `
            <a href="singIn.html" class="btn btn-primary px-3 fw-semibold me-2">Kirish</a>
            <a href="register.html" class="btn btn-success px-3 fw-semibold">Ro'yxatdan o'tish</a>
        `;
    }
}

function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("role");
    window.location.href = "index.html";
}
