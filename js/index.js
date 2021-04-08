var canvas = document.getElementById("canvas");
var cursorCanvas = document.getElementById("cursorCanvas");
//using "const" causes problems in safari when an ID shares the same name.
const cursor = cursorCanvas.getContext("2d");
const ctx = canvas.getContext("2d");

document.body.style.backgroundColor = "#fff";
document.body.style.cursor = "none";

//disable pop up menu on right click
document.oncontextmenu = function() {
    return false;
}

const input = {
    m1: false,
    m2: false,
}

document.body.addEventListener("mousemove", (e) => {
    game.mouse.x = e.clientX;
    game.mouse.y = e.clientY;
});

document.body.addEventListener("mouseup", (e) => {
    if (e.which === 3) {
        input.m2 = false;
    } else {
        input.m1 = false;
    }
});

document.body.addEventListener("mousedown", (e) => {
    if (e.which === 3) {
        input.m2 = true;
    } else {
        input.m1 = true;
    }
});

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.width2 = canvas.width / 2; 
    canvas.height2 = canvas.height / 2;
    canvas.diagonal = Math.sqrt(canvas.width2 * canvas.width2 + canvas.height2 * canvas.height2);
    ctx.font = "25px Arial";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
    cursorCanvas.width2 = cursorCanvas.width / 2; 
    cursorCanvas.height2 = cursorCanvas.height / 2;
    cursorCanvas.diagonal = Math.sqrt(cursorCanvas.width2 * cursorCanvas.width2 + cursorCanvas.height2 * cursorCanvas.height2);
    cursor.font = "25px Arial";
    cursor.lineJoin = "round";
    cursor.lineCap = "round";
}
setupCanvas();
window.onresize = () => {
    setupCanvas();
    update();
};

function cycle() {
    if (!game.paused) requestAnimationFrame(cycle);

    const now = Date.now();
    const elapsed = now - game.then; // calc elapsed time since last loop
    if (elapsed > game.fpsInterval) { // if enough time has elapsed, draw the next frame
        game.then = now - (elapsed % game.fpsInterval); // Get ready for next frame by setting then=now.   Also, adjust for fpsInterval not being multiple of 16.67
        game.cycle++; //tracks game cycles
        game.loop();
    }
}

function update() {
    game.wipe();
    game.drawTiles();
}

function setup() {
  fetch('js/config.JSON')
  .then(response => {
      if (!response.ok) {
          throw new Error("HTTP error " +   response.status);
      }
      return response.json();
  })
  .then(json => {
      this.settings = json;
      console.log(this.settings);
      game.startGame()
      const settings = JSON.parse(this.settings);
      
  })
  .catch(function () {
      this.dataError = true;
  });
}