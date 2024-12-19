


// 22222222222222222
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

//     const urlParams = new URLSearchParams(window.location.search);
//     const postId = urlParams.get("post_id");

//     if (!postId) {
//         postContent.textContent = "Post not found.";
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
//             user_id: "current_user_id", // Replace with actual user ID from your authentication logic
//             content: commentText,
//         };

//         console.log(commentData)

//         fetch("http://127.0.0.1:8000/comments", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
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
                Authorization: `Bearer ${token}`, // Pass the token for authentication
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
        likePost(postId, userId);
    });

    dislikeButton.addEventListener("click", () => {
        dislikePost(postId, userId);
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

    // like a post
    function likePost(postId) {
        const token = localStorage.getItem("access_token");
        const userId = parseJwt(token).id;
    
        fetch("http://127.0.0.1:8000/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                post_id: postId,
                user_id: userId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
                // alert(data.message);
            } else {
                alert(data.detail);
            }
        })
        .catch(error => console.error("Error liking post:", error));
    }
    
    // dislike a post
    function dislikePost(postId) {
        const token = localStorage.getItem("access_token");
        const userId = parseJwt(token).id;
    
        fetch("http://127.0.0.1:8000/dislike", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                post_id: postId,
                user_id: userId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                dislikeCountSpan.textContent = parseInt(dislikeCountSpan.textContent) + 1;
                // alert(data.message);
            } else {
                alert(data.detail);
            }
        })
        .catch(error => console.error("Error disliking post:", error));
    }
    

    // remove like
    
});
