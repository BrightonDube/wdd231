document.addEventListener('DOMContentLoaded', function () { 
  const hamburger = document.querySelector('#nav-button');
  const navMenu = document.querySelector('#animate-me');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
  }

  // Active Page Class Logic 
  const navLinks = document.querySelectorAll('#animate-me .menu-links li a'); 
  const currentPagePath = window.location.pathname; // Get the current page's path

  navLinks.forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname; // Get the absolute path from href

    const normalizedCurrentPath = currentPagePath.endsWith('/') ? currentPagePath.slice(0, -1) : currentPagePath;
    const normalizedLinkPath = linkPath.endsWith('/') ? linkPath.slice(0, -1) : linkPath;
    const finalNormalizedCurrentPath = normalizedCurrentPath.endsWith('index.html') ? normalizedCurrentPath.replace('index.html', '') : normalizedCurrentPath;
    const finalNormalizedLinkPath = normalizedLinkPath.endsWith('index.html') ? normalizedLinkPath.replace('index.html', '') : normalizedLinkPath;


    if (finalNormalizedLinkPath === finalNormalizedCurrentPath) {
      link.parentElement.classList.add('active'); 
    } else {
      link.parentElement.classList.remove('active');
    }
  });
});