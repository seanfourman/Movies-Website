$(document).ready(init);

const port = 5001;
const url = `https://localhost:${port}/api/Movies`;

const moviesPerPage = 20;
var currentMovieIndex = 0;

const htmlSnippets = {
  nav: `
    <a href="./index.html"><button>Home</button></a>
    <img id="logo" src="../sources/LOGO-ducktape.png" />
    <a href="./myMovies.html"><button>My Movies</button></a>
  `,
  footer: `
    <p>&copy; 2025 The Reel Deal, All rights reserved.</p>
  `
};

const noMoviesMessages = [
  "No movies? That's suspicious.",
  "The shelf is empty.",
  "Nothing to see here.",
  "The plot is missing.",
  "Silence... no titles found.",
  "Cue the crickets...",
  "Zero films. Drama incoming!",
  "No scenes, just vibes.",
  "Oops! No reels today.",
  "Hollywood took the day off.",
  "Your list is on vacation.",
  "Still rolling… with no film.",
  "Popcorn's ready. But nothing's playing."
];

var path = window.location.pathname;
var page = path.split("/").pop();

function init() {
  for (const element in htmlSnippets) {
    injectSnippet(element);
  }

  if ($("#loadMoviesButton").length) {
    $("#loadMoviesButton").click(function () {
      loadMovies(movies);
    });
  } else if (page === "index.html") {
    console.error(`loadMovies: Element '#loadMoviesButton' not found in DOM.`);
  }

  let isLoading = false;

  $(window).on("scroll", function () {
    if (!isLoading && $(window).scrollTop() + $(window).height() >= $(document).height()) {
      isLoading = true;

      loadMovies(movies);

      setTimeout(function () {
        isLoading = false;
      }, 500); // Prevent multiple triggers
    }
  });
}

function injectSnippet(element) {
  if ($(`${element}`).length) {
    $(`${element}`).html(htmlSnippets[element]);
  } else {
    console.error(`injectSnippet: Element '${element}' not found in DOM.`);
  }
}

function loadMovies(arr) {
  const nextBatch = arr.slice(currentMovieIndex, currentMovieIndex + moviesPerPage);
  currentMovieIndex += moviesPerPage;

  const filteredMovies = nextBatch.map((movie) => {
    let genres;
    if (movie.genres) {
      if (Array.isArray(movie.genres)) {
        genres = movie.genres;
      } else if (typeof movie.genres === "string") {
        genres = movie.genres.split(",").map((genre) => genre.trim());
      } else {
        genres = []; // For unexpected types
      }
    } else {
      genres = []; //For undefined or null
    }

    return {
      id: movie.id,
      url: movie.url,
      primaryTitle: movie.primaryTitle,
      description: movie.description,
      primaryImage: movie.primaryImage,
      year: movie.startYear || movie.year,
      releaseDate: movie.releaseDate,
      language: movie.language,
      budget: movie.budget,
      grossWorldwide: movie.grossWorldwide,
      genres: genres,
      isAdult: movie.isAdult,
      runtimeMinutes: movie.runtimeMinutes,
      averageRating: movie.averageRating,
      numVotes: movie.numVotes
    };
  });

  if ($("#loadMoviesButton").length) {
    $("#loadMoviesButton").hide();
  } else if (page === "index.html") {
    console.error(`loadMovies: Element '#loadMoviesButton' not found in DOM.`);
  }

  if (filteredMovies.length === 0) {
    return showNoMoviesMessage();
  } else {
    updateFooterPosition();
  }

  for (let movie of filteredMovies) {
    createMovieCard(movie);
  }

  if (currentMovieIndex >= arr.length) {
    $(window).off("scroll");
  }
}

function showNoMoviesMessage(text = noMoviesMessages[Math.floor(Math.random() * noMoviesMessages.length)]) {
  if ($("#noMovies").length === 0) {
    $("container").append($("<h1></h1>").attr("id", "noMovies").text(text));
  }
  updateFooterPosition();
}

function createMovieCard(movie) {
  let movieCard = $('<div class="movieCard"></div>');

  let cardHTML = `
    <div class="movieCardImageContainer">
      <img
        id="movieCardImg"
        src="${movie.primaryImage || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}"
        alt="${movie.primaryTitle}"
        class="movieCardImage"
      />
    </div>
    <div class="movieCardTextContainer">
      <div class="movieCardTextHeader">
        <div class="movieCardTitle" title="${movie.primaryTitle}">${movie.primaryTitle}</div>
        <div class="movieCardStats">
          <span>${movie.year || "N/A"}</span>
          <span>${movie.runtimeMinutes ? movie.runtimeMinutes + " min" : "N/A"}</span>
          <span id="rating">${movie.isAdult ? "R" : "PG-13"}</span>
        </div>
      </div>
      <div class="movieCardTextContent">
        <p>${movie.description || "No description available."}</p>
      </div>
      <div class="movieCardTextTags">
        ${generateGenreTags(movie.genres)}
      </div>
      <div class="movieCardFooter">
        <div class="movieCardBudget">
          <p class="footerTitle">Budget</p>
          <p class="footerText">${formatCurrency(movie.budget)}</p>
        </div>
        <div class="movieCardBoxOffice">
          <p class="footerTitle">Box Office</p>
          <p class="footerText">${formatCurrency(movie.grossWorldwide)}</p>
        </div>
        <div class="movieCardVotes">
          <p class="footerTitle">Votes</p>
          <p class="footerText">${formatNumber(movie.numVotes)}</p>
        </div>
      </div>
    </div>
    <div class="movieCardTag tag movieCardRating">★ ${movie.averageRating ? movie.averageRating.toFixed(1) : "N/A"}/10</div>
  `;

  movieCard.html(cardHTML);
  $("container").append(movieCard);
  onImageHover(movie, movieCard);
  enableDragScroll();
}

