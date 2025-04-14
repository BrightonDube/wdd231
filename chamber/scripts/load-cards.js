document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.querySelector('.grid-card');
    
    // Load cards from JSON file
    fetch('./data/discover.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        // Create IntersectionObserver for lazy loading
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '200px', 
          threshold: 0.01
        });
  
        // Create cards
        data.cards.forEach(card => {
          const cardElement = document.createElement('article');
          cardElement.className = 'card';
          cardElement.innerHTML = `
            <figure class="card-image">
              <img data-src="${card.photo}" alt="${card.title}" loading="lazy">
            </figure>
            <h2>${card.title}</h2>
            <address>${card.address}</address>
            <p>${card.description}</p>
            <button class="learn-more">${card.buttonText || 'Learn More'}</button>
          `;
          gridContainer.appendChild(cardElement);
          
          // Observe the image for lazy loading
          const img = cardElement.querySelector('img');
          observer.observe(img);
        });
      })
      .catch(error => {
        console.error('Error loading card data:', error);
        gridContainer.innerHTML = '<p class="error">Error loading attractions. Please try again later.</p>';
      });
  });