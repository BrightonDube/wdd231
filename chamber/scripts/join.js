document.addEventListener("DOMContentLoaded", function () {
  let lastScrollPosition = 0;

  const openButtons = document.querySelectorAll(".open-button");
  const closeButtons = document.querySelectorAll(".close-btn");
  const memberCards = document.querySelectorAll('.member-card'); 
  const formDataDisplay = document.getElementById('formDataDisplay');
  const urlParams = new URLSearchParams(window.location.search);
  let formDataHTML = '<dl>';

  const requiredFields = [
    { name: 'first_name', label: "Applicant's First Name" },
    { name: 'last_name', label: "Applicant's Last Name" },
    { name: 'email', label: 'Email Address' },
    { name: 'mobile_number', label: 'Mobile Phone Number' },
    { name: 'business_name', label: "Business/Organization's Name" },
    { name: 'timestamp', label: 'Application Date' }
  ];

  requiredFields.forEach(field => {
    const value = urlParams.get(field.name);
    if (value) {
      formDataHTML += `<dt>${field.label}:</dt><dd>${decodeURIComponent(value)}</dd>`;
    }
  });

  formDataHTML += '</dl>';

  if (formDataDisplay) {
    formDataDisplay.innerHTML = formDataHTML.length > 10 ? formDataHTML : "<p>No application data to display.</p>"; // Basic check to see if data was added
  }


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