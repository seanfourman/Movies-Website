let isEditingMode = false;

function initMyMoviesPage() {
  loadMoreMovies();
  addEditButton();
}

function readSCB(res) {
  loadMovies(res);
  //showNoMoviesMessage();
}

function readECB() {
  showPopup("Failed to reach server. Please try again later!", false);
  showNoMoviesMessage();
}

function addEditButton() {
  const $editButton = $(`
    <div id="edit-button">
      <img src="../sources/edit-icon.png" />
    </div>
  `);

  $("body").append($editButton);

  $editButton.on("click", function () {
    toggleEditingMode();
  });
}

function toggleEditingMode() {
  isEditingMode = !isEditingMode;

  const $editButton = $("#edit-button");

  if (isEditingMode) {
    $editButton.addClass("editing-active");
    $editButton.find("img").attr("src", "../sources/inEdit-icon.png");
    console.log("Editing mode activated");
  } else {
    $editButton.removeClass("editing-active");
    $editButton.find("img").attr("src", "../sources/edit-icon.png");
    console.log("Editing mode deactivated");
  }
}
