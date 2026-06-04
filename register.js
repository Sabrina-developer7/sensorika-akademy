document.addEventListener("DOMContentLoaded", () => {
    // Allaqachon kirgan bo'lsa, index ga qaytarish
    if (localStorage.getItem("username")) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("registerBtn").addEventListener("click", () => {
        const name     = document.getElementById("regName").value.trim();
        const username = document.getElementById("regUsername").value.trim();
        const password = document.getElementById("regPassword").value.trim();
        const errorMsg   = document.getElementById("errorMsg");
        const successMsg = document.getElementById("successMsg");

        errorMsg.classList.add("d-none");
        errorMsg.textContent = "";

        // Validatsiya
        if (!name || !username || !password) {
            errorMsg.textContent = "Barcha maydonlarni to'ldiring!";
            errorMsg.classList.remove("d-none");
            return;
        }
        if (password.length < 4) {
            errorMsg.textContent = "Parol kamida 4 ta belgidan iborat bo'lishi kerak!";
            errorMsg.classList.remove("d-none");
            return;
        }

        // Username mavjudligini tekshirish (localStorage dan ham)
        const saved = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        const allUsers = [...Users, ...saved];

        const exists = allUsers.find(u => u.username === username);
        if (exists) {
            errorMsg.textContent = "Bu username allaqachon band! Boshqa username tanlang.";
            errorMsg.classList.remove("d-none");
            return;
        }

        // Yangi foydalanuvchini saqlash
        const newUser = {
            id: Date.now(),
            name: name,
            username: username,
            password: password,
            role: "o'quvchi"
        };
        saved.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(saved));

        // Avtomatik kirish
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
    localStorage.setItem("role", newUser.role);

        successMsg.classList.remove("d-none");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    });
});
