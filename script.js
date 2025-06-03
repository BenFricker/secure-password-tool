// ------ JavaScript for Password Strength Checker ------ //
// 1. Get references to HTML elements
const passwordInput = document.getElementById("password-input");
const strengthBar = document.getElementById("strength-bar");
const feedbackMessages = document.getElementById("feedback-messages");
const togglePasswordVisibility = document.getElementById("toggle-password-visibility");

// Get references to individual requirement feedback items
const requirementLength = document.querySelector(".requirement-length");
const requirementUppercase = document.querySelector(".requirement-uppercase");
const requirementLowercase = document.querySelector(".requirement-lowercase");
const requirementNumber = document.querySelector(".requirement-number");
const requirementSymbol = document.querySelector(".requirement-symbol");

// Get references to Generate Password Elements
const passwordLengthInput = document.getElementById("password-length");
const includeUppercase = document.getElementById("include-uppercase");
const includeLowercase = document.getElementById("include-lowercase");
const includeNumbers = document.getElementById("include-numbers");
const includeSymbols = document.getElementById("include-symbols");
const generatePasswordBtn = document.getElementById("generate-password-btn");
const exportPasswordBtn = document.getElementById("export-password-btn");

// 2. Add an event listener to the password input field
passwordInput.addEventListener("input", updatePasswordStrength);

// 3. Add Event listender for password visibility toggle
togglePasswordVisibility.addEventListener("click", () => {
  // Check the current type of input
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type); // toggle the type

})


// 4. Function to update password strength
function updatePasswordStrength() {
  const password = passwordInput.value;
  let strength = 0; // Initialise strength score
  const messages = []; // Array to hold suggestions or detailed feedback

  // --- Password Strength Criteria Checks --- //

  // 4.1 Length Check
  // Length: Met
  if (password.length >= 8) {
    strength += 20;
    requirementLength.classList.add("met");
    requirementLength.classList.remove("unmet");
  } else {

    // Length: Unmet
    requirementLength.classList.add("unmet");
    requirementLength.classList.remove("Met");
    if (password.length > 0 && password.length < 8) {
      messages.push("Password should be at least 8 characters long.");
    }
  }

  // 4.2 Check for Uppercase Letters
  const hasUppercase = /[A-Z]/.test(password); // Use regular expresssion to test A-Z
  if (hasUppercase) {
    strength += 20;
    requirementUppercase.classList.add("met");
    requirementUppercase.classList.remove("unmet");
  } else {
    requirementUppercase.classList.add("unmet");
    requirementUppercase.classList.remove("met");
    if (password.length > 0) {
      messages.push("Password should include at least one uppercase letter");
    }
  }

  // 4.3 Check for lowercase Letters
  const hasLowercase = /[a-z]/.test(password); // Use regular expresssion to test A-Z
  if (hasLowercase) {
    strength += 20;
    requirementLowercase.classList.add("met");
    requirementLowercase.classList.remove("unmet");
  } else {
    requirementLowercase.classList.add("unmet");
    requirementLowercase.classList.remove("met");
    if (password.length > 0) {
      messages.push("Password should include at least one lowercase letter");
    }
  }

  // 4.4 Check for Numbers
  const hasNumber = /[0-9]/.test(password); // Use regular expression to test for 0-9
  if (hasNumber) {
    strength += 20;
    requirementNumber.classList.add("met");
    requirementNumber.classList.remove("unmet");
  } else {
    requirementNumber.classList.add("unmet");
    requirementNumber.classList.remove("met")
    if (password.length > 0) {
      messages.push("Password should include at least one number");
    }
  }

  // 4.5 Check for Symbols (Regular expression for common symbols)
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  if (hasSymbol) {
    strength += 20;
    requirementSymbol.classList.add("met");
    requirementSymbol.classList.remove("unmet");
  } else {
    requirementSymbol.classList.add("unmet");
    requirementSymbol.classList.remove("met");
    if (password.length > 0) {
      messages.push("Password should include at least one symbol (!@#$%^&*).");
    }
  }

  // --- Update UI Based on Strength --- //

  // Adjust strength for very short/empty passwords (to avoid false positives)
  if (password.length === 0) {
    strength = 0;

    // Reset all feedback items to default if password empty
    [requirementLength,
      requirementUppercase,
      requirementLowercase,
      requirementNumber,
      requirementSymbol].forEach(item => {
        item.classList.remove("met", "unmet");
      });

      // Override strength to "very weak" if password is short
    } else if (password.length < 4 && strength > 0) {
      strength = 10;
      messages.unshift("Password is too short, regardless if it meets some other criteria");
    }

    // Set width of Strength Bar
    strengthBar.style.width = `${strength}%`;

    // Set Strength Colour based on password strength

    // Set Very Weak Bar Colour
    let barColor = '#dc3545'; // Red (Very Weak)

    // Set Weak Bar Colour
    if (strength > 25) {
      barColor = '#ffc107'; // Yellow (Weak)
    }

    if (strength > 50) {
      barColor = '#fd7e14'; // Orange (Medium)
    }
    if (strength > 75) {
      barColor = '#28a745'; // Green (Strong)
    }

    // NOTE FOR STRENGTH BAR COLOURING:
    // The CSS gradient will likely override this background-color if it's set on strength-bar,
    // but having it here allows you to potentially dynamically change the gradient itself or use solid colors.
    // For now, the CSS gradient will likely be more visually appealing.
    // strengthBar.style.backgroundColor = barColor; // Uncomment if you want solid colors instead of gradient

    // Display general suggestions & feedback
    const suggestionsDiv = document.getElementById("suggestions");
    suggestionsDiv.innerHTML = ""; // Clear previous suggestions

    if (messages.length > 0) {
      const ul = document.createElement("ul");
      messages.forEach(msg => {
        const li = document.createElement("li");
        li.textContent = msg;
        ul.appendChild(li)
      });

      suggestionsDiv.appendChild(ul);
    } else if (password.length > 0) {
      suggestionsDiv.innerHTML = "<p>Great Job! Your password meets all requirements.</p>";
    } else {
      suggestionsDiv.innerHTML = "<p>Start typing to check your password strength.</p>"
    }
  }

