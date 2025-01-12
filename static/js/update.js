document.addEventListener("DOMContentLoaded", () => {
    const updateForm = document.getElementById("update-form");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const tagInput = document.getElementById("tags"); // This is the input for tags
    const errorMessage = document.getElementById("error-message");

    // Extract the post ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (!postId) {
        alert("Post ID is missing. Please try again.");
        window.location.href = "/"; // Redirect to the home page if no post ID is found
        return;
    }

    // Fetch post data from the API
    fetch(`http://127.0.0.1:8000/posts/${postId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch post details.");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data); // Log the data to see what is returned
            if (data && data.post) {
                const post = data.post;
                // Pre-populate the form with the post data
                titleInput.value = post.title;
                contentInput.value = post.content;

                // Ensure the tags are displayed as a comma-separated string in the input field
                if (Array.isArray(post.tags)) {
                    tagInput.value = post.tags.join(", ");  // Join tags as a comma-separated string
                } else {
                    tagInput.value = ""; // If tags are not available, leave it empty
                }
            } else {
                alert("Post not found.");
                window.location.href = "/"; // Redirect to home if post not found
            }
        })
        .catch((error) => {
            console.error("Error fetching post details:", error);
            alert("An error occurred while fetching post details.");
        });

    // Handle form submission
    updateForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form from submitting the default way

        const updatedPost = {
            title: titleInput.value.trim(),
            content: contentInput.value.trim(),
            tags: tagInput.value.split(",").map(tag => tag.trim()) // Convert comma-separated string to an array
        };

        if (!updatedPost.title || !updatedPost.content) {
            errorMessage.textContent = "Both fields are required.";
            errorMessage.style.display = "block";
            return;
        }

        // Send PUT request to update the post
        fetch(`http://127.0.0.1:8000/posts/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`, // Ensure authentication token is included
            },
            body: JSON.stringify(updatedPost),
        })
        .then((response) => {
            if (response.ok) {
                alert("Post updated successfully!");
                window.location.href = `/templates/post.html?post_id=${postId}`; // Redirect to the post details page
            } else {
                return response.json().then((errorData) => {
                    throw new Error(errorData.detail || "Error updating post.");
                });
            }
        })
        .catch((error) => {
            console.error("Error updating post:", error);
            errorMessage.textContent = error.message || "An error occurred. Please try again.";
            errorMessage.style.display = "block";
        });
    });
     // Fetch and include the footer HTML
     fetch("/templates/shared/footer.html")
     .then((response) => response.text())
     .then((data) => (document.getElementById("footer").innerHTML = data));

});
