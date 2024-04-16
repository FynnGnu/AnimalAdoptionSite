const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const readline = require('readline');
const session = require('express-session'); // Import express-session

const app = express(); // Define 'app' before using it

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure this points to your views directory

const port = 5087;

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key', // Replace 'your_secret_key' with a secret string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if you're using HTTPS
}));
app.use(express.json());


// Define your routes here
app.get("/", (req, res) => {
    res.render('index'); 
});
app.get("/find_pet", (req, res) => {
  res.render('find_pet'); 
});
app.get("/dog_care", (req, res) => {
  res.render('dog_care'); 
});
app.get("/cat_care", (req, res) => {
  res.render('cat_care'); 
});
app.get("/give_away_pet", (req, res) => {
  // Check if the user is logged in
  const isLoggedIn = req.session.username ? true : false;
  // Render the give_away_pet view and pass the isLoggedIn variable
  res.render('give_away_pet', { isLoggedIn });
 });
app.get("/contact", (req, res) => {
  res.render('contact'); 
});
app.get("/login", (req, res) => {
  res.render('login'); 
});
app.get("/create_account", (req, res) => {
  res.render('create_account'); 
});
app.get("/privacy_statement", (req, res) => {
  res.render('privacy_statement'); 
});


// Looks through the pet info text file to compare form inputs to each line
app.post("/findPets", async (req, res) => {
  try {
     const fileContent = fs.readFileSync(path.join(__dirname, 'available_pet_info.txt'), 'utf8');
     const lines = fileContent.split('\n');
     const pets = lines.map(line => {
       const [_, __, type, breed, age, gender, dogComp, catComp, kidsComp, comments, ownerName, ownerEmail] = line.split(':');
       return {
         type,
         breed,
         age: parseInt(age, 10), // Ensure age is treated as a number
         gender,
         dogComp: dogComp === 'true',
         catComp: catComp === 'true',
         kidsComp: kidsComp === 'true',
         comments,
         ownerName,
         ownerEmail
       };
     });
 
     const filteredPets = pets.filter(pet => {
       const {
         type,
         breed,
         age,
         gender,
         compatibility,
         ageFilter 
       } = req.body;
       let matches = true;
       if (type && pet.type.toLowerCase() !== type.toLowerCase()) matches = false;
       if (breed && breed !== 'any' && pet.breed !== breed) matches = false;
       if (gender && gender !== 'any' && pet.gender !== gender) matches = false;
 
       // Adjusted age filter logic
       if (ageFilter.young && !(pet.age >= 0 && pet.age <= 2)) matches = false;
       if (ageFilter.adult && !(pet.age >= 3 && pet.age <= 8)) matches = false;
       if (ageFilter.senior && !(pet.age >= 9)) matches = false;
 
       if (compatibility.dogs === true && !pet.dogComp) matches = false;
       if (compatibility.cats === true && !pet.catComp) matches = false;
       if (compatibility.children === true && !pet.kidsComp) matches = false;
 
       return matches;
     });
 
     res.json(filteredPets);
  } catch (error) {
     console.log("Something went wrong");
     res.status(500).json({
       error: 'An error occurred while finding the pet.'
     });
  }
 });
 
 
 
 
 

app.post("/validateInput", async (req, res) => { // Make the route handler async
    const username = req.body.username;
    const password = req.body.password;
    const result = await validateInput(username, password); // Use await here
    res.json(result); // Send JSON response with whatever the result was
   });

   app.post("/checkIfExists", async (req, res) => { // Make the route handler async
    const username = req.body.username;
    const password = req.body.password;
    const result = await checkIfExists(username, password); // Use await here
    if (result.success) {
        req.session.username = username;
    }
    res.json(result); // Send JSON response with whatever the result was
   });


   app.post("/addToAvailablePetInfo", async (req, res) => {
    const type = req.body.type;
    const breed = req.body.breed;
    const age = req.body.age;
    const gender = req.body.gender;
    const dogComp = req.body.dogComp;
    const catComp = req.body.catComp;
    const kidsComp = req.body.kidsComp;
    const comments = req.body.comments;
    const ownerName = req.body.ownerName;
    const ownerEmail = req.body.ownerEmail;
    const username = req.session.username;
    const result = await addToAvailablePetInfo(type, breed, age, gender, dogComp, catComp, kidsComp, comments, ownerName, ownerEmail, username); // Use await here
    res.json(result);
   });

   app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect("/login");
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect("/login"); // Redirect to the login page
    });
});