// 5. Function to generate password
function generatePassword() {
  const length = parseInt(passwordLengthInput.value); // Get desired length
  let generatedPasswordChars = []; // Use an array to build password for easier shuffling
  let allAvailableChars = ""; // Character set for filling the rest of the password


  // Define character sets
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Arrays to hold functions for adding guaranteed characters
  const charTypeFunctions = [];

  // Build character set based on user selections and guarantee at least one of each selected type
   if (includeUppercase.checked) {
    allAvailableChars += uppercaseChars;
    charTypeFunctions.push(() => {
      const randomIndex = Math.floor(Math.random() * uppercaseChars.length);
      return uppercaseChars[randomIndex];
    });
  }
  if (includeLowercase.checked) {
    allAvailableChars += lowercaseChars;
    charTypeFunctions.push(() => {
      const randomIndex = Math.floor(Math.random() * lowercaseChars.length);
      return lowercaseChars[randomIndex];
    });
  }
  if (includeNumbers.checked) {
    allAvailableChars += numberChars;
    charTypeFunctions.push(() => {
      const randomIndex = Math.floor(Math.random() * numberChars.length);
      return numberChars[randomIndex];
    });
  }
  if (includeSymbols.checked) {
    allAvailableChars += symbolChars;
    charTypeFunctions.push(() => {
      const randomIndex = Math.floor(Math.random() * symbolChars.length);
      return symbolChars[randomIndex];
    });
  }

  // Ensure at least one character type is selected
  if (allAvailableChars === "") {
    alert("Please select at least one character type (uppercase, lowercase, numbers, or symbols).");
    return; // Exit if no character type is selected
  }

  // Add at least one character from each selected type
  for (const getChar of charTypeFunctions) {
    if (generatedPasswordChars.length < length) { // Ensure we don't exceed desired length prematurely
        generatedPasswordChars.push(getChar());
    } else {
        // If password length is too short to guarantee all chosen types,
        break;
    }
  }


  // Fill the remaining length with random characters from all available types
  while (generatedPasswordChars.length < length) {
    const randomIndex = Math.floor(Math.random() * allAvailableChars.length);
    generatedPasswordChars.push(allAvailableChars[randomIndex]);
  }

  // Shuffle the generated password characters to ensure randomness of position
  for (let i = generatedPasswordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [generatedPasswordChars[i], generatedPasswordChars[j]] = [generatedPasswordChars[j], generatedPasswordChars[i]]; // ES6 swap
  }

  // Join the characters to form the final password string
  const finalPassword = generatedPasswordChars.join('');

  // Set the generated password to the input field and trigger strength update
  passwordInput.value = finalPassword;
  updatePasswordStrength(); // Re-evaluate strength for the new password

  passwordInput.setAttribute('type', 'text'); // Ensure it's always visible after generation
   togglePasswordVisibility.innerHTML = '🙈'; // Set to 'hide' icon since it's now visible
}


generatePasswordBtn.addEventListener("click", generatePassword);

updatePasswordStrength();

// 7. Function to export password to text file
function exportPasswordToTxt() {
  const password = passwordInput.value; // Get  current password from the input field

  if (!password) {
    alert("There's no password to export. Please generate one first!")
    return;
  }

  // Create a Blob (Binary Large Object) from password string
  const blob = new Blob([password], {type: "text/plain;charset=utf8"});

  // Create temportary URL for Blob
  const url = URL.createObjectURL(blob);

  // Create temporary ancor element & name file
  const a = document.createElement("a");
  a.href = url;
  a.download = "generated_password.txt";

  // Programatically click anchor element to trigger download
  document.body.appendChild(a); // Required on firefox
  a.click(); // Trigger the download
  document.body.removeChild(a); // Clean up element

  // Revoke object URL (free up space)
  URL.revokeObjectURL(url);

  alert("Password has been exported to generated_password.txt\nThank you for using our services!");
}

if (exportPasswordBtn) {
  exportPasswordBtn.addEventListener("click", exportPasswordToTxt);
}
