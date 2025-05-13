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

  // MY PROFILE
  if ($("#myProfileForm").length) {
    setupFormValidation();
    $("#myProfileForm").css("background-image", "url(../sources/auth-bg3.png)");

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    $("#nameTB").val(userData.name || "");
    $("#emailTB").val(userData.email || "");
  }

  $("#myProfileForm").on("submit", function (e) {
    e.preventDefault();

    if (this.checkValidity()) {
      editUserProfile();
    }
  });

  swapWebsiteIcon();
});

// Validations
function setupFormValidation() {
  // Name - empty, at least 2 characters, only letters (space is possible)
  $("#nameTB").on("input", function () {
    const name = $(this).val().trim();

    if (name === "") {
      this.setCustomValidity("Please enter your name");
    } else if (name.length < MIN_NAME_LENGTH) {
      this.setCustomValidity("Name must be at least 2 characters long");
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      this.setCustomValidity("Name should contain only letters");
    } else {
      this.setCustomValidity("");
    }

    this.reportValidity();
  });

  //  Email - empty, valid by emailRegex
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

  // Password - empty, must be at least MIN_PASS_LENGTH and contain - number, uppercase letter
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
}

// Registration
function registerNewUser() {
  const user = {
    Name: $("#nameTB").val().trim(),
    Email: $("#emailTB").val().trim(),
    Password: $("#passwordTB").val(),
    Active: true,
    isAdmin: false
  };

  $("#submitButton").val("wait a sec...").prop("disabled", true);
  registerUser(user, registerCBSuccess, registerCBError);
}

function registerCBSuccess(response) {
  $("#submitButton").val("Sign up").prop("disabled", false);

  if (response === false) {
    showPopup("Registration failed. Email is already in use", false);
    return;
  }

  $("#signupForm")[0].reset();
  showPopup("Registration successful! You can now log in", true);
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
    errorMessage = "Cannot connect to server. Please check your internet connection";
  } else if (xhr.status === 500) {
    errorMessage = "Email address is already taken";
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
    showPopup("Login failed. Invalid email or password", false);
    return;
  }

  const userData = {
    email: response.email,
    name: response.name,
    id: response.id,
    active: response.active,
    isAdmin: response.isAdmin
  };

  localStorage.setItem("userData", JSON.stringify(userData));

  $("#signinForm")[0].reset();
  showPopup("Login successful!", true);
  setTimeout(() => (window.location.href = "../html/index.html"), 2000);
}

function loginCBError(xhr, status) {
  $("#submitButton").val("Sign in").prop("disabled", false);

  let errorMessage = "Login failed: ";

  if (xhr.responseJSON) {
    errorMessage += xhr.responseJSON.message || xhr.responseJSON.title || "Server error";
  } else if (xhr.status === 0) {
    errorMessage = "Cannot connect to server. Please check your internet connection";
  } else {
    errorMessage += status;
  }

  if (xhr.responseText === "Inactive users are not allowed to login") {
    showPopup(xhr.responseText, false);
    return;
  } else if (xhr.responseText === "Invalid email or password") {
    showPopup(xhr.responseText, false);
    return;
  }
  showPopup(errorMessage, false);
}

// My Profile
function editUserProfile() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = userData.id;

  // (***) NEED TO FIX
  const user = {
    Name: $("#nameTB").val().trim(),
    Email: $("#emailTB").val().trim(),
    Password: $("#passwordTB").val(),
    Active: userData.active,
    isAdmin: userData.isAdmin
  };

  $("#submitButton").val("wait a sec...").prop("disabled", true);
  editUser(user, userId, editCBSuccess, editCBError);
}

function editCBSuccess(response) {
  $("#submitButton").val("Save").prop("disabled", false);

  if (response === false) {
    showPopup("Failed to update profile. Please try again later", false);
    return;
  }

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (response.name) {
    userData.name = response.name;
  }
  if (response.email) {
    userData.email = response.email;
  }

  localStorage.setItem("userData", JSON.stringify(userData));

  $("#myProfileForm")[0].reset();
  showPopup("Your profile has been successfully updated", true);
  setTimeout(function () {
    window.location.href = "../html/myProfile.html";
  }, 2000);
}

function editCBError(xhr, status) {
  $("#submitButton").val("Save").prop("disabled", false);

  let errorMessage = "Failed to update profile: ";

  if (xhr.responseJSON) {
    errorMessage += xhr.responseJSON.message || xhr.responseJSON.title || "Server error";
  } else if (xhr.status === 0) {
    errorMessage = "Cannot connect to server. Please check your internet connection.";
  } else if (xhr.status === 500) {
    errorMessage = "Email address is already taken.";
  } else {
    errorMessage += status;
  }

  showPopup(errorMessage, false);
}
