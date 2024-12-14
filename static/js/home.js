 // Load the navbar.html content into the #navbar div
 fetch('navbar.html')
 .then(response => {
     if (!response.ok) {
         throw new Error('Network response was not ok ' + response.statusText);
     }
     return response.text();
 })
 .then(data => {
     document.getElementById('navbar').innerHTML = data;
 })
 .catch(error => console.error('Error loading navbar:', error));

 fetch('footer.html')
 .then(response => {
     if (!response.ok) {
         throw new Error('Network response was not ok ' + response.statusText);
     }
     return response.text();
 })
 .then(data => {
     document.getElementById('footer').innerHTML = data;
 })
 .catch(error => console.error('Error loading footer:', error));