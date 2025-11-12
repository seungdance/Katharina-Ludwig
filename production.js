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

// Mobile detection and restructuring
function isMobile() {
  return window.innerWidth <= 768;
}

function restructureForMobile() {
  const workHeros = document.querySelectorAll(".work-hero");
  console.log("Found work-hero elements:", workHeros.length);

  workHeros.forEach((hero, index) => {
    console.log(`Processing work-hero ${index}:`, hero);

    const bgImage = hero.style.backgroundImage;
    const imageUrl = bgImage.slice(5, -2); // url("...") 에서 URL 추출
    console.log("Image URL:", imageUrl);

    // 이미지 컨테이너
    const imageDiv = document.createElement("div");
    imageDiv.className = "work-image-mobile";
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "";
    imageDiv.appendChild(img);

    // 텍스트 컨테이너
    const overlay = hero.querySelector(".work-overlay");
    console.log("Found overlay:", overlay);

    if (overlay) {
      const textDiv = document.createElement("div");
      textDiv.className = "work-text-mobile";

      // 텍스트 내용 복사
      const title = overlay.querySelector(".work-title");
      const location = overlay.querySelector(".work-location");

      if (title) {
        const titleClone = title.cloneNode(true);
        textDiv.appendChild(titleClone);
      }

      if (location) {
        const locationClone = location.cloneNode(true);
        textDiv.appendChild(locationClone);
      }

      console.log("Text content:", textDiv.innerHTML);

      // 래퍼 생성
      const wrapper = document.createElement("div");
      wrapper.className = "work-item-mobile";
      wrapper.appendChild(imageDiv);
      wrapper.appendChild(textDiv);

      // 클릭 이벤트 복사
      const originalOnclick = hero.getAttribute("onclick");
      if (originalOnclick) {
        wrapper.setAttribute("onclick", originalOnclick);
      }

      hero.parentNode.replaceChild(wrapper, hero);
    } else {
      console.error("No overlay found for work-hero", index);
    }
  });
}

function restoreDesktopLayout() {
  const mobileItems = document.querySelectorAll(".work-item-mobile");
  mobileItems.forEach((item) => {
    // 원래 구조로 복원하는 로직은 페이지 새로고침으로 처리
    window.location.reload();
  });
}

function handleResize() {
  if (isMobile()) {
    restructureForMobile();
  } else {
    restoreDesktopLayout();
  }
}

// Observe all work-hero sections except the first one
document.addEventListener("DOMContentLoaded", () => {
  const workHeroes = document.querySelectorAll(".work-hero");
  workHeroes.forEach((hero, index) => {
    if (index > 0) {
      // Skip first one as it animates immediately
      observer.observe(hero);
    }
  });

  // Initial mobile check
  if (isMobile()) {
    restructureForMobile();
  }
});

// Add resize listener
window.addEventListener("resize", handleResize);
