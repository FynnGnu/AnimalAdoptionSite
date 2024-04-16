async function populateBreeds() {
  const breedSelect = document.getElementById("breed");
 
  try {
     const response = await fetch('/getUniqueBreeds');
     const uniqueBreeds = await response.json();
 
     uniqueBreeds.forEach(breed => {
       const option = document.createElement("option");
       option.value = breed.toLowerCase(); // Optionally convert breed names to lowercase
       option.text = breed;
       breedSelect.appendChild(option);
     });
  } catch (error) {
     console.error('Failed to fetch unique breeds:', error);
  }
 }
 
 // Call the function to populate breeds
 populateBreeds();
 