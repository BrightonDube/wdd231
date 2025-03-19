document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('#nav-button');
  const navMenu = document.querySelector('#animate-me');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
  }
});
