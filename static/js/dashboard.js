// document.addEventListener("DOMContentLoaded", () => {
//     const profileIcon = document.getElementById("profile-icon");
//     const sidebar = document.getElementById("sidebar");
//     const authLink = document.getElementById("auth-link");
//     const logoutLink = document.getElementById("logout");
//     const contentSection = document.getElementById("content");

//     // Toggle sidebar
//     profileIcon.addEventListener("click", () => {
//         sidebar.classList.toggle("hidden");
//         sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";
//     });

    
//     // Dynamic content loading
//     document.getElementById("blogs-btn").addEventListener("click", () => {
//         loadContent("/blogs", "Blogs");
//     });

//     document.getElementById("update-btn").addEventListener("click", () => {
//         loadContent("/update", "Update");
//     });

//     document.getElementById("profile-btn").addEventListener("click", () => {
//         loadContent("/profile", "Profile");
//     });

//     // Load content into the content section
//     function loadContent(url, type) {
//         contentSection.innerHTML = `<p>Loading ${type}...</p>`;
//         fetch(url)
//             .then((response) => response.text())
//             .then((html) => {
//                 contentSection.innerHTML = html;
//             })
//             .catch((error) => {
//                 console.error(`Failed to load ${type}:`, error);
//                 contentSection.innerHTML = `<p>Failed to load ${type}. Please try again later.</p>`;
//             });
//     }
// });


// document.addEventListener("DOMContentLoaded", () => {
//     const totalPosts = document.getElementById("total-posts");
//     const totalLikes = document.getElementById("total-likes");
//     const totalComments = document.getElementById("total-comments");
//     const postOverview = document.getElementById("post-overview");

//     // Fetch dashboard stats
//     fetch("http://127.0.0.1:8000/dashboard/stats")
//         .then((response) => response.json())
//         .then((data) => {
//             totalPosts.textContent = data.total_posts;
//             totalLikes.textContent = data.total_likes;
//             totalComments.textContent = data.total_comments;
//             renderPostOverview(data.recent_posts);
//         })
//         .catch((error) => console.error("Error fetching dashboard data:", error));

//     // Render post cards in the overview
//     function renderPostOverview(posts) {
//         postOverview.innerHTML = "";
//         posts.forEach((post) => {
//             const postCard = document.createElement("div");
//             postCard.classList.add("stat-card");
//             postCard.innerHTML = `
//                 <h2>${post.title}</h2>
//                 <p>Likes: ${post.likes_count} | Comments: ${post.comments_count}</p>
//             `;
//             postOverview.appendChild(postCard);
//         });
//     }
// });








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

    // Create a post card element
    function createPostCard(post) {
        const card = document.createElement("div");
        card.classList.add("post-card");

        const formattedDate = post.created_at
            ? new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
              })
            : "Unknown Date";

        card.innerHTML = `
            <h3>${post.title}</h3>
            <p class="post-meta">By: ${post.author_name} | ${formattedDate}</p>
            <p>${post.content_snippet}</p>
            <div class="post-stats">
                <span><i class="fas fa-thumbs-up"></i> ${post.likes_count}</span>
                <span><i class="fas fa-thumbs-down"></i> ${post.dislikes_count}</span>
                <span><i class="fas fa-comments"></i> ${post.comments_count}</span>
            </div>
        `;
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
});
