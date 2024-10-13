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
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');  
      const functionElements = doc.querySelectorAll('.toc a'); // Select the function links

      ramdaFunctions = Array.from(functionElements).map(element => ({
        name: element.textContent.trim(),
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

  setTimeout(() => {
    const randomFunction = getRandomFunction();
    const name = randomFunction.name.split('\n')[0]
    const link = document.createElement('a');
    link.href = `https://ramdajs.com/docs/#${name}`; // Set the link's URL
    link.textContent = name;
    link.target = '_blank'; // Open link in a new tab

    docContent.src = link.href;
    replContent.src = `https://ramdajs.com/repl/?v=0.30.1#?R.${name}`; // Set the repl iframe source

    functionDisplay.innerHTML = '';
    functionDisplay.appendChild(link);
    spinner.stop(); // Hide spinner
  }, 1000); // Simulate some delay
});

fetchRamdaFunctions();
