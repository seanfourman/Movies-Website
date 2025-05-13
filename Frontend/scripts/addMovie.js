const MIN_TITLE_LENGTH = 2;
const MIN_YEAR = 1888;
const MIN_BUDGET = 100000;
const MAX_RUNTIME = 1000;
const MAX_RATING = 10;

let allowedLanguages = [];
let allowedGenres = [];

$(document).ready(function () {
  if ($("#movieForm").length) {
    setupMovieFormValidation();
    populateLanguageAndGenreLists();
  }

  $("#movieForm").on("submit", function (e) {
    e.preventDefault();
    clearAllErrors();

    if (validateMovieForm()) {
      $("#submitButton").val("wait a sec...").prop("disabled", true);
      submitMovieForm();
    } else {
      showPopup("Required fields are missing from the form", false);
    }
  });
});

function populateLanguageAndGenreLists() {
  getUniqueLanguagesAndGenres(
    (data) => {
      const languageList = $("#languageList");
      const genresList = $("#genresList");

      allowedLanguages = data.languages.sort();
      allowedGenres = data.genres.sort();

      languageList.empty();
      allowedLanguages.forEach((lang) => {
        languageList.append(`<option value="${lang}">`);
      });

      genresList.empty();
      allowedGenres.forEach((genre) => {
        genresList.append(`<option value="${genre}">`);
      });
    },
    (err) => {
      showPopup("Failed to load languages and genres", false);
    }
  );
}

// Validations
function setupMovieFormValidation() {
  // Title - empty, must be more than MIN_TITLE_LENGTH
  $("#primaryTitleTB").on("focusout", function () {
    const title = $(this).val().trim();

    if (title === "") {
      showFieldError($(this), "Title is required");
    } else if (title.length < MIN_TITLE_LENGTH) {
      showFieldError($(this), `Title must be at least ${MIN_TITLE_LENGTH} characters long`);
    } else {
      removeFieldError($(this));
    }
  });

  // Image - empty, isValidURL func
  $("#primaryImageTB").on("focusout", function () {
    const imageUrl = $(this).val().trim();

    if (imageUrl === "") {
      showFieldError($(this), "Primary image URL is required");
    } else if (!isValidURL(imageUrl)) {
      showFieldError($(this), "Please enter a valid URL");
    } else {
      removeFieldError($(this));
    }
  });

  // URL - empty, isValidURL func
  $("#urlTB").on("focusout", function () {
    const url = $(this).val().trim();

    if (url !== "" && !isValidURL(url)) {
      showFieldError($(this), "Please enter a valid URL");
    } else {
      removeFieldError($(this));
    }
  });

  // Year - empty, must be a number and between MIN_YEAR and currentYear
  $("#yearTB").on("focusout", function () {
    const year = parseInt($(this).val().trim());
    const currentYear = new Date().getFullYear();

    if ($(this).val().trim() === "") {
      showFieldError($(this), "Year is required");
    } else if (isNaN(year) || year < MIN_YEAR || year > currentYear) {
      showFieldError($(this), `Year must be between ${MIN_YEAR} and ${currentYear}`);
    } else {
      removeFieldError($(this));
    }
  });

  // Release date - empty
  // (maybe add a check if year == year from here? ***)
  $("#releaseDateTB").on("focusout", function () {
    if ($(this).val().trim() === "") {
      showFieldError($(this), "Release date is required");
    } else {
      removeFieldError($(this));
    }
  });

  // Language - empty
  $("#languageTB").on("focusout", function () {
    const language = $(this).val().trim();

    if (language === "") {
      showFieldError($(this), "Language is required");
    } else if (!isValidLanguage(language)) {
      showFieldError($(this), "Please select a valid language from the list");
    } else {
      removeFieldError($(this));
    }
  });

  // Budget - empty, must be a number and below MIN_BUDGET
  $("#budgetTB").on("focusout", function () {
    const budget = parseFloat($(this).val().trim());

    if ($(this).val().trim() !== "" && (isNaN(budget) || budget < MIN_BUDGET)) {
      showFieldError($(this), `Budget must be at least $${MIN_BUDGET.toLocaleString()}`);
    } else {
      removeFieldError($(this));
    }
  });

  // Gross WW - empty, must be a number and positive
  $("#grossWorldwideTB").on("focusout", function () {
    const gross = parseFloat($(this).val().trim());

    if ($(this).val().trim() !== "" && (isNaN(gross) || gross < 0)) {
      showFieldError($(this), "Gross worldwide must be a positive number");
    } else {
      removeFieldError($(this));
    }
  });

  // Genres - empty, isValidGenres func
  $("#genresTB").on("focusout", function () {
    const genres = $(this).val().trim();

    if (genres !== "") {
      if (!isValidGenres(genres)) {
        showFieldError($(this), "Please enter valid genres from the list, separated by commas");
      } else {
        removeFieldError($(this));
      }
    } else {
      removeFieldError($(this));
    }
  });

  // Runtime - empty, must be a number and between 0 and MAX_RUNTIME
  $("#runtimeMinutesTB").on("focusout", function () {
    const runtime = parseInt($(this).val().trim());

    if ($(this).val().trim() === "") {
      showFieldError($(this), "Runtime minutes is required");
    } else if (isNaN(runtime) || runtime <= 0 || runtime > MAX_RUNTIME) {
      showFieldError($(this), `Runtime must be a positive number less than ${MAX_RUNTIME} minutes`);
    } else {
      removeFieldError($(this));
    }
  });

  // Average Rating - empty, must be a number and between 0 and MAX_RATING
  $("#averageRatingTB").on("focusout", function () {
    const rating = parseFloat($(this).val().trim());

    if ($(this).val().trim() !== "" && (isNaN(rating) || rating < 0 || rating > MAX_RATING)) {
      showFieldError($(this), `Average rating must be between 0 and ${MAX_RATING}`);
    } else {
      removeFieldError($(this));
    }
  });

  // Number of Votes - empty, must be a number and positive
  $("#numVotesTB").on("focusout", function () {
    const votes = parseInt($(this).val().trim());

    if ($(this).val().trim() !== "" && (isNaN(votes) || votes < 0)) {
      showFieldError($(this), "Number of votes must be a positive number");
    } else {
      removeFieldError($(this));
    }
  });
}

