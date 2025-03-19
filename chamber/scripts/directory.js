const gridbutton = document.querySelector('#grid');
const listbutton = document.querySelector('#list');
const display = document.querySelector('article');
const templateSection = display.querySelector('.template-section');
const url = 'data/members.json'; // Path to your JSON data file

async function getMembers() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      displayMembers(data); // Call function to display members
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    display.innerHTML = '<p>Data could not be loaded.</p>'; // Display error message in article
  }
}
function displayMembers(members) {
  display.innerHTML = ''; // Clear existing content in article
  display.appendChild(templateSection);
  members.forEach((member) => {
    const section = templateSection.cloneNode(true);
    section.style.display = 'block';
    const imgElement = section.querySelector('img');
    //const namesElement = section.querySelector('.names');
    const addressElement = section.querySelector('.address');
    const phoneElement = section.querySelector('.phone');
    const linkElement = section.querySelector('.link');
    // const membershipElement = section.querySelector('.membership');
    // const otherInfoElement = section.querySelector('.other-info');

    imgElement.src = `images/${member['image or icon file names']}`; // Set image source
    imgElement.alt = `Logo of ${member.names}`; // Set alt attribute
    //namesElement.textContent = member.names;
    addressElement.textContent = member.addresses;
    phoneElement.textContent = `Phone: ${member['phone numbers']}`;
    linkElement.href = member['website URLs'];
    linkElement.textContent = `${member['website URLs']}`;
    // membershipElement.textContent = `Membership Level: ${getLevelName(
    // member['membership level']
    //)}`;
    //otherInfoElement.textContent = member['other information'];

    display.appendChild(section); // Append the populated section to article
  });
}

function getLevelName(level) {
  switch (level) {
    case 1:
      return 'Member';
    case 2:
      return 'Silver';
    case 3:
      return 'Gold';
    default:
      return 'Unknown';
  }
}
// gridbutton.addEventListener('click', () => {
//   display.classList.replace('list', 'grid');
// });

// listbutton.addEventListener('click', () => {
//   display.classList.replace('grid', 'list');
// });

getMembers();
