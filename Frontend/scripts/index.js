$(document).ready(init);

const htmlSnippets = {
  nav: `
    <a id="logo" href="./index.html">
      <img id="logo" src="../sources/LOGO-white.png" />
    </a>
    <a href="./myMovies.html"><button>My Movies</button></a>
  `,
  footer: `
    <p>&copy; 2025 The Reel Deal, All rights reserved.</p>
  `
};

function init() {
  for (const element in htmlSnippets) {
    injectSnippet(element);
  }
  swapLogoHref();

  // Length is needed because jquery always returns true without
  if ($("#loadMoviesButton").length) {
    $("#loadMoviesButton").click(loadMovies);
  } else {
    console.error(`loadMovies: Element '#loadMoviesButton' not found in DOM.`);
  }
}

function injectSnippet(element) {
  if ($(`${element}`).length) {
    $(`${element}`).html(htmlSnippets[element]);
  } else {
    console.error(`injectSnippet: Element '${element}' not found in DOM.`);
  }
}

function swapLogoHref() {
  var path = window.location.pathname;
  var page = path.split("/").pop();
  if (page === "index.html") {
    if ($("#logo").length) {
      $("#logo").attr("href", "#");
    } else {
      console.error(`loadMovies: Element '#logo' not found in DOM.`);
    }
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
