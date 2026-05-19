(function (global) {
  function initHeroTitleScroll(options) {
    const hero = document.querySelector(options.hero);
    const landing = document.querySelector(options.landing);
    const title = document.querySelector(options.title);
    const placeholder = document.querySelector(options.placeholder);

    if (!hero || !landing || !title || !placeholder) {
      return null;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const heroColor = options.heroColor || { r: 255, g: 255, b: 255 };
    const landedColor = options.landedColor || { r: 30, g: 30, b: 30 };
    const centerOffset = options.centerOffset ?? 0.07;

    let startTopViewport = null;
    let ticking = false;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function mixColor(t) {
      return `rgb(${Math.round(lerp(heroColor.r, landedColor.r, t))}, ${Math.round(lerp(heroColor.g, landedColor.g, t))}, ${Math.round(lerp(heroColor.b, landedColor.b, t))})`;
    }

    function clearInlineStyles() {
      title.style.top = "";
      title.style.color = "";
    }

    function syncPlaceholder() {
      placeholder.style.height = `${title.offsetHeight}px`;
    }

    function setLanded() {
      title.classList.remove("is-fixed", "is-on-hero");
      title.classList.add("is-landed");
      clearInlineStyles();
      placeholder.style.height = "";
    }

    function setStaticLayout() {
      startTopViewport = null;
      setLanded();
    }

    function measureStartTop() {
      const heroRect = hero.getBoundingClientRect();
      const centerTop = heroRect.top + (heroRect.height - title.offsetHeight) / 2;
      return centerTop + heroRect.height * centerOffset;
    }

    function update() {
      ticking = false;

      if (reducedMotionQuery.matches) {
        setStaticLayout();
        return;
      }

      if (startTopViewport === null) {
        startTopViewport = measureStartTop();
      }

      syncPlaceholder();

      const scrollY = window.scrollY;
      const scrollLand = Math.max(landing.offsetTop - startTopViewport, 1);

      if (scrollY >= scrollLand) {
        setLanded();
        return;
      }

      const progress = Math.min(Math.max(scrollY / scrollLand, 0), 1);

      title.classList.remove("is-landed");
      title.classList.add("is-fixed");
      title.classList.toggle("is-on-hero", progress < 0.85);

      title.style.top = `${startTopViewport}px`;
      title.style.color = mixColor(progress);
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function resetAndUpdate() {
      startTopViewport = null;
      requestUpdate();
    }

    function init() {
      if (reducedMotionQuery.matches) {
        setStaticLayout();
        return;
      }

      title.classList.remove("is-landed");
      startTopViewport = measureStartTop();
      requestUpdate();
    }

    reducedMotionQuery.addEventListener("change", resetAndUpdate);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", resetAndUpdate);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(init);
    } else {
      init();
    }

    return { reset: resetAndUpdate };
  }

  global.HeroTitleScroll = { init: initHeroTitleScroll };
})(window);
