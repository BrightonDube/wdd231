const API_BASE_URL = 'https://tableresapi.onrender.com';

const modalDialog = document.getElementById('modal-dialog');
const modalMessage = document.getElementById('modal-message');
const closeButton = document.querySelector('.close-button');

function showModal(message) {
    if (modalDialog && modalMessage) {
        modalMessage.textContent = message;
        modalDialog.style.display = 'block';
    } else {
        console.warn("Modal elements not found. Cannot show modal:", message);
        alert(message);
    }
}

function hideModal() {
    if (modalDialog) {
        modalDialog.style.display = 'none';
    }
}

if (closeButton) {
    closeButton.addEventListener('click', hideModal);
}
if (modalDialog) {
    window.addEventListener('click', function(event) {
        if (event.target == modalDialog) {
            hideModal();
        }
    });
}

async function fetchData(endpoint, options = {}) {
    options.credentials = 'include';

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (response.status === 401) {
            console.warn('Unauthorized access detected.');
            return null;
        }
        if (!response.ok) {
            let errorBody = null;
            try { errorBody = await response.json(); } catch(e) {}
            const errorMessage = errorBody?.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }
        if (response.status === 204) {
            return {};
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        showModal(`Error: ${error.message}`);
        return null;
    }
}

async function updateAuthStatus() {
    const authStatusDisplayElements = document.querySelectorAll('#auth-status');
    const logoutButtonElements = document.querySelectorAll('#logout-button');
    let isAuthenticated = false;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/status`, { credentials: 'include' });

        if (!response.ok) {
            if (response.status !== 401) {
               console.error(`Auth status check failed: ${response.status}`);
            }
            isAuthenticated = false;
        } else {
            const data = await response.json();
            isAuthenticated = data && data.isAuthenticated;

            if (isAuthenticated) {
                 authStatusDisplayElements.forEach(element => {
                    if (element) element.textContent = `Logged in as ${data.user.email}`;
                });
            }
        }

    } catch (error) {
        console.error("Error checking authentication status:", error);
        isAuthenticated = false;
    } finally {
        authStatusDisplayElements.forEach(element => {
             if (element && !isAuthenticated) {
                const redirectUrl = encodeURIComponent(window.location.href);
                element.innerHTML = `<a href="${API_BASE_URL}/auth/google">Login with Google</a>`;
            }
        });

        logoutButtonElements.forEach(button => {
            if (button) button.style.display = isAuthenticated ? 'inline-block' : 'none';
        });
    }
    return isAuthenticated;
}

function logoutUser() {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `${API_BASE_URL}/auth/logout?redirect=${redirectUrl}`;
}

function displayRestaurantInfo(info) {
    const infoDisplay = document.getElementById('restaurant-info-display');
    const nameEdit = document.getElementById('restaurant-name-edit');
    const addressEdit = document.getElementById('restaurant-address-edit');
    const phoneEdit = document.getElementById('restaurant-phone-edit');

    if (infoDisplay) {
        infoDisplay.innerHTML = `
            <h3>${info?.name || 'Restaurant Name Not Set'}</h3>
            <p>Address: ${info?.address || 'No Address Provided'}</p>
            <p>Phone: ${info?.phone || 'No Phone Provided'}</p>
            <button id="edit-info-btn" class="action-button">Edit Info</button>
        `;
        const editBtn = document.getElementById('edit-info-btn');
        const editSection = document.getElementById('restaurant-info-edit-page');
        if(editBtn && editSection) {
            editBtn.addEventListener('click', () => {
                 editSection.style.display = editSection.style.display === 'none' ? 'block' : 'none';
            });
            editSection.style.display = 'none';
        }
    }
    if (nameEdit) nameEdit.value = info?.name || '';
    if (addressEdit) addressEdit.value = info?.address || '';
    if (phoneEdit) phoneEdit.value = info?.phone || '';
}

async function loadRestaurantInfoDashboard() {
    const info = await fetchData('/api/restaurant-info');
    if (info) {
        displayRestaurantInfo(info);
    } else {
       displayRestaurantInfo(null);
       showModal('Could not load restaurant information. You might need to set it up.');
    }
}

function setupUpdateRestaurantInfoForm() {
    const form = document.getElementById('edit-restaurant-info-form');
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            const name = document.getElementById('restaurant-name-edit').value;
            const address = document.getElementById('restaurant-address-edit').value;
            const phone = document.getElementById('restaurant-phone-edit').value;

            const updatedInfo = await fetchData('/api/restaurant-info', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, address, phone })
            });

            if (updatedInfo) {
                showModal('Restaurant information updated successfully!');
                displayRestaurantInfo(updatedInfo);
                const editSection = document.getElementById('restaurant-info-edit-page');
                if(editSection) editSection.style.display = 'none';
            } else {
                 showModal('Failed to update restaurant information.');
            }
        });
    }
}

async function loadTablesDashboard() {
    const tablesList = document.getElementById('tables-list');
    if (!tablesList) return;

    const tables = await fetchData('/api/tables');
    if (tables && Array.isArray(tables)) {
         if (tables.length > 0) {
            tablesList.innerHTML = '<ul>' + tables.map(table => `
                <li>
                    ID: ${table._id || table.id} |
                    <strong>Name:</strong> ${table.name} |
                    <strong>Capacity:</strong> ${table.capacity} |
                    <strong>Status:</strong> Available
                </li>`).join('') + '</ul>';
        } else {
             tablesList.innerHTML = '<p>No tables found. Add some using the form below.</p>';
        }
    } else {
        tablesList.innerHTML = '<p>Could not load tables.</p>';
    }
}

function setupCreateTableForm() {
    const form = document.getElementById('create-table-form');
     if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            const tableNameInput = document.getElementById('table-name');
            const capacityInput = document.getElementById('capacity');
            const tableName = tableNameInput.value;
            const capacity = capacityInput.value;

            if (!tableName || !capacity || parseInt(capacity) < 1) {
                 showModal("Please provide a valid table name and capacity (minimum 1).");
                 return;
            }

            const newTable = await fetchData('/api/tables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: tableName, capacity: parseInt(capacity) })
            });

            if (newTable) {
                showModal(`Table "${newTable.name}" created successfully!`);
                loadTablesDashboard();
                form.reset();
            } else {
                showModal('Failed to create table.');
            }
        });
    }
}

async function loadReservationsDashboard() {
    const reservationsList = document.getElementById('reservations-list');
    if (!reservationsList) return;

    const reservations = await fetchData('/api/reservations');
     if (reservations && Array.isArray(reservations)) {
         if (reservations.length > 0) {
             reservationsList.innerHTML = '<ul>' + reservations.map(res => `
                 <li>
                     ID: ${res._id || res.id} |
                     Table ID: ${res.tableId} |
                     Guest: ${res.guestName} |
                     Time: ${new Date(res.reservationTime).toLocaleString()} |
                     Party Size: ${res.partySize}
                 </li>`).join('') + '</ul>';
         } else {
            reservationsList.innerHTML = '<p>No reservations found.</p>';
         }
    } else {
        reservationsList.innerHTML = '<p>Could not load reservations.</p>';
    }
}

function setupCreateReservationForm() {
     const form = document.getElementById('create-reservation-form');
     if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            const tableIdInput = document.getElementById('reservation-table');
            const guestNameInput = document.getElementById('guest-name');
            const reservationTimeInput = document.getElementById('reservation-time');
            const partySizeInput = document.getElementById('reservation-party-size');

            const tableId = tableIdInput.value;
            const guestName = guestNameInput.value;
            const reservationTime = reservationTimeInput.value;
            const partySize = partySizeInput.value;

             if (!tableId || !guestName || !reservationTime || !partySize || parseInt(partySize) < 1) {
                 showModal("Please fill in all reservation details correctly.");
                 return;
            }

            const newReservation = await fetchData('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                     tableId: tableId,
                     guestName: guestName,
                     reservationTime: reservationTime,
                     partySize: parseInt(partySize)
                 })
            });

            if (newReservation) {
                showModal(`Reservation for "${newReservation.guestName}" created successfully!`);
                loadReservationsDashboard();
                form.reset();
            } else {
                showModal('Failed to create reservation. Check table ID and availability.');
            }
        });
    }
}

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation nav ul');

if (menuToggle && navigation) {
    menuToggle.addEventListener('click', function() {
        navigation.classList.toggle('active');
        menuToggle.textContent = navigation.classList.contains('active') ? '✕' : '☰';
    });
} else {
    console.warn("Menu toggle button or navigation list not found.");
}

document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await updateAuthStatus();

    const logoutButtonElements = document.querySelectorAll('#logout-button');
    logoutButtonElements.forEach(button => {
        if (button) button.addEventListener('click', logoutUser);
    });

    const dashboardContent = document.getElementById('dashboard-content');
    const homeSearchForm = document.getElementById('home-search-form');
    const aboutContent = document.querySelector('.about-content');

    if (dashboardContent) {
        if (!isAuthenticated) {
            showModal("Please log in to access the dashboard.");
            window.location.href = 'index.html';
            return;
        }

        dashboardContent.style.display = 'block';
        await loadRestaurantInfoDashboard();
        await loadTablesDashboard();
        await loadReservationsDashboard();

        setupUpdateRestaurantInfoForm();
        setupCreateTableForm();
        setupCreateReservationForm();

    } else if (homeSearchForm) {
        console.log("Home page loaded");

    } else if (aboutContent) {
        console.log("About page loaded");
    }
});