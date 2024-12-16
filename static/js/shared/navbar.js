document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const root = document.documentElement;

    // Ensure the theme exists, default to "light" if it's not set
    let currentTheme = root.getAttribute("data-theme") || "light"; 

    themeToggle.addEventListener("click", () => {
        // Toggle theme
        currentTheme = currentTheme === "dark" ? "light" : "dark"; // Toggle the theme
        root.setAttribute("data-theme", currentTheme); // Set new theme
        themeToggle.textContent = currentTheme === "dark" ? "🌙" : "☀️"; // Change button text
    });
});
