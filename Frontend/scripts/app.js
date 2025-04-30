const moviesPerPage = 20;
let currentMovieIndex = 0;

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

  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "index.html") {
    initHomePage();
  } else if (currentPage === "myMovies.html") {
    initMyMoviesPage();
  }

  pageAuthorizationSetup();
  setupAccountDropdown();
  $(window).on("load resize", updateFooterPosition);
});

function pageAuthorizationSetup() {
  const restrictedPages = ["addmovie.html", "mymovies.html", "myprofile.html"];
  const loggedPages = ["signin.html", "signup.html"];
  const userEmail = localStorage.getItem("userEmail");
  const pageName = window.location.pathname.split("/").pop().toLowerCase();

  if (!userEmail && restrictedPages.includes(pageName)) {
    window.location.href = "../html/signin.html";
  } else if (userEmail && loggedPages.includes(pageName)) {
    window.location.href = "../html/index.html";
  }
}

function loadMovies(arr) {
  const nextBatch = arr.slice(currentMovieIndex, currentMovieIndex + moviesPerPage);
  currentMovieIndex += moviesPerPage;

  const filteredMovies = nextBatch.map((movie) => {
    let genres;
    if (movie.genres) {
      if (Array.isArray(movie.genres)) {
        genres = movie.genres;
      } else if (typeof movie.genres === "string") {
        genres = movie.genres.split(",").map((genre) => genre.trim());
      } else {
        genres = []; // For unexpected types - probably pointless
      }
    } else {
      genres = [];
    }

    return {
      id: movie.id,
      url: movie.url,
      primaryTitle: movie.primaryTitle,
      description: movie.description,
      primaryImage: movie.primaryImage,
      year: movie.startYear || movie.year,
      releaseDate: movie.releaseDate,
      language: movie.language,
      budget: movie.budget,
      grossWorldwide: movie.grossWorldwide,
      genres: genres,
      isAdult: movie.isAdult,
      runtimeMinutes: movie.runtimeMinutes,
      averageRating: movie.averageRating,
      numVotes: movie.numVotes
    };
  });

  if ($("#loadMoviesButton").length) {
    $("#loadMoviesButton").hide();
  }

  if (filteredMovies.length === 0) {
    return showNoMoviesMessage();
  } else {
    updateFooterPosition();
  }

  for (let movie of filteredMovies) {
    createMovieCard(movie);
  }

  // Stop event listener when there are not movies left
  if (currentMovieIndex >= arr.length) {
    $(window).off("scroll");
  }
}

function checkIfArrayIsNull(res) {
  if (res.length === 0) {
    return showNoMoviesMessage();
  }
}

function sendToServer(selectedMovie) {
  let movie = {
    url: selectedMovie.url,
    primaryTitle: selectedMovie.primaryTitle,
    description: selectedMovie.description,
    primaryImage: selectedMovie.primaryImage,
    year: selectedMovie.year,
    releaseDate: selectedMovie.releaseDate,
    language: selectedMovie.language,
    budget: selectedMovie.budget,
    grossWorldwide: selectedMovie.grossWorldwide,
    genres: Array.isArray(selectedMovie.genres) ? selectedMovie.genres.join(",") : selectedMovie.genres,
    isAdult: selectedMovie.isAdult,
    runtimeMinutes: selectedMovie.runtimeMinutes,
    averageRating: selectedMovie.averageRating,
    numVotes: selectedMovie.numVotes
  };

  addMovie(
    movie,
    function (res) {
      if (res === false) {
        showPopup("Movie is already in your library!", false);
      } else {
        showPopup("Added to your library!", true);
      }
    },
    handleServerError
  );
}

function handleServerError() {
  showPopup("Failed to reach server. Please try again later!", false);
}

function setupAccountDropdown() {
  const isLoggedIn = localStorage.getItem("userEmail") !== null;
  updateDropdownContent(isLoggedIn);

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

  // Disable background image right click menu
  const img = $("#formLetterImg");
  if (img.length) {
    img.on("contextmenu", function (e) {
      e.preventDefault();
    });
  }
}

function updateDropdownContent(isLoggedIn) {
  const dropdownMenu = $(".dropdown-menu");
  dropdownMenu.empty();

  if (isLoggedIn) {
    dropdownMenu.append(`
      <a href="#" id="addMovieBtn"><img src="../sources/plus-icon.png" />Add Movie</a>
      <a href="#" id="myProfileBtn"><img src="../sources/myprofile-icon.png" />My Profile</a>
      <a href="#" id="logoutBtn"><img src="../sources/logout-icon.png" />Logout</a>
    `);
  } else {
    dropdownMenu.append(`
      <a href="#" id="loginBtn"><img src="../sources/login-icon.png" />Log in</a>
      <a href="#" id="signupBtn"><img src="../sources/signup-icon.png" />Sign up</a>
    `);
  }
}

function logout() {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("welcomeMessage");

  updateDropdownContent(false);
  showPopup("You have been logged out successfully", true);
  setTimeout(function () {
    window.location.href = "./index.html";
  }, 1500);
}
