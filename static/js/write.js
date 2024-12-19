document.getElementById('blogForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    const title = document.getElementById('blogTitle').value;
    const content = document.getElementById('blogContent').value;
    const token = localStorage.getItem("access_token"); // Get the token from localStorage

    if (!token) {
        alert("User not authenticated. Please log in.");
        window.location.href = "/login";
        return;
    }

    // Construct the post object
    const postData = {
        title: title,
        content: content
    };

    // Send the data to the backend
    fetch('http://127.0.0.1:8000/write/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Send the JWT token in the Authorization header
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (response.ok) {
            alert('Blog post created successfully!');
            this.reset(); // Reset the form after publishing
            document.getElementById('preview').style.display = 'none';
        } else {
            response.json().then(err => alert(`Error: ${err.detail || 'Failed to create post.'}`));
        }
    })
    .catch(error => console.error('Error:', error));
});
