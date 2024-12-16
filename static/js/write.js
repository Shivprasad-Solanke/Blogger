document.addEventListener("DOMContentLoaded", () => {
    const blogContainer = document.getElementById("blog-container");
    const themeToggle = document.getElementById("theme-toggle");
    const root = document.documentElement;

    // Toggle theme
    themeToggle.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme");
        root.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
        themeToggle.textContent = currentTheme === "dark" ? "🌙" : "☀️";
    });
document.getElementById('previewBtn').addEventListener('click', function () {
    const title = document.getElementById('blogTitle').value;
    const content = document.getElementById('blogContent').value;
    const imageUpload = document.getElementById('imageUpload');

    // Set preview title and content
    previewTitle.textContent = title;
    previewContent.textContent = content;

    // Display the image preview if selected
    if (imageUpload.files && imageUpload.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(imageUpload.files[0]);
    } else {
        previewImage.style.display = 'none';
    }

    // Show preview section
    document.getElementById('preview').style.display = 'block';
});

document.getElementById('blogForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    const title = document.getElementById('blogTitle').value;
    const content = document.getElementById('blogContent').value;

    // Construct the post object
    const postData = {
        title: title,
        content: content
    };

    // Send the data to the backend
    fetch('http://127.0.0.1:8000/posts/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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


fetch('shared/footer.html')
    .then(response => response.text())
    .then(data => document.getElementById('footer').innerHTML = data)
});