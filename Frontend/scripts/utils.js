function formatCurrency(value) {
  if (!value) return "N/A";

  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return "$" + (value / 1000).toFixed(1) + "K";
  }

  return "$" + value;
}

function formatNumber(value) {
  if (!value) return "N/A";

  if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value;
}

function showPopup(message, isSuccess) {
  let $popup = $("#popup");
  if ($popup.length > 0) {
    $popup.remove();
  }

  $popup = $("<div></div>").attr("id", "popup").addClass("popup").text(message);

  if (isSuccess === true) {
    $popup.addClass("success");
  } else {
    $popup.addClass("failure");
  }

  $("body").append($popup);

  $popup[0].offsetHeight; // Trigger reflow to ensure animation works
  $popup.addClass("show");

  setTimeout(() => {
    $popup.removeClass("show");
    setTimeout(() => {
      $popup.remove();
    }, 500);
  }, 2000);
}

function showNoMoviesMessage(text) {
  const messages = [
    "No movies? That's suspicious.",
    "The shelf is empty.",
    "Nothing to see here.",
    "The plot is missing.",
    "Silence... no titles found.",
    "Cue the crickets...",
    "Zero films. Drama incoming!",
    "No scenes, just vibes.",
    "Oops! No reels today.",
    "Hollywood took the day off.",
    "Your list is on vacation.",
    "Still rolling… with no film.",
    "Popcorn's ready. But nothing's playing."
  ];

  const message = text || messages[Math.floor(Math.random() * messages.length)];

  if ($("#noMovies").length === 0) {
    $("container").append($("<h1></h1>").attr("id", "noMovies").text(message));
  }
  updateFooterPosition();
}

function updateFooterPosition() {
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "signin.html" || currentPage === "signup.html") {
    return;
  }

  setTimeout(() => {
    const isScrollable = $(document).height() > $(window).height();
    if (isScrollable) {
      $("footer").addClass("relative");
    } else {
      $("footer").removeClass("relative");
    }
  }, 1);
}

function swapWebsiteIcon() {
  const websiteLogo = $("#logo");
  if (websiteLogo.length) {
    websiteLogo.attr("src", "../sources/website-icon-white.png");
  }
}

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
