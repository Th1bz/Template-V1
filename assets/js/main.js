/**
 * Template Site Vitrine - Main JavaScript
 * Version: 1.0
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /**
   * Sélecteurs d'éléments fréquemment utilisés
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Écouteur d'événements
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Écouteur d'événements au défilement
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Menu mobile toggle
   */
  const toggleMobileMenu = () => {
    const hamburger = select(".hamburger");
    const navMenu = select(".nav-menu");

    on("click", ".hamburger", function (e) {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  };

  /**
   * Navigation active state sur défilement
   */
  const navbarlinks = select(".nav-menu a", true);

  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };

  /**
   * Header fixe lors du défilement
   */
  const headerScrolled = () => {
    const header = select("#header");
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }
    }
  };

  /**
   * Bouton retour en haut
   */
  const backToTop = select(".back-to-top");
  if (backToTop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backToTop.classList.add("active");
      } else {
        backToTop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Animation au défilement avec AOS
   */
  const initAOS = () => {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }
  };

  /**
   * Filtres du portfolio
   */
  const initProjectFilters = () => {
    on(
      "click",
      ".filter-btn",
      function (e) {
        e.preventDefault();
        const filterBtns = select(".filter-btn", true);
        filterBtns.forEach((btn) => {
          btn.classList.remove("active");
        });
        this.classList.add("active");

        const filterValue = this.getAttribute("data-filter");
        const projectItems = select(".project-item", true);

        projectItems.forEach((item) => {
          if (
            filterValue === "all" ||
            item.getAttribute("data-category") === filterValue
          ) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      },
      true
    );
  };

  /**
   * Animation de défilement doux pour les liens d'ancrage
   */
  const initSmoothScroll = () => {
    on(
      "click",
      'a[href*="#"]:not([href="#"])',
      function (e) {
        if (
          location.pathname.replace(/^\//, "") ===
            this.pathname.replace(/^\//, "") &&
          location.hostname === this.hostname
        ) {
          e.preventDefault();

          let target = select(this.hash);
          if (target) {
            let headerHeight = select("#header").offsetHeight;
            let scrollPosition = target.offsetTop - headerHeight;

            window.scrollTo({
              top: scrollPosition,
              behavior: "smooth",
            });

            // Fermer le menu mobile si ouvert
            const navMenu = select(".nav-menu");
            const hamburger = select(".hamburger");
            if (navMenu.classList.contains("active")) {
              navMenu.classList.remove("active");
              hamburger.classList.remove("active");
            }
          }
        }
      },
      true
    );
  };

  /**
   * Préchargeur
   */
  const initPreloader = () => {
    const preloader = select("#preloader");
    if (preloader) {
      window.addEventListener("load", () => {
        preloader.remove();
      });
    }
  };

  /**
   * Initialisation de toutes les fonctions
   */
  window.addEventListener("load", () => {
    toggleMobileMenu();
    headerScrolled();
    initProjectFilters();
    initSmoothScroll();
    initPreloader();
    initAOS();
  });

  // Activer les liens de navigation au défilement
  window.addEventListener("scroll", navbarlinksActive);
  window.addEventListener("scroll", headerScrolled);
});
