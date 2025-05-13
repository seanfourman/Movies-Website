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
  const $bgImg = $("<img>").addClass("popup-bg-img desktop-bg").attr("src", "../sources/paper-bg-bw.png");
  const $bgImgMobile = $("<img>").addClass("popup-bg-img mobile-bg").attr("src", "../sources/paper-bg-bw-mobile.png");
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

  const $startInput = addInput("Start Date", "date", "rentStart", formatDate(today));
  const $endInput = addInput("End Date", "date", "rentEnd", formatDate(nextWeek));

  const $priceInfo = $("<h3>").addClass("price-info");
  const $totalPriceSpan = $("<span>").addClass("total-price");

  $priceInfo.append($totalPriceSpan);
  $form.append($priceInfo);

  function updatePrice() {
    const startDate = $startInput.val();
    const endDate = $endInput.val();

    if (startDate && endDate) {
      const days = calculateDaysBetween(startDate, endDate);
      const totalPrice = (movie.priceToRent * days).toFixed(2);

      $totalPriceSpan.text(`Total Price: $${totalPrice}`);
    }
  }

  $startInput.on("change", updatePrice);
  $endInput.on("change", updatePrice);

  updatePrice();

  const $submit = $("<button>")
    .addClass("rent-submit")
    .text("Rent Now")
    .on("click", function () {
      const startDate = $startInput.val();
      const endDate = $endInput.val();
      const days = calculateDaysBetween(startDate, endDate);
      const totalPrice = (movie.priceToRent * days).toFixed(2);

      if (!startDate || !endDate) {
        showPopup("Both start and end dates are required", false);
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        showPopup("The start date cannot be later than the end date", false);
        return;
      }

      rentMovie(
        movie.id,
        startDate,
        endDate,
        totalPrice,
        function (response) {
          $overlay.fadeOut(300, function () {
            $(this).remove();
            enableBodyScroll();
          });
          showPopup("Movie rented successfully!", true);
        },
        function (error) {
          showPopup("You can't rent the same movie twice", false);
        }
      );
    });

  $form.append($submit);

  $wrapper.append($bgImg);
  $wrapper.append($bgImgMobile);
  $wrapper.append($form);

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
