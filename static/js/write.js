// document.addEventListener("DOMContentLoaded", () => {
//     const root = document.documentElement;

//     // JWT Token from LocalStorage
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//         alert("User not authenticated. Please log in.");
//         window.location.href = "/login";
//         return;
//     }

//     // Decode JWT to get the author ID
//     const authorId = parseJwt(token).id;
//     if (!authorId) {
//         alert("Failed to fetch user ID from token. Please log in again.");
//         window.location.href = "/login";
//         return;
//     }


//     // Preview button functionality
//     document.getElementById("previewBtn").addEventListener("click", () => {
//         const title = document.getElementById("blogTitle").value;
//         const content = document.getElementById("blogContent").value;

//         // Set preview content
//         document.getElementById("previewTitle").textContent = title;
//         document.getElementById("previewContent").textContent = content;

//         // Display preview section
//         document.getElementById("preview").style.display = "block";
//     });

//     // Form submission functionality
//     document.getElementById("blogForm").addEventListener("submit", async (event) => {
//         event.preventDefault(); // Prevent default form submission

//         const title = document.getElementById("blogTitle").value;
//         const content = document.getElementById("blogContent").value;

//         // Construct the post object
//         const postData = {
//             title: title,
//             content: content,
//             author_id: authorId, // Add author_id from the JWT
//         };

//         // Send the data to the backend
//         try {
//             const response = await fetch("http://127.0.0.1:8000/posts/", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${localStorage.getItem("token")}`, // Replace with actual token storage
//                 },
//                 body: JSON.stringify(postData),
//             });

//             if (response.ok) {
//                 alert("Blog post created successfully!");
//                 document.getElementById("blogForm").reset(); // Reset the form
//                 document.getElementById("preview").style.display = "none"; // Hide preview
//             } else {
//                 const errorData = await response.json();
//                 alert(`Error: ${errorData.detail || "Failed to create post."}`);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             alert("An unexpected error occurred. Please try again.");
//         }
//     });

//     // Fetch and include the footer HTML
//     fetch("/shared/footer.html")
//         .then((response) => response.text())
//         .then((data) => (document.getElementById("footer").innerHTML = data));

//     // Function to decode JWT and extract payload
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
// });

// document.addEventListener("DOMContentLoaded", () => {
//     const root = document.documentElement;

//     // JWT Token from LocalStorage
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//         alert("User not authenticated. Please log in.");
//         window.location.href = "/login";
//         return;
//     }

//     // Decode JWT to get the author ID
//     const authorId = parseJwt(token).id;
//     if (!authorId) {
//         alert("Failed to fetch user ID from token. Please log in again.");
//         window.location.href = "/login";
//         return;
//     }

//     // Preview button functionality
//     document.getElementById("previewBtn").addEventListener("click", () => {
//         const title = document.getElementById("blogTitle").value;
//         const content = document.getElementById("blogContent").value;
//         const tags = document.getElementById("blogTags").value;

//         if (!title || !content) {
//             alert("Please fill out the title and content before previewing.");
//             return;
//         }

//         // Set preview content
//         document.getElementById("previewTitle").textContent = title;
//         document.getElementById("previewContent").textContent = content;
//         document.getElementById("previewTags").textContent = tags
//             ? `Tags: ${tags}`
//             : "Tags: None";

//         // Display preview section
//         document.getElementById("preview").style.display = "block";
//     });

//     // Form submission functionality
//     document.getElementById("blogForm").addEventListener("submit", async (event) => {
//         event.preventDefault(); // Prevent default form submission

//         const title = document.getElementById("blogTitle").value.trim();
//         const content = document.getElementById("blogContent").value.trim();
//         const tags = document.getElementById("blogTags").value
//             .split(",")
//             .map((tag) => tag.trim())
//             .filter((tag) => tag); // Remove empty tags

//         if (!title || !content) {
//             alert("Title and content are required.");
//             return;
//         }

//         // Construct the post object
//         const postData = {
//             title: title,
//             content: content,
//             tags: tags,
//         };

//         console.log("Post Data:", postData); // Inspect the data being sent

//         // Send the data to the backend
//         try {
//             const response = await fetch("http://127.0.0.1:8000/write", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`,
//                 },
//                 body: JSON.stringify(postData),
//             });

//             if (response.ok) {
//                 alert("Blog post created successfully!");
//                 document.getElementById("blogForm").reset(); // Reset the form
//                 document.getElementById("preview").style.display = "none"; // Hide preview
//             } else {
//                 const errorData = await response.json();
//                 alert(`Error: ${errorData.detail || "Failed to create post."}`);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             alert("An unexpected error occurred. Please try again.");
//         }
//     });

//     // Fetch and include the footer HTML
//     fetch("/shared/footer.html")
//         .then((response) => response.text())
//         .then((data) => (document.getElementById("footer").innerHTML = data));

//     // Function to decode JWT and extract payload
//     function parseJwt(token) {
//         try {
//             const base64Url = token.split(".")[1];
//             const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//             const jsonPayload = decodeURIComponent(
//                 atob(base64)
//                     .split("")
//                     .map((c) => {
//                         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//                     })
//                     .join("")
//             );
//             return JSON.parse(jsonPayload);
//         } catch (error) {
//             console.error("Failed to parse JWT:", error);
//             return null;
//         }
//     }
// });




document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;

    // JWT Token from LocalStorage
    const token = localStorage.getItem("access_token");
    if (!token) {
        alert("User not authenticated. Please log in.");
        window.location.href = "/templates/login.html";
        return;
    }

    // Decode JWT to get the author ID
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

        // Set preview content, converting newlines to <br>
    document.getElementById("previewTitle").textContent = title;
    document.getElementById("previewContent").innerHTML = content.replace(/\n/g, "<br>");


        // Display preview section
        document.getElementById("preview").style.display = "block";
    });

    // Form submission functionality
    document.getElementById("blogForm").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        const title = document.getElementById("blogTitle").value;
        const content = document.getElementById("blogContent").value;
        const tags = document.getElementById("blogTags").value.split(",").map(tag => tag.trim()); // Tags input

        // Construct the post object
        const postData = {
            title: title,
            content: content,
            author_id: authorId, // Add author_id from the JWT
            tags: tags,
        };

        // Send the data to the backend
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
                document.getElementById("blogForm").reset(); // Reset the form
                document.getElementById("preview").style.display = "none"; // Hide preview
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.detail || "Failed to create post."}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    });

    // Fetch and include the footer HTML
    fetch("/shared/footer.html")
        .then((response) => response.text())
        .then((data) => (document.getElementById("footer").innerHTML = data));

    // Function to decode JWT and extract payload
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
});
