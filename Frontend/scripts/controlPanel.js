$(document).ready(function () {
  loadUsersDataTable();

  $("#resetMoviesBtn").on("click", function () {
    showResetMoviesConfirmation();
  });
});

function loadUsersDataTable() {
  const currentUserData = JSON.parse(localStorage.getItem("userData") || "{}");
  const currentUserId = currentUserData.id;

  const dataTable = $("#usersDataTable").DataTable({
    ajax: {
      url: usersEndpoint,
      dataSrc: function (json) {
        return json || [];
      },
      error: function (xhr, error, thrown) {
        showPopup("Error loading users: " + thrown, false);
        return [];
      }
    },
    columns: [
      { data: "id", visible: true },
      {
        data: "active",
        render: function (data) {
          const statusClass = data ? "active" : "inactive";
          return `<span class="status-dot ${statusClass}"></span>${data ? "Active" : "Inactive"}`;
        }
      },
      { data: "name" },
      { data: "email" },
      {
        data: "isAdmin",
        render: function (data) {
          return data ? "Admin" : "User";
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          if (row.id === currentUserId) {
            return `<button class="action-btn self-btn" disabled>Self</button>`;
          }

          const activeButtonClass = row.active ? "" : "activate";
          const activeButtonText = row.active ? "Deactivate" : "Activate";

          const adminButtonClass = row.isAdmin ? "" : "activate";
          const adminButtonText = row.isAdmin ? "Remove Admin" : "Make Admin";

          return `
            <div class="action-buttons">
              <button class="action-btn ${activeButtonClass}" data-action="active" data-user-id="${row.id}">${activeButtonText}</button>
              <button class="action-btn admin-btn ${adminButtonClass}" data-action="admin" data-user-id="${row.id}">${adminButtonText}</button>
            </div>
          `;
        },
        orderable: false
      }
    ],
    responsive: true,
    dom: "Bfrtip",
    language: {
      search: "Search users:",
      emptyTable: "No users available"
    },
    order: [[0, "asc"]],
    pageLength: 10,
    lengthMenu: [
      [5, 10, 25, 50, -1],
      [5, 10, 25, 50, "All"]
    ],
    initComplete: function () {
      $(".dataTables_filter input").attr("placeholder", "Search users...");
    }
  });

  $("#usersDataTable").on("click", ".action-btn:not([disabled])", function () {
    const $tr = $(this).closest("tr");
    let row = dataTable.row($tr);

    if ($tr.hasClass("child")) {
      const $parent = $tr.prev();
      row = dataTable.row($parent);
    }

    const userData = row.data();
    const actionType = $(this).data("action") || "active";

    showUserActionConfirmation(userData, dataTable, actionType);
  });
}

function showUserActionConfirmation(userData, dataTable, actionType) {
  let isCurrentValue, action, actionDisplay, attributeType;

  if (actionType === "admin") {
    isCurrentValue = userData.isAdmin;
    attributeType = "Admin";
    action = isCurrentValue ? "removeAdmin" : "setAdmin";
    actionDisplay = isCurrentValue ? "Remove Admin" : "Make Admin";
  } else {
    isCurrentValue = userData.active;
    attributeType = "Active";
    action = isCurrentValue ? "deactivate" : "activate";
    actionDisplay = isCurrentValue ? "Deactivate" : "Activate";
  }

  const confirmHTML = `
    <div class="confirmation-dialog-overlay">
      <div class="confirmation-dialog">
        <p class="confirmation-dialog-title">${actionDisplay} User</p>
        <p class="confirmation-dialog-message">
          Are you sure you want to ${action} user<br>
          <strong>${userData.name}</strong> (${userData.email})?
        </p>
        <div class="confirmation-dialog-buttons">
          <button class="confirmation-dialog-btn confirm-btn ${!isCurrentValue ? "activate" : ""}">${actionDisplay}</button>
          <button class="confirmation-dialog-btn cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  `;

  $("body").append(confirmHTML);

  $(".confirm-btn").on("click", function () {
    setUserAttribute(
      userData.email,
      attributeType,
      !isCurrentValue,
      function (result) {
        if (actionType === "admin") {
          userData.isAdmin = !isCurrentValue;
        } else {
          userData.active = !isCurrentValue;
        }

        const rowIndex = dataTable
          .rows()
          .indexes()
          .filter(function (value, index) {
            return dataTable.row(value).data().id === userData.id;
          });

        if (rowIndex.length > 0) {
          dataTable.row(rowIndex[0]).data(userData).draw();
        }
        if (action === "setAdmin") {
          showPopup(`User "${userData.name}" has been granted admin privileges`, true);
        } else if (action === "removeAdmin") {
          showPopup(`Admin privileges have been revoked from user "${userData.name}"`, true);
        } else {
          showPopup(`User "${userData.name}" has been ${action}d`, true);
        }

        $(".confirmation-dialog-overlay").fadeOut(300, function () {
          $(this).remove();
        });
      },
      function (error) {
        showPopup(`Failed to ${action} user "${userData.name}"`, false);

        $(".confirmation-dialog-overlay").fadeOut(300, function () {
          $(this).remove();
        });
      }
    );
  });

  $(".cancel-btn, .confirmation-dialog-overlay").on("click", function (e) {
    if ($(e.target).is(".cancel-btn") || $(e.target).is(".confirmation-dialog-overlay")) {
      $(".confirmation-dialog-overlay").fadeOut(300, function () {
        $(this).remove();
      });
    }
  });
}

