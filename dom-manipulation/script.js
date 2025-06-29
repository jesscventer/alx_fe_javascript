// Array to store quote objects
let quotes = []; // Initialize as empty, as quotes will be loaded from storage

// --- Configuration for Server Simulation ---
// Using JSONPlaceholder /posts as a mock source.
// In a real app, this would be your backend API endpoint.
const MOCK_SERVER_API_URL = 'https://jsonplaceholder.typicode.com/posts';
const SYNC_INTERVAL_MS = 10000; // Sync every 10 seconds (for demonstration)

// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteForm = document.getElementById('addQuoteForm');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const newQuoteSourceInput = document.getElementById('newQuoteSource');
const importFileInput = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter');
const syncStatusElement = document.getElementById('syncStatus'); // Get the new sync status element

// --- Utility Functions for Notifications ---

/**
 * Displays a temporary status message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - 'success' or 'error' for styling.
 */
function showStatus(message, type = '') {
    syncStatusElement.textContent = message;
    syncStatusElement.className = `show ${type}`; // Add 'show' and type class
    setTimeout(() => {
        syncStatusElement.className = ''; // Hide after a delay
        syncStatusElement.textContent = ''; // Clear message
    }, 5000); // Message disappears after 5 seconds
}


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
        // Adding unique IDs for server sync purposes (even for mock data)
        quotes = [
            { id: 'q1', text: "The only way to do great work is to love what you do.", category: "Inspiration", source: "Steve Jobs" },
            { id: 'q2', text: "Innovation distinguishes between a leader and a follower.", category: "Innovation", source: "Steve Jobs" },
            { id: 'q3', text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams", source: "Eleanor Roosevelt" },
            { id: 'q4', text: "Strive not to be a success, but rather to be of value.", category: "Value", source: "Albert Einstein" },
            { id: 'q5', text: "Life is what happens when you're busy making other plans.", category: "Life", source: "John Lennon" },
            { id: 'q6', text: "The best way to predict the future is to create it.", category: "Future", source: "Abraham Lincoln" }
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
        // Assign a unique ID to new locally created quotes
        const newLocalQuote = {
            id: 'local-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9), // Unique client-side ID
            text: text,
            category: category,
            source: source
        };
        quotes.push(newLocalQuote);
        saveQuotesToLocalStorage(); // Save quotes after adding a new one
        populateCategories(); // Update category filter dropdown
        
        // Clear form fields
        newQuoteTextInput.value = '';
        newQuoteCategoryInput.value = '';
        newQuoteSourceInput.value = '';
        
        // After adding, re-apply the current filter or show all if "All Categories" is selected
        filterQuotes(); // Apply current filter to show new quote
        alert('Quote added successfully!');
        
        // Optional: Attempt to post new quote to server (JSONPlaceholder won't persist)
        // postQuoteToServer(newLocalQuote); // This would be more relevant with a real backend
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
                // Ensure imported quotes have IDs for merging purposes if they don't already
                const quotesWithIds = importedQuotes.map(q => ({
                    id: q.id || 'imported-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
                    text: q.text,
                    category: q.category,
                    source: q.source
                }));
                
                // Merge imported quotes into current quotes (simple append, then unique based on ID)
                // This doesn't resolve conflicts based on 'server precedence' but rather appends new data.
                // For a more robust import, you might ask user about overwrite/merge.
                const combinedQuotes = [...quotes, ...quotesWithIds];
                const uniqueCombinedQuotes = Array.from(new Map(combinedQuotes.map(item => [item.id, item])).values());
                
                quotes = uniqueCombinedQuotes; // Replace existing quotes with merged unique set
                
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


// --- Server Syncing Logic ---

/**
 * Fetches mock quote data from a simulated server endpoint.
 * @returns {Promise<Array>} A promise that resolves with an array of quote objects.
 */
async function fetchQuotesFromServer() {
    try {
        // Using JSONPlaceholder /posts as a mock source for server data.
        // We'll transform it to fit our quote structure.
        const response = await fetch(MOCK_SERVER_API_URL + '?_limit=5'); // Fetch a limited number of posts
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverPosts = await response.json();
        
        // Transform fetched posts into our quote structure
        const serverQuotes = serverPosts.map(post => ({
            id: 'server-' + post.id, // Assign a server-prefixed ID
            text: post.title, // Use title as quote text
            category: 'Server', // Assign a generic category
            source: 'JSONPlaceholder User ' + post.userId // Use userId as source
        }));
        console.log("Fetched from server:", serverQuotes);
        return serverQuotes;
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        showStatus("Error syncing with server!", 'error');
        return []; // Return empty array on error
    }
}

/**
 * Simulates pushing a new local quote to the server.
 * (Note: JSONPlaceholder /posts will accept POST requests but won't persist them globally.)
 * @param {Object} quote - The quote object to post.
 */
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(MOCK_SERVER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: quote.text,
                body: `Category: ${quote.category}, Source: ${quote.source}`,
                userId: 1, // Mock user ID
                id: quote.id // Include client-side ID for potential future mapping
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Simulated post to server:", result);
    } catch (error) {
        console.error("Error posting quote to server:", error);
    }
}


/**
 * Syncs local quotes with server data, applying server precedence.
 * Notifies the user about sync status and conflicts.
 */
async function syncQuotes() {
    showStatus("Syncing with server...", '');
    try {
        const serverQuotes = await fetchQuotesFromServer();
        
        // Create a map of existing local quotes for quick lookup by ID
        const localQuotesMap = new Map(quotes.map(q => [q.id, q]));
        
        let newQuotesAdded = 0;
        let quotesUpdated = 0;
        let conflictResolved = false; // Flag for conflict notification

        // Start with server quotes as the base
        let mergedQuotes = [...serverQuotes];
        const serverQuotesMap = new Map(serverQuotes.map(q => [q.id, q]));

        // Identify local-only quotes and add them
        quotes.forEach(localQuote => {
            if (!serverQuotesMap.has(localQuote.id)) {
                // This is a local-only quote, add it to merged list
                mergedQuotes.push(localQuote);
                newQuotesAdded++;
            } else {
                // If quote exists on both, server's version (already in mergedQuotes) takes precedence.
                // We could compare for changes here to specifically count "updated" but for simplicity
                // if ID matches, server's current version is assumed definitive.
                // If the local version was modified, it's overwritten by the server's version.
                // This counts as a resolved conflict if the content was different.
                const serverVersion = serverQuotesMap.get(localQuote.id);
                if (JSON.stringify(localQuote) !== JSON.stringify(serverVersion)) {
                    // Only mark as updated/resolved if there was a real content difference
                    quotesUpdated++;
                    conflictResolved = true;
                }
            }
        });

        // Update the main quotes array
        quotes = mergedQuotes;
        saveQuotesToLocalStorage(); // Persist the merged data
        populateCategories();       // Update categories with potential new ones
        filterQuotes();             // Re-apply filter to show updated list

        let syncMessage = "Sync complete!";
        if (newQuotesAdded > 0) {
            syncMessage += ` ${newQuotesAdded} new local quotes added.`;
        }
        if (conflictResolved) {
            syncMessage += ` Conflicts resolved (server precedence).`;
            showStatus(syncMessage, 'success');
        } else {
            showStatus(syncMessage, 'success');
        }

    } catch (error) {
        console.error("Sync failed:", error);
        showStatus("Sync failed. Check console for details.", 'error');
    }
}


// --- Event Listeners and Initial Setup ---

// Event listener for "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Event listener for "Export Quotes" button (defined in HTML onclick)
// Event listener for "Import Quotes" file input (defined in HTML onchange)

// Initial setup and display when the page loads
document.addEventListener('DOMContentLoaded', async () => { // Added async keyword
    loadQuotesFromLocalStorage(); // 1. Load quotes from local storage
    
    // Perform initial sync with server immediately
    await syncQuotes(); // Wait for initial sync before populating and filtering
    
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

    // Set up periodic sync
    setInterval(syncQuotes, SYNC_INTERVAL_MS);
});
