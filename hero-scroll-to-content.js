(function () {
  function scrollToContent(target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function bindHeroScroll(hero) {
    const targetId = hero.getAttribute("data-scroll-to");
    const target = targetId ? document.getElementById(targetId) : null;
    if (!target) {
      return;
    }

    const handler = function () {
      scrollToContent(target);
    };

    const arrow = hero.querySelector(".hero-scroll-down");
    const title = hero.querySelector(".hero-page-title");

    if (arrow) {
      arrow.addEventListener("click", handler);
    }

    if (title) {
      title.addEventListener("click", handler);
      title.setAttribute("role", "button");
      title.setAttribute("tabindex", "0");
      title.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handler();
        }
      });
    }
  }

  document.querySelectorAll("[data-scroll-to]").forEach(bindHeroScroll);
})();
