function initHomePage() {
  if ($("#loadMoviesButton").length) {
    $("#loadMoviesButton").click(function () {
      loadMovies(movies);
    });
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
