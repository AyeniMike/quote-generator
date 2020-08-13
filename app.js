// Select DOM Elements
const quoteContainer = document.getElementById("quote-container");
const quote = document.querySelector("#quote");
const author = document.querySelector("#author");
const twitterButton = document.getElementById("twitter");
const newQuoteButton = document.querySelector(".new-quote");
const loader = document.querySelector(".loader");
const noDataFeedback = document.getElementById("no-data");

function showLoaderSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
  newQuoteButton.disabled = true;
  twitterButton.disabled = true;
}

function hideLoaderSpinner() {
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
    newQuoteButton.disabled = false;
    twitterButton.disabled = false;
  }
}

// Get quote from API
let count = 0;
async function getQuote() {
  showLoaderSpinner();
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const apiUrl = `http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json`;
  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();
    // If author is blank add unknown
    if (data.quoteAuthor === "") {
      author.innerText = "Unknown";
    } else {
      author.innerText = data.quoteAuthor;
    }

    quote.innerText = data.quoteText;

    // Reduce font size for long quotes
    if (data.quoteText.length > 120) {
      quote.classList.add("long-quote");
    } else {
      quote.classList.remove("long-quote");
    }
    console.log(data);
    hideLoaderSpinner();
  } catch (err) {
    count = count + 1;
    console.log(count);
    if (count > 5) {
      quote.innerText = "Unable to get quotes now, try later";
      hideLoaderSpinner();
      return;
    }
    getQuote();
  }
}

function tweetQuote() {
  const quoteToPost = quote.innerText;
  const authorToPost = author.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteToPost} - ${authorToPost}`;

  window.open(twitterUrl, "_blank");
}
newQuoteButton.addEventListener("click", () => {
  count = 0;
  getQuote();
});
twitterButton.addEventListener("click", tweetQuote);

// This gets called on load
getQuote();

// Advancements added
// Disable tweet and new-quote buttons when fetching quotes from API
// stop trying to fetch quotes five times of unsuccessful trials and return "Unable to get quotes now, try later";
// Removed the buttons from the general div so they can be displayed while fetching data
