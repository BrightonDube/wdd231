document.addEventListener("DOMContentLoaded", function () {
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
      console.log(`Field: ${field.name}, Value: ${value}`)
      if (value) {
        formDataHTML += `<dt>${field.label}:</dt><dd>${decodeURIComponent(value)}</dd>`;
      }
    });
  
    formDataHTML += '</dl>';
    console.log("Generated formDataHTML:", formDataHTML);
    if (formDataDisplay) {
      formDataDisplay.innerHTML = formDataHTML.length > 10 ? formDataHTML :
        "<p>No application data to display.</p>";
      console.log("formDataDisplay.innerHTML set:", formDataDisplay.innerHTML);
  
    } else {
      console.log("formDataDisplay element not found!");
    }
  });