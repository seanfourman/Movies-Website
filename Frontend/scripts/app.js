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
              <a href="./profile.html">Account Settings</a>
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

  setupAccountDropdown();
  $(window).on("load resize", updateFooterPosition);
});

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
        genres = []; // For unexpected types
      }
    } else {
      genres = []; //For undefined or null
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

  if (currentMovieIndex >= arr.length) {
    $(window).off("scroll");
  }
}

function checkIfArrayIsNull(res) {
  if (res.length === 0) {
    return showNoMoviesMessage();
  }
}

function handleServerError() {
  showPopup("Failed to reach server. Please try again later!", false);
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
    genres: Array.isArray(selectedMovie.genres) ? selectedMovie.genres.join(", ") : selectedMovie.genres,
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

function setupAccountDropdown() {
  $(document).on("click", "#accountIcon", function (e) {
    e.stopPropagation();
    $(".account-dropdown").toggleClass("active");
  });

  // Close dropdown when clicking anywhere else on the page
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".account-dropdown").length) {
      $(".account-dropdown").removeClass("active");
    }
  });

  $(document).on("click", "#logoutBtn", function (e) {
    e.preventDefault();
    logout();
  });
}

function logout() {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");

  showPopup("You have been logged out successfully", true);

  setTimeout(function () {
    window.location.href = "../html/signin.html";
  }, 2000);
}
