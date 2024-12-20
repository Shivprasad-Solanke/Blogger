// document.addEventListener("DOMContentLoaded", () => {
//     const likeButton = document.getElementById("like-button");
//     const dislikeButton = document.getElementById("dislike-button");
//     const likeCountSpan = document.getElementById("like-count");
//     const dislikeCountSpan = document.getElementById("dislike-count");

//     let hasLiked = false;
//     let hasDisliked = false;

//     // Get postId from URL
//     const urlParams = new URLSearchParams(window.location.search);
//     const postId = urlParams.get("post_id");

//     if (!postId) {
//         alert("Post ID not found in the URL.");
//         return;
//     }

//     // Extract the JWT token
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//         alert("User not authenticated. Please log in.");
//         window.location.href = "/templates/login.html";
//         return;
//     }

//     // Decode the JWT to extract the user ID
//     const userId = parseJwt(token).id;
//     if (!userId) {
//         alert("Failed to fetch user ID from token. Please log in again.");
//         window.location.href = "/login";
//         return;
//     }

//     // Fetch user's reaction state when the page loads
//     fetch(`http://127.0.0.1:8000/posts/${postId}/reactions?user_id=${userId}`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             hasLiked = data.hasLiked;
//             hasDisliked = data.hasDisliked;
//             updateReactionButtons();
//         })
//         .catch((error) => console.error("Error fetching reaction state:", error));

//     // Add event listeners for like and dislike buttons
//     likeButton.addEventListener("click", () => {
//         toggleLike(postId, userId);
//     });

//     dislikeButton.addEventListener("click", () => {
//         toggleDislike(postId, userId);
//     });

//     // Parse JWT to extract payload
//     function parseJwt(token) {
//         const base64Url = token.split(".")[1];
//         const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//         const jsonPayload = decodeURIComponent(
//             atob(base64)
//                 .split("")
//                 .map((c) => {
//                     return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//                 })
//                 .join("")
//         );
//         return JSON.parse(jsonPayload);
//     }

//     // Update button styles based on reaction state
//     function updateReactionButtons() {
//         if (hasLiked) {
//             likeButton.textContent = "Liked";
//             likeButton.classList.add("active");
//         } else {
//             likeButton.textContent = "Like";
//             likeButton.classList.remove("active");
//         }

//         if (hasDisliked) {
//             dislikeButton.textContent = "Disliked";
//             dislikeButton.classList.add("active");
//         } else {
//             dislikeButton.textContent = "Dislike";
//             dislikeButton.classList.remove("active");
//         }
//     }

//     // Toggle like functionality
//     function toggleLike(postId, userId) {
//         const method = hasLiked ? "DELETE" : "POST";
//         const endpoint = "http://127.0.0.1:8000/like";

//         fetch(endpoint, {
//             method: method,
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//                 post_id: postId,
//                 user_id: userId,
//             }),
//         })
//             .then((response) => {
//                 if (response.ok) {
//                     return response.json().then(() => {
//                         hasLiked = !hasLiked;
//                         if (hasLiked) {
//                             likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
//                             if (hasDisliked) {
//                                 dislikeCountSpan.textContent =
//                                     parseInt(dislikeCountSpan.textContent) - 1;
//                                 hasDisliked = false;
//                             }
//                         } else {
//                             likeCountSpan.textContent = parseInt(likeCountSpan.textContent) - 1;
//                         }
//                         updateReactionButtons();
//                     });
//                 } else {
//                     return response.json().then((errorData) => {
//                         alert(errorData.detail);
//                     });
//                 }
//             })
//             .catch((error) => console.error("Error toggling like:", error));
//     }

//     // Toggle dislike functionality
//     function toggleDislike(postId, userId) {
//         const method = hasDisliked ? "DELETE" : "POST";
//         const endpoint = "http://127.0.0.1:8000/dislike";

