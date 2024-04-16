function validateForm() {
  const animalType = document.getElementById("type").value;
  let breed;
  let age;
 
  // Check if ownerName and ownerEmail exist
  const ownerNameExists = !!document.getElementById("ownerName");
  const ownerEmailExists = !!document.getElementById("ownerEmail");
 
  // Check if breed and age are dropdown selections or text inputs
  const breedInput = document.getElementById("breed");
  const ageInput = document.getElementById("age");
 
  if (breedInput.tagName === "SELECT") {
     breed = breedInput.value;
  } else if (breedInput.tagName === "INPUT") {
     breed = breedInput.value.trim();
  }
 
  if (ageInput.tagName === "SELECT") {
     age = ageInput.value;
  } else if (ageInput.tagName === "INPUT") {
     age = ageInput.value.trim();
  }
 
  const gender = document.getElementById("gender").value;
 
  // Check if any of the required fields are empty
  if (animalType === "" || breed === "" || age === "" || gender === "") {
     return { success: false, message: "Please fill in all required fields." };
  }
  else if ((ownerNameExists || ownerEmailExists) && (ownerName.value.trim() === "" || ownerEmail.value.trim() === "")) {
     return { success: false, message: "Owner's name and email are required." };
  }
 
  return { success: true, message: "Validation successful." };
 }
 