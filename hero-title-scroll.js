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
    const landedPinInLanding = options.landedPinInLanding === true;

    let startTopViewport = null;
    let isLanded = false;
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

    function positionLandedInLanding() {
      syncPlaceholder();
      title.style.top = `${placeholder.getBoundingClientRect().top}px`;
    }

    function setLanded() {
      title.classList.remove("is-on-hero");
      if (landedPinInLanding) {
        title.classList.add("is-fixed", "is-landed");
        title.style.color = `rgb(${landedColor.r}, ${landedColor.g}, ${landedColor.b})`;
        positionLandedInLanding();
      } else {
        title.classList.remove("is-fixed");
        title.classList.add("is-landed");
        clearInlineStyles();
        placeholder.style.height = "";
      }
      isLanded = true;
    }

    function setStaticLayout() {
      startTopViewport = null;
      isLanded = false;
      setLanded();
    }

    function measureStartTop() {
      const heroRect = hero.getBoundingClientRect();
      const centerTop = heroRect.top + (heroRect.height - title.offsetHeight) / 2;
      return centerTop + heroRect.height * centerOffset;
    }

    function getScrollLand() {
      const landingTop = landing.getBoundingClientRect().top + window.scrollY;
      return Math.max(landingTop - startTopViewport, 1);
    }

    function isTitleOverHero() {
      const heroRect = hero.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const overlap =
        Math.min(heroRect.bottom, titleRect.bottom) - Math.max(heroRect.top, titleRect.top);
      return overlap > titleRect.height * 0.2;
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
      const scrollLand = getScrollLand();

      if (scrollY >= scrollLand) {
        if (!isLanded) {
          setLanded();
        } else if (landedPinInLanding) {
          positionLandedInLanding();
        }
        return;
      }

      if (isLanded) {
        startTopViewport = null;
        isLanded = false;
      }

      const progress = Math.min(Math.max(scrollY / scrollLand, 0), 1);
      const overHero = isTitleOverHero();
      const colorProgress = overHero ? progress : Math.max(progress, 0.95);

      title.classList.remove("is-landed");
      title.classList.add("is-fixed");
      title.classList.toggle("is-on-hero", overHero && progress < 1);

      title.style.top = `${startTopViewport}px`;
      title.style.color = mixColor(colorProgress);
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function resetAndUpdate() {
      startTopViewport = null;
      isLanded = false;
      requestUpdate();
    }

    function init() {
      if (reducedMotionQuery.matches) {
        setStaticLayout();
        return;
      }

      title.classList.remove("is-landed");
      isLanded = false;
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
