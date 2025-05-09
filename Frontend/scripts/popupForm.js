function createPopupForm(movie) {
  if ($(".popup-wrapper").length) return;

  const $wrapper = $("<div>").addClass("popup-wrapper");
  const $bgImg = $("<img>").addClass("popup-bg-img").attr("src", "../sources/paper-bg-bw.png");

  const $form = $("<div>").addClass("form-container");

  const $closeBtn = $("<div>")
    .addClass("form-close")
    .html("&times;")
    .on("click", () => $wrapper.remove());

  $form.append($closeBtn);
  $form.append($("<h1>").text("Rent Movie:"));

  function addInput(labelText, inputType, name) {
    const $label = $("<label>").attr("for", name).text(labelText);
    const $input = $("<input>").attr({
      type: inputType,
      name: name,
      id: name
    });

    $form.append($label, $input);
  }

  addInput("Start Date", "date", "rentStart");
  addInput("End Date", "date", "rentEnd");

  console.log(movie);

  const $submit = $("<button>").text("Submit");
  $form.append($submit);

  $wrapper.append($bgImg, $form);
  $("body").append($wrapper);
}
