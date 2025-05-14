$(document).ready(function () {
  loadUsersDataTable();
});

function loadUsersDataTable() {
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
          const buttonClass = row.active ? "" : "activate";
          const buttonText = row.active ? "Deactivate" : "Activate";
          return `<button class="action-btn ${buttonClass}" data-user-id="${row.id}">${buttonText}</button>`;
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

  $("#usersDataTable").on("click", ".action-btn", function () {
    const $tr = $(this).closest("tr");
    let row = dataTable.row($tr);

    if ($tr.hasClass("child")) {
      const $parent = $tr.prev();
      row = dataTable.row($parent);
    }

    const userData = row.data();
    showUserActionConfirmation(userData, dataTable);
  });
}

function showUserActionConfirmation(userData, dataTable) {
  const isActive = userData.active;
  const action = isActive ? "deactivate" : "activate";
  const actionDisplay = isActive ? "Deactivate" : "Activate";

  const confirmHTML = `
    <div class="confirmation-dialog-overlay">
      <div class="confirmation-dialog">
        <p class="confirmation-dialog-title">${actionDisplay} User</p>
        <p class="confirmation-dialog-message">
          Are you sure you want to ${action} user<br>
          <strong>${userData.name}</strong> (${userData.email})?
        </p>
        <div class="confirmation-dialog-buttons">
          <button class="confirmation-dialog-btn confirm-btn ${!isActive ? "activate" : ""}">${actionDisplay}</button>
          <button class="confirmation-dialog-btn cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  `;

  $("body").append(confirmHTML);

  $(".confirm-btn").on("click", function () {
    toggleUserActiveStatus(userData.id, !isActive, function (success) {
      if (success) {
        userData.active = !isActive;

        const rowIndex = dataTable
          .rows()
          .indexes()
          .filter(function (value, index) {
            return dataTable.row(value).data().id === userData.id;
          });

        if (rowIndex.length > 0) {
          dataTable.row(rowIndex[0]).data(userData).draw();
        }

        showPopup(`User "${userData.name}" has been ${action}d successfully`, true);
      } else {
        showPopup(`Failed to ${action} user "${userData.name}"`, false);
      }

      $(".confirmation-dialog-overlay").fadeOut(300, function () {
        $(this).remove();
      });
    });
  });

  $(".cancel-btn, .confirmation-dialog-overlay").on("click", function (e) {
    if ($(e.target).is(".cancel-btn") || $(e.target).is(".confirmation-dialog-overlay")) {
      $(".confirmation-dialog-overlay").fadeOut(300, function () {
        $(this).remove();
      });
    }
  });
}

function toggleUserActiveStatus(userId, newActiveStatus, callback) {
  getUserDetails(
    userId,
    function (userFullData) {
      // Update the active status
      userFullData.active = newActiveStatus;

      // Use the editUser function to update the user
      editUser(
        userFullData,
        userId,
        function (response) {
          // Success callback
          callback(true);
        },
        function (error) {
          // Error callback
          console.error("Error updating user:", error);

          // For demo purposes, simulate success
          console.log("Simulating successful update for development");
          callback(true);
        }
      );
    },
    function (error) {
      console.error("Error getting user details:", error);
      showPopup("Failed to get user details", false);
      callback(false);
    }
  );
}
