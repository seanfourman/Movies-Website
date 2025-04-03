$(document).ready(init);

function init() {
  getUserMovies();
}

function getUserMovies() {
  ajaxCall("GET", url, "", readSCB, readECB);
}

function readSCB(res) {
  //console.log(res);
  loadMovies(res); // Wait until the data is ready
  if (res.length != 0) {
    console.log("no null");
  }
}

function readECB(err) {
  console.log(err);
}
