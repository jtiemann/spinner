import {Spinner} from './node_modules/spin.js/spin.js';
class RamdaSpinner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Create a shadow DOM

    // Add the component's HTML to the shadow DOM
    this.shadowRoot.innerHTML = `
    <style>
    @keyframes spinner-line-fade-more {
      0%, 100% {
        opacity: 0; /* minimum opacity */
      }
      1% {
        opacity: 1;
      }
    }

    @keyframes spinner-line-fade-quick {
      0%, 39%, 100% {
        opacity: 0.25; /* minimum opacity */
      }
      40% {
        opacity: 1;
      }
    }

    @keyframes spinner-line-fade-default {
      0%, 100% {
        opacity: 0.22; /* minimum opacity */
      }
      1% {
        opacity: 1;
      }
    }

    @keyframes spinner-line-shrink {
      0%, 25%, 100% {
        /* minimum scale and opacity */
        transform: scale(0.5);
        opacity: 0.25;
      }
      26% {
        transform: scale(1);
        opacity: 1;
      }
    }
      .container {
        display: flex;
      }

      .top-container {
        display: flex;
        height: 39vh; /* Top container takes 1/3 of the screen height */
      }

      .bottom-container {
        height: 58vh; /* Bottom container takes 2/3 of the screen height */
      }

      #replContent {
        margin-top: 5px;
        width: 100%;
        height: 100%;
        border: none;
      }

      .sidebar {
        width: 20%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .content {
        width: 80%;
      }

      #docContent {
        width: 100%; /* Use all available width */
        height: 39vh; /* Use all available height */
        border: none; /* Remove default iframe border */
      }

      /* Spinner styles (you can customize these) */
      #spinner {
        /* width: 60px;
        height: 60px; */
        margin: 0 auto 0px auto; /* Center the spinner */
      }

      #docContent, #replContent {
        width: 100%;
        height: 100%;
        border: none;
        opacity: 0; /* Initially hidden */
        transition: opacity 2.0s ease-in-out; /* Add a smooth transition for opacity */
      }

      #docContent.show, #replContent.show {
        opacity: 1; /* Show when the 'show' class is added */
      }
    </style>
      <div class="top-container">
        <div class="sidebar">
          <button id="spinButton">Spin</button>
          <div id="functionDisplay"></div>
          <div id="spinner" class="spinner"></div>
        </div>
        <div class="content">
          <iframe id="docContent"></iframe>
        </div>
      </div>
      <div class="bottom-container">
        <iframe id="replContent"></iframe>
      </div>
    `;

    // Get references to elements in the shadow DOM
    this.spinnerContainer = this.shadowRoot.getElementById('spinner');
    this.spinButton = this.shadowRoot.getElementById('spinButton');
    this.functionDisplay = this.shadowRoot.getElementById('functionDisplay');
    this.docContent = this.shadowRoot.getElementById('docContent');
    this.replContent = this.shadowRoot.getElementById('replContent');
    this.ramdaFunctions = []; // Initialize ramdaFunctions

    // Fetch Ramda functions when the component is created
    this.fetchRamdaFunctions();

  }
  fetchRamdaFunctions() {
    // Fetch the Ramda documentation page
    fetch('https://ramdajs.com/docs/')
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');  
        const functionElements = doc.querySelectorAll('.toc a'); // Select the function links

        this.ramdaFunctions = Array.from(functionElements).map(element => ({
          name: element.textContent.trim(),
          description: element.title,
          link: element.href, // Include the link to the documentation
        }));
      });
  }

  getRandomFunction() {
    const randomIndex = Math.floor(Math.random() * this.ramdaFunctions.length);
    return this.ramdaFunctions[randomIndex];
  }

  // Add the spin button event listener when the component is added to the DOM
  connectedCallback() {
    this.spinButton.addEventListener('click', () => {
      this.spinner = new Spinner().spin(this.spinnerContainer);
      this.docContent.classList.remove('show');
      this.replContent.classList.remove('show');

      this.docContent.src = '';
      this.replContent.src = '';

      setTimeout(() => {
        const randomFunction = this.getRandomFunction();
        const name = randomFunction.name.split('\n')[0]
        const link = document.createElement('a');
        this.docContent.classList.add('show');
        this.replContent.classList.add('show');
        link.href = `https://ramdajs.com/docs/#${name}`; // Set the link's URL
        link.textContent = name;
        link.target = '_blank'; // Open link in a new tab

        this.docContent.src = link.href;
        this.replContent.src = `https://ramdajs.com/repl/?v=0.30.1#?R.${name}`; // Set the repl iframe source

        this.functionDisplay.innerHTML = '';
        this.functionDisplay.appendChild(link);
        this.spinner.stop(); // Hide spinner
      }, 1000); // Simulate some delay
    });
  }

  // Remove the event listener when the component is removed from the DOM
  disconnectedCallback() {
    this.spinButton.removeEventListener('click', this.spin.bind(this));
  }
}

// Define the custom element
customElements.define('ramda-spinner', RamdaSpinner);
