// Navigation functionality
function toggleNav() {
  const navMenu = document.getElementById("navMenu");
  navMenu.classList.toggle("active");
}

// Close nav when clicking outside
document.addEventListener("click", function (event) {
  const navIcon = document.querySelector(".nav-icon");
  const navMenu = document.getElementById("navMenu");

  if (!navIcon.contains(event.target) && !navMenu.contains(event.target)) {
    navMenu.classList.remove("active");
  }
});

// Navigate to detail page
function navigateToDetail(page) {
  window.location.href = page;
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.3,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const workContent = entry.target.querySelector(".work-content");
      if (workContent && !workContent.classList.contains("animate")) {
        workContent.classList.add("animate");
      }
    }
  });
}, observerOptions);

// Observe all work-hero sections except the first one
document.addEventListener("DOMContentLoaded", () => {
  const workHeroes = document.querySelectorAll(".work-hero");
  workHeroes.forEach((hero, index) => {
    if (index > 0) {
      // Skip first one as it animates immediately
      observer.observe(hero);
    }
  });
});
