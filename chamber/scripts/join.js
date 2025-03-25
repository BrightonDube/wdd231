document.addEventListener("DOMContentLoaded", function () {
  let lastScrollPosition = 0;

  const openButtons = document.querySelectorAll(".open-button");
  const closeButtons = document.querySelectorAll(".close-btn");
  const memberCards = document.querySelectorAll('.member-card'); // Select member cards for animation


  memberCards.forEach(card => {
    const delay = card.dataset.animationDelay || 0; // Get delay from data attribute, default to 0
    setTimeout(() => {
      card.classList.add('animated'); // Add 'animated' class to trigger animation
    }, delay * 1000); // Convert delay in seconds to milliseconds
  });


  openButtons.forEach((button) => {
    button.addEventListener("click", function () {
      lastScrollPosition = window.scrollY;
      const card = this.closest(".member-card");
      const dialog = card.querySelector(".membership-info");
      dialog.showModal();
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const dialog = this.closest(".membership-info");
      dialog.close();


      setTimeout(() => {
        window.scrollTo({ top: lastScrollPosition, behavior: "smooth" });
      }, 100);
    });
  });
});