app.get("/isLoggedIn", (req, res) => {
    if (req.session.username) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get("/getUniqueBreeds", async (req, res) => {
  try {
     const fileContent = fs.readFileSync(path.join(__dirname, 'available_pet_info.txt'), 'utf8');
     const lines = fileContent.split('\n');
     const uniqueBreeds = new Set();
 
     lines.forEach(line => {
       const parts = line.split(':');
       if (parts.length > 3) {
         const breed = parts[3]; // Assuming the breed is the fourth part of each line
         uniqueBreeds.add(breed);
       }
     });
 
     res.json(Array.from(uniqueBreeds));
  } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'An error occurred while fetching unique breeds.' });
  }
 });
 



async function addToAvailablePetInfo(type, breed, age, gender, dogComp, catComp, kidsComp, comments, ownerName, ownerEmail, username) {
  try {
     // Read the file and find the highest counter value
     const fileStream = fs.createReadStream(__dirname + "/available_pet_info.txt");
     let highestCounter = 0;
     for await (const line of readline.createInterface({ input: fileStream, crlfDelay: Infinity })) {
       const parts = line.split(':', 2);
       if (parts.length > 1) {
         const counter = parseInt(parts[0], 10);
         if (counter > highestCounter) {
           highestCounter = counter;
         }
       }
     }

     breed = toLowerCase(breed);

     catComp = catComp === undefined ? false: true;
     dogComp = dogComp === undefined ? false: true;
     kidsComp = kidsComp === undefined ? false: true;

     // Increment the highest counter by one
     const newCounter = highestCounter + 1;
 
     // Append the new pet information with the incremented counter
     fs.appendFileSync(__dirname + "/available_pet_info.txt", `\n${newCounter}:${username}:${type}:${breed}:${age}:${gender}:${dogComp}:${catComp}:${kidsComp}:${comments}:${ownerName}:${ownerEmail}`);
 
     return { success: true, message: "Pet successfully added." };
  } catch (error) {
     console.log(error);
     return { success: false, message: "An error occurred. Please try again." };
  }
 }
 


async function checkIfExists(username, password) {
    try {
        const fileStream = fs.createReadStream(__dirname + "/login.txt");
        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity
        });
    
        // goes through each line, splits it into an array of 2 at the :, and compares username input to the username in the line
        for await (const line of rl) {
          const parts = line.split(':', 2);
          if (parts.length > 1 && parts[0] === username && parts[1] === password) {
            // returns true if username and password match the input
            return { success: true, message: "You have successfully logged in." };
          }
        }
        return { success: false, message: "Invalid credentials. Please try again."};
}
catch (error) {
  console.error();
    return { success: false, message: "An error occurred. Please try again." };
 }
}



// Function to check login.txt file for duplicate usernames and add the info the file if no duplicates are found
async function validateInput(username, password) {
// tries to read from login.txt file
try {
    const fileStream = fs.createReadStream(__dirname + "/login.txt");
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    // goes through each line, splits it into an array of 2 at the :, and compares username input to the username in the line
    for await (const line of rl) {
      const parts = line.split(':', 2);
      if (parts.length > 1 && parts[0] === username) {
        // returns false if username is found to be equal to one in the file
        return { success: false, message: "The username is already taken. Please try again." };
      }
    }

    // If username is not found, create a new account
    fs.appendFileSync(__dirname + "/login.txt", `${username}:${password}\n`);
    return { success: true, message: "Account successfully created. You may log in now." };
 } catch (error) {
  console.error();
    return { success: false, message: "An error occurred. Please try again." };
 }
}

   

app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});
