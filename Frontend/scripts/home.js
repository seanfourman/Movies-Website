function initHomePage() {
  $("#searchInputs input").prop("disabled", true);
  $("#searchInputs input").addClass("disabled-section");
  $(".searchText").addClass("disabled-text");

  if ($("#loadMoviesButton").length) {
    $("#loadMoviesButton").click(function () {
      const movies = getAllMovies(readSCB, readECB); // (***)
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

  let isLoading = false;

  $(window).on("scroll", function () {
    if (!isLoading && $(window).scrollTop() + $(window).height() >= $(document).height()) {
      isLoading = true;

      loadMovies(movies);

      setTimeout(function () {
        isLoading = false;
      }, 500); // Prevent multiple triggers
    }
  });
}

function readSCB(res) {
  currentMovieIndex = 0;
  $("#noMovies").remove();
  loadMovies(res);
}

function readECB() {
  showPopup("Failed to reach server. Please try again later!", false);
  showNoMoviesMessage();
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

  if (title) {
    searchMoviesByTitle(title, successCB, errorCB);
  } else if (startDate && endDate) {
    searchMoviesByDate(startDate, endDate, successCB, errorCB);
  } else {
    getAllMovies(readSCB, readECB);
  }
}

function successCB(res) {
  currentMovieIndex = 0;
  if (Array.isArray(res) && res.length != 0) {
    $("#noMovies").remove();
  }

  $(".movieCard").remove();
  loadMovies(res);
}

function errorCB() {
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
