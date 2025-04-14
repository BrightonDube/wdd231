import { updateAuthStatus, loadRestaurantInfoDashboard, loadTablesDashboard, loadReservationsDashboard, updateRestaurantInfoDashboard, createTableDashboard, createReservationDashboard } from './script.js';

document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await updateAuthStatus();

    if (!isAuthenticated) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('dashboard-content').style.display = 'block';

    loadRestaurantInfoDashboard();
    loadTablesDashboard();
    loadReservationsDashboard();
    updateRestaurantInfoDashboard();
    createTableDashboard();
    createReservationDashboard();
});