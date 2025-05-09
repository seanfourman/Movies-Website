function initMyMoviesPage() {
  getRentedMovies(readSCB, readECB);
}

function readSCB(res) {
  currentMovieIndex = 0;
  loadMovies(res);
}

function readECB() {
  showPopup("Failed to reach server. Please try again later!", false);
  showNoMoviesMessage();
}
