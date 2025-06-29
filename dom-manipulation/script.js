// Array to store quote objects
let quotes = [
    { text: "Be yourself; everyone else is already taken", source: "Oscar Wilde", category: "Inspiration",},
    { text: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel", source: "Maya Angelou", category: "Value" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", source: "Eleanor Roosevelt", category: "Dreams" },
    { text: "Strive not to be a success, but rather to be of value.", source: "Albert Einstein", category: "Value" },
    { text: "Life is what happens when you're busy making other plans.", source: "John Lennon", category: "Life" },
    { text: "Unless someone like you cares a whole awful lot, Nothing is going to get better. It's not.", source: "Dr. Seuss, The Lorax", category: "Future" }
];

// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const quoteSourceElement = document.getElementById('quoteSource'); // Get the new source element
const newQuoteButton = document.getElementById('newQuote');
const addQuoteForm = document.getElementById('addQuoteForm');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const newQuoteSourceInput = document.getElementById('newQuoteSource'); // Get the new source input

/**
 * Displays a random quote from the 'quotes' array.
 * Updates the 'quoteTextElement', 'quoteCategoryElement', and 'quoteSourceElement' in the DOM.
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteTextElement.textContent = "No quotes available. Add some!";
        quoteCategoryElement.textContent = "";
        quoteSourceElement.textContent = ""; // Clear source as well
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteTextElement.textContent = `"${randomQuote.text}"`;

    // Display the source first, if it exists
    if (randomQuote.source) {
        quoteSourceElement.textContent = `— ${randomQuote.source}`;
    } else {
        quoteSourceElement.textContent = "";
    }
    
    // Then display the category
    quoteCategoryElement.textContent = `- ${randomQuote.category}`;
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
    const source = newQuoteSourceInput.value.trim(); // Get the new source value

    if (text && category) { // Ensure text and category are filled
        quotes.push({ text: text, category: category, source: source }); // Add source to the new quote
        // Clear the form fields after adding
        newQuoteTextInput.value = '';
        newQuoteCategoryInput.value = '';
        newQuoteSourceInput.value = ''; // Clear source input as well
        // Optionally show the newly added quote or a random one
        showRandomQuote();
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);
addQuoteForm.addEventListener('submit', addQuote);

// Initial display of a random quote when the page loads
document.addEventListener('DOMContentLoaded', showRandomQuote);