function validateMovieForm() {
  let isValid = true;
  const requiredFields = [
    { id: "#primaryTitleTB", message: "Title is required" },
    { id: "#primaryImageTB", message: "Primary image URL is required" },
    { id: "#yearTB", message: "Year is required" },
    { id: "#releaseDateTB", message: "Release date is required" },
    { id: "#languageTB", message: "Language is required" },
    { id: "#runtimeMinutesTB", message: "Runtime minutes is required" }
  ];

  requiredFields.forEach((field) => {
    const element = $(field.id);
    if (element.val().trim() === "") {
      showFieldError(element, field.message);
      isValid = false;
    }
  });

  // Custom validations

  // URL Format
  const url = $("#urlTB").val().trim();
  if (url !== "" && !isValidURL(url)) {
    showFieldError($("#urlTB"), "Please enter a valid URL");
    isValid = false;
  }

  const imageUrl = $("#primaryImageTB").val().trim();
  if (imageUrl !== "" && !isValidURL(imageUrl)) {
    showFieldError($("#primaryImageTB"), "Please enter a valid image URL");
    isValid = false;
  }

  // Year
  const year = parseInt($("#yearTB").val().trim());
  const currentYear = new Date().getFullYear();
  if ($("#yearTB").val().trim() !== "" && (isNaN(year) || year < MIN_YEAR || year > currentYear + 5)) {
    showFieldError($("#yearTB"), `Year must be between ${MIN_YEAR} and ${currentYear + 5}`);
    isValid = false;
  }

  // Language
  const language = $("#languageTB").val().trim();
  if (language !== "" && !isValidLanguage(language)) {
    showFieldError($("#languageTB"), "Please select a valid language from the list");
    isValid = false;
  }

  // Budget
  const budget = parseFloat($("#budgetTB").val().trim());
  if ($("#budgetTB").val().trim() !== "" && (isNaN(budget) || budget < MIN_BUDGET)) {
    showFieldError($("#budgetTB"), `Budget must be at least $${MIN_BUDGET.toLocaleString()}`);
    isValid = false;
  }

  // Genres
  const genres = $("#genresTB").val().trim();
  if (genres !== "") {
    if (!isValidGenres(genres)) {
      showFieldError($("#genresTB"), "Please enter valid genres from the list, separated by commas");
      isValid = false;
    }
  }

  // Runtime
  const runtime = parseInt($("#runtimeMinutesTB").val().trim());
  if ($("#runtimeMinutesTB").val().trim() !== "" && (isNaN(runtime) || runtime <= 0 || runtime > 1000)) {
    showFieldError($("#runtimeMinutesTB"), "Runtime must be a positive number less than 1000 minutes");
    isValid = false;
  }

  // Average Rating
  const rating = parseFloat($("#averageRatingTB").val().trim());
  if ($("#averageRatingTB").val().trim() !== "" && (isNaN(rating) || rating < 0 || rating > MAX_RATING)) {
    showFieldError($("#averageRatingTB"), `Average rating must be between 0 and ${MAX_RATING}`);
    isValid = false;
  }

  // Number of Votes
  const votes = parseInt($("#numVotesTB").val().trim());
  if ($("#numVotesTB").val().trim() !== "" && (isNaN(votes) || votes < 0)) {
    showFieldError($("#numVotesTB"), "Number of votes must be a positive number");
    isValid = false;
  }

  return isValid;
}

