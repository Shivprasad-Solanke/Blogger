document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const likeBtn = document.getElementById("like-btn");
    const dislikeBtn = document.getElementById("dislike-btn");
    const likeCountSpan = document.getElementById("like-count");
    const dislikeCountSpan = document.getElementById("dislike-count");
    const commentBtn = document.getElementById("comment-btn");
    const commentCountSpan = document.getElementById("comment-count");
    const commentsSection = document.getElementById("comments-section");
    const commentList = document.getElementById("comment-list");
    const newComment = document.getElementById("new-comment");
    const submitComment = document.getElementById("submit-comment");
  
    // Initial data (you can fetch these from an API for real-world apps)
    let likeCount = 0;
    let dislikeCount = 0;
    let comments = [];
    let userReaction = null; // Tracks if the user has liked or disliked
  
    // Like button functionality
    likeBtn.addEventListener("click", () => {
      if (userReaction === "like") {
        likeCount--;
        userReaction = null;
      } else {
        if (userReaction === "dislike") {
          dislikeCount--;
        }
        likeCount++;
        userReaction = "like";
      }
      updateCounts();
    });
  
    // Dislike button functionality
    dislikeBtn.addEventListener("click", () => {
      if (userReaction === "dislike") {
        dislikeCount--;
        userReaction = null;
      } else {
        if (userReaction === "like") {
          likeCount--;
        }
        dislikeCount++;
        userReaction = "dislike";
      }
      updateCounts();
    });
  
    // Update like and dislike counts in the DOM
    function updateCounts() {
      likeCountSpan.textContent = likeCount;
      dislikeCountSpan.textContent = dislikeCount;
  
      // Update button states (optional visual feedback)
      likeBtn.classList.toggle("active", userReaction === "like");
      dislikeBtn.classList.toggle("active", userReaction === "dislike");
    }
  
    // Toggle comments section
    commentBtn.addEventListener("click", () => {
      commentsSection.classList.toggle("hidden");
    });
  
    // Submit a new comment
    submitComment.addEventListener("click", () => {
      const commentText = newComment.value.trim();
      if (commentText) {
        comments.push(commentText); // Add comment to the list
        newComment.value = ""; // Clear textarea
        renderComments();
      }
    });
  
    // Render comments in the DOM
    function renderComments() {
      commentList.innerHTML = ""; // Clear the list
      comments.forEach(comment => {
        const li = document.createElement("li");
        li.textContent = comment;
        commentList.appendChild(li);
      });
  
      // Update comment count
      commentCountSpan.textContent = comments.length;
    }
  
    // Initial render (in case you fetch data from an API)
    updateCounts();
    renderComments();
  });
  