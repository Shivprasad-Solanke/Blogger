


document.addEventListener("DOMContentLoaded", () => {
    // Get elements by ID
    const postTitle = document.getElementById("post-title");
    const postAuthor = document.getElementById("post-author");
    const postTimestamp = document.getElementById("post-timestamp");
    const postContent = document.getElementById("post-content");
    const likeCountSpan = document.getElementById("like-count");
    const dislikeCountSpan = document.getElementById("dislike-count");
    const commentBtn = document.getElementById("comment-btn");
    const commentCountSpan = document.getElementById("comment-count");
    const commentsSection = document.getElementById("comments-section");
    const commentsList = document.getElementById("comments-list");
    const newComment = document.getElementById("new-comment");
    const submitComment = document.getElementById("submit-comment");

    // Get post_id from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("post_id");

    if (!postId) {
        postContent.textContent = "Post not found.";
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
        postContent.textContent = post.content;
        likeCountSpan.textContent = post.likes_count;
        dislikeCountSpan.textContent = post.dislikes_count;
        commentCountSpan.textContent = post.comments_count;

        commentsList.innerHTML = post.comments.map(comment => `
            <li>
                <p>${comment.content}</p>
                <p>By: ${comment.author_name}</p>
            </li>
        `).join('');
    }

    // Handle likes and dislikes
    let userReaction = null;

    document.getElementById("like-btn").addEventListener("click", () => {
        if (userReaction === "like") {
            likeCountSpan.textContent = --post.likes_count;
            userReaction = null;
        } else {
            if (userReaction === "dislike") dislikeCountSpan.textContent = --post.dislikes_count;
            likeCountSpan.textContent = ++post.likes_count;
            userReaction = "like";
        }
    });

    document.getElementById("dislike-btn").addEventListener("click", () => {
        if (userReaction === "dislike") {
            dislikeCountSpan.textContent = --post.dislikes_count;
            userReaction = null;
        } else {
            if (userReaction === "like") likeCountSpan.textContent = --post.likes_count;
            dislikeCountSpan.textContent = ++post.dislikes_count;
            userReaction = "dislike";
        }
    });

    // Toggle comment section
    commentBtn.addEventListener("click", () => {
        commentsSection.classList.toggle("hidden");
    });

    // Add new comments
    submitComment.addEventListener("click", () => {
        const commentText = newComment.value.trim();
        if (commentText) {
            const newCommentItem = document.createElement("li");
            newCommentItem.innerHTML = `<p>${commentText}</p><p>By: You</p>`;
            commentsList.appendChild(newCommentItem);
            newComment.value = "";
            commentCountSpan.textContent = parseInt(commentCountSpan.textContent) + 1;
        }
    });
});
