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
        <div class="movieCardTag tag movieCardRating"> ★ ${movie.averageRating === 10 ? "10" : movie.averageRating === 0 ? "0" : movie.averageRating.toFixed(1)}/10</div>
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
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();
  const userData = localStorage.getItem("userData");

  movieCard.find(".movieCardImageContainer").hover(
    function () {
      $(this).find("#movieCardImg").css({
        filter: "blur(5px)",
        transform: "scale(1.1)"
      });

      $(this).find(".add-button").remove();

      let $btn = null;

      if (currentPage === "index.html") {
        $btn = $('<div class="add-button"><img id="cartIcon" src="../sources/cart-icon.png" /></div>');
        $btn.on("click", function (e) {
          e.stopPropagation();
          const userData = JSON.parse(localStorage.getItem("userData") || "{}");
          if (!userData.email) {
            window.location.href = "../html/signin.html";
          } else {
            createPopupForm(movie);
          }
        });
      } else if (currentPage === "mymovies.html") {
        if (isEditingMode) {
          $btn = $('<div class="add-button remove"><span>✘</span></div>');
          $btn.on("click", function (e) {
            e.stopPropagation();
            showReturnConfirmationDialog(movie, $(this).closest(".movieCard"));
          });
        } else {
          $btn = $('<div class="add-button remove"><img id="rentingEdit" src="../sources/transaction-icon.png" /></div>');
          $btn.on("click", function (e) {
            e.stopPropagation();
            showUserSelectionDataTable(movie);
          });
        }
      }

      if ($btn) {
        $(this).append($btn);
        $btn.fadeIn(300);
      }
    },
    function () {
      if ($(".confirmation-dialog-overlay").length === 0) {
        $(this).find("#movieCardImg").css({
          filter: "none",
          transform: "scale(1)"
        });
        $(this)
          .find(".add-button")
          .fadeOut(300, function () {
            $(this).remove();
          });
      }
    }
  );
}

function showReturnConfirmationDialog(movie, movieCardElement) {
  $(".confirmation-dialog-overlay").remove();

  const dialogHTML = `
    <div class="confirmation-dialog-overlay">
      <div class="confirmation-dialog">
        <p class="confirmation-dialog-title">Return Movie</p>
        <p class="confirmation-dialog-message">Are you sure you want to return<br><strong>"${movie.primaryTitle}"?</p>
        <div class="confirmation-dialog-buttons">
          <button class="confirmation-dialog-btn confirm-btn">Return</button>
          <button class="confirmation-dialog-btn cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  `;

  preventBodyScroll();
  $("body").append(dialogHTML);
  const $dialogOverlay = $(".confirmation-dialog-overlay");
  const $dialog = $(".confirmation-dialog");

  $dialogOverlay.fadeIn(300);

  $dialog.find(".confirm-btn").on("click", function () {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    deleteRentedMovie(
      userData.id,
      movie.id,
      function () {
        movieCardElement.fadeOut(300, function () {
          $(this).remove();
          enableBodyScroll();
          if ($(".movieCard").length === 0) {
            $("#edit-button").remove();
            showNoMoviesMessage();
          }
          updateFooterPosition();

          const $imageContainer = movieCardElement.find(".movieCardImageContainer");
          $imageContainer.find("img").css({ filter: "none", transform: "scale(1)" });
          $imageContainer.find(".add-button").remove();
        });
        showPopup(`"${movie.primaryTitle}" has been returned`, true);
      },
      function (error) {
        handleServerError(error);
        showPopup(`Failed to return "${movie.primaryTitle}". Please try again`, false);
      }
    );
    $dialogOverlay.fadeOut(300, function () {
      $(this).remove();
      enableBodyScroll();
    });
  });

  $dialog.find(".cancel-btn").on("click", function () {
    $dialogOverlay.fadeOut(300, function () {
      $(this).remove();
      const $imageContainer = movieCardElement.find(".movieCardImageContainer");
      $imageContainer.find("img").css({ filter: "none", transform: "scale(1)" });
      $imageContainer.find(".add-button").fadeOut(300, function () {
        $(this).remove();
        enableBodyScroll();
      });
    });
  });

  $dialogOverlay.on("click", function (event) {
    if ($(event.target).is($dialogOverlay)) {
      $dialogOverlay.fadeOut(300, function () {
        $(this).remove();
        const $imageContainer = movieCardElement.find(".movieCardImageContainer");
        $imageContainer.find("img").css({ filter: "none", transform: "scale(1)" });
        $imageContainer.find(".add-button").fadeOut(300, function () {
          $(this).remove();
          enableBodyScroll();
        });
      });
    }
  });
}

