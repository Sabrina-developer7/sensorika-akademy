document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("username")) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("sendBtn").addEventListener("click", (e) => {
        e.preventDefault();

        const username = document.getElementById("floatingInput").value.trim();
        const password = document.getElementById("floatingPassword").value.trim();
        const errorMsg = document.getElementById("errorMsg");

        // database.js dagi Users + localStorage da ro'yxatdan o'tganlar
        const saved = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        const allUsers = [...Users, ...saved];

        let found = false;
        allUsers.forEach(user => {
            if (username === user.username && password === user.password) {
                found = true;
                localStorage.setItem("username", user.username);
                if (user.role) localStorage.setItem("role", user.role);
                localStorage.setItem("password", user.password);
                window.location.href = "index.html";
            }
        });

        if (!found) {
            errorMsg.classList.remove("d-none");
        }
    });
});
