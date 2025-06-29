// Array to store quote objects
let quotes = []; // Initialize as empty, as quotes will be loaded from storage

// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteForm = document.getElementById('addQuoteForm');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const newQuoteSourceInput = document.getElementById('newQuoteSource');
const importFileInput = document.getElementById('importFile'); // Get the file input element

// --- Local Storage Functions ---

/**
 * Saves the current 'quotes' array to localStorage.
 * Converts the array to a JSON string before saving.
 */
function saveQuotesToLocalStorage() {
    localStorage.setItem('dynamicQuotes', JSON.stringify(quotes));
    console.log("Quotes saved to localStorage.");
}

/**
 * Loads quotes from localStorage into the 'quotes' array.
 * Parses the JSON string back into an array.
 * Initializes 'quotes' array with default quotes if no data is found in localStorage.
 */
function loadQuotesFromLocalStorage() {
    const storedQuotes = localStorage.getItem('dynamicQuotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
        console.log("Quotes loaded from localStorage.");
    } else {
        // If no quotes in local storage, use a default set
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration", source: "Steve Jobs" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation", source: "Steve Jobs" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams", source: "Eleanor Roosevelt" },
            { text: "Strive not to be a success, but rather to be of value.", category: "Value", source: "Albert Einstein" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life", source: "John Lennon" },
            { text: "The best way to predict the future is to create it.", category: "Future", source: "Abraham Lincoln" }
        ];
        saveQuotesToLocalStorage(); // Save the default quotes immediately
    }
}

// --- Session Storage Function ---

/**
 * Saves the currently displayed quote to sessionStorage.
 * @param {Object} quote - The quote object currently displayed.
 */
function saveLastViewedQuoteToSessionStorage(quote) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    console.log("Last viewed quote saved to sessionStorage.");
}

/**
 * Loads the last viewed quote from sessionStorage.
 * @returns {Object|null} The last viewed quote object, or null if not found.
 */
function loadLastViewedQuoteFromSessionStorage() {
    const storedLastQuote = sessionStorage.getItem('lastViewedQuote');
    if (storedLastQuote) {
        console.log("Last viewed quote loaded from sessionStorage.");
        return JSON.parse(storedLastQuote);
    }
    return null;
}


// --- Quote Display & Add Functions ---

/**
 * Displays a random quote from the 'quotes' array, or a specific quote if provided.
 * Dynamically creates and appends elements for the quote text, source, and category.
 * Also saves the displayed quote to session storage.
 * @param {Object} [quoteToDisplay] - Optional: A specific quote object to display.
 */
function showRandomQuote(quoteToDisplay = null) {
    // Clear previous quote display content
    quoteDisplay.innerHTML = '';

    let currentQuote;

    if (quotes.length === 0) {
        const noQuotesMessage = document.createElement('p');
        noQuotesMessage.innerHTML = "No quotes available. Add some!";
        noQuotesMessage.style.textAlign = 'center';
        quoteDisplay.appendChild(noQuotesMessage);
        return;
    }

    if (quoteToDisplay) {
        // If a specific quote is passed, use it
        currentQuote = quoteToDisplay;
    } else {
        // Otherwise, pick a random one
        const randomIndex = Math.floor(Math.random() * quotes.length);
        currentQuote = quotes[randomIndex];
    }

    // Create and append quote text element
    const quoteTextElement = document.createElement('p');
    quoteTextElement.className = "quote-text";
    quoteTextElement.innerHTML = `"${currentQuote.text}"`;
    quoteDisplay.appendChild(quoteTextElement);

    // Create and append source element (if exists)
    if (currentQuote.source) {
        const quoteSourceElement = document.createElement('p');
        quoteSourceElement.className = "quote-source";
        quoteSourceElement.innerHTML = `— ${currentQuote.source}`;
        quoteDisplay.appendChild(quoteSourceElement);
    }
    
    // Create and append category element
    const quoteCategoryElement = document.createElement('p');
    quoteCategoryElement.className = "quote-category";
    quoteCategoryElement.innerHTML = `- ${currentQuote.category}`;
    quoteDisplay.appendChild(quoteCategoryElement);

    // Save the currently displayed quote to session storage
    saveLastViewedQuoteToSessionStorage(currentQuote);
}

/**
 * Handles the submission of the 'Add New Quote' form.
 * Adds the new quote to the 'quotes' array and updates the display.
 * @param {Event} event - The form submission event.
 */
function addQuote(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();
    const source = newQuoteSourceInput.value.trim();

    if (text && category) { // Ensure text and category are filled
        quotes.push({ text: text, category: category, source: source });
        saveQuotesToLocalStorage(); // Save quotes after adding a new one
        
        // Clear the form fields after adding
        newQuoteTextInput.value = '';
        newQuoteCategoryInput.value = '';
        newQuoteSourceInput.value = '';
        
        showRandomQuote(); // Show a random quote after adding
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

/**
 * Sets up the functionality for adding new quotes,
 * This includes attaching the event listener to the add quote form.
 */
function createAddQuoteForm() {
    addQuoteForm.addEventListener('submit', addQuote);
}

// --- JSON Import/Export Functions ---

/**
 * Exports the current 'quotes' array to a JSON file and prompts download.
 */
function exportQuotesToJson() {
    if (quotes.length === 0) {
        alert("No quotes to export!");
        return;
    }
    const dataStr = JSON.stringify(quotes, null, 2); // null, 2 for pretty-printing
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json'; // Suggested filename
    document.body.appendChild(a); // Append to body to make it clickable
    a.click(); // Programmatically click the link to trigger download
    document.body.removeChild(a); // Clean up the element
    URL.revokeObjectURL(url); // Release the object URL
    alert('Quotes exported successfully as quotes.json!');
}

/**
 * Imports quotes from a selected JSON file.
 * Updates the quotes array and saves to local storage.
 * @param {Event} event - The file input change event.
 */
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                // You might want to decide if you replace or append.
                // For now, let's append as per the instruction snippet.
                quotes.push(...importedQuotes);
                saveQuotesToLocalStorage(); // Save the updated quotes to local storage
                showRandomQuote(); // Display a random quote from the new set
                alert('Quotes imported successfully!');
            } else {
                alert('Import failed: JSON file does not contain an array of quotes.');
            }
        } catch (e) {
            alert('Error parsing JSON file. Please ensure it is a valid JSON format.');
            console.error("JSON parsing error:", e);
        }
    };
    // Ensure a file is selected before attempting to read
    if (event.target.files[0]) {
        fileReader.readAsText(event.target.files[0]);
    } else {
        alert('No file selected for import.');
    }
}


// --- Event Listeners and Initial Setup ---

// Event listener for "Show New Quote" button
newQuoteButton.addEventListener('click', () => showRandomQuote()); // Ensure no arguments are passed on click

// Initial setup when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadQuotesFromLocalStorage(); // 1. Load quotes from local storage
    const lastViewed = loadLastViewedQuoteFromSessionStorage(); // 2. Try to load last viewed quote
    if (lastViewed && quotes.some(q => q.text === lastViewed.text && q.category === lastViewed.category && q.source === lastViewed.source)) {
        // If last viewed quote exists and is still in our quotes array, display it
        showRandomQuote(lastViewed);
    } else {
        // Otherwise, display a random one
        showRandomQuote();
    }
    createAddQuoteForm(); // 3. Set up the form functionality
});
