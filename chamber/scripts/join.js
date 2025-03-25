document.addEventListener("DOMContentLoaded", function () {
  let lastScrollPosition = 0; 

  const openButtons = document.querySelectorAll(".open-button");
  const closeButtons = document.querySelectorAll(".close-btn");

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
