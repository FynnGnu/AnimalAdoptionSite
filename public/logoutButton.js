function insertLogoutButton() {
  const navbar = document.querySelector(".navbar ul");
  const logoutListItem = document.createElement("li");
  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logout";
  logoutButton.id = "logoutButton"; // Assign the ID "logoutButton"
  logoutButton.onclick = function() {
     logout();
  }
  logoutListItem.appendChild(logoutButton);
  navbar.appendChild(logoutListItem);
 }
 
 function logout() {
   // Send a GET request to the server to terminate the session
   fetch('/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
   })
   .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // If the server successfully terminated the session, proceed with client-side actions
      removeLogoutButton();
      // Store the logout message in session storage
      sessionStorage.setItem('logoutMessage', 'You have successfully logged out.');
      // Redirect to the login page
      window.location.href = '/login';
   })
   .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
   });
  }
  
  
 
 
 function removeLogoutButton() {
  console.log('Attempting to remove logout button'); // Debugging statement
  const logoutButton = document.getElementById('logoutButton'); // Corrected selector
  if (logoutButton) {
     console.log('Logout button found, attempting to remove'); // Debugging statement
     logoutButton.parentNode.removeChild(logoutButton);
  } else {
     console.log('Logout button not found'); // Debugging statement
  }
 }
 