function generateGenreTags(genres) {
  if (genres.length === 0) {
    return '<span class="tag">Uncategorized</span>';
  }
  return genres.map((genre) => `<span class="tag">${genre}</span>`).join("");
}

function formatCurrency(value) {
  if (!value) return "N/A";

  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return "$" + (value / 1000).toFixed(1) + "K";
  }

  return "$" + value;
}

function formatNumber(value) {
  if (!value) return "N/A";

  if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value;
}

function enableDragScroll() {
  const $el = $(".movieCardTextTags");
  let isDown = false;
  let startX, scrollLeft;

  $el.on("mousedown", function (e) {
    isDown = true;
    startX = e.pageX;
    scrollLeft = this.scrollLeft;
  });

  $(document).on("mouseup", function () {
    isDown = false;
  });

  $el.on("mousemove", function (e) {
    if (!isDown) return;
    e.preventDefault();
    this.scrollLeft = scrollLeft - (e.pageX - startX);
  });
}

function onImageHover(movie, movieCard) {
  movieCard.find(".movieCardImageContainer").hover(
    function () {
      $(this).find("img").css({
        filter: "blur(5px)",
        transform: "scale(1.1)"
      });

      if ($(this).find(".add-button").length === 0) {
        let $btn = null;

        if (page === "index.html") {
          $btn = $('<div class="add-button"><span>❤</span></div>');
          $btn.on("click", function () {
            sendToServer(movie);
          });
        } else if (page === "myMovies.html") {
          $btn = $('<div class="add-button remove"><span>✘</span></div>');
          $btn.on("click", function () {
            deleteMovie(movie.id);
            const card = $btn.closest(".movieCard");
            card.fadeOut(300, function () {
              card.remove();
              ajaxCall("GET", url, "", checkIfArrayIsNull, handleServerError);
            });
          });
        }

        $(this).append($btn);
        $btn.fadeIn(500);
      } else {
        $(this).find(".add-button").fadeIn(500);
      }
    },
    function () {
      $(this).find("img").css({
        filter: "none",
        transform: "scale(1)"
      });

      $(this).find(".add-button").fadeOut(500);
    }
  );
}

function checkIfArrayIsNull(res) {
  if (res.length === 0) {
    return showNoMoviesMessage();
  }
}

function handleServerError() {
  showPopup("Failed to reach server. Please try again later!", false);
}

function sendToServer(selectedMovie) {
  let movie = {
    url: selectedMovie.url,
    primaryTitle: selectedMovie.primaryTitle,
    description: selectedMovie.description,
    primaryImage: selectedMovie.primaryImage,
    year: selectedMovie.year,
    releaseDate: selectedMovie.releaseDate,
    language: selectedMovie.language,
    budget: selectedMovie.budget,
    grossWorldwide: selectedMovie.grossWorldwide,
    genres: selectedMovie.genres.join(", "),
    isAdult: selectedMovie.isAdult,
    runtimeMinutes: selectedMovie.runtimeMinutes,
    averageRating: selectedMovie.averageRating,
    numVotes: selectedMovie.numVotes
  };

  ajaxCall("POST", url, JSON.stringify(movie), insertSCB, insertECB);
}

function deleteMovie(movieId) {
  ajaxCall("DELETE", `${url}/${movieId}`, null, insertSCB, insertECB);
}

function insertSCB(res) {
  if (res === false) {
    showPopup("Movie is already in your library!", false);
  } else {
    if (page === "index.html") {
      showPopup("Added to your library!", true);
    }
  }
}

function insertECB() {
  showPopup("Failed to reach server. Please try again later!", false);
}

function showPopup(message, flag) {
  let $popup = $("#popup");
  if ($popup.length > 0) {
    $popup.remove();
  }

  $popup = $("<div></div>").attr("id", "popup").addClass("popup").text(message);

  if (flag === true) {
    $popup.addClass("success");
  } else {
    $popup.addClass("failure");
  }
  $("body").append($popup);

  $popup[0].offsetHeight; // Trigger reflow to ensure animation works
  $popup.addClass("show");

  setTimeout(() => {
    $popup.removeClass("show");

    setTimeout(() => {
      $popup.remove();
    }, 500);
  }, 2000);
}

function updateFooterPosition() {
  setTimeout(() => {
    const isScrollable = $(document).height() > $(window).height();

    if (isScrollable) {
      $("footer").addClass("relative");
    } else {
      $("footer").removeClass("relative");
    }
  }, 1);
}

$(window).on("load resize", updateFooterPosition);
