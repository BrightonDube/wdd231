document.addEventListener('DOMContentLoaded', function() {
    const currentYearSpan = document.getElementById("currentYear");
    const lastModifiedParagraph = document.getElementById("lastModified");

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    if (lastModifiedParagraph) {
        lastModifiedParagraph.textContent = "Last Update: " + document.lastModified;
    }
});