function checkIfArrayIsNull(res) {
  if (res.length === 0) {
    if (typeof showNoMoviesMessage === "function") {
      return showNoMoviesMessage();
    }
  }
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
  $("container").on("mousedown", ".movieCardTextTags", function (e) {
    const $el = $(this);
    let isDown = true;
    let startX = e.pageX - $el.offset().left;
    let scrollLeft = $el.scrollLeft();
    $el.addClass("grabbing");

    $(document)
      .on("mousemove.dragScroll", function (ev) {
        if (!isDown) return;
        ev.preventDefault();
        const x = ev.pageX - $el.offset().left;
        const walk = (x - startX) * 2;
        $el.scrollLeft(scrollLeft - walk);
      })
      .on("mouseup.dragScroll", function () {
        if (isDown) {
          isDown = false;
          $el.removeClass("grabbing");
          $(document).off("mousemove.dragScroll mouseup.dragScroll");
        }
      });
  });
}

function showUserSelectionDataTable(movie) {
  $(".user-selection-overlay").remove();

  const dialogHTML = `
    <div class="user-selection-overlay">
      <div class="user-selection-dialog">
        <div class="user-selection-header">
          <h2>Transfer "${movie.primaryTitle}"</h2>
          <span class="user-selection-close">×</span>
        </div>
        <div class="user-selection-content">
          <p>Select a user to transfer this movie to:</p>
          <div class="datatable-container">
            <table id="usersDataTable" class="display responsive nowrap" style="width:100%">
              <thead>
                <tr>
                  <th style="display:none;">ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  preventBodyScroll();
  $("body").append(dialogHTML);

  $(".user-selection-overlay").fadeIn(300);

  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const currentUserId = currentUser.id;

  const dataTable = $("#usersDataTable").DataTable({
    ajax: {
      url: usersEndpoint,
      dataSrc: function (json) {
        return json.filter((user) => user.id !== currentUserId);
      },
      error: function (xhr, error, thrown) {
        showPopup("Error loading users: " + thrown, false);
        $(".user-selection-overlay").fadeOut(300, function () {
          $(this).remove();
          enableBodyScroll();
        });
      }
    },
    columns: [
      { data: "id", visible: false },
      { data: "name" },
      { data: "email" },
      {
        data: null,
        defaultContent: '<button class="transfer-btn">Transfer</button>',
        orderable: false
      }
    ],
    responsive: true,
    dom: "Bfrtip",
    language: {
      search: "Search users:",
      emptyTable: "No other users available"
    },
    order: [[1, "asc"]],
    pageLength: 5,
    lengthMenu: [
      [5, 10, 25, -1],
      [5, 10, 25, "All"]
    ],
    initComplete: function () {
      $(".dataTables_filter input").attr("placeholder", "Search users...");
    }
  });

  $("#usersDataTable").on("click", ".transfer-btn", function () {
    const data = dataTable.row($(this).parents("tr")).data();
    if (data) {
      showTransferConfirmation(movie, data);
    }
  });

  $(".user-selection-close, .user-selection-overlay").on("click", function (e) {
    if ($(e.target).is(".user-selection-overlay") || $(e.target).is(".user-selection-close")) {
      $(".user-selection-overlay").fadeOut(300, function () {
        $(this).remove();
        enableBodyScroll();
      });
    }
  });
}

function showTransferConfirmation(movie, receiverData) {
  const confirmHTML = `
    <div class="confirmation-dialog-overlay">
      <div class="confirmation-dialog">
        <p class="confirmation-dialog-title">Confirm Transfer</p>
        <p class="confirmation-dialog-message">
          Are you sure you want to transfer<br>
          <strong>"${movie.primaryTitle}"</strong><br>
          to <strong>${receiverData.name}</strong>?
        </p>
        <div class="confirmation-dialog-buttons">
          <button class="confirmation-dialog-btn confirm-btn">Transfer</button>
          <button class="confirmation-dialog-btn cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  `;

  $("body").append(confirmHTML);

  $(".confirm-btn").on("click", function () {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const rentedMovieToTransfer = {
      UserId: userData.id,
      MovieId: movie.id
    };

    transferRentedMovie(
      receiverData.id,
      rentedMovieToTransfer,
      function (response) {
        $(".confirmation-dialog-overlay, .user-selection-overlay").fadeOut(300, function () {
          $(this).remove();
          enableBodyScroll();
        });

        showPopup(`"${movie.primaryTitle}" has been transferred to ${receiverData.name}`, true);

        $(".movieCard").each(function () {
          if ($(this).find(".movieCardTitle").text() === movie.primaryTitle) {
            $(this).fadeOut(300, function () {
              $(this).remove();

              if ($(".movieCard").length === 0) {
                $("#edit-button").remove();
                showNoMoviesMessage();
              }

              updateFooterPosition();
            });
          }
        });
      },
      function (error) {
        $(".confirmation-dialog-overlay").fadeOut(300, function () {
          $(this).remove();
        });
        handleServerError(error);
        showPopup(`Failed to transfer "${movie.primaryTitle}". User is already renting this movie!`, false);
      }
    );
  });

  $(".cancel-btn").on("click", function () {
    $(".confirmation-dialog-overlay").fadeOut(300, function () {
      $(this).remove();
    });
  });

  $(".confirmation-dialog-overlay").on("click", function (e) {
    if ($(e.target).is(".confirmation-dialog-overlay")) {
      $(this).fadeOut(300, function () {
        $(this).remove();
      });
    }
  });
}
