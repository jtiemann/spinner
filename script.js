const spinnerContainer = document.getElementById('spinner'); // Target the container
const spinButton = document.getElementById('spinButton');
const functionDisplay = document.getElementById('functionDisplay');
const docContent = document.getElementById('docContent');
const replContent = document.getElementById('replContent'); // Get the new iframe

let spinner; // Declare spinner variable

let ramdaFunctions = []; // Initialize as an empty array

function fetchRamdaFunctions() {
  // Fetch the Ramda documentation page
  fetch('https://ramdajs.com/docs/')
    .then(response => response.text())
    .then(html => {
      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');  
      const functionElements = doc.querySelectorAll('.toc a'); // Select the function links

      ramdaFunctions = Array.from(functionElements).map(element => ({
        name: element.textContent.trim(),
        // Extract the description from the link's title attribute
        description: element.title,
        link: element.href, // Include the link to the documentation
      }));
    });
}
function getRandomFunction() {
  const randomIndex = Math.floor(Math.random() * ramdaFunctions.length);
  return ramdaFunctions[randomIndex];
}

spinButton.addEventListener('click', () => {
  spinner = new Spinner().spin(spinnerContainer);
  docContent.src = '';
  replContent.src = '';
  //spinner.style.display = 'block'; // Show spinner
  setTimeout(() => {
    const randomFunction = getRandomFunction();
    const name = randomFunction.name.split('\n')[0]
    const link = document.createElement('a');
    link.href = `https://ramdajs.com/docs/#${name}`; // Set the link's URL
    link.textContent = name;
    link.target = '_blank'; // Open link in a new tab
 // Add an event listener to the link
 // link.addEventListener('click', (event) => {
 // event.preventDefault(); // Prevent default link behavior

  // Set the iframe source to the link's URL
  docContent.src = link.href;
//});
    replContent.src = `https://ramdajs.com/repl/?v=0.30.1#?R.${name}`; // Set the repl iframe source
    // Clear previous content and add the link
    functionDisplay.innerHTML = '';
    functionDisplay.appendChild(link);
    spinner.stop(); // Hide spinner
  }, 1000); // Simulate some delay
});

fetchRamdaFunctions();
