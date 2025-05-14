const htmlSnippets = {
  nav: `
        <img id="logo" src="../sources/LOGO-ducktape.png" />
        <div>
          <a href="./index.html"><button>Home</button></a>
          <a href="./myMovies.html"><button>My Movies</button></a>
          <div class="account-dropdown">
            <img id="accountIcon" src="../sources/account-icon.png" />
            <div class="dropdown-menu">
              <a href="#" id="logoutBtn">Logout</a>
            </div>
          </div>
        </div>
    `,
  footer: `
        <p>&copy; 2025 The Reel Deal, All rights reserved.</p>
    `
};

$(document).ready(function () {
  for (const element in htmlSnippets) {
    if ($(`${element}`).length) {
      $(`${element}`).html(htmlSnippets[element]);
    }
  }

  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  if (currentPage === "index.html") {
    initHomePage();
  } else if (currentPage === "mymovies.html") {
    initMyMoviesPage();
  }

  pageAuthorizationSetup();
  setupAccountDropdown();
  $(window).on("load resize", updateFooterPosition);
});

function pageAuthorizationSetup() {
  const adminPages = ["controlpanel.html"];
  const restrictedPages = ["addmovie.html", "mymovies.html", "myprofile.html"];
  const loggedPages = ["signin.html", "signup.html"];
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isLoggedIn = Boolean(userData.email);
  const pageName = window.location.pathname.split("/").pop().toLowerCase();

  if (!userData.isAdmin && adminPages.includes(pageName)) {
    window.location.href = "../html/index.html";
  }

  if (!isLoggedIn && restrictedPages.includes(pageName)) {
    window.location.href = "../html/signin.html";
  } else if (isLoggedIn && loggedPages.includes(pageName)) {
    window.location.href = "../html/index.html";
  }
}

function setupAccountDropdown() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isLoggedIn = Boolean(userData.email);
  const isAdmin = userData.isAdmin;
  updateDropdownContent(isLoggedIn, isAdmin);

  $(document).on("click", "#accountIcon", function (e) {
    e.stopPropagation(); // Prevents click from triggering other click events
    $(".account-dropdown").toggleClass("active");
  });

  // Close dropdown when clicking anywhere else
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".account-dropdown").length) {
      $(".account-dropdown").removeClass("active");
    }
  });

  // Signup
  $(document).on("click", "#signupBtn", function (e) {
    e.preventDefault();
    window.location.href = "./signup.html";
  });

  // Login
  $(document).on("click", "#loginBtn", function (e) {
    e.preventDefault();
    window.location.href = "./signin.html";
  });

  // Logout
  $(document).on("click", "#logoutBtn", function (e) {
    e.preventDefault();
    logout();
  });

  // Add Movie
  $(document).on("click", "#addMovieBtn", function (e) {
    e.preventDefault();
    window.location.href = "./addMovie.html";
  });

  // Edit Profile
  $(document).on("click", "#myProfileBtn", function (e) {
    e.preventDefault();
    window.location.href = "./myProfile.html";
  });

  // Control Panel
  $(document).on("click", "#controlPanelBtn", function (e) {
    e.preventDefault();
    window.location.href = "./controlPanel.html";
  });

  // Disable background image right click menu
  const img = $("#formLetterImg");
  if (img.length) {
    img.on("contextmenu", function (e) {
      e.preventDefault();
    });
  }
}

function updateDropdownContent(isLoggedIn, isAdmin) {
  const dropdownMenu = $(".dropdown-menu");
  dropdownMenu.empty();

  if (isLoggedIn) {
    dropdownMenu.append(`
      <a href="#" id="addMovieBtn"><img src="../sources/plus-icon.png" />Add Movie</a>
      <a href="#" id="myProfileBtn"><img src="../sources/myProfile-icon.png" />My Profile</a>
    `);

    if (isAdmin) {
      dropdownMenu.append(`
        <a href="#" id="controlPanelBtn"><img src="../sources/controlPanel-icon.png" />Control Panel</a>
      `);
    }

    dropdownMenu.append(`
      <a href="#" id="logoutBtn"><img src="../sources/logout-icon.png" />Logout</a>
    `);
  } else {
    dropdownMenu.append(`
      <a href="#" id="loginBtn"><img src="../sources/login-icon.png" />Log in</a>
      <a href="#" id="signupBtn"><img src="../sources/signup-icon.png" />Sign up</a>
    `);
  }
}

function showWelcomeToast(userName) {
  const toast = $(`
    <div class="welcome-toast">
      <div class="toast-content">
        <div class="toast-icon">👋</div>
        <div class="toast-message">
          <h4>Welcome back, ${userName}!</h4>
          <p>Start your next movie adventure.</p>
        </div>
      </div>
      <div class="toast-progress"></div>
    </div>
  `);
  $("body").append(toast);

  setTimeout(() => {
    toast.addClass("show");

    const progressBar = toast.find(".toast-progress");
    progressBar.addClass("animate");
    setTimeout(() => {
      toast.removeClass("show");
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 6000);
  }, 500);
}

function logout() {
  localStorage.removeItem("userData");
  localStorage.removeItem("welcomeMessage");

  updateDropdownContent(false);
  showPopup("You have been logged out", true);
  setTimeout(function () {
    window.location.href = "./index.html";
  }, 1500);
}
