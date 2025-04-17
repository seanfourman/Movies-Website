function initHomePage() {
  if ($("#loadMoviesButton").length) {
    $("#loadMoviesButton").click(function () {
      loadMovies(movies);
    });

    let userEmail = localStorage.getItem("userEmail");
    let userName = localStorage.getItem("userName");
    if (userEmail) {
      const container = $("container");
      var welcomeText = "<h1>Welcome back, " + userName + "!</h1>";
      container.append(welcomeText);
    }
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
