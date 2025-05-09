const moviesPerBatch = 20;
let currentOffset = 0;
let isLoading = false;
let hasMoreMovies = true;
let currentSearchResults = null;

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

  // If we have search results, use those instead of making an API call
  if (currentSearchResults && currentSearchResults.length > 0) {
    const batch = currentSearchResults.slice(currentOffset, currentOffset + moviesPerBatch);
    processMovieBatch(batch, currentSearchResults);
  } else {
    getMoviesBatch(currentOffset, moviesPerBatch, loadMoreMoviesSCB, loadMoreMoviesECB);
  }
}

function processMovieBatch(movies, fullArray = null) {
  hideLoadingIndicator();

  if (!movies || movies.length === 0) {
    hasMoreMovies = false;
    if (currentOffset === 0) {
      showNoMoviesMessage();
    }
  } else {
    for (let movie of movies) {
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
    currentOffset += movies.length;

    if (fullArray && currentOffset >= fullArray.length) {
      hasMoreMovies = false;
    }
  }

  isLoading = false;
  updateFooterPosition();
}

function loadMoreMoviesSCB(data) {
  processMovieBatch(data);
}

function loadMoreMoviesECB(error) {
  hideLoadingIndicator();
  isLoading = false;
  showPopup("Failed to load movies. Please try again later.", false);
}

function showLoadingIndicator() {
  if ($("#loadingIndicator").length === 0) {
    $("container").append(`
      <div id="loadingIndicator" class="loading-indicator">
        <div class="spinner"></div>
      </div>
    `);
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
    return;
  }

  $(".movieCard").remove();
  currentOffset = 0;
  hasMoreMovies = true;
  currentSearchResults = null;

  if (title) {
    searchMoviesByTitle(title, successCB, errorCB);
  } else if (startDate && endDate) {
    searchMoviesByDate(startDate, endDate, successCB, errorCB);
  } else {
    setupScrollHandler();
    loadMoreMovies();
  }
}

function successCB(res) {
  if (Array.isArray(res) && res.length !== 0) {
    $("#noMovies").remove();
    $(".movieCard").remove();

    currentSearchResults = res;

    currentOffset = 0;
    hasMoreMovies = true;

    setupScrollHandler();
    loadMoreMovies();
  } else {
    hideLoadingIndicator();
    isLoading = false;
    showNoMoviesMessage();
  }
}

function errorCB() {
  hideLoadingIndicator();
  isLoading = false;
  showPopup("Failed to reach server. Please try again later!", false);
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
