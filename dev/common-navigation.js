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
