const gridbutton = document.querySelector('#grid');
const listbutton = document.querySelector('#list');
const display = document.querySelector('article');
const sections = display.querySelectorAll('section');
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
        console.error("Fetch Error:", error);
        display.innerHTML = "<p>Data could not be loaded.</p>"; // Display error message in article
    }
}