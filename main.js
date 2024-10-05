const tilesContainer = document.querySelector('.tiles');
const colors = [
    '#e6194b', //red
    '#3cb44b', //green
    '#ffe119', //yellow
    '#bfef45', //lime
    '#f58231', //orange
    '#42d4f4', //cyan
    '#4363d8', //blue
    '#911eb4', //purple
    '#f032e6', // magenta
    '#a9a9a9', //gray
];
const colorsPicklist = [...colors, ...colors]; // make a copy of the colors array (the matches)
const tileCount = colorsPicklist.length;
// console.log(colorsPicklist);

// Game state
let revealedCount = 0;
let activeTile = null; // the tile that is currently being clicked
let awaitingEndofMove = false;
let score = 0;

// Recursive function to shuffle the colors array
function shuffleArray(array) {
    if (array.length <= 1) return array; // base case: when 1 or fewer elements, no need to shuffle

    const randomIndex = Math.floor(Math.random() * array.length); // pick a random element
    const temp = array[randomIndex];
    
    // Remove the random element from the array
    array.splice(randomIndex, 1); // native splice method to remove
    // Recursive call: shuffle the rest and place the removed element in the new array
    return [temp, ...shuffleArray(array)];
}

// Use Lodash's shuffle function (instead of the above recursion) to shuffle colors
const shuffledColors = _.shuffle(colorsPicklist); 
console.log(shuffledColors);

function buildTile(color) { // build a new tile element and return it to the loop
    const element = document.createElement("div");

    element.classList.add("tile");
    element.setAttribute("data-color", color);
    element.setAttribute("data-revealed", "false");

    document.querySelector(".score").textContent = score; // display the current score

    // reveal color
    element.addEventListener("click", () => {
        const revealed = element.getAttribute("data-revealed");

        if (awaitingEndofMove
            || revealed === "true" // don't allow clicks on already revealed tiles
            || element === activeTile // don't allow clicks on the same tile
        ) {
            return;
        }

        element.style.backgroundColor = color; // reveal the tile's color

        if (!activeTile) {
            activeTile = element; // set this as the active tile since it's the first one clicked
            return;
        }

        // not awaiting end of move, and there is an active tile
        // check if they match
        const colorToMatch = activeTile.getAttribute("data-color");

        if (colorToMatch === color) {
            activeTile.setAttribute("data-revealed", "true");
            element.setAttribute("data-revealed", "true");

            awaitingEndOfMove = false; 
            activeTile = null; 
            revealedCount += 2; 

            score++;
            document.querySelector(".score").textContent = score; // update score on the page

            if (revealedCount === tileCount) { // check if all tiles have been revealed (game complete)
                alert("You won! Refresh the page to play again."); 
            }

            return;
        }

        // if they don't match, hide both tiles again after a delay
        awaitingEndofMove = true;

        setTimeout(() => { // incorrect match, flip both tiles back after a short delay
            element.style.backgroundColor = null;
            activeTile.style.backgroundColor = null;

            awaitingEndofMove = false; 
            activeTile = null; 
        }, 1000);
    });

    return element; 
}

// Build up tiles using shuffled colors (from Lodash shuffle above)
for (let i = 0; i < tileCount; i++) {
    const color = shuffledColors[i]; // grab a color from the shuffled array
    const tile = buildTile(color); // create a tile with the current color

    tilesContainer.appendChild(tile); // append the tile to the container
}
