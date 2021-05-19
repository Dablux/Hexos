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

const TILE_SIZE = 16;
const LAYOUT = 1;
const ISLAND_RADIUS = 50;
const SEED = null;
var CT = {
    x: 100,
    y: 100
} //Camera tolerance

const input = {
    m1: false,
    m2: false,
    m3: false
}

document.body.addEventListener("mousemove", (e) => {
    game.mouse.x = e.clientX;
    game.mouse.y = e.clientY;
});

document.body.addEventListener("mouseup", (e) => {
    if (e.which === 3) {
        input.m2 = false;
    } else if (e.which === 2) {
        input.m3 = false;
    } else {
        input.m1 = false;
    }
});

document.body.addEventListener("mousedown", (e) => {
    if (e.which === 3) {
        input.m2 = true;
    } else if (e.which === 2){
        input.m3 = true;
    } else {
        input.m1 = true;
    }
});
document.body.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) {
        game.p++;
        if (game.p == game.paint.length) {
            game.p = 0;
        }
    } else {
        game.p--;
        if (game.p == -1) {
            game.p = game.paint.length - 1;
        }
    }
}, {
    passive: true
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

    CT.x = canvas.width / 4;
    CT.y = canvas.height / 4;
}
setupCanvas();
window.onresize = () => {
    setupCanvas();
    update();
};

/*function shift_canvas(ctx, w, h, dx, dy) {
  var imageData = ctx.getImageData(0, 0, w, h);
  ctx.clearRect(0, 0, w, h);
  ctx.putImageData(imageData, dx, dy);
  game.camera.x += dx;
  game.camera.y += dy;
  setupCanvas();
  update();
};*/

function cameraMove() {
    if(game.mouse.x <= CT.x){game.camera.x += (CT.x - game.mouse.x) / (CT.x / 10)}
    if(game.mouse.x >= canvas.width - CT.x){game.camera.x += (canvas.width - CT.x - game.mouse.x) / (CT.x / 10)}
    if(game.mouse.y <= CT.y){game.camera.y += (CT.y - game.mouse.y) / (CT.y / 10)}
    if(game.mouse.y >= canvas.height - CT.y){game.camera.y += (canvas.height - CT.y - game.mouse.y) / (CT.y / 10)}
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
};

function update() {
    game.wipe();
    game.drawTiles();
};
