
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll(".section-anchor")];

  // 1. Dark and light theme
  const savedTheme = localStorage.getItem("xyz-portfolio-theme");

  if (savedTheme === "light") {
    body.classList.add("light");
  }

  updateThemeButton();

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light");

    const isLight = body.classList.contains("light");

    localStorage.setItem(
      "xyz-portfolio-theme",
      isLight ? "light" : "dark"
    );

    updateThemeButton();
  });

  function updateThemeButton() {
    const isLight = body.classList.contains("light");

    themeToggle.textContent = isLight ? "☾" : "☼";

    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );
  }

  // 2. Mobile navigation menu
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  // Close mobile menu after clicking a navigation link
  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    });
  });

  // 3. Highlight the active navigation section
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navItems.forEach((link) => {
            const isActive =
              link.getAttribute("href") ===
              `#${entry.target.id}`;

            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      navObserver.observe(section);
    });
  }

  // 4. Scroll reveal animations
  const revealTargets = document.querySelectorAll(
    ".panel, .section-heading, .timeline-item, .project-card"
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08
      }
    );

    revealTargets.forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  }

  // 5. Automatically update copyright year
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
