document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar");

    // Load Navbar HTML
    fetch("/templates/shared/navbar.html")
        .then((response) => response.text())
        .then((navbarHtml) => {
            navbarContainer.innerHTML = navbarHtml;
            updateNavbar(); // Update navbar based on user state
        })
        .catch((error) => console.error("Error loading navbar:", error));

    function updateNavbar() {
        const navbarRight = document.getElementById("navbar-right");
        const token = localStorage.getItem("access_token"); // Check for JWT

        if (token) {
            // User is logged in
            navbarRight.innerHTML = `
                <a href="#" id="profile-icon"><i class="fas fa-user"></i></a>
                <div id="user-sidebar" class="sidebar">
                    <ul>
                    <li><a href="/templates/home.html">Home</a></li>
                    <li><a href="/templates/write.html">Write</a></li>
                        <li><a href="/templates/dashboard.html">Dashboard</a></li>
                        <li><a href="/templates/profile.html">Profile</a></li>
                        <li><a href="#" id="sign-out">Sign Out</a></li>
                    </ul>
                </div>
            `;
            attachEventListeners();
        } else {
            // User is not logged in
            navbarRight.innerHTML = `
                <a href="/templates/signup.html" class="btn">Sign Up</a>
                <a href="/templates/login.html" class="btn">Login</a>
            `;
        }
    }

    function attachEventListeners() {
        // Toggle Sidebar
        const profileIcon = document.getElementById("profile-icon");
        const userSidebar = document.getElementById("user-sidebar");
        profileIcon.addEventListener("click", (event) => {
            event.preventDefault();
            userSidebar.classList.toggle("visible");
        });

        // Handle Sign Out
        const signOutButton = document.getElementById("sign-out");
        signOutButton.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("access_token"); // Remove token
            window.location.href = "home.html"; // Redirect to home
        });
    }
});
