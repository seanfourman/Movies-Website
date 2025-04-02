$(document).ready(init);

function loadSnippet(name, type, ...followups) {
  const prefixTypes = {
    element: "",
    class: ".",
    id: "#"
  };
  const prefix = prefixTypes[type];

  $.get(`../html/${name}.html`, (data) => {
    $(`${prefix}${name}`).html(data);

    for (const followup of followups) {
      followup();
    }
  });
}

function init() {
  // loadSnippet("nav", "element", swapLogoLink);
  // loadSnippet("footer", "element");

  if ($("#loadMovies-btn")) {
    $("#loadMovies-btn").click(loadMovies);
  }
}

function swapLogoLink() {
  var path = window.location.pathname;
  var page = path.split("/").pop();
  if (page === "index.html") {
    $("#logo").attr("href", "#");
  }
}

function loadMovies() {
  filteredMovies = movies.map((movie) => ({
    id: movie.id,
    url: movie.url,
    primaryTitle: movie.primaryTitle,
    description: movie.description,
    primaryImage: movie.primaryImage,
    year: movie.startYear,
    releaseDate: movie.releaseDate,
    language: movie.language,
    budget: movie.budget,
    grossWorldwide: movie.grossWorldwide,
    genres: movie.genres,
    isAdult: movie.isAdult,
    runtimeMinutes: movie.runtimeMinutes,
    averageRating: movie.averageRating,
    numVotes: movie.numVotes
  }));

  $(this).hide();

  if (filteredMovies.length === 0) {
    return showNoMoviesMessage();
  }

  for (movie of filteredMovies) {
    createMovieCard(movie);
  }
}

function showNoMoviesMessage() {
  $("container").append($("<h1></h1>").attr("id", "noMovies").text("No Movies Available"));
}

function createMovieCard(movie) {
  console.log(movie);
}
