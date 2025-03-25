document.addEventListener('DOMContentLoaded', function() {
    const timestampInput = document.getElementById('timestamp');
    if (timestampInput) {
      timestampInput.value = new Date().toISOString(); 
    }

    const dialog = document.getElementById('contact-form');
    const openButton = document.getElementById('openButton');

    openButton.addEventListener('click', () => {
      dialog.showModal();
    });

    const form = document.getElementById('join-form');
    form.addEventListener('submit', (event) => {
        dialog.close();      
    });


  });