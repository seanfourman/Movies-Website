$(document).ready(init);

const port = 5001;
const url = `https://localhost:${port}/api/Movies`;

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

var path = window.location.pathname;
var page = path.split("/").pop();

function init() {
  for (const element in htmlSnippets) {
    injectSnippet(element);
  }
  swapLogoHref();

  // Length is needed because jquery always returns true without
  if ($("#loadMoviesButton").length) {
    $("#loadMoviesButton").click(function () {
      loadMovies(movies);
    });
  } else if (page === "index.html") {
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
  if (page === "index.html") {
    if ($("#logo").length) {
      $("#logo").attr("href", "#");
    } else {
      console.error(`loadMovies: Element '#logo' not found in DOM.`);
    }
  }
}

function loadMovies(arr) {
  filteredMovies = arr.map((movie) => ({
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
    genres: movie.genres,
    isAdult: movie.isAdult,
    runtimeMinutes: movie.runtimeMinutes,
    averageRating: movie.averageRating,
    numVotes: movie.numVotes
  }));

  if ($("#loadMoviesButton").length) {
    $("#loadMoviesButton").hide();
  } else if (page === "index.html") {
    console.error(`loadMovies: Element '#loadMoviesButton' not found in DOM.`);
  }

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
  onImageHover(movie);
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

function onImageHover(movie) {
  $(".movieCardImageContainer").hover(
    function () {
      $(this).find("img").css({
        filter: "blur(5px)",
        transform: "scale(1.1)"
      });

      if ($(this).find(".add-button").length === 0) {
        let $btn = null;

        if (page === "index.html") {
          $btn = $('<div class="add-button"><span>+</span></div>');
          $btn.on("click", function () {
            sendToServer(movie);
          });
        } else if (page === "myMovies.html") {
          $btn = $('<div class="add-button remove"><span>⮿</span></div>');
          $btn.on("click", function () {
            deleteMovie(movie.id);
            $btn.parent().parent().remove();
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

// Send data to server
function sendToServer(selectedMovie) {
  let movie = {
    id: selectedMovie.id,
    url: selectedMovie.url,
    primaryTitle: selectedMovie.primaryTitle,
    description: selectedMovie.description,
    primaryImage: selectedMovie.primaryImage,
    year: selectedMovie.year,
    releaseDate: selectedMovie.releaseDate,
    language: selectedMovie.language,
    budget: selectedMovie.budget,
    grossWorldwide: selectedMovie.grossWorldwide,
    genres: selectedMovie.genres,
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
    console.error("[HTTP Request]: Movie is already in library.");
    showPopup("Movie is already in your library!", false);
  } else {
    console.log("[HTTP Request]: Movie added to user library.");
    showPopup("Added to your library!", true);
  }
}

function insertECB(err) {
  console.log(err);
}

function showPopup(message, flag) {
  const $popup = $("#popup");
  $popup.text(message).addClass("show");
  if (flag === true) {
    console.log("alo");
    $popup.addClass("success");
  } else {
    $popup.addClass("failure");
  }

  setTimeout(() => {
    $popup.removeClass("show");
    $popup.removeClass("success");
    $popup.removeClass("failure");
  }, 2000);
}
