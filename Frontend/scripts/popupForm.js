function createPopupForm(movie) {
  if ($(".popup-wrapper").length) return;
  preventBodyScroll();

  const $overlay = $("<div>")
    .addClass("popup-overlay")
    .on("click", function (e) {
      if ($(e.target).hasClass("popup-overlay")) {
        $overlay.fadeOut(300, function () {
          $(this).remove();
          enableBodyScroll();
        });
      }
    });

  const $wrapper = $("<div>").addClass("popup-wrapper");
  const $bgImg = $("<img>").addClass("popup-bg-img").attr("src", "../sources/paper-bg-bw.png");
  const $form = $("<div>").addClass("form-container");

  const $closeBtn = $("<div>")
    .addClass("form-close")
    .html("&times;")
    .on("click", function () {
      $overlay.fadeOut(300, function () {
        $(this).remove();
        enableBodyScroll();
      });
    });

  $form.append($closeBtn);
  $form.append($("<h1>").text("Rent Movie:"));

  const $titleContainer = $("<div>").addClass("movie-title-container");
  const $title = $("<h4>").addClass("movie-title-ellipsis").text(movie.primaryTitle).attr("data-full-title", movie.primaryTitle);

  $titleContainer.append($title);
  $form.append($titleContainer);

  function addInput(labelText, inputType, name, defaultValue = "") {
    const $formGroup = $("<div>").addClass("form-group");
    const $label = $("<label>").attr("for", name).text(labelText);
    const $input = $("<input>").attr({
      type: inputType,
      name: name,
      id: name,
      value: defaultValue
    });

    $formGroup.append($label, $input);
    $form.append($formGroup);
    return $input;
  }

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const $startInput = addInput("Start Date", "date", "rentStart", formatDate(today));
  const $endInput = addInput("End Date", "date", "rentEnd", formatDate(nextWeek));

  $form.append($("<h3>").addClass("price-info").text(`Rent Price: $${movie.priceToRent}`));

  const $submit = $("<button>")
    .addClass("rent-submit")
    .text("Rent Now")
    .on("click", function () {
      const startDate = $startInput.val();
      const endDate = $endInput.val();

      if (!startDate || !endDate) {
        showPopup("Please select both dates", false);
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        showPopup("Start date cannot be after end date", false);
        return;
      }

      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      if (!userData.id) {
        showPopup("Please log in to rent movies", false);
        enableBodyScroll();
        window.location.href = "../html/signin.html";
        return;
      }

      rentMovie(
        movie.id,
        startDate,
        endDate,
        function (response) {
          $overlay.fadeOut(300, function () {
            $(this).remove();
            enableBodyScroll();
          });
          showPopup("Movie rented successfully!", true);
        },
        function (error) {
          showPopup("Failed to rent movie. Please try again.", false);
        }
      );
    });

  $form.append($submit);

  $wrapper.append($bgImg, $form);
  $overlay.append($wrapper);

  $("body").append($overlay);
  $overlay.hide().fadeIn(300);

  $wrapper
    .css({
      transform: "translateY(-20px)",
      opacity: 0
    })
    .animate(
      {
        transform: "translateY(0)",
        opacity: 1
      },
      300
    );
}

/*
function rentMovie(movieId, startDate, endDate, successCallback, errorCallback) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = userData.id;

  const rentalData = {
    userId: userId,
    movieId: movieId,
    startDate: startDate,
    endDate: endDate
  };

  ajaxCall("POST", `${moviesEndpoint}/rent`, JSON.stringify(rentalData), successCallback, errorCallback);
}
*/
