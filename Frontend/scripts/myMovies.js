$(document).ready(init);

function init() {
  $("#searchInputs input").on("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      $(".movieCard").remove();
      triggerSearch();
    }
  });

  $("#searchInputs input").on("blur", function () {
    $(".movieCard").remove();
    triggerSearch();
  });

  setupSearchTitlePlaceholder();
  getUserMovies();
}

function getUserMovies() {
  ajaxCall("GET", url, "", readSCB, readECB);
}

function readSCB(res) {
  loadMovies(res);
}

function readECB(err) {
  console.log(err);
}

function triggerSearch() {
  const title = $("#searchTitle").val().trim();
  const startDate = $("#startDate").val();
  const endDate = $("#endDate").val();

  $(".movieCard").remove();
  if (title) {
    ajaxCall("GET", `${url}/searchByTitle`, { title }, successCB, errorCB);
  } else if (startDate && endDate) {
    ajaxCall("GET", `${url}/searchByReleaseDate/startDate/${startDate}/endDate/${endDate}`, null, successCB, errorCB);
  } else {
    getUserMovies();
  }
}

function successCB(res) {
  $(".movieCard").remove();
  loadMovies(res);
}

function errorCB(err) {
  console.log(err);
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
