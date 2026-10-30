/* =====================================================
   NIKKOLE AGTON — PORTFOLIO INTERACTIONS
   ===================================================== */

(() => {
  "use strict";

  // Mark the page as JavaScript-enabled.
  // CSS animations are enabled only after this class is added.
  document.documentElement.classList.add("js-enabled");

  // ---------- ELEMENT REFERENCES ----------

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  const navLinkItems = Array.from(
    document.querySelectorAll(".nav-link")
  );

  const sections = Array.from(
    document.querySelectorAll("main section[id]")
  );

  const filterButtons = Array.from(
    document.querySelectorAll(".filter-button")
  );

  const projectCards = Array.from(
    document.querySelectorAll(".project-card")
  );

  const filterStatus = document.getElementById("filter-status");
  const emptyProjects = document.getElementById("empty-projects");
  const copyrightYear = document.getElementById("copyright-year");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // ---------- AUTOMATIC COPYRIGHT YEAR ----------

  if (copyrightYear) {
    copyrightYear.textContent = String(
      new Date().getFullYear()
    );
  }

  // ---------- MOBILE NAVIGATION ----------

  function closeMenu() {
    if (!navToggle || !navLinks) {
      return;
    }

    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    navLinks.classList.remove("is-open");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const willOpen =
        navToggle.getAttribute("aria-expanded") !== "true";

      navToggle.setAttribute(
        "aria-expanded",
        String(willOpen)
      );

      navToggle.setAttribute(
        "aria-label",
        willOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      );

      navLinks.classList.toggle("is-open", willOpen);
    });

    // Close the menu after selecting a navigation link.
    navLinkItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Escape closes the mobile menu.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const menuWasOpen =
          navToggle.getAttribute("aria-expanded") === "true";

        closeMenu();

        if (menuWasOpen) {
          navToggle.focus();
        }
      }
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", (event) => {
      if (!navLinks.classList.contains("is-open")) {
        return;
      }

      const clickedInsideMenu =
        navLinks.contains(event.target);

      const clickedToggle =
        navToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });

    // Reset mobile menu when returning to desktop width.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  // ---------- SMOOTH SCROLLING ----------

  // Native anchor navigation remains available when
  // JavaScript is disabled.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      let target;

      try {
        target = document.querySelector(targetId);
      } catch {
        return;
      }

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  // ---------- ACTIVE NAVIGATION LINK ----------

  function setActiveLink(sectionId) {
    navLinkItems.forEach((link) => {
      const isActive =
        link.getAttribute("href") === `#${sectionId}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveLink(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-24% 0px -58% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  } else {
    // Fallback for browsers without IntersectionObserver.
    function updateActiveLink() {
      let currentSection = sections[0];

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 150) {
          currentSection = section;
        }
      });

      if (currentSection) {
        setActiveLink(currentSection.id);
      }
    }

    window.addEventListener(
      "scroll",
      updateActiveLink,
      { passive: true }
    );

    updateActiveLink();
  }

  // ---------- REVEAL-ON-SCROLL ANIMATIONS ----------

  const revealItems = Array.from(
    document.querySelectorAll(".reveal")
  );

  if (
    "IntersectionObserver" in window &&
    !reducedMotion.matches
  ) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            // Stop observing an element once it appears.
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    // Keep all content visible when animations are disabled
    // or IntersectionObserver is unavailable.
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }

  // ---------- PROJECT CATEGORY FILTERS ----------

  function applyProjectFilter(filter) {
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const categories = (
        card.dataset.categories || ""
      )
        .split(/\s+/)
        .filter(Boolean);

      const matches =
        filter === "all" || categories.includes(filter);

      card.hidden = !matches;

      if (matches) {
        visibleCount += 1;
        card.classList.add("is-visible");
      }
    });

    // Update active filter styling and accessibility state.
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter;

      button.classList.toggle("active", isActive);

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });

    // Update the accessible results announcement.
    if (filterStatus) {
      const selectedButton = filterButtons.find(
        (button) => button.dataset.filter === filter
      );

      const categoryName = selectedButton
        ? selectedButton.textContent
            .trim()
            .replace(/\s+\d+$/, "")
        : "Projects";

      if (filter === "all") {
        filterStatus.textContent =
          `Showing all ${visibleCount} projects.`;
      } else {
        const projectWord =
          visibleCount === 1 ? "project" : "projects";

        filterStatus.textContent =
          `Showing ${visibleCount} ${categoryName.toLowerCase()} ${projectWord}.`;
      }
    }

    // Display a message if a category has no matching projects.
    if (emptyProjects) {
      emptyProjects.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter || "all";

      applyProjectFilter(selectedFilter);
    });
  });

  // Initialize with all projects visible.
  applyProjectFilter("all");

})();