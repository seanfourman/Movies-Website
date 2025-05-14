//const apiBaseUrl = "https://proj.ruppin.ac.il/cgroup7/test2/tar1/api";
//const port = 5001;
const port = 7268;
const apiBaseUrl = `https://localhost:${port}/api`;
const moviesEndpoint = `${apiBaseUrl}/Movies`;
const rentedMoviesEndpoint = `${apiBaseUrl}/RentedMovies`;
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
function getUniqueLanguagesAndGenres(successCallback, errorCallback) {
  ajaxCall("GET", `${moviesEndpoint}/getUniqueLanguagesAndGenres`, null, successCallback, errorCallback);
}

function getAllMovies(successCallback, errorCallback) {
  ajaxCall("GET", moviesEndpoint, null, successCallback, errorCallback);
}

function getMoviesBatch(offset, count, successCallback, errorCallback) {
  ajaxCall("GET", `${moviesEndpoint}/batch/${offset}/${count}`, null, successCallback, errorCallback);
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

function deleteMovie(movieId, successCallback, errorCallback) {
  ajaxCall("DELETE", `${moviesEndpoint}/${movieId}`, null, successCallback, errorCallback);
}

// RentedMovie API
function rentMovie(movieId, startDate, endDate, totalPrice, successCallback, errorCallback) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = userData.id;

  const rentalData = {
    userId: userId,
    movieId: movieId,
    rentStart: startDate,
    rentEnd: endDate,
    totalPrice: totalPrice
  };

  ajaxCall("POST", rentedMoviesEndpoint, JSON.stringify(rentalData), successCallback, errorCallback);
}

function getRentedMovies(successCallback, errorCallback) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = userData.id;
  ajaxCall("GET", `${rentedMoviesEndpoint}/getRentedMoviesById/${userId}`, null, successCallback, errorCallback);
}

function transferRentedMovie(userId, rentedMovie, successCallback, errorCallback) {
  ajaxCall("PUT", `${rentedMoviesEndpoint}/${userId}`, JSON.stringify(rentedMovie), successCallback, errorCallback);
}

function deleteRentedMovie(userId, movieId, successCallback, errorCallback) {
  ajaxCall("DELETE", `${rentedMoviesEndpoint}/userId/${userId}/movieId/${movieId}`, null, successCallback, errorCallback);
}

// User API
// (***) Pagination?
function getAllUsers(successCallback, errorCallback) {
  ajaxCall("GET", usersEndpoint, "", successCallback, errorCallback);
}

function registerUser(user, successCallback, errorCallback) {
  ajaxCall("POST", usersEndpoint, JSON.stringify(user), successCallback, errorCallback);
}

function editUser(user, id, successCallback, errorCallback) {
  ajaxCall("PUT", `${usersEndpoint}/${id}`, JSON.stringify(user), successCallback, errorCallback);
}

function loginUser(credentials, successCallback, errorCallback) {
  ajaxCall("POST", `${usersEndpoint}/login`, JSON.stringify(credentials), successCallback, errorCallback);
}

function setUserAttribute(email, attributeType, value, successCallback, errorCallback) {
  const attributeData = {
    isAdmin: attributeType === "Admin" ? value : false,
    Active: attributeType === "Active" ? value : false,
    AttributeType: attributeType
  };
  ajaxCall("PUT", `${usersEndpoint}/setUserAttribute/${email}`, JSON.stringify(attributeData), successCallback, errorCallback);
}

// Database
function resetMovieDatabase(successCallback, errorCallback) {
  ajaxCall("DELETE", `${moviesEndpoint}/reset-database`, null, successCallback, errorCallback);
}
