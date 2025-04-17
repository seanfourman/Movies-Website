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
                    <span class="rating">${movie.isAdult ? "R" : "PG-13"}</span>
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
        <div class="movieCardTag tag movieCardRating"> ★ ${movie.averageRating ? (movie.averageRating === 10 ? "10" : movie.averageRating.toFixed(1)) : "N/A"}/10</div>
    `;

  movieCard.html(cardHTML);
  $("container").append(movieCard);
  setupCardInteraction(movie, movieCard);
  updateRatingBackground();
  enableDragScroll();

  return movieCard;
}

function generateGenreTags(genres) {
  if (!genres || genres.length === 0) {
    return '<span class="tag">Uncategorized</span>';
  }

  if (typeof genres === "string") {
    genres = genres.split(",").map((genre) => genre.trim());
  }

  return genres.map((genre) => `<span class="tag">${genre}</span>`).join("");
}

function setupCardInteraction(movie, movieCard) {
  const currentPage = window.location.pathname.split("/").pop();

  movieCard.find(".movieCardImageContainer").hover(
    function () {
      $(this).find("#movieCardImg").css({
        filter: "blur(5px)",
        transform: "scale(1.1)"
      });

      if ($(this).find(".add-button").length === 0) {
        let $btn = null;

        if (currentPage === "index.html") {
          $btn = $('<div class="add-button"><span>❤</span></div>');
          $btn.on("click", function () {
            let userEmail = localStorage.getItem("userEmail");
            if (!userEmail) {
              window.location.href = "../html/signin.html";
            } else {
              sendToServer(movie);
            }
          });
        } else if (currentPage === "myMovies.html") {
          $btn = $('<div class="add-button remove"><span>✘</span></div>');
          $btn.on("click", function () {
            deleteMovie(
              movie.id,
              function () {
                const card = $btn.closest(".movieCard");
                card.fadeOut(300, function () {
                  card.remove();
                  updateFooterPosition();
                  getAllMovies(checkIfArrayIsNull, handleServerError);
                });
              },
              handleServerError
            );
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

function updateRatingBackground() {
  $(".rating").each(function () {
    const $rating = $(this);
    if ($rating.text().trim() === "R") {
      $rating.css("background-color", "#e33923");
    } else {
      $rating.css("background-color", "#a2d25e");
    }
  });
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
