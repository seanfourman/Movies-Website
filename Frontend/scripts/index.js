$(document).ready(init);

function init() {
  $("nav").load("../html/navbar.html", swapLogoLink);
  $("footer").load("../html/footer.html");

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
  let filteredMovies = movies.map((movie) => ({
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

  if (filteredMovies.length === 0) {
    const $noMoviesText = $("<h1></h1>").attr("id", "noMovies").text("No Movies Available");
    $("container").append($noMoviesText);
  }

  for (movie of filteredMovies) {
    createMovieCard(movie);
  }
  $(this).hide();
}

function createMovieCard(movie) {
  console.log(movie.primaryTitle);
}
