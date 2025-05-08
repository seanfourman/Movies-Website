//const apiBaseUrl = "https://proj.ruppin.ac.il/cgroup7/test2/tar1/api";
const port = 5001;
const apiBaseUrl = `https://localhost:${port}/api`;
const moviesEndpoint = `${apiBaseUrl}/Movies`;
const usersEndpoint = `${apiBaseUrl}/Users`;

function ajaxCall(method, api, data, successCB, errorCB) {
  $.ajax({
    type: method,
    url: api,
    data: data,
    cache: false,
    contentType: "application/json",
    dataType: "json",
    success: successCB,
    error: errorCB
  });
}

// Movie API
function getAllMovies(successCallback, errorCallback) {
  ajaxCall("GET", moviesEndpoint, null, successCallback, errorCallback);
}

function getRentedMovies(successCallback, errorCallback) {
  const userId = localStorage.getItem("userId");
  ajaxCall("GET", `${moviesEndpoint}/getRentedMovies/${userId}`, null, successCallback, errorCallback);
}

function searchMoviesByTitle(title, successCallback, errorCallback) {
  showPopup("This function is currently disabled!", false);
  //ajaxCall("GET", `${moviesEndpoint}/searchByTitle`, { title }, successCallback, errorCallback);
}

function searchMoviesByDate(startDate, endDate, successCallback, errorCallback) {
  showPopup("This function is currently disabled!", false);
  //ajaxCall("GET", `${moviesEndpoint}/searchByReleaseDate/startDate/${startDate}/endDate/${endDate}`, null, successCallback, errorCallback);
}

function addMovie(movie, successCallback, errorCallback) {
  ajaxCall("POST", moviesEndpoint, JSON.stringify(movie), successCallback, errorCallback);
}

function deleteMovie(movieId, successCallback, errorCallback) {
  ajaxCall("DELETE", `${moviesEndpoint}/${movieId}`, null, successCallback, errorCallback);
}

// User API
function registerUser(user, successCallback, errorCallback) {
  ajaxCall("POST", usersEndpoint, JSON.stringify(user), successCallback, errorCallback);
}

function editUser(user, id, successCallback, errorCallback) {
  ajaxCall("PUT", `${usersEndpoint}/${id}`, JSON.stringify(user), successCallback, errorCallback);
}

function loginUser(credentials, successCallback, errorCallback) {
  ajaxCall("POST", `${usersEndpoint}/login`, JSON.stringify(credentials), successCallback, errorCallback);
}
