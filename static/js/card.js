document.addEventListener("DOMContentLoaded", () => {
    const postContainer = document.getElementById("post-container");

    fetch("http://localhost:8000/posts/details")
        .then((response) => response.json())
        .then((data) => {
            const posts = data.posts;
            posts.forEach((post) => {
                const card = createCard(post);
                postContainer.appendChild(card);
            });
        })
        .catch((error) => console.error("Error fetching posts:", error));

    function createCard(post) {
        const card = document.createElement("div");
        card.classList.add("card");

        // Safely parse the created_at timestamp
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

        card.innerHTML = `
            <div class="card-header">${post.title}</div>
            <div class="card-details">
                <div class="card-subtitle">By: ${post.author_name}</div>
                <div class="card-timestamp">${formattedDate}</div>
            </div>
           
            <div class="card-content">${post.content_snippet}</div>
            <div class="card-icons">
                <span><i class="fas fa-thumbs-up"></i> ${post.likes_count}</span>
                <span><i class="fas fa-thumbs-down"></i> ${post.dislikes_count}</span>
                <span><i class="fas fa-comments"></i> ${post.comments_count}</span>
            </div>
        `;
        return card;
    }
});
