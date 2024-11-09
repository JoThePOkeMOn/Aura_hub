let data = [
  {
    username: "acqui",
    email: "acqui10@gmail.com",
    password: "HACK@2024",
  },
];

function checkCred() {
  const submitButton = document.querySelector(".js-submit-btn");

  submitButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission (if it's inside a form)

    // Get values from input fields
    const usernameInput = document.querySelector(".js-username").value;
    const passwordInput = document.querySelector(".js-password").value;

    // Check credentials
    if (
      usernameInput === data[0].username &&
      passwordInput === data[0].password
    ) {
      window.location.href = "../index2.html"; // Replace "#" with your destination URL
      console.log("Successful");
    } else {
      alert("Invalid username or password.");
    }
  });
}

checkCred();
