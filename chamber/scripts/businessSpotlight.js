document.addEventListener("DOMContentLoaded", () => {
    fetch("./data/members.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const eligibleMembers = data.filter(member => member["membership level"] >= 2); // Only Gold (3) and Silver (2)
            displayRandomBusinesses(eligibleMembers);
        })
        .catch(error => console.error("Error loading business data:", error));
});

function displayRandomBusinesses(members) {
    const businessCards = document.querySelectorAll(".business-card");
    
    if (members.length === 0) {
        console.warn("No eligible businesses found.");
        return;
    }

    const selectedBusinesses = shuffleArray(members).slice(0, businessCards.length);

    businessCards.forEach((card, index) => {
        const business = selectedBusinesses[index];

        if (business) {
            card.querySelector(".business-name").textContent = business.names;
            card.querySelector(".tagline").textContent = business.tagline;
            card.querySelector(".address").textContent = `Address: ${business.addresses}`;
            card.querySelector(".phone").textContent = `Phone: ${business["phone numbers"]}`;
            card.querySelector(".url a").href = business["website URLs"];
            card.querySelector(".url a").textContent = business["website URLs"];
            card.querySelector(".membership").textContent = `Membership Level: ${business["membership level"]}`;

            const logo = card.querySelector(".business-logo");
            logo.src = business["image or icon file names"];
            logo.alt = `${business.names} Logo`;
        }
    });
}

// Fisher-Yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
