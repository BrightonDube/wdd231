import { hideModal } from './modal.js';
const API_BASE_URL = 'https://tableresapi.onrender.com';

const modalDialog = document.getElementById('modal-dialog');
const modalMessage = document.getElementById('modal-message');
const closeButton = document.querySelector('.close-button');

function showModal(message) {
  if (modalDialog && modalMessage) {
    modalMessage.textContent = message;
    modalDialog.style.display = 'block';
  } else {
    console.warn('Modal elements not found. Cannot show modal:', message);
    alert(message);
  }
}

if (closeButton) {
  closeButton.addEventListener('click', hideModal);
}
if (modalDialog) {
  window.addEventListener('click', function (event) {
    if (event.target == modalDialog) {
      hideModal();
    }
  });
}

// Helper function to load data from a JSON file
async function loadFromFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading file ${filePath}:`, error);
    return [];
  }
}

// Helper function to save data to a JSON file
function saveToFile(filePath, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filePath.split('/').pop(); // Extract the file name
  link.click();
}

// Create a JSON variable with restaurant information
let restaurant = {
  name: 'The Gourmet Spot',
  address: '123 Main Street, Sandown',
  city: 'Sandton',
  phone: '555-123-4567'
};

// Display restaurant information from the `restaurant` variable
function displayRestaurantInfo() {
  const infoDisplay = document.getElementById('restaurant-info-display');
  if (infoDisplay) {
    infoDisplay.innerHTML = `
      <h3>${restaurant.name || 'Restaurant Name Not Set'}</h3>
      <p>Street Address: ${restaurant.address || 'No Address Provided'}</p>
      <p>City: ${restaurant.city || 'No City Provided'}</p>
      <p>Phone: ${restaurant.phone || 'No Phone Provided'}</p>
    `;
  }
}

// Update restaurant information in the `restaurant` variable
function setupUpdateRestaurantInfoForm() {
  const form = document.getElementById('edit-restaurant-info-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const name = document.getElementById('restaurant-name-edit').value;
      const address = document.getElementById('restaurant-address-edit').value;
      const phone = document.getElementById('restaurant-phone-edit').value;

      // Update the restaurant JSON variable
      restaurant.name = name || restaurant.name;
      restaurant.address = address || restaurant.address;
      restaurant.phone = phone || restaurant.phone;

      // Display the updated restaurant info
      displayRestaurantInfo();

      // Show a success message
      showModal('Restaurant information updated successfully!');
    });
  }
}

// Load and display tables from `data/tables.json`
async function loadTablesDashboard() {
  const tablesList = document.getElementById('tables-list');
  if (!tablesList) return;

  const tables = await loadFromFile('data/tables.json');
  if (tables.length > 0) {
    tablesList.innerHTML =
      '<ul>' +
      tables
        .map(
          table => `
            <li>
              <strong>Table Number:</strong> ${table.tableNumber} |
              <strong>Capacity:</strong> ${table.capacity} |
              <strong>Location:</strong> ${table.location} |
              <strong>Status:</strong> ${table.status}
            </li>`
        )
        .join('') +
      '</ul>';
  } else {
    tablesList.innerHTML =
      '<p>No tables found. Add some using the form below.</p>';
  }
}

// Add a new table to `data/tables.json`
function setupCreateTableForm() {
  const form = document.getElementById('create-table-form');
  if (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const tableNumberInput = document.getElementById('table-number');
      const capacityInput = document.getElementById('capacity');
      const locationInput = document.getElementById('location');
      const statusInput = document.getElementById('status');

      const tableNumber = tableNumberInput.value;
      const capacity = capacityInput.value;
      const location = locationInput.value;
      const status = statusInput.value;

      if (
        !tableNumber ||
        !capacity ||
        parseInt(capacity) < 1 ||
        !location ||
        !status
      ) {
        showModal('Please provide valid table details.');
        return;
      }

      const tables = await loadFromFile('data/tables.json');
      const newTable = {
        tableNumber: parseInt(tableNumber),
        capacity: parseInt(capacity),
        location: location,
        status: status
      };
      tables.push(newTable);

      // Save the updated tables to the JSON file
      saveToFile('data/tables.json', tables);

      showModal(`Table ${newTable.tableNumber} created successfully!`);
      loadTablesDashboard();
      form.reset();
    });
  }
}

// Load and display reservations from `data/reservations.json`
async function loadReservationsDashboard() {
  const reservationsList = document.getElementById('reservations-list');
  if (!reservationsList) return;

  const reservations = await loadFromFile('data/reservations.json');
  if (reservations.length > 0) {
    reservationsList.innerHTML =
      '<ul>' +
      reservations
        .map(
          res => `
            <li>
              <strong>ID:</strong> ${res.id} <br>
              <strong>Table Number:</strong> ${res.tableNumber} <br>
              <strong>Customer Name:</strong> ${res.customerName} <br>
              <strong>Phone:</strong> ${res.customerPhone} <br>
              <strong>Email:</strong> ${res.customerEmail} <br>
              <strong>Reservation Date & Time:</strong> ${new Date(res.reservationDateTime).toLocaleString()} <br>
              <strong>Party Size:</strong> ${res.partySize} <br>
              <strong>Status:</strong> ${res.status} <br>
              <strong>Notes:</strong> ${res.notes || 'None'} <br>
            </li>`
        )
        .join('') +
      '</ul>';
  } else {
    reservationsList.innerHTML = '<p>No reservations found.</p>';
  }
}

// Add a new reservation to `data/reservations.json`
function setupCreateReservationForm() {
  const form = document.getElementById('create-reservation-form');
  if (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const tableIdInput = document.getElementById('reservation-table');
      const guestNameInput = document.getElementById('guest-name');
      const reservationTimeInput = document.getElementById('reservation-time');
      const partySizeInput = document.getElementById('reservation-party-size');

      const tableId = tableIdInput.value;
      const guestName = guestNameInput.value;
      const reservationTime = reservationTimeInput.value;
      const partySize = partySizeInput.value;

      if (
        !tableId ||
        !guestName ||
        !reservationTime ||
        !partySize ||
        parseInt(partySize) < 1
      ) {
        showModal('Please fill in all reservation details correctly.');
        return;
      }

      const reservations = await loadFromFile('data/reservations.json');
      const newReservation = {
        id: reservations.length + 1,
        tableId: parseInt(tableId),
        guestName: guestName,
        reservationTime: reservationTime,
        partySize: parseInt(partySize)
      };
      reservations.push(newReservation);

      // Save the updated reservations to the JSON file
      saveToFile('data/reservations.json', reservations);

      showModal(
        `Reservation for "${newReservation.guestName}" created successfully!`
      );
      loadReservationsDashboard();
      form.reset();
    });
  }
}

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', function () {
    navigation.classList.toggle('active');
  });
} else {
  console.warn('Menu toggle button or navigation list not found.');
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', async () => {
  const dashboardContent = document.getElementById('dashboard-content');
  const homeSearchForm = document.getElementById('home-search-form');
  const aboutContent = document.querySelector('.about-content');

  if (dashboardContent) {
    dashboardContent.style.display = 'block';
    displayRestaurantInfo();
    await loadTablesDashboard();
    await loadReservationsDashboard();

    setupUpdateRestaurantInfoForm();
    setupCreateTableForm();
    setupCreateReservationForm();
  } else if (homeSearchForm) {
    console.log('Home page loaded');
  } else if (aboutContent) {
    console.log('About page loaded');
  }

  const contactLink = document.querySelector('.about-content a[href="#"]');
  const contactModal = document.getElementById('contact-modal');
  const closeContactModal = document.getElementById('close-contact-modal');

  if (contactLink && contactModal && closeContactModal) {
    contactLink.addEventListener('click', event => {
      event.preventDefault();
      contactModal.style.display = 'flex';
    });

    closeContactModal.addEventListener('click', () => {
      contactModal.style.display = 'none';
    });

    window.addEventListener('click', event => {
      if (event.target === contactModal) {
        contactModal.style.display = 'none';
      }
    });
  }

  const contactLinks = document.querySelectorAll('a[href="#"]:not([id])'); // Select all <a href="#"> without an id

  if (contactModal && closeContactModal && contactLinks.length > 0) {
    contactLinks.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        contactModal.style.display = 'flex';
      });
    });

    closeContactModal.addEventListener('click', () => {
      contactModal.style.display = 'none';
    });

    window.addEventListener('click', event => {
      if (event.target === contactModal) {
        contactModal.style.display = 'none';
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      // Collect form data
      const formData = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        message: contactForm.message.value
      };

      // Show the success message in the modal dialog
      showModal(
        'Thank you, ' + formData.name + '! Your message has been sent.'
      );

      // Close the contact modal and reset the form
      document.getElementById('contact-modal').style.display = 'none';
      contactForm.reset();
    });
  }

  // Example: Load restaurants from a local JSON file
  async function loadRestaurants() {
    const response = await fetch('data/restaurants.json');
    const restaurants = await response.json();

    const grid = document.querySelector('.restaurants-grid');
    if (!grid) return;

    grid.innerHTML = restaurants.map(r => `
      <div class="restaurant-card">
        <img src="images/${r.image}" alt="${r.name}" class="restaurant-img" loading="lazy" />
        <div class="restaurant-info">
          <h3 class="restaurant-name">${r.name}</h3>
          <div class="restaurant-meta">
            <span class="restaurant-cuisine">${r.cuisine}</span>
            <span class="restaurant-rating">⭐ ${r.rating}</span>
          </div>
          <div class="restaurant-address">${r.address}</div>
          <div class="restaurant-phone">${r.phone}</div>
        </div>
      </div>
    `).join('');
  }

  loadRestaurants();
  

  function handleLastVisit() {
    const lastVisitKey = 'lastVisit';
    const now = new Date();

   
    const lastVisit = localStorage.getItem(lastVisitKey);

    
    if (lastVisit) {
      const lastVisitDate = new Date(lastVisit);
      const message = `
        Welcome back! Your last visit was on 
        ${lastVisitDate.toLocaleDateString()} at ${lastVisitDate.toLocaleTimeString()}.
      `;
      showModal(message);
    } else {
      
      showModal('Welcome to Table Whisperer! This is your first visit.');
    }

    
    localStorage.setItem(lastVisitKey, now.toISOString());
  }

  
  const isIndexPage = document.querySelector('.restaurants-grid'); 
  if (isIndexPage) {
    handleLastVisit();
  }
});
