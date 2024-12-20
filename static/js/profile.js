document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        alert("User not authenticated. Please log in.");
        window.location.href = "/templates/login.html";
        return;
    }

    const userId = parseJwt(token).id;
    if (!userId) {
        alert("Failed to fetch user ID from token. Please log in again.");
        window.location.href = "/templates/login.html";
        return;
    }

    const userNameElement = document.getElementById("user-name");
    const userEmailElement = document.getElementById("user-email");
    const userPostsCountElement = document.getElementById("user-posts-count");
    const newNameInput = document.getElementById("new-name");
    const updateNameBtn = document.getElementById("update-name-btn");


    // Fetch user details
    function fetchUserProfile() {
        const url = `http://127.0.0.1:8000/profile?user_id=${userId}`;
        fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user profile");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched Data:", data); // Debugging line
                const profile = data?.profile; // Extract the `profile` object
                if (profile) {
                    userNameElement.textContent = profile.name || "Unknown";
                    userEmailElement.textContent = profile.email || "Unknown";
                    userPostsCountElement.textContent = profile.post_count || "0";
                } else {
                    userNameElement.textContent = "Unknown";
                    userEmailElement.textContent = "Unknown";
                    userPostsCountElement.textContent = "0";
                }
            })
            .catch((error) => {
                console.error("Error fetching profile:", error);
                alert("Failed to load profile. Please try again later.");
            });
    }

    // Update user name
    function updateUserName() {
        const newName = newNameInput.value.trim();
        if (!newName) {
            alert("Please enter a new name.");
            return;
        }

        const url = "http://127.0.0.1:8000/profile";
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                user_id: userId,
                name: newName,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update user name");
                }
                return response.json();
            })
            .then((data) => {
                alert(data.message || "Name updated successfully!");
                fetchUserProfile(); // Refresh profile
            })
            .catch((error) => {
                console.error("Error updating name:", error);
                alert("Failed to update name. Please try again.");
            });
    }

    // Initialize profile data
    fetchUserProfile();

    // Attach event listener to update name button
    updateNameBtn.addEventListener("click", updateUserName);

    // JWT Parsing Function
    function parseJwt(token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    }
});
