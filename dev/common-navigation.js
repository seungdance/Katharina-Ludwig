// Common Navigation JavaScript
function toggleNav() {
  console.log("toggleNav called"); // 디버깅용
  const navMenu = document.getElementById("navMenu");
  const navIcon = document.querySelector(".nav-icon");

  if (navMenu) {
    navMenu.classList.toggle("active");
    console.log("Menu toggled:", navMenu.classList.contains("active")); // 디버깅용
  }

  if (navIcon) {
    navIcon.classList.toggle("active");
  }
}

function navigateToDetail(page) {
  window.location.href = page;
}

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const navMenu = document.getElementById("navMenu");
  const navIcon = document.querySelector(".nav-icon");

  if (!navMenu.contains(event.target) && !navIcon.contains(event.target)) {
    navMenu.classList.remove("active");
    navIcon.classList.remove("active");
  }
});

// Close menu on escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const navMenu = document.getElementById("navMenu");
    const navIcon = document.querySelector(".nav-icon");

    navMenu.classList.remove("active");
    navIcon.classList.remove("active");
  }
});

// Mobile dropdown functionality
document.addEventListener("DOMContentLoaded", function () {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach(function (dropdown) {
    const dropdownLink = dropdown.querySelector("a");
    const dropdownContent = dropdown.querySelector(".dropdown-content");

    // Check if it's mobile (touch device)
    function isMobile() {
      return window.innerWidth <= 768 || "ontouchstart" in window;
    }

    if (isMobile()) {
      let clickTimeout;
      let clickCount = 0;

      // Mobile: Handle click events
      dropdownLink.addEventListener("click", function (e) {
        clickCount++;

        if (clickCount === 1) {
          // First click: prevent default and show dropdown
          e.preventDefault();

          // Close other dropdowns
          dropdowns.forEach(function (otherDropdown) {
            if (otherDropdown !== dropdown) {
              otherDropdown.classList.remove("mobile-open");
            }
          });

          // Toggle current dropdown
          dropdown.classList.toggle("mobile-open");

          // Reset click count after 300ms
          clickTimeout = setTimeout(function () {
            clickCount = 0;
          }, 300);
        } else if (clickCount === 2) {
          // Second click: navigate to page
          clearTimeout(clickTimeout);
          clickCount = 0;
          window.location.href = dropdownLink.href;
        }
      });
    }
  });
});
