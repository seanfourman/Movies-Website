$(document).ready(init);

const messages = [
  "The movies ghosted us.",
  "Popcorn machine broke down.",
  "We forgot the script.",
  "Server went on vacation.",
  "Our reel got jammed.",
  "Lost in the credits.",
  "No signal from Hollywood.",
  "Buffering... forever apparently.",
  "Plot twist: no connection.",
  "The page fell asleep.",
  "Movie magic malfunctioned. Oops!",
  "Be kind, rewind... retry!",
  "The drama's behind the scenes.",
  "We paused the internet.",
  "Couch potato panic mode!"
];

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

function readECB() {
  showPopup("Failed to reach server. Please try again later!", false);
  showNoMoviesMessage(messages[Math.floor(Math.random() * messages.length)]);
}

function triggerSearch() {
  const title = $("#searchTitle").val().trim();
  const startDate = $("#startDate").val();
  const endDate = $("#endDate").val();

  $("#noMovies").remove();
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

function errorCB() {
  console.log("alo");
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
