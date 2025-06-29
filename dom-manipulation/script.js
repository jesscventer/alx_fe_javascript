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
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const quoteSourceElement = document.getElementById('quoteSource');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteForm = document.getElementById('addQuoteForm');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const newQuoteSourceInput = document.getElementById('newQuoteSource');

/**
 * Displays a random quote from the 'quotes' array.
 * Updates the 'quoteTextElement', 'quoteCategoryElement', and 'quoteSourceElement' in the DOM.
 * Uses innerHTML as required by the test.
 */
function displayRandomQuote() {
    if (quotes.length === 0) {
        quoteTextElement.innerHTML = "No quotes available. Add some!";
        quoteCategoryElement.innerHTML = "";
        quoteSourceElement.innerHTML = "";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteTextElement.innerHTML = `"${randomQuote.text}"`;

    // Display the source first, if it exists
    if (randomQuote.source) {
        quoteSourceElement.innerHTML = `— ${randomQuote.source}`;
    } else {
        quoteSourceElement.innerHTML = "";
    }
    
    // Then display the category
    quoteCategoryElement.innerHTML = `- ${randomQuote.category}`;
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
        displayRandomQuote(); // Call the renamed function
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
function createAddQuoteForm() { // New function added
    addQuoteForm.addEventListener('submit', addQuote);
}


// Event Listeners
newQuoteButton.addEventListener('click', displayRandomQuote);

// Initial setup and display when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayRandomQuote();
    createAddQuoteForm(); // Call the new function to set up the form
});
