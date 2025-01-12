document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        alert("User not authenticated. Please log in.");
        window.location.href = "/login";
        return;
    }

    const authorId = parseJwt(token).id;
    if (!authorId) {
        alert("Failed to fetch user ID from token. Please log in again.");
        window.location.href = "/login";
        return;
    }

    // Preview button functionality
    document.getElementById("previewBtn").addEventListener("click", () => {
        const title = document.getElementById("blogTitle").value;
        const content = document.getElementById("blogContent").value;
        document.getElementById("previewTitle").textContent = title;
        document.getElementById("previewContent").innerHTML = content.replace(/\n/g, "<br>");
        document.getElementById("preview").style.display = "block";
    });

    // Form submission functionality
    document.getElementById("blogForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("blogTitle").value.trim();
        const content = document.getElementById("blogContent").value.trim();
        const tags = document.getElementById("blogTags").value.split(",").map(tag => tag.trim());

        if (!title || !content) {
            alert("Title and content are required.");
            return;
        }

        const postData = {
            title,
            content,
            author_id: authorId,
            tags,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/write", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                alert("Blog post created successfully!");
                document.getElementById("blogForm").reset();
                document.getElementById("preview").style.display = "none";
                window.location.href = `/templates/dashboard.html`;
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.detail || "Failed to create post."}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    });

    fetch("/templates/shared/footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("footer").innerHTML = data);

    function parseJwt(token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    }
});
