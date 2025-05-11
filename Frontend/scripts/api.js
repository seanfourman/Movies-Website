//const apiBaseUrl = "https://proj.ruppin.ac.il/cgroup7/test2/tar1/api";
const port = 5001;
//const port = 7268;
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

function getMoviesBatch(offset, count, successCallback, errorCallback) {
  ajaxCall("GET", `${moviesEndpoint}/batch/${offset}/${count}`, null, successCallback, errorCallback);
}

function getRentedMovies(successCallback, errorCallback) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = userData.id;
  ajaxCall("GET", `${moviesEndpoint}/getRentedMovies/${userId}`, null, successCallback, errorCallback);
}

function searchMoviesByTitle(title, offset = 0, count = 20, successCallback, errorCallback) {
  ajaxCall("GET", `${moviesEndpoint}/searchByTitle?title=${encodeURIComponent(title)}&offset=${offset}&count=${count}`, null, successCallback, errorCallback);
}

function searchMoviesByDate(startDate, endDate, offset = 0, count = 20, successCallback, errorCallback) {
  const searchByDateURL = `${moviesEndpoint}/searchByReleaseDate?startDate=${startDate}&endDate=${endDate}&offset=${offset}&count=${count}`;
  ajaxCall("GET", searchByDateURL, null, successCallback, errorCallback);
}

function addMovie(movie, successCallback, errorCallback) {
  ajaxCall("POST", moviesEndpoint, JSON.stringify(movie), successCallback, errorCallback);
}

function rentMovie(movieId, startDate, endDate, successCallback, errorCallback) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = userData.id;

  const rentalData = {
    userId: userId,
    movieId: movieId,
    startDate: startDate,
    endDate: endDate
  };

  //xsajaxCall("POST", `${moviesEndpoint}/rent`, JSON.stringify(rentalData), successCallback, errorCallback);
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
