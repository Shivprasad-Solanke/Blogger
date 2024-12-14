document.getElementById('previewBtn').addEventListener('click', function () {
    const title = document.getElementById('blogTitle').value;
    const content = document.getElementById('blogContent').value;
    const imageUpload = document.getElementById('imageUpload');
    const previewImage = document.getElementById('previewImage');

    // Update the preview
    document.getElementById('previewTitle').innerText = title;
    document.getElementById('previewContent').innerText = content;

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
});

document.getElementById('blogForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this); // Automatically collects data from the form
    fetch('/api/publish-blog', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Blog published successfully!');
            this.reset(); // Reset the form after publishing
            document.getElementById('preview').style.display = 'none';
        } else {
            alert('Error publishing blog.');
        }
    })
    .catch(error => console.error('Error:', error));
});

// Load the navbar and footer
fetch('navbar.html')
    .then(response => response.text())
    .then(data => document.getElementById('navbar').innerHTML = data)
    .catch(error => console.error('Error loading navbar:', error));

fetch('footer.html')
    .then(response => response.text())
    .then(data => document.getElementById('footer').innerHTML = data)
