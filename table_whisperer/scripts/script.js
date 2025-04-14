export { updateAuthStatus, loadRestaurantInfoDashboard, loadTablesDashboard, loadReservationsDashboard, updateRestaurantInfoDashboard, createTableDashboard, createReservationDashboard, API_BASE_URL };

const API_BASE_URL = 'https://tableresapi.onrender.com';

async function fetchData(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        alert(`Error fetching data: ${error.message}`);
        return null;
    }
}

const modalDialog = document.getElementById('modal-dialog');
const modalMessage = document.getElementById('modal-message');
const closeButton = document.querySelector('.close-button');
function showModal(message) {
    modalMessage.textContent = message;
    modalDialog.style.display = 'block';
}

function hideModal() {
    modalDialog.style.display = 'none';
}

closeButton.addEventListener('click', hideModal);
window.addEventListener('click', function(event) {
    if (event.target == modalDialog) {
        hideModal();
    }
});

async function updateAuthStatus() {
    try {
        const data = await fetchData('/auth/status');
        const isAuthenticated = data && data.isAuthenticated;
        const authStatusDisplayElements = document.querySelectorAll('#auth-status');
        const logoutButtonElements = document.querySelectorAll('#logout-button');

        authStatusDisplayElements.forEach(element => {
            if (isAuthenticated) {
                element.textContent = `Logged in as ${data.user.email}`;
            } else {
                element.innerHTML = `<a href="${API_BASE_URL}/auth/google">Login with Google</a>`;
            }
        });

        logoutButtonElements.forEach(button => {
            button.style.display = isAuthenticated ? 'inline-block' : 'none';
        });
        return isAuthenticated;

    } catch (error) {
        console.error("Error checking authentication status:", error);
        return false;
    }
}


function logoutUser() {
    fetchData('/auth/logout')
        .then(() => {
            updateAuthStatus();
            showModal('Logged out successfully.');
        });
}

function loadRestaurantInfoDashboard() {
    if (document.getElementById('restaurant-info-display')) {
        fetchData('/api/restaurant-info')
            .then(info => {
                if (info) {
                    const infoDisplay = document.getElementById('restaurant-info-display');
                    infoDisplay.innerHTML = `
                        <h3>${info.name || 'Restaurant Name'}</h3>
                        <p>Address: ${info.address || 'No Address'}</p>
                        <p>Phone: ${info.phone || 'No Phone'}</p>
                    `;
                    document.getElementById('restaurant-name-edit').value = info.name || '';
                    document.getElementById('restaurant-address-edit').value = info.address || '';
                    document.getElementById('restaurant-phone-edit').value = info.phone || '';
                }
            });
    }
}

function updateRestaurantInfoDashboard() {
    if (document.getElementById('edit-restaurant-info-form')) {
        document.getElementById('edit-restaurant-info-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('restaurant-name-edit').value;
            const address = document.getElementById('restaurant-address-edit').value;
            const phone = document.getElementById('restaurant-phone-edit').value;

            fetchData('/api/restaurant-info', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, address: address, phone: phone })
            }).then(updatedInfo => {
                if (updatedInfo) {
                    showModal('Restaurant information updated successfully!');
                    loadRestaurantInfoDashboard();
                }
            });
        });
    }
}

function loadTablesDashboard() {
    if (document.getElementById('tables-list')) {
        fetchData('/api/tables')
            .then(tables => {
                if (tables && tables.length >= 15) {
                    const tablesList = document.getElementById('tables-list');
                    tablesList.innerHTML = '<ul>' + tables.slice(0, 15).map(table => `
                        <li>
                            <strong>Table Name:</strong> ${table.name},
                            <strong>Capacity:</strong> ${table.capacity},
                            <strong>Status:</strong> Available,
                            <strong>Last Updated:</strong> ${new Date().toLocaleTimeString()}
                        </li>`).join('') + '</ul>';
                } else {
                    document.getElementById('tables-list').innerHTML = '<p>Not enough table data to display 15+ items. Please ensure your API returns sufficient data.</p>';
                }
            });
    }
}

function createTableDashboard() {
    if (document.getElementById('create-table-form')) {
        document.getElementById('create-table-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const tableName = document.getElementById('table-name').value;
            const capacity = document.getElementById('capacity').value;

            fetchData('/api/tables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: tableName, capacity: parseInt(capacity) })
            }).then(newTable => {
                if (newTable) {
                    showModal(`Table "${newTable.name}" created successfully!`);
                    loadTablesDashboard();
                    document.getElementById('create-table-form').reset();
                }
            });
        });
    }
}

function loadReservationsDashboard() {
    if (document.getElementById('reservations-list')) {
        fetchData('/api/reservations')
            .then(reservations => {
                if (reservations) {
                    const reservationsList = document.getElementById('reservations-list');
                    reservationsList.innerHTML = '<ul>' + reservations.map(reservation => `<li>Reservation ID: ${reservation.id}, Table ID: ${reservation.tableId}, Guest: ${reservation.guestName}, Time: ${new Date(reservation.reservationTime).toLocaleString()}, Party Size: ${reservation.partySize}</li>`).join('') + '</ul>';
                }
            });
    }
}

function createReservationDashboard() {
     if (document.getElementById('create-reservation-form')) {
        document.getElementById('create-reservation-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const tableId = document.getElementById('reservation-table').value;
            const guestName = document.getElementById('guest-name').value;
            const reservationTime = document.getElementById('reservation-time').value;
            const partySize = document.getElementById('reservation-party-size').value;

            fetchData('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableId: parseInt(tableId), guestName: guestName, reservationTime: reservationTime, partySize: parseInt(partySize) })
            }).then(newReservation => {
                if (newReservation) {
                    showModal(`Reservation for "${newReservation.guestName}" created successfully!`);
                    loadReservationsDashboard();
                    document.getElementById('create-reservation-form').reset();
                }
            });
        });
    }
}

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
menuToggle.addEventListener('click', function() {
    navigation.style.display = navigation.style.display === 'block' ? 'none' : 'block';
});

const logoutButtonElements = document.querySelectorAll('#logout-button');
logoutButtonElements.forEach(button => {
    button.addEventListener('click', logoutUser);
});

document.addEventListener('DOMContentLoaded', () => {
    updateAuthStatus();

    if (document.getElementById('dashboard-page')) {
        loadRestaurantInfoDashboard();
        loadTablesDashboard();
        loadReservationsDashboard();
        updateRestaurantInfoDashboard();
        createTableDashboard();
        createReservationDashboard();
    } else if (document.getElementById('about-page')) {
    } else if (document.getElementById('home-search-form')) {
    }
});