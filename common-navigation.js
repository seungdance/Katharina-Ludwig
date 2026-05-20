// Common Navigation JavaScript
let navScrollPosition = 0;

function setNavOpen(isOpen) {
  const navMenu = document.getElementById("navMenu");
  const navIcon = document.querySelector(".nav-icon");

  if (navMenu) {
    navMenu.classList.toggle("active", isOpen);
  }

  if (navIcon) {
    navIcon.classList.toggle("active", isOpen);
    navIcon.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navIcon.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  if (isOpen) {
    navScrollPosition = window.scrollY;
    document.body.classList.add("nav-open");
    document.body.style.top = "-" + navScrollPosition + "px";
    return;
  }

  if (document.body.classList.contains("nav-open")) {
    document.body.classList.remove("nav-open");
    document.body.style.top = "";
    window.scrollTo(0, navScrollPosition);
  }
}

function toggleNav() {
  const navMenu = document.getElementById("navMenu");
  const isOpen = navMenu ? !navMenu.classList.contains("active") : false;
  setNavOpen(isOpen);
}

function navigateToDetail(page) {
  window.location.href = page;
}

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const navMenu = document.getElementById("navMenu");
  const navIcon = document.querySelector(".nav-icon");

  if (
    navMenu &&
    navIcon &&
    !navMenu.contains(event.target) &&
    !navIcon.contains(event.target)
  ) {
    setNavOpen(false);
  }
});

// Close menu on escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const navMenu = document.getElementById("navMenu");
    const navIcon = document.querySelector(".nav-icon");

    setNavOpen(false);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const navIcon = document.querySelector(".nav-icon");
  if (navIcon && !navIcon.hasAttribute("aria-label")) {
    navIcon.setAttribute("aria-label", "Open menu");
    navIcon.setAttribute("aria-expanded", "false");
  }

  initNavIconContrast();
});

/* White icon on dark backgrounds, dark icon on light backgrounds */
const DARK_HERO_SELECTORS =
  ".hero-photo, .hero-video, .hero-section, .about-video-hero, .hero, .reachout, .hero-media";

function setNavIconContrast(navIcon, isLight) {
  navIcon.classList.toggle("nav-icon--on-dark", !isLight);
  navIcon.classList.toggle("nav-icon--on-light", isLight);
}

function isPointInRect(x, y, rect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function findSmallestSectionAtPoint(selector, x, y) {
  let match = null;
  let smallestArea = Infinity;

  document.querySelectorAll(selector).forEach(function (el) {
    const rect = el.getBoundingClientRect();
    if (!isPointInRect(x, y, rect)) {
      return;
    }

    const area = rect.width * rect.height;
    if (area < smallestArea) {
      smallestArea = area;
      match = el;
    }
  });

  return match;
}

function parseRgb(color) {
  if (!color || color === "transparent") {
    return null;
  }
  const match = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (!match) {
    return null;
  }
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function luminance(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function isLightFromElement(startEl) {
  let node = startEl;

  while (node && node !== document.documentElement) {
    const theme = node.dataset?.navTheme;
    if (theme === "dark") {
      return false;
    }
    if (theme === "light") {
      return true;
    }

    const bg = getComputedStyle(node).backgroundColor;
    const rgb = parseRgb(bg);
    if (rgb && rgb.a > 0.15) {
      return luminance(rgb.r, rgb.g, rgb.b) > 0.58;
    }

    node = node.parentElement;
  }

  const bodyBg = parseRgb(getComputedStyle(document.body).backgroundColor);
  if (bodyBg) {
    return luminance(bodyBg.r, bodyBg.g, bodyBg.b) > 0.58;
  }

  return true;
}

function updateNavIconContrast() {
  const navIcon = document.querySelector(".nav-icon");
  if (!navIcon) {
    return;
  }

  const rect = navIcon.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  const themedSection = findSmallestSectionAtPoint("[data-nav-theme]", x, y);
  if (themedSection) {
    setNavIconContrast(navIcon, themedSection.dataset.navTheme === "light");
    return;
  }

  const darkHero = findSmallestSectionAtPoint(DARK_HERO_SELECTORS, x, y);
  if (darkHero) {
    setNavIconContrast(navIcon, false);
    return;
  }

  const navMenu = document.getElementById("navMenu");
  const prevIconPe = navIcon.style.pointerEvents;
  const prevMenuPe = navMenu ? navMenu.style.pointerEvents : "";

  navIcon.style.pointerEvents = "none";
  if (navMenu) {
    navMenu.style.pointerEvents = "none";
  }

  const target = document.elementFromPoint(
    Math.min(window.innerWidth - 1, Math.max(1, x)),
    Math.min(window.innerHeight - 1, Math.max(1, y))
  );

  navIcon.style.pointerEvents = prevIconPe;
  if (navMenu) {
    navMenu.style.pointerEvents = prevMenuPe;
  }

  if (!target || navIcon.contains(target)) {
    setNavIconContrast(navIcon, true);
    return;
  }

  setNavIconContrast(navIcon, isLightFromElement(target));
}

function initNavIconContrast() {
  let ticking = false;

  function scheduleUpdate() {
    if (ticking) {
      return;
    }
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      updateNavIconContrast();
    });
  }

  updateNavIconContrast();
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("load", updateNavIconContrast);
}

// Dropdown toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach(function (dropdown) {
    const dropdownToggle = dropdown.querySelector(".dropdown-toggle");
    const dropdownContent = dropdown.querySelector(".dropdown-content");

    if (dropdownToggle) {
      // Handle click on toggle button
      dropdownToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns
        dropdowns.forEach(function (otherDropdown) {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove("open");
          }
        });

        // Toggle current dropdown
        dropdown.classList.toggle("open");
      });
    }

    // Prevent dropdown from closing when clicking inside dropdown content
    if (dropdownContent) {
      dropdownContent.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (event) {
    dropdowns.forEach(function (dropdown) {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("open");
      }
    });
  });
});
