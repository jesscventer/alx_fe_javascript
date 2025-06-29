// Array to store quote objects
let quotes = []; // Initialize as empty, as quotes will be loaded from storage

// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteForm = document.getElementById('addQuoteForm');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const newQuoteSourceInput = document.getElementById('newQuoteSource');
const importFileInput = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter'); // Get the new filter dropdown

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

// --- Quote Display, Add & Filter Functions ---

/**
 * Renders a list of quotes (or a single random one) to the quoteDisplay area.
 * This function handles the dynamic creation of quote elements.
 * @param {Array} quotesToRender - An array of quote objects to display.
 */
function renderQuotesForDisplay(quotesToRender) {
    quoteDisplay.innerHTML = ''; // Clear previous content

    if (quotesToRender.length === 0) {
        const message = document.createElement('p');
        message.innerHTML = "No quotes available for this category. Add some!";
        message.style.textAlign = 'center';
        quoteDisplay.appendChild(message);
        return;
    }

    quotesToRender.forEach(quote => {
        const quoteItemDiv = document.createElement('div');
        quoteItemDiv.className = 'quote-item'; // Apply class for styling

        const quoteTextElement = document.createElement('p');
        quoteTextElement.className = "quote-text";
        quoteTextElement.innerHTML = `"${quote.text}"`;
        quoteItemDiv.appendChild(quoteTextElement);

        if (quote.source) {
            const quoteSourceElement = document.createElement('p');
            quoteSourceElement.className = "quote-source";
            quoteSourceElement.innerHTML = `— ${quote.source}`;
            quoteItemDiv.appendChild(quoteSourceElement);
        }
        
        const quoteCategoryElement = document.createElement('p');
        quoteCategoryElement.className = "quote-category";
        quoteCategoryElement.innerHTML = `Category: ${quote.category}`;
        quoteItemDiv.appendChild(quoteCategoryElement);

        quoteDisplay.appendChild(quoteItemDiv);
    });

    // Save the last viewed quote in session storage if displaying a single random quote
    // For list view, we don't save a "last viewed" as it's a collection.
    // If we only show one random quote at a time in the filtered view, then we would save.
    // Given the new "filterQuotes" that shows all, this is handled differently now.
}


/**
 * Displays a random quote from the 'quotes' array.
 * This function is primarily for the "Show New Quote" button.
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        renderQuotesForDisplay([]); // Show no quotes message
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    renderQuotesForDisplay([randomQuote]); // Display only one random quote
    saveLastViewedQuoteToSessionStorage(randomQuote); // Save this single random quote
}


/**
 * Handles the submission of the 'Add New Quote' form.
 * Adds the new quote to the 'quotes' array, saves to storage, and updates categories.
 * @param {Event} event - The form submission event.
 */
function addQuote(event) {
    event.preventDefault();

    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();
    const source = newQuoteSourceInput.value.trim();

    if (text && category) {
        quotes.push({ text: text, category: category, source: source });
        saveQuotesToLocalStorage(); // Save quotes after adding a new one
        populateCategories(); // Update category filter dropdown
        
        // Clear form fields
        newQuoteTextInput.value = '';
        newQuoteCategoryInput.value = '';
        newQuoteSourceInput.value = '';
        
        // After adding, re-apply the current filter or show all if "All Categories" is selected
        filterQuotes(); // Apply current filter to show new quote
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

/**
 * Extracts unique categories from the quotes array and populates the category filter dropdown.
 */
function populateCategories() {
    const categories = ['all']; // Start with 'All Categories' option
    const uniqueCategories = new Set(quotes.map(quote => quote.category));
    uniqueCategories.forEach(category => categories.push(category));

    categoryFilter.innerHTML = ''; // Clear existing options

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category === 'all' ? 'All Categories' : category;
        categoryFilter.appendChild(option);
    });
}

/**
 * Filters quotes based on the selected category and updates the display.
 * Also saves the selected filter to local storage.
 */
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('lastSelectedCategory', selectedCategory); // Save selected filter

    let filteredQuotes = [];
    if (selectedCategory === 'all') {
        filteredQuotes = quotes;
    } else {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    renderQuotesForDisplay(filteredQuotes); // Display the filtered list
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
                // For this project, we'll replace existing quotes with imported ones
                // to make management simpler, or you could push(...importedQuotes);
                quotes = importedQuotes; // Replace existing quotes
                saveQuotesToLocalStorage(); // Save the updated quotes to local storage
                populateCategories(); // Update categories with potentially new ones
                filterQuotes(); // Re-apply filter or show all imported quotes
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
newQuoteButton.addEventListener('click', showRandomQuote);

// Initial setup and display when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadQuotesFromLocalStorage(); // 1. Load quotes from local storage
    populateCategories();         // 2. Populate the category dropdown
    
    // 3. Load and apply last selected filter
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory && Array.from(categoryFilter.options).some(option => option.value === lastSelectedCategory)) {
        categoryFilter.value = lastSelectedCategory;
    } else {
        categoryFilter.value = 'all'; // Default to 'all' if no valid last filter
    }
    filterQuotes(); // Apply the loaded or default filter

    // 4. Set up the form functionality
    createAddQuoteForm();

    // 5. Optionally, if no filter is active and we want to show a single random quote
    // initially, we can call showRandomQuote() here.
    // For now, filterQuotes() will display all 'all' if no filter is active.
    // If user clicks 'Show New Quote', it will switch to single random display.
});