function showResetMoviesConfirmation() {
  const confirmHTML = `
    <div class="confirmation-dialog-overlay">
      <div class="confirmation-dialog danger-dialog">
        <p class="confirmation-dialog-title">Dangerous Action</p>
        <p class="confirmation-dialog-message">
          Are you sure you want to restore <strong>ALL Movies</strong><br>back to default from the database?<br>
          <span class="danger-warning">This action cannot be undone</span>
        </p>
        <div class="confirmation-dialog-buttons">
          <button class="confirmation-dialog-btn confirm-btn danger-confirm">Restore</button>
          <button class="confirmation-dialog-btn cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  `;

  $("body").append(confirmHTML);

  $(".confirm-btn.danger-confirm").on("click", function () {
    resetMovieDatabase(
      function (result) {
        showPopup("Movie database has been reset successfully. Adding movies...", true);
        sendMoviesToServer();

        $(".confirmation-dialog-overlay").fadeOut(300, function () {
          $(this).remove();
        });
      },
      function (error) {
        showPopup("Failed to reset movie database: " + (error.responseText || "Unknown error"), false);
        $(".confirmation-dialog-overlay").fadeOut(300, function () {
          $(this).remove();
        });
      }
    );
  });

  $(".cancel-btn, .confirmation-dialog-overlay").on("click", function (e) {
    if ($(e.target).is(".cancel-btn") || $(e.target).is(".confirmation-dialog-overlay")) {
      $(".confirmation-dialog-overlay").fadeOut(300, function () {
        $(this).remove();
      });
    }
  });
}

function sendMoviesToServer() {
  let totalMovies = movies.length;
  let successCount = 0;
  let errorCount = 0;

  function checkCompletion() {
    if (successCount + errorCount === totalMovies) {
      if (errorCount === 0) {
        showPopup(`Database restore complete! ${successCount} movies added successfully.`, true);
      } else {
        showPopup(`Database restore completed with issues. ${successCount} movies added successfully, ${errorCount} failed.`, false);
      }
    }
  }

  movies.forEach((movie) => {
    const movieData = {
      primaryTitle: movie.primaryTitle,
      description: movie.description,
      primaryImage: movie.primaryImage,
      contentRating: movie.contentRating,
      releaseDate: movie.releaseDate,
      language: movie.language == null ? "Unknown" : movie.language,
      genres: Array.isArray(movie.genres) ? movie.genres.join(",") : movie.genres,
      year: movie.startYear,
      budget: movie.budget === null ? 0.0 : movie.budget,
      grossWorldWide: movie.grossWorldwide === null ? 0.0 : movie.grossWorldwide,
      runtimeMinutes: movie.runtimeMinutes,
      averageRating: movie.averageRating,
      numVotes: movie.numVotes,
      url: movie.url
    };

    addMovie(
      movieData,
      (response) => {
        successCount++;
        if (
          successCount % 10 === 0 ||
          successCount === Math.floor(totalMovies * 0.25) ||
          successCount === Math.floor(totalMovies * 0.5) ||
          successCount === Math.floor(totalMovies * 0.75)
        ) {
          showPopup(`Adding movies: ${successCount}/${totalMovies} complete...`, true);
        }
        checkCompletion();
      },
      (error) => {
        errorCount++;
        console.error(`Error adding movie "${movie.primaryTitle}": ${error}`);
        checkCompletion();
      }
    );
  });
}
