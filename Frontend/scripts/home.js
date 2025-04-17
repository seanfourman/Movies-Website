function initHomePage() {
  if ($("#loadMoviesButton").length) {
    $("#loadMoviesButton").click(function () {
      loadMovies(movies);
    });

    let userEmail = localStorage.getItem("userEmail");
    let userName = localStorage.getItem("userName");
    if (userEmail) {
      if (!localStorage.getItem("welcomeShown")) {
        showWelcomeToast(userName);
        localStorage.setItem("welcomeShown", "true");
      }
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

function showWelcomeToast(userName) {
  const toast = $(`
    <div class="welcome-toast">
      <div class="toast-content">
        <div class="toast-icon">👋</div>
        <div class="toast-message">
          <h4>Welcome back, ${userName}!</h4>
          <p>Start your next movie adventure.</p>
        </div>
      </div>
      <div class="toast-progress"></div>
    </div>
  `);
  $("body").append(toast);

  setTimeout(() => {
    toast.addClass("show");

    const progressBar = toast.find(".toast-progress");
    progressBar.addClass("animate");
    setTimeout(() => {
      toast.removeClass("show");
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 6000);
  }, 500);
}
