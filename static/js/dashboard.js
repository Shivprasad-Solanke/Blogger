document.addEventListener("DOMContentLoaded", () => {
    const profileIcon = document.getElementById("profile-icon");
    const sidebar = document.getElementById("sidebar");
    const authLink = document.getElementById("auth-link");
    const logoutLink = document.getElementById("logout");
    const contentSection = document.getElementById("content");

    // Toggle sidebar
    profileIcon.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";
    });

    // Dynamic content loading
    document.getElementById("blogs-btn").addEventListener("click", () => {
        loadContent("/blogs", "Blogs");
    });

    document.getElementById("update-btn").addEventListener("click", () => {
        loadContent("/update", "Update");
    });

    document.getElementById("profile-btn").addEventListener("click", () => {
        loadContent("/profile", "Profile");
    });

    // Load content into the content section
    function loadContent(url, type) {
        contentSection.innerHTML = `<p>Loading ${type}...</p>`;
        fetch(url)
            .then((response) => response.text())
            .then((html) => {
                contentSection.innerHTML = html;
            })
            .catch((error) => {
                console.error(`Failed to load ${type}:`, error);
                contentSection.innerHTML = `<p>Failed to load ${type}. Please try again later.</p>`;
            });
    }
});