//         fetch(endpoint, {
//             method: method,
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//                 post_id: postId,
//                 user_id: userId,
//             }),
//         })
//             .then((response) => {
//                 if (response.ok) {
//                     return response.json().then(() => {
//                         hasDisliked = !hasDisliked;
//                         if (hasDisliked) {
//                             dislikeCountSpan.textContent =
//                                 parseInt(dislikeCountSpan.textContent) + 1;
//                             if (hasLiked) {
//                                 likeCountSpan.textContent = parseInt(likeCountSpan.textContent) - 1;
//                                 hasLiked = false;
//                             }
//                         } else {
//                             dislikeCountSpan.textContent =
//                                 parseInt(dislikeCountSpan.textContent) - 1;
//                         }
//                         updateReactionButtons();
//                     });
//                 } else {
//                     return response.json().then((errorData) => {
//                         alert(errorData.detail);
//                     });
//                 }
//             })
//             .catch((error) => console.error("Error toggling dislike:", error));
//     }
// });






// // Working code
// // 1111111111111111111111111111111111111111111111111
// document.addEventListener("DOMContentLoaded", () => {
//     const postTitle = document.getElementById("post-title");
//     const postAuthor = document.getElementById("post-author");
//     const postTimestamp = document.getElementById("post-timestamp");
//     const postContent = document.getElementById("post-content");
//     const likeCountSpan = document.getElementById("like-count");
//     const dislikeCountSpan = document.getElementById("dislike-count");
//     const commentCountSpan = document.getElementById("comment-count");
//     const commentsList = document.getElementById("comments-list");
//     const newCommentInput = document.getElementById("new-comment");
//     const submitCommentBtn = document.getElementById("submit-comment");
//     const likeButton = document.getElementById("like-button");
//     const dislikeButton = document.getElementById("dislike-button");

//     const urlParams = new URLSearchParams(window.location.search);
//     const postId = urlParams.get("post_id");

//     if (!postId) {
//         postContent.textContent = "Post not found.";
//         return;
//     }

//     // Extract the JWT token
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//         alert("User not authenticated. Please log in.");
//         window.location.href = "/templates/login.html";
//         return;
//     }

//     // Decode the JWT to extract the user ID
//     const userId = parseJwt(token).id;
//     if (!userId) {
//         alert("Failed to fetch user ID from token. Please log in again.");
//         window.location.href = "/login";
//         return;
//     }

//     // Fetch post details
//     fetch(`http://127.0.0.1:8000/posts/${postId}`)
//         .then((response) => response.json())
//         .then((data) => renderPost(data.post))
//         .catch((error) => console.error("Error fetching post:", error));

//     function renderPost(post) {
//         postTitle.textContent = post.title;
//         postAuthor.textContent = `By ${post.author_name}`;
//         postTimestamp.textContent = new Date(post.created_at).toLocaleDateString();
//         postContent.innerHTML = post.content.replace(/\n/g, "<br>");
//         likeCountSpan.textContent = post.likes_count;
//         dislikeCountSpan.textContent = post.dislikes_count;
//         commentCountSpan.textContent = post.comments_count;

//         commentsList.innerHTML = post.comments
//             .map(
//                 (comment) => `
//             <li>
//                 <p>${comment.content.replace(/\n/g, "<br>")}</p>
//                 <p>By: ${comment.user_name}</p>
//             </li>`
//             )
//             .join("");
//     }

//     // Add new comment
//     submitCommentBtn.addEventListener("click", () => {
//         const commentText = newCommentInput.value.trim();

//         if (!commentText) {
//             alert("Comment cannot be empty.");
//             return;
//         }

//         const commentData = {
//             post_id: postId,
//             user_id: userId, // Use the extracted user ID
//             content: commentText,
//         };