// Helper function - Validate URL Format
function isValidURL(url) {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+,\\(\\)\\[\\]{}:;@&=+$#]*)*" + // port and path - expanded character set
      "(\\?[-a-z\\d%_.~+,\\(\\)\\[\\]{}:;@&=+$#]*=[-a-z\\d%_.~+,\\(\\)\\[\\]{}:;@&=+$#]*)?" + // query string - expanded
      "(\\#[-a-z\\d_]*)?$", // fragment locator
    "i"
  );
  return urlPattern.test(url);
}

// Helper function - Validate Genres Format
function isValidGenres(genresString) {
  if (!/^[a-zA-Z]+(\s*,\s*[a-zA-Z]+)*$/.test(genresString)) {
    return false;
  }

  // Check if each genre is in the allowedGenres list
  const enteredGenres = genresString.split(",").map((genre) => genre.trim().toLowerCase());
  return enteredGenres.every((genre) => allowedGenres.map((g) => g.toLowerCase()).includes(genre));
}

// Helper function - Validate Language
function isValidLanguage(language) {
  return allowedLanguages.map((lang) => lang.toLowerCase().trim()).includes(language.toLowerCase().trim());
}

function showFieldError(element, message) {
  removeFieldError(element);
  const errorParagraph = $("<p class='error-message'></p>").text(message).css({
    color: "red",
    "font-size": "14px",
    "margin-top": "5px"
  });

  element.css("border-color", "red");

  // Append to closest father by .form-group
  element.closest(".form-group").append(errorParagraph);
}

function removeFieldError(element) {
  element.css("border-color", "");
  element.closest(".form-group").find(".error-message").remove();
}

function clearAllErrors() {
  $(".error-message").remove();
  $(".form-control").css("border-color", "");
}

// Movie Submission
function submitMovieForm() {
  const movie = {
    primaryTitle: $("#primaryTitleTB").val().trim(),
    description: $("#descriptionTB").val().trim(),
    url: $("#urlTB").val().trim(),
    primaryImage: $("#primaryImageTB").val().trim(),
    year: parseInt($("#yearTB").val().trim()),
    releaseDate: $("#releaseDateTB").val(),
    language: toTitleCase($("#languageTB").val().trim()),
    budget: $("#budgetTB").val().trim() ? parseFloat($("#budgetTB").val().trim()) : 0,
    grossWorldwide: $("#grossWorldwideTB").val().trim() ? parseFloat($("#grossWorldwideTB").val().trim()) : 0,

    genres: $("#genresTB").val().trim()
      ? $("#genresTB")
          .val()
          .trim()
          .split(",")
          .map((g) => toTitleCase(g.trim()))
          .sort((a, b) => a.localeCompare(b))
          .join(",")
      : "",

    isAdult: $("#isAdultCB").is(":checked"),
    runtimeMinutes: parseInt($("#runtimeMinutesTB").val().trim()),
    averageRating: $("#averageRatingTB").val().trim() ? parseFloat($("#averageRatingTB").val().trim()) : 0,
    numVotes: $("#numVotesTB").val().trim() ? parseInt($("#numVotesTB").val().trim()) : 0
  };

  $("#submitButton").val("wait a sec...").prop("disabled", true);
  addMovie(movie, submitMovieCBSuccess, submitMovieCBError);
}

function submitMovieCBSuccess(response) {
  $("#submitButton").val("Add Movie").prop("disabled", false);
  if (response === false) {
    showPopup("Movie already exists in database!", false);
    return;
  }

  $("#movieForm")[0].reset();
  showPopup("Movie added successfully!", true);
}

function submitMovieCBError(xhr, status) {
  $("#submitButton").val("Add Movie").prop("disabled", false);

  let errorMessage = "Failed to add movie: ";

  if (xhr.responseJSON) {
    errorMessage += xhr.responseJSON.message || xhr.responseJSON.title || "Server error";
  } else if (xhr.status === 0) {
    errorMessage = "Cannot connect to server. Please check your internet connection.";
  } else {
    errorMessage += status;
  }

  showPopup(errorMessage, false);
}
