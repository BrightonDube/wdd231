gridbutton.addEventListener('click', () => {
  display.classList.replace('list', 'grid'); // Replaces 'list' with 'grid'
});

listbutton.addEventListener('click', () => {
  display.classList.replace('grid', 'list'); // Replaces 'grid' with 'list'
});