//         fetch("http://127.0.0.1:8000/comments", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`, // Pass the token for authentication
//             },
//             body: JSON.stringify(commentData),
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error("Failed to add comment.");
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 const newCommentItem = document.createElement("li");
//                 newCommentItem.innerHTML = `
//                     <p>${data.comment.content.replace(/\n/g, "<br>")}</p>
//                     <p>By: ${data.comment.user_name}</p>
//                 `;
//                 commentsList.appendChild(newCommentItem);
//                 newCommentInput.value = "";
//                 commentCountSpan.textContent = parseInt(commentCountSpan.textContent) + 1;
//             })
//             .catch((error) => console.error("Error adding comment:", error));
//     });


//     // Add event listeners for like and dislike buttons
//     likeButton.addEventListener("click", () => {
//         likePost(postId, userId);
//     });

//     dislikeButton.addEventListener("click", () => {
//         dislikePost(postId, userId);
//     });

//     // Parse JWT to extract payload
//     function parseJwt(token) {
//         const base64Url = token.split(".")[1];
//         const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//         const jsonPayload = decodeURIComponent(
//             atob(base64)
//                 .split("")
//                 .map((c) => {
//                     return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//                 })
//                 .join("")
//         );
//         return JSON.parse(jsonPayload);
//     }

//     // like a post
//     function likePost(postId) {
//         const token = localStorage.getItem("access_token");
//         const userId = parseJwt(token).id;
    
