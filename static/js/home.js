document.addEventListener("DOMContentLoaded", () => {
    const blogContainer = document.getElementById("blog-container");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    // Handle search form submission
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page reload
        const query = searchInput.value.trim(); // Get the query from the input field
        if (query) {
            updateUrlWithQuery(query); // Update the URL with the query
            handleUrlAndFetchPosts(); // Fetch posts based on the query
        }
    });

    window.addEventListener("popstate", handleUrlAndFetchPosts); // Handle back/forward navigation

    // Handle URL parameters and fetch posts
    function handleUrlAndFetchPosts() {
        const urlParams = new URLSearchParams(window.location.search); // Get query from URL
        const query = urlParams.get("query") || ""; // Get the 'query' parameter (if any)
        fetchPosts(query); // Fetch posts based on query
    }

    function fetchPosts(query) {
        let apiUrl = "http://127.0.0.1:8000/posts";
        if (query) {
            apiUrl += `?query=${encodeURIComponent(query)}`;
        }

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => renderPosts(data.posts || []))
            .catch((error) => console.error("Error fetching posts:", error));
    }

    function renderPosts(posts) {
        blogContainer.innerHTML = "";

        if (posts.length === 0) {
            blogContainer.innerHTML = "<p>No posts found.</p>";
            return;
        }

        posts.forEach((post) => {
            const card = createCard(post);
            blogContainer.appendChild(card);
        });
    }


    function createCard(post) {
        const card = document.createElement("div");
        card.classList.add("card");
    
        const formattedDate = post.created_at
            ? new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
            : "Unknown Date";
    
        // Create an anchor tag to wrap the card content
        const postLink = document.createElement("a");
        postLink.href = `/templates/post.html?post_id=${post._id}`;  // Link to the post page
        postLink.classList.add("post-link");  // Optional: Add a class for styling
    
        // Fill the card content inside the anchor tag
        postLink.innerHTML = `
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
    
        // Append the anchor tag to the card
        card.appendChild(postLink);
    
        return card;
    }
    

    // // Update the URL with the query
    function updateUrlWithQuery(query) {
        const baseUrl = window.location.pathname; // This gets the current page's URL without query parameters
        const newUrl = query ? `${baseUrl}?query=${encodeURIComponent(query)}` : baseUrl; // Add the query parameter
        window.history.pushState({}, "", newUrl); // Update the browser's address bar
    }

    // Call this function initially to load posts based on the current query (if any)
    handleUrlAndFetchPosts();
});
