document.addEventListener("DOMContentLoaded", () => {
    const postContainer = document.getElementById("post-container");

    fetch("http://127.0.0.1:8000/users/675ab8fb35449c1ad5b09499/posts")
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






// document.addEventListener("DOMContentLoaded", () => {
//     const postContainer = document.getElementById("post-container");

//     // Example of using dynamic URLs depending on the situation
//     const currentUrl = window.location.href;
//     const urlParams = new URLSearchParams(window.location.search);
//     // const userId = "675ab8fb35449c1ad5b09499"; // Assume we get this dynamically based on login state
//     const searchQuery = urlParams.get("query") || ""; // Get search query from URL or empty string if not present

//     // let fetchUrl = "http://127.0.0.1:8000/posts";
//     let fetchUrl = "http://127.0.0.1:5500/templates/home.html";


//     // Add filters to the URL if they exist
//     if (userId) {
//         fetchUrl += `?user_id=${userId}`;
//     }
//     if (searchQuery) {
//         fetchUrl += `&query=${searchQuery}`;
//     }

//     // Fetch posts based on filters
//     fetch(fetchUrl)
//         .then((response) => response.json())
//         .then((data) => {
//             const posts = data.posts;
//             posts.forEach((post) => {
//                 const card = createCard(post);
//                 postContainer.appendChild(card);
//             });
//         })
//         .catch((error) => console.error("Error fetching posts:", error));

//     function createCard(post) {
//         const card = document.createElement("div");
//         card.classList.add("card");

//         // Safely parse the created_at timestamp
//         let formattedDate = "Unknown Date";
//         if (post.created_at) {
//             const creationDate = new Date(post.created_at);
//             if (!isNaN(creationDate)) {
//                 formattedDate = creationDate.toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                 });
//             }
//         }

//         card.innerHTML = `
//             <div class="card-header">${post.title}</div>
//             <div class="card-details">
//                 <div class="card-subtitle">By: ${post.author_name}</div>
//                 <div class="card-timestamp">${formattedDate}</div>
//             </div>
           
//             <div class="card-content">${post.content_snippet}</div>
//             <div class="card-icons">
//                 <span><i class="fas fa-thumbs-up"></i> ${post.likes_count}</span>
//                 <span><i class="fas fa-thumbs-down"></i> ${post.dislikes_count}</span>
//                 <span><i class="fas fa-comments"></i> ${post.comments_count}</span>
//             </div>
//         `;
//         return card;
//     }
// });