//         fetch("http://127.0.0.1:8000/like", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 post_id: postId,
//                 user_id: userId
//             })
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.message) {
//                 likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
//                 // alert(data.message);
//             } else {
//                 alert(data.detail);
//             }
//         })
//         .catch(error => console.error("Error liking post:", error));
//     }
    
//     // dislike a post
//     function dislikePost(postId) {
//         const token = localStorage.getItem("access_token");
//         const userId = parseJwt(token).id;
    
//         fetch("http://127.0.0.1:8000/dislike", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 post_id: postId,
//                 user_id: userId
//             })
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.message) {
//                 dislikeCountSpan.textContent = parseInt(dislikeCountSpan.textContent) + 1;
//                 // alert(data.message);
//             } else {
//                 alert(data.detail);
//             }
//         })
//         .catch(error => console.error("Error disliking post:", error));
//     }
    

//     // remove like
    
// });


// ####################################
// // Track the user's reaction state
// let hasLiked = false;
// let hasDisliked = false;

// // Fetch user's reaction state when the page loads
// fetch(`http://127.0.0.1:8000/posts/${postId}/reactions?user_id=${userId}`, {
//     headers: {
//         Authorization: `Bearer ${token}`
//     }
// })
//     .then((response) => response.json())
//     .then((data) => {
//         hasLiked = data.hasLiked;
//         hasDisliked = data.hasDisliked;
//         updateReactionButtons();
//     })
//     .catch((error) => console.error("Error fetching reaction state:", error));

// // Update button styles based on reaction state
// function updateReactionButtons() {
//     if (hasLiked) {
//         likeButton.textContent = "Liked";
//     } else {
//         likeButton.textContent = "Like";
//     }

//     if (hasDisliked) {
//         dislikeButton.textContent = "Disliked";
//     } else {
//         dislikeButton.textContent = "Dislike";
//     }
// }

// // Toggle like
// likeButton.addEventListener("click", () => {
//     if (hasLiked) {
//         // Remove like
//         fetch("http://127.0.0.1:8000/like", {
//             method: "DELETE",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify({ post_id: postId, user_id: userId })
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error("Failed to remove like.");
//                 }
//                 return response.json();
//             })
//             .then(() => {
//                 hasLiked = false;
//                 likeCountSpan.textContent = parseInt(likeCountSpan.textContent) - 1;
//                 updateReactionButtons();
//             })
//             .catch((error) => console.error("Error removing like:", error));
//     } else {
//         // Add like
//         fetch("http://127.0.0.1:8000/like", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify({ post_id: postId, user_id: userId })
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error("Failed to add like.");
//                 }
//                 return response.json();
//             })
//             .then(() => {
//                 hasLiked = true;
//                 hasDisliked = false; // Remove dislike if previously disliked
//                 likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
//                 if (parseInt(dislikeCountSpan.textContent) > 0) {
//                     dislikeCountSpan.textContent = parseInt(dislikeCountSpan.textContent) - 1;
//                 }
//                 updateReactionButtons();
//             })
//             .catch((error) => console.error("Error adding like:", error));
//     }
// });

// // Toggle dislike
// dislikeButton.addEventListener("click", () => {
//     if (hasDisliked) {
//         // Remove dislike
//         fetch("http://127.0.0.1:8000/dislike", {
//             method: "DELETE",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify({ post_id: postId, user_id: userId })
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error("Failed to remove dislike.");
//                 }
//                 return response.json();
//             })
//             .then(() => {
//                 hasDisliked = false;
//                 dislikeCountSpan.textContent = parseInt(dislikeCountSpan.textContent) - 1;
//                 updateReactionButtons();
//             })
//             .catch((error) => console.error("Error removing dislike:", error));
//     } else {
//         // Add dislike
//         fetch("http://127.0.0.1:8000/dislike", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify({ post_id: postId, user_id: userId })
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error("Failed to add dislike.");
//                 }
//                 return response.json();
//             })
//             .then(() => {
//                 hasDisliked = true;
//                 hasLiked = false; // Remove like if previously liked
//                 dislikeCountSpan.textContent = parseInt(dislikeCountSpan.textContent) + 1;
//                 if (parseInt(likeCountSpan.textContent) > 0) {
//                     likeCountSpan.textContent = parseInt(likeCountSpan.textContent) - 1;
//                 }
//                 updateReactionButtons();
//             })
//             .catch((error) => console.error("Error adding dislike:", error));
//     }
// });


document.addEventListener("DOMContentLoaded", () => {
    const postTitle = document.getElementById("post-title");
    const postAuthor = document.getElementById("post-author");
    const postTimestamp = document.getElementById("post-timestamp");
    const postContent = document.getElementById("post-content");
    const likeCountSpan = document.getElementById("like-count");
    const dislikeCountSpan = document.getElementById("dislike-count");
    const commentCountSpan = document.getElementById("comment-count");
    const commentsList = document.getElementById("comments-list");
    const newCommentInput = document.getElementById("new-comment");
    const submitCommentBtn = document.getElementById("submit-comment");
    const likeButton = document.getElementById("like-button");
    const dislikeButton = document.getElementById("dislike-button");

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("post_id");

    if (!postId) {
        postContent.textContent = "Post not found.";
        return;
    }

    // Extract the JWT token
    const token = localStorage.getItem("access_token");
    if (!token) {
        alert("User not authenticated. Please log in.");
        window.location.href = "/templates/login.html";
        return;
    }

    // Decode the JWT to extract the user ID
    const userId = parseJwt(token).id;
    if (!userId) {
        alert("Failed to fetch user ID from token. Please log in again.");
        window.location.href = "/login";
        return;
    }

    // Reaction state variables
    let hasLiked = false;
    let hasDisliked = false;

    // Fetch user's reaction state when the page loads
    fetch(`http://127.0.0.1:8000/posts/${postId}/reactions?user_id=${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            hasLiked = data.hasLiked;
            hasDisliked = data.hasDisliked;
            updateReactionButtons();
        })
        .catch((error) => console.error("Error fetching reaction state:", error));

    // Fetch post details
    fetch(`http://127.0.0.1:8000/posts/${postId}`)
        .then((response) => response.json())
        .then((data) => renderPost(data.post))
        .catch((error) => console.error("Error fetching post:", error));

    function renderPost(post) {
        postTitle.textContent = post.title;
        postAuthor.textContent = `By ${post.author_name}`;
        postTimestamp.textContent = new Date(post.created_at).toLocaleDateString();
        postContent.innerHTML = post.content.replace(/\n/g, "<br>");
        likeCountSpan.textContent = post.likes_count;
        dislikeCountSpan.textContent = post.dislikes_count;
        commentCountSpan.textContent = post.comments_count;

        commentsList.innerHTML = post.comments
            .map(
                (comment) => `
            <li>
                <p>${comment.content.replace(/\n/g, "<br>")}</p>
                <p>By: ${comment.user_name}</p>
            </li>`
            )
            .join("");
    }

    // Add new comment
    submitCommentBtn.addEventListener("click", () => {
        const commentText = newCommentInput.value.trim();

        if (!commentText) {
            alert("Comment cannot be empty.");
            return;
        }

        const commentData = {
            post_id: postId,
            user_id: userId, // Use the extracted user ID
            content: commentText,
        };

        fetch("http://127.0.0.1:8000/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(commentData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add comment.");
                }
                return response.json();
            })
            .then((data) => {
                const newCommentItem = document.createElement("li");
                newCommentItem.innerHTML = `
                    <p>${data.comment.content.replace(/\n/g, "<br>")}</p>
                    <p>By: ${data.comment.user_name}</p>
                `;
                commentsList.appendChild(newCommentItem);
                newCommentInput.value = "";
                commentCountSpan.textContent = parseInt(commentCountSpan.textContent) + 1;
            })
            .catch((error) => console.error("Error adding comment:", error));
    });

    // Add event listeners for like and dislike buttons
    likeButton.addEventListener("click", () => {
        toggleLike(postId, userId);
    });

    dislikeButton.addEventListener("click", () => {
        toggleDislike(postId, userId);
    });

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

    // Update button styles based on reaction state
    function updateReactionButtons() {
        if (hasLiked) {
            likeButton.textContent = "Liked";
            likeButton.classList.add("active");
        } else {
            likeButton.textContent = "Like";
            likeButton.classList.remove("active");
        }

        if (hasDisliked) {
            dislikeButton.textContent = "Disliked";
            dislikeButton.classList.add("active");
        } else {
            dislikeButton.textContent = "Dislike";
            dislikeButton.classList.remove("active");
        }
    }

    // Toggle like functionality
    function toggleLike(postId, userId) {
        const method = hasLiked ? "DELETE" : "POST";
        const endpoint = "http://127.0.0.1:8000/like";

        fetch(endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                post_id: postId,
                user_id: userId,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then(() => {
                        hasLiked = !hasLiked;
                        if (hasLiked) {
                            likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
                            if (hasDisliked) {
                                dislikeCountSpan.textContent =
                                    parseInt(dislikeCountSpan.textContent) - 1;
                                hasDisliked = false;
                            }
                        } else {
                            likeCountSpan.textContent = parseInt(likeCountSpan.textContent) - 1;
                        }
                        updateReactionButtons();
                    });
                } else {
                    return response.json().then((errorData) => {
                        alert(errorData.detail);
                    });
                }
            })
            .catch((error) => console.error("Error toggling like:", error));
    }

    // Toggle dislike functionality
    function toggleDislike(postId, userId) {
        const method = hasDisliked ? "DELETE" : "POST";
        const endpoint = "http://127.0.0.1:8000/dislike";

        fetch(endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                post_id: postId,
                user_id: userId,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then(() => {
                        hasDisliked = !hasDisliked;
                        if (hasDisliked) {
                            dislikeCountSpan.textContent =
                                parseInt(dislikeCountSpan.textContent) + 1;
                            if (hasLiked) {
                                likeCountSpan.textContent = parseInt(likeCountSpan.textContent) - 1;
                                hasLiked = false;
                            }
                        } else {
                            dislikeCountSpan.textContent =
                                parseInt(dislikeCountSpan.textContent) - 1;
                        }
                        updateReactionButtons();
                    });
                } else {
                    return response.json().then((errorData) => {
                        alert(errorData.detail);
                    });
                }
            })
            .catch((error) => console.error("Error toggling dislike:", error));
    }
});

