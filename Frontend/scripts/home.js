const moviesPerBatch = 20;
let currentOffset = 0;
let isLoading = false;
let hasMoreMovies = true;
let currentSearchMode = "normal";
let currentSearchParams = {};

function initHomePage() {
  $("#searchInputs input").prop("disabled", true);
  $("#searchInputs input").addClass("disabled-section");
  $(".searchText").addClass("disabled-text");

  if ($("#loadMoviesButton").length) {
    $("#loadMoviesButton").click(function () {
      $("#loadMoviesButton").remove();
      loadMoreMovies();
      $("#searchInputs input").prop("disabled", false);
      $("#searchInputs input").removeClass("disabled-section");
      $(".searchText").removeClass("disabled-text");
    });
  }

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (userData.email) {
    if (!localStorage.getItem("welcomeMessage")) {
      showWelcomeToast(userData.name || "User");
      localStorage.setItem("welcomeMessage", "true");
    }
  }

  $("#searchInputs input").on("input", function () {
    $(".movieCard").remove();
    triggerSearch();
  });

  setupSearchTitlePlaceholder();
  setupScrollHandler();

  const $returnToTopButton = $(`
    <div id="return-to-top">
      <img src="../sources/chevron-up.png" />
    </div>
  `);
  $("body").append($returnToTopButton);

  $returnToTopButton.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
  });

  $(document).on("scroll", function () {
    toggleReturnToTop($(window).scrollTop() > 100);
  });

  function toggleReturnToTop(active) {
    $returnToTopButton.toggleClass("visible", active);
  }
}

function setupScrollHandler() {
  $(window).off("scroll.movieLoader");

  $(window).on("scroll.movieLoader", function () {
    if (!isLoading && hasMoreMovies && $(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
      loadMoreMovies();
    }
  });
}

function loadMoreMovies() {
  if (isLoading || !hasMoreMovies) return;

  isLoading = true;
  showLoadingIndicator();

  switch (currentSearchMode) {
    case "title":
      searchMoviesByTitle(currentSearchParams.title, currentOffset, moviesPerBatch, loadMoreMoviesSCB, loadMoreMoviesECB);
      break;
    case "date":
      searchMoviesByDate(currentSearchParams.startDate, currentSearchParams.endDate, currentOffset, moviesPerBatch, loadMoreMoviesSCB, loadMoreMoviesECB);
      break;
    case "rentedMovie":
      getRentedMovies(loadMoreMoviesSCB, loadMoreMoviesECB);
      break;
    default:
      getMoviesBatch(currentOffset, moviesPerBatch, loadMoreMoviesSCB, loadMoreMoviesECB);
      break;
  }
}

function loadMoreMoviesSCB(data) {
  hideLoadingIndicator();

  if (!data || data.length === 0) {
    hasMoreMovies = false;
    if (currentOffset === 0 || data.length === 0) {
      showNoMoviesMessage();
    }
  } else {
    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
    if (currentPage === "mymovies.html") {
      addEditButton();
    }

    for (let movie of data) {
      if (movie.genres) {
        if (typeof movie.genres === "string") {
          movie.genres = movie.genres.split(",").map((genre) => genre.trim());
        }
      } else {
        movie.genres = [];
      }
      movie.year = movie.startYear || movie.year;

      createMovieCard(movie);
    }
    currentOffset += data.length;

    if (data.length < moviesPerBatch) {
      hasMoreMovies = false;
    }
  }

  isLoading = false;
  updateFooterPosition();
}

function loadMoreMoviesECB(error) {
  hideLoadingIndicator();
  isLoading = false;
  showPopup("Failed to load movies. Please try again later", false);
  showNoMoviesMessage();
}

function showLoadingIndicator() {
  if ($("#loadingIndicator").length === 0) {
    const noMoviesYet = $(".movieCard").length === 0;

    const loadingIndicator = $(`
      <div id="loadingIndicator" class="loading-indicator${noMoviesYet ? " loading-indicator-centered" : ""}">
        <div class="spinner"></div>
      </div>
    `);

    if (noMoviesYet) {
      $("body").append(loadingIndicator);
    } else {
      $("container").append(loadingIndicator);
    }
  }
}

function hideLoadingIndicator() {
  $("#loadingIndicator").remove();
}

function triggerSearch() {
  const title = $("#searchTitle").val().trim();
  let startDate = $("#startDate").val();
  let endDate = $("#endDate").val();

  const sqlMinDate = "1753-01-01";
  const sqlMaxDate = "9999-12-31";

  if (startDate) {
    if (new Date(startDate) < new Date(sqlMinDate)) {
      startDate = sqlMinDate;
    }
  }

  if (endDate) {
    if (new Date(endDate) > new Date(sqlMaxDate)) {
      endDate = sqlMaxDate;
    }
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    showNoMoviesMessage();
    return;
  }

  $(".movieCard").remove();
  $("#noMovies").remove();
  currentOffset = 0;
  hasMoreMovies = true;

  if (title) {
    currentSearchMode = "title";
    currentSearchParams = { title };
    loadMoreMovies();
  } else if (startDate && endDate) {
    currentSearchMode = "date";
    currentSearchParams = { startDate, endDate };
    loadMoreMovies();
  } else {
    currentSearchMode = "normal";
    currentSearchParams = {};
    loadMoreMovies();
  }
}

function successCB(res) {
  if (Array.isArray(res) && res.length !== 0) {
    $("#noMovies").remove();
    $(".movieCard").remove();

    for (let movie of res) {
      createMovieCard(movie);
    }
  } else {
    showNoMoviesMessage();
  }
}

function errorCB() {
  showPopup("Failed to reach server. Please try again later", false);
  showNoMoviesMessage();
}

function setupSearchTitlePlaceholder() {
  $("#searchTitle").on("focus", function () {
    $(this).attr("placeholder", "");
  });

  $("#searchTitle").on("blur", function () {
    if ($(this).val().trim() === "") {
      $(this).attr("placeholder", "Search");
    }
  });
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
  showPopup("Failed to reach server. Please try again later", false);
}
