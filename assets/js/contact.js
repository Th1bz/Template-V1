/**
 * Gestion du formulaire de contact avec EmailJS
 * Ce fichier gère la validation et l'envoi du formulaire de contact
 */

// Configuration EmailJS - À personnaliser pour chaque projet
const CONFIG = {
  // Clés EmailJS
  publicKey: "WtSDctCMaTZG5prkz",
  serviceID: "service_devv5tf",
  templateID: "template_c1yqywd",

  // Sélecteurs
  formSelector: "#contactForm",
  nameSelector: "#name",
  emailSelector: "#email",
  subjectSelector: "#subject",
  messageSelector: "#message",
  submitButtonSelector: 'button[type="submit"]',

  // Classes CSS
  validClass: "valid",
  invalidClass: "invalid",
  successClass: "btn-success",
  dangerClass: "btn-danger",
  primaryClass: "btn-primary",

  // Messages
  invalidEmailMessage: "Veuillez entrer une adresse email valide",
  loadingMessage: '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...',
  successMessage: '<i class="fas fa-check"></i> Message envoyé !',
  errorMessage:
    '<i class="fas fa-exclamation-triangle"></i> Erreur lors de l\'envoi',

  // Délais (en ms)
  resetDelay: 3000,
};

// Initialisation de EmailJS avec la clé publique
(function () {
  emailjs.init(CONFIG.publicKey);
})();

// Validation de l'email
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Initialisation du formulaire de contact
document.addEventListener("DOMContentLoaded", function () {
  // Gestion de la validation de l'email en temps réel
  const emailInput = document.querySelector(CONFIG.emailSelector);
  if (emailInput) {
    emailInput.addEventListener("input", function () {
      const emailGroup = this.closest(".form-group");

      if (this.value.length > 0) {
        if (isValidEmail(this.value)) {
          emailGroup.classList.remove(CONFIG.invalidClass);
          emailGroup.classList.add(CONFIG.validClass);
          this.setCustomValidity("");
        } else {
          emailGroup.classList.remove(CONFIG.validClass);
          emailGroup.classList.add(CONFIG.invalidClass);
          this.setCustomValidity(CONFIG.invalidEmailMessage);
        }
      } else {
        emailGroup.classList.remove(CONFIG.validClass, CONFIG.invalidClass);
        this.setCustomValidity("");
      }
    });
  }

  // Gestion du formulaire de contact
  const contactForm = document.querySelector(CONFIG.formSelector);
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Vérification de l'email avant l'envoi
      const emailInput = document.querySelector(CONFIG.emailSelector);
      if (!isValidEmail(emailInput.value)) {
        emailInput.closest(".form-group").classList.add(CONFIG.invalidClass);
        emailInput.setCustomValidity(CONFIG.invalidEmailMessage);
        emailInput.reportValidity();
        return;
      }

      // Afficher l'indicateur de chargement
      const submitBtn = this.querySelector(CONFIG.submitButtonSelector);
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = CONFIG.loadingMessage;
      submitBtn.disabled = true;

      // Préparation des paramètres
      const templateParams = {
        from_name: document.querySelector(CONFIG.nameSelector).value,
        from_email: document.querySelector(CONFIG.emailSelector).value,
        subject: document.querySelector(CONFIG.subjectSelector).value,
        message: document.querySelector(CONFIG.messageSelector).value,
      };

      // Envoi de l'email
      emailjs.send(CONFIG.serviceID, CONFIG.templateID, templateParams).then(
        function () {
          // Succès
          submitBtn.innerHTML = CONFIG.successMessage;
          submitBtn.classList.remove(CONFIG.primaryClass);
          submitBtn.classList.add(CONFIG.successClass);

          // Réinitialiser le formulaire
          contactForm.reset();

          // Supprimer toutes les classes de validation des champs du formulaire
          const formGroups = contactForm.querySelectorAll(".form-group");
          formGroups.forEach((group) => {
            group.classList.remove(CONFIG.validClass, CONFIG.invalidClass);
          });

          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove(CONFIG.successClass);
            submitBtn.classList.add(CONFIG.primaryClass);
            submitBtn.disabled = false;
          }, CONFIG.resetDelay);
        },
        function (error) {
          // Erreur
          console.error("Erreur:", error);
          submitBtn.innerHTML = CONFIG.errorMessage;
          submitBtn.classList.remove(CONFIG.primaryClass);
          submitBtn.classList.add(CONFIG.dangerClass);

          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove(CONFIG.dangerClass);
            submitBtn.classList.add(CONFIG.primaryClass);
            submitBtn.disabled = false;
          }, CONFIG.resetDelay);
        }
      );
    });
  }
});
