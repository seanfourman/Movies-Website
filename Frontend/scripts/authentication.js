const MIN_NAME_LENGTH = 2;
const MIN_PASS_LENGTH = 8;

$(document).ready(function () {
  // SIGN UP
  if ($("#signupForm").length) {
    setupFormValidation();
  }

  $("#signupForm").on("submit", function (e) {
    e.preventDefault();

    if (this.checkValidity()) {
      registerNewUser();
    }
  });

  // SIGN IN
  $("#signinForm").on("submit", function (e) {
    e.preventDefault();

    if (this.checkValidity()) {
      login();
    }
  });
});

function setupFormValidation() {
  $("#nameTB").on("input", function () {
    const name = $(this).val().trim();

    if (name === "") {
      this.setCustomValidity("Please enter your name");
    } else if (name.length < MIN_NAME_LENGTH) {
      this.setCustomValidity("Name must be at least 2 characters long");
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      this.setCustomValidity("Name should contain only letters and spaces");
    } else {
      this.setCustomValidity("");
    }

    this.reportValidity();
  });

  $("#emailTB").on("input", function () {
    const email = $(this).val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      this.setCustomValidity("Please enter your email address");
    } else if (!emailRegex.test(email)) {
      this.setCustomValidity("Please enter a valid email address");
    } else {
      this.setCustomValidity("");
    }

    this.reportValidity();
  });

  $("#passwordTB").on("input", function () {
    const password = $(this).val();

    if (password === "") {
      this.setCustomValidity("Please enter a password");
    } else if (password.length < MIN_PASS_LENGTH) {
      this.setCustomValidity("Password must be at least 8 characters long");
    } else if (!/[0-9]/.test(password)) {
      this.setCustomValidity("Password must contain at least one number");
    } else if (!/[A-Z]/.test(password)) {
      this.setCustomValidity("Password must contain at least one uppercase letter");
    } else {
      this.setCustomValidity("");
    }

    this.reportValidity();
  });

  $("#signupForm").on("submit", function () {
    $("#nameTB, #emailTB, #passwordTB").trigger("focusout");
  });
}

// Registration
function registerNewUser() {
  const user = {
    Name: $("#nameTB").val().trim(),
    Email: $("#emailTB").val().trim(),
    Password: $("#passwordTB").val()
  };

  $("#submitButton").val("wait a sec...").prop("disabled", true);

  registerUser(user, registerCBSuccess, registerCBError);
}

function registerCBSuccess(response) {
  $("#submitButton").val("Sign up").prop("disabled", false);

  if (response === false) {
    showPopup("Registration failed. Email is already in use.", false);
    return;
  }

  $("#signupForm")[0].reset();
  showPopup("Registration successful! You can now log in.", true);
  setTimeout(function () {
    window.location.href = "../html/signin.html";
  }, 2000);
}

function registerCBError(xhr, status) {
  $("#submitButton").val("Sign up").prop("disabled", false);

  let errorMessage = "Registration failed: ";

  if (xhr.responseJSON) {
    errorMessage += xhr.responseJSON.message || xhr.responseJSON.title || "Server error";
  } else if (xhr.status === 0) {
    errorMessage = "Cannot connect to server. Please check your internet connection.";
  } else if (xhr.status === 409) {
    errorMessage = "A user with this email already exists.";
  } else {
    errorMessage += status;
  }

  showPopup(errorMessage, false);
}

// Login
function login() {
  const credentials = {
    Email: $("#emailTB").val().trim(),
    Password: $("#passwordTB").val()
  };

  $("#submitButton").val("wait a sec...").prop("disabled", true);

  loginUser(credentials, loginCBSuccess, loginCBError);
}

function loginCBSuccess(response) {
  $("#submitButton").val("Sign in").prop("disabled", false);

  if (response === false) {
    showPopup("Login failed. Invalid email or password.", false);
    return;
  }

  // Local Storage
  if (response.email) {
    localStorage.setItem("userEmail", response.email);
  }
  if (response.name) {
    localStorage.setItem("userName", response.name);
  }

  $("#signinForm")[0].reset();
  showPopup("Login successful!", true);
  setTimeout(function () {
    window.location.href = "../html/index.html";
  }, 2000);
}

function loginCBError(xhr, status) {
  $("#submitButton").val("Sign in").prop("disabled", false);

  let errorMessage = "Login failed: ";

  if (xhr.status === 401) {
    errorMessage = "Invalid email or password.";
  } else if (xhr.status === 0) {
    errorMessage = "Cannot connect to server. Please check your internet connection.";
  } else if (xhr.responseJSON) {
    errorMessage += xhr.responseJSON.message || xhr.responseJSON.title || "Server error";
  } else {
    errorMessage += status;
  }

  showPopup(errorMessage, false);
}
