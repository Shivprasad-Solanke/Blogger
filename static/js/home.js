document.addEventListener("DOMContentLoaded", () => {
    const blogContainer = document.getElementById("blog-container");
    const themeToggle = document.getElementById("theme-toggle");
    const root = document.documentElement;

    // Toggle theme
    themeToggle.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme");
        root.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
        themeToggle.textContent = currentTheme === "dark" ? "🌙" : "☀️";
    });

    // Fetch blog posts from the API
    fetch("http://localhost:8000/posts/details")
        .then((response) => response.json())
        .then((data) => {
            const posts = data.posts; // Assuming the response contains an array of posts.
            posts.forEach(post => {
                const card = createBlogCard(post);
                blogContainer.appendChild(card);
            });
        })
        .catch((error) => console.error("Error fetching blog posts:", error));

    // Function to create a blog card
    function createBlogCard(post) {
        const card = document.createElement("div");
        card.classList.add("blog-card");

        // Format the date
        let formattedDate = "Unknown Date";
        if (post.created_at) {
            const creationDate = new Date(post.created_at);
            if (!isNaN(creationDate)) {
                formattedDate = creationDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });
            }
        }

        // Add content to the card
        card.innerHTML = `
            <div class="card-content-wrapper">
                 <div class="card-text">
                    <div class="card-header">${post.title}</div>
                    <div class="card-subtitle">By: ${post.author_name} | ${formattedDate}</div>
                    <div class="card-content">${post.content_snippet}</div>
                    <div class="card-icons">
                        <span><i class="fas fa-thumbs-up"></i> ${post.likes_count}</span>
                        <span><i class="fas fa-thumbs-down"></i> ${post.dislikes_count}</span>
                        <span><i class="fas fa-comments"></i> ${post.comments_count}</span>
                    </div>
                </div>
                    <div class="card-image">
                        <img src="${post.image_url}" alt="Blog image">
                    </div>
            </div>
`;


        return card;
    }
});
 
 // Load the navbar.html content into the #navbar div
 fetch('navbar.html')
 .then(response => {
     if (!response.ok) {
         throw new Error('Network response was not ok ' + response.statusText);
     }
     return response.text();
 })
 .then(data => {
     document.getElementById('navbar').innerHTML = data;
 })
 .catch(error => console.error('Error loading navbar:', error));

 fetch('footer.html')
 .then(response => {
     if (!response.ok) {
         throw new Error('Network response was not ok ' + response.statusText);
     }
     return response.text();
 })
 .then(data => {
     document.getElementById('footer').innerHTML = data;
 })
 .catch(error => console.error('Error loading footer:', error));