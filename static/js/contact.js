document.addEventListener("DOMContentLoaded", () => {
    // const token = localStorage.getItem("access_token");
    // if (!token) {
    //     alert("User not authenticated. Please log in.");
    //     window.location.href = "/login";
    //     return;
    // }

    // // Decode JWT to get the user ID
    // const userId = parseJwt(token).id;
    // if (!userId) {
    //     alert("Failed to fetch user ID from token. Please log in again.");
    //     window.location.href = "/login";
    //     return;
    // }

    // Handle form submission
    document.getElementById("contact-form").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        const form = event.target; // Get the form that was submitted
        const formData = new FormData(form); // Collect form data

        // Add userId to form data if needed
        // formData.append("user_id", userId);

        // Convert FormData to a regular object
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Send data as JSON to FastAPI backend
        try {
            const response = await fetch("http://127.0.0.1:8000/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Send as JSON
                },
                body: JSON.stringify(data), // Send the data object
            });

            if (response.ok) {
                alert("Message sent successfully!");
                document.getElementById("contact-form").reset(); 
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.detail || "Failed to send message."}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    });

    // Function to decode JWT and extract payload
    // function parseJwt(token) {
    //     const base64Url = token.split(".")[1];
    //     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    //     const jsonPayload = decodeURIComponent(
    //         atob(base64)
    //             .split("")
    //             .map((c) => {
    //                 return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    //             })
    //             .join("")
    //     );
    //     return JSON.parse(jsonPayload);
    // }
    fetch("/templates/shared/footer.html")
    .then((response) => response.text())
    .then((data) => (document.getElementById("footer").innerHTML = data));
});
