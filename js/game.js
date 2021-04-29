//Updated
const game = {
    loop() {
        game.cursorWipe();
        game.drawCursor();
    },
    cycle: 0,
    camera:{
        x: 0,
        y: 0
    },
    seed: null,
    paused: false,
    then: null,
    fpsCap: 60,
    fpsCapDefault: 60,
    fpsInterval: 0,
    m: 0,
    wipe() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    cursorWipe() {
      cursor.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    },
    mouse: {
        x: canvas.width / 2,
        y: canvas.height / 2
    },
    mouseInGame: {
        x: 0,
        y: 0
    },

    drawCursor() {
        const size = 14 - (game.m / 17);
        let c = cursorHex;
        c.setSize(size);
        let p = c.points()

        if(input.m1) {
            game.mouseDownTime++;
            if(game.m < 90) {
              game.m += 5;
            }
        }else{
            game.mouseDownTime = 0;
            if(game.m > 0) {
              game.m -= 5;
            }
        }
        cursor.save();
        cursor.translate(game.mouse.x, game.mouse.y);
        cursor.rotate(game.m * 2 * (Math.PI/180));
        cursor.beginPath();
        cursor.lineWidth = 2;
        cursor.strokeStyle = "#f00";
        for(let i = 0; i < 6; i++) {
            cursor.lineTo(Math.round(p[i].x), Math.round(p[i].y));
        };
        cursor.closePath();
        cursor.stroke();
        cursor.restore();
    },
    drawTiles() {
        for(var i in m) {
            m[i].draw();
        }
    },
    seed(s) {
        if(s != null){
            c = toDigit(s);
        }else{
            c = toDigit(Date.now());
        }
        rand = Math.seed(c);
    },
    startGame(finalSeed = SEED) {
        game.paused = false;
        game.fpsCap = game.fpsCapDefault;
        game.fpsInterval = 1000 / game.fpsCap;
        game.then = Date.now();
        game.seed(finalSeed);
        m = {};
        map.generate(ISLAND_RADIUS);
        requestAnimationFrame(cycle);
        update(); 
    }
};
