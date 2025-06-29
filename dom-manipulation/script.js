// Array to store quote objects
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration", source: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation", source: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams", source: "Eleanor Roosevelt" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value", source: "Albert Einstein" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life", source: "John Lennon" },
    { text: "The best way to predict the future is to create it.", category: "Future", source: "Abraham Lincoln" }
];

// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
// Removed direct references to quoteTextElement, quoteCategoryElement, quoteSourceElement
// as they will be created dynamically inside showRandomQuote
const newQuoteButton = document.getElementById('newQuote');
const addQuoteForm = document.getElementById('addQuoteForm');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const newQuoteSourceInput = document.getElementById('newQuoteSource');

/**
 * Displays a random quote from the 'quotes' array.
 * Dynamically creates and appends elements for the quote text, source, and category.
 * Uses innerHTML for content as required by the test.
 */
function showRandomQuote() {
    // Clear previous quote display content
    quoteDisplay.innerHTML = '';

    if (quotes.length === 0) {
        const noQuotesMessage = document.createElement('p'); // Use createElement
        noQuotesMessage.innerHTML = "No quotes available. Add some!"; // Use innerHTML
        noQuotesMessage.style.textAlign = 'center'; // Add some basic centering
        quoteDisplay.appendChild(noQuotesMessage); // Use appendChild
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Create and append quote text element
    const quoteTextElement = document.createElement('p'); // Use createElement
    quoteTextElement.className = "quote-text"; // Apply class for styling
    quoteTextElement.innerHTML = `"${randomQuote.text}"`; // Use innerHTML
    quoteDisplay.appendChild(quoteTextElement); // Use appendChild

    // Create and append source element (if exists)
    if (randomQuote.source) {
        const quoteSourceElement = document.createElement('p'); // Use createElement
        quoteSourceElement.className = "quote-source"; // Apply class for styling
        quoteSourceElement.innerHTML = `— ${randomQuote.source}`; // Use innerHTML
        quoteDisplay.appendChild(quoteSourceElement); // Use appendChild
    }
    
    // Create and append category element
    const quoteCategoryElement = document.createElement('p'); // Use createElement
    quoteCategoryElement.className = "quote-category"; // Apply class for styling
    quoteCategoryElement.innerHTML = `- ${randomQuote.category}`; // Use innerHTML
    quoteDisplay.appendChild(quoteCategoryElement); // Use appendChild
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
        // Clear the form fields after adding
        newQuoteTextInput.value = '';
        newQuoteCategoryInput.value = '';
        newQuoteSourceInput.value = '';
        // Optionally show the newly added quote or a random one
        showRandomQuote();
        alert('Quote added successfully!'); // Using alert per previous context
    } else {
        alert('Please enter both quote text and category.');
    }
}

/**
 * Sets up the functionality for adding new quotes,
 * as required by the 'createAddQuoteForm' function name.
 * This includes attaching the event listener to the add quote form.
 */
function createAddQuoteForm() {
    addQuoteForm.addEventListener('submit', addQuote);
}


// Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);

// Initial setup and display when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showRandomQuote();
    createAddQuoteForm();
});
