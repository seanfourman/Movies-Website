function initMyMoviesPage() {
  $("#searchInputs input").on("input", function () {
    $(".movieCard").remove();
    triggerSearch();
  });

  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) {
    showPopup("Sign in to access your movies tab!", false);
    setTimeout(function () {
      window.location.href = "../html/signin.html";
    }, 2000);
  }

  setupSearchTitlePlaceholder();
  getAllMovies(readSCB, readECB);
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
  const startDate = $("#startDate").val();
  const endDate = $("#endDate").val();

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
