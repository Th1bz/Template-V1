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
  const initPortfolioFilters = () => {
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
        const portfolioItems = select(".portfolio-item", true);

        portfolioItems.forEach((item) => {
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
   * Slider de témoignages
   */
  const initTestimonialsSlider = () => {
    const testimonialItems = select(".testimonial-item", true);
    const prevBtn = select(".prev-btn");
    const nextBtn = select(".next-btn");
    let currentIndex = 0;

    // Cacher tous les témoignages sauf le premier
    testimonialItems.forEach((item, index) => {
      if (index !== 0) {
        item.style.display = "none";
      }
    });

    // Fonction pour afficher un témoignage spécifique
    const showTestimonial = (index) => {
      testimonialItems.forEach((item) => {
        item.style.display = "none";
      });
      testimonialItems[index].style.display = "block";
    };

    // Événement pour le bouton précédent
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex--;
        if (currentIndex < 0) {
          currentIndex = testimonialItems.length - 1;
        }
        showTestimonial(currentIndex);
      });
    }

    // Événement pour le bouton suivant
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex >= testimonialItems.length) {
          currentIndex = 0;
        }
        showTestimonial(currentIndex);
      });
    }

    // Défilement automatique
    setInterval(() => {
      if (nextBtn) {
        nextBtn.click();
      }
    }, 5000);
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
   * Validation du formulaire de contact
   */
  const initContactForm = () => {
    const contactForm = select("#contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Simulation d'envoi de formulaire
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = "Envoi en cours...";

        // Simuler un délai d'envoi
        setTimeout(() => {
          // Réinitialiser le formulaire
          contactForm.reset();

          // Afficher un message de succès
          const successMessage = document.createElement("div");
          successMessage.className = "alert alert-success";
          successMessage.textContent =
            "Votre message a été envoyé avec succès!";

          contactForm.parentNode.insertBefore(successMessage, contactForm);

          // Réinitialiser le bouton
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;

          // Supprimer le message après 5 secondes
          setTimeout(() => {
            successMessage.remove();
          }, 5000);
        }, 2000);
      });
    }
  };

  /**
   * Validation du formulaire de newsletter
   */
  const initNewsletterForm = () => {
    const newsletterForm = select("#newsletterForm");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Simulation d'abonnement
        const emailInput = this.querySelector('input[type="email"]');
        const submitBtn = this.querySelector('button[type="submit"]');

        submitBtn.disabled = true;

        // Simuler un délai d'envoi
        setTimeout(() => {
          // Réinitialiser le formulaire
          newsletterForm.reset();

          // Afficher un message de succès
          const successMessage = document.createElement("div");
          successMessage.className = "newsletter-success";
          successMessage.textContent =
            "Vous êtes maintenant abonné à notre newsletter!";

          newsletterForm.parentNode.insertBefore(
            successMessage,
            newsletterForm.nextSibling
          );

          // Réinitialiser le bouton
          submitBtn.disabled = false;

          // Supprimer le message après 5 secondes
          setTimeout(() => {
            successMessage.remove();
          }, 5000);
        }, 1500);
      });
    }
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
    initPortfolioFilters();
    initTestimonialsSlider();
    initSmoothScroll();
    initContactForm();
    initNewsletterForm();
    initPreloader();
    initAOS();
  });

  // Activer les liens de navigation au défilement
  window.addEventListener("scroll", navbarlinksActive);
  window.addEventListener("scroll", headerScrolled);
});
