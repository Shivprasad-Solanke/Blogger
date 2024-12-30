document.addEventListener("DOMContentLoaded", () => {
    const postContainer = document.getElementById("post-container"); // The container where posts are displayed
    const searchForm = document.getElementById("search-form"); // The search form element
    const searchInput = document.getElementById("search-input"); // The search input element

    // Extract the JWT token
    const token = localStorage.getItem("access_token");
    if (!token) {
        alert("User not authenticated. Please log in.");
        window.location.href = "/login";
        return;
    }

    // Decode the JWT to extract the user ID
    const userId = parseJwt(token).id;
    if (!userId) {
        alert("Failed to fetch user ID from token. Please log in again.");
        window.location.href = "/login";
        return;
    }

    // Update the URL with user_id and query parameters
    function updateUrl(userId, query = "") {
        const baseUrl = window.location.pathname;
        const newUrl = query
            ? `${baseUrl}?user_id=${userId}&query=${encodeURIComponent(query)}`
            : `${baseUrl}?user_id=${userId}`;
        window.history.pushState({}, "", newUrl);
    }

    // Fetch posts based on the user_id and optional query
    function fetchPosts(userId, query = "") {
        let apiUrl = `http://127.0.0.1:8000/posts?user_id=${userId}`;
        if (query) {
            apiUrl += `&query=${encodeURIComponent(query)}`;
        }

        fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                return response.json();
            })
            .then((data) => renderPosts(data.posts || []))
            .catch((error) => {
                console.error("Error fetching posts:", error);
                postContainer.innerHTML = "<p>Failed to load posts. Please try again later.</p>";
            });
    }

    // Render posts in the post container
    function renderPosts(posts) {
        postContainer.innerHTML = ""; // Clear the container

        if (posts.length === 0) {
            postContainer.innerHTML = "<p>No posts found.</p>";
            return;
        }

        posts.forEach((post) => {
            const postCard = createPostCard(post);
            postContainer.appendChild(postCard);
        });
    }

    function createPostCard(post) {
        const card = document.createElement("div");
        card.classList.add("post-card");
    
        const formattedDate = post.created_at
            ? new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
              })
            : "Unknown Date";
    
        // Create the main content of the card
        const postLink = document.createElement("a");
        postLink.href = `/templates/post.html?post_id=${post._id}`;
        postLink.classList.add("post-link");
        postLink.innerHTML = `
            <h3>${post.title}</h3>
            <p class="post-meta">By: ${post.author_name} | ${formattedDate}</p>
            <p>${post.content_snippet}</p>
            <div class="post-stats">
                <span><i class="fas fa-thumbs-up"></i> ${post.likes_count}</span>
                <span><i class="fas fa-thumbs-down"></i> ${post.dislikes_count}</span>
                <span><i class="fas fa-comments"></i> ${post.comments_count}</span>
            </div>
        `;
    
        // Create menu for options
        const menuContainer = document.createElement("div");
        menuContainer.classList.add("menu-container");
        menuContainer.innerHTML = `
            <div class="menu-icon">
                <i class="fas fa-ellipsis-v"></i>
            </div>
            <div class="menu-options hidden">
                <button class="menu-option update"><i class="fa-solid fa-pen"></i>Update</button>
                <button class="menu-option delete"><i class="fa-solid fa-trash"></i>Delete</button>
            </div>
        `;
    
        // Attach event listeners
        const menuIcon = menuContainer.querySelector(".menu-icon");
        const menuOptions = menuContainer.querySelector(".menu-options");
    
        // Toggle the menu visibility when the icon is clicked
        menuIcon.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent event bubbling
            menuOptions.classList.toggle("hidden");
        });
    
        // Close menu when clicking outside
        document.addEventListener("click", () => {
            menuOptions.classList.add("hidden");
        });
    
        // Prevent menu from closing when clicking inside it
        menuOptions.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    
       // DELETE button functionality
menuContainer.querySelector(".delete").addEventListener("click", async () => {
    const confirmation = confirm("Are you sure you want to delete this post?");
    if (confirmation) {
        try {
            // DELETE request to the FastAPI backend
            const response = await fetch(`http://127.0.0.1:8000/posts/${post._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json", // Optional if sending JSON body
                },
            });

            if (response.ok) {
                alert("Post deleted successfully!");
                card.remove(); // Remove the card from the DOM
            } else {
                const errorData = await response.json(); // Parse the response body
                alert(`Failed to delete the post: ${errorData.detail || response.statusText}`);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("An error occurred while deleting the post. Please try again later.");
        }
    }
});

        // Append the elements to the card
        card.appendChild(postLink);
        card.appendChild(menuContainer);
    
        return card;
    }
    
    

    // Parse JWT to extract payload
    function parseJwt(token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );
        return JSON.parse(jsonPayload);
    }

    // Handle search form submission
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page reload
        const query = searchInput.value.trim(); // Get the search query
        updateUrl(userId, query); // Update the URL with the query
        fetchPosts(userId, query); // Fetch posts based on the query
    });

    // Handle URL parameters on page load
    function handleInitialFetch() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get("query") || ""; // Get the 'query' parameter (if any)
        fetchPosts(userId, query); // Fetch posts with the user_id and query
    }

    // Initial fetch of posts
    handleInitialFetch();

    // Handle browser navigation events (e.g., back/forward)
    window.addEventListener("popstate", handleInitialFetch);

    fetch("/templates/shared/footer.html")
    .then((response) => response.text())
    .then((data) => (document.getElementById("footer").innerHTML = data));
});
