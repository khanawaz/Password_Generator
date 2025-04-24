//Syntax of custom attribute inside query Selector
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-password");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "!@#$%^*&()_+|}{~`";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle to grey

//setting password's length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerHTML = passwordLength;
}
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow
}
//Getting random integer
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomNumber() {
  return getRandomInteger(0, 9);
}
function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}
function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}
function generateSymbols() {
  const randNum = getRandomInteger(0, symbols.length);
  return symbols.charAt(randNum);
}
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;
  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}
//Copying content to clipboard
async function copyContent() {
  try {
    // Copying the password to clipboard
    await navigator.clipboard.writeText(passwordDisplay.value);
    // Show the copied message
    copyMsg.innerText = "copied";
  } catch (e) {
    // Show the failed message if an error occurs
    copyMsg.innerText = "failed";
  }

  // Make the copy message visible
  copyMsg.classList.add("active");

  // Set a timeout to hide the message after 2 seconds and clear the text
  setTimeout(() => {
    copyMsg.classList.remove("active");
    copyMsg.innerText = ""; // Clear the message after 2 seconds
  }, 2000);
}

function handleCheckboxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  //Agar charo checkbox me se kisi ko tick ya untick kiya jara h to firse count krna pdega  no of ticked checkboxes
  checkbox.addEventListener("change", handleCheckboxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value);
  copyContent();
});
function shufflePassword(password) {
  //Fisher Yates method
  array=Array.from(password);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}
let str = "";
array.forEach((el) => (str += el));
return str;
}
generateBtn.addEventListener("click", () => {
  //None of the checkbox are selected
  if (checkCount <= 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  console.log("Journey started");
  //let's start the journey of generating a password
  password = "";
  //Putting the stuff mentioned by checkboxes
  let funcArr = [];
  if (uppercaseCheck.checked) funcArr.push(generateUpperCase());
  if (lowercaseCheck.checked) funcArr.push(generateLowerCase());
  if (numbersCheck.checked) funcArr.push(generateRandomNumber());
  if (symbolsCheck.checked) funcArr.push(generateSymbols());
  //compulsory addition ie ticked ones should be included always

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i];
  }
  console.log("Compulsory addtion done");
  console.log(password);

  //Remaining length ie now we can generate random number,symbol or letters
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndx = getRandomInteger(0, funcArr.length);
    password += funcArr[randIndx];
  }
  console.log("Remaining length done ");
  console.log(password);
  // Now shuffling the password elements
  password = shufflePassword(Array.from(password));
  // //Now show generated password in UI
  passwordDisplay.value = password;
  //calculate the strength after generating password
  calcStrength();
});