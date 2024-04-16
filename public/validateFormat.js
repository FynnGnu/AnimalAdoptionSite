function validateFormat(username, password) {

    if (username === "") {
        return { success: false, message: "Please enter a username." };
    }
    else if (password === "") {
        return { success: false, message: "Please enter a password." };
    }

        // Goes through username input
    for (let i = 0; i < username.length; i++) {
        // Checks if it is a number
        let isNumber = parseInt(username.charAt(i));

        // If NaN, checks if the char is a letter using charCode and returns false if not
        if (!isNumber) {
            let charCode = username.charCodeAt(i);
            if (!((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122))) {
                return { success: false, message: "Username must be only letters or numbers. Please try again." };
            }
         }
        }

    // values to check if password has at least 1 num and 1 letter
    let hasNumber = false;
    let hasLetter = false;
    // Goes through password input
    for (let i = 0; i < password.length; i++) {
        // If less than 4 digits, returns false
        if (password.length < 4) {
            return { success: false, message: "Password too short. Please try again." };
        }

        // Same as with username
        let isNumber = parseInt(password.charAt(i));

        if (!isNumber) {
            let charCode = password.charCodeAt(i);
            if (!((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122))) {
                return { success: false, message: "Password must be only letters or numbers. Please try again." };
            }
            // If it is a letter, sets hasLetter to true
            else {
                hasLetter = true;
            }
         }
         // If it doesnt go into the if statement (aka it's a number), sets hasNumber to true
         else {
            hasNumber = true;
         }
        }
        // If either hasLetter or hasNumber werent set to true, returns false
        if (!hasLetter || !hasNumber) {
            return { success: false, message: "Password must contain at least one letter and one number. Please try again." };
        }
        console.log("validateFormat.js success");
        return {success: true};

      }
