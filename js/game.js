const game = {
    loop() {
        game.cursorWipe();
        game.drawCursor();
        game.cycleTile();
        update();
        if(input.m2)
        cameraMove();
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
    paint: [null, allTerrain["tileGrass"], allTerrain["tileStone"], allTerrain["tileTree"], allTerrain["tileWater"], allTerrain["tileSand"]],
    p: 1,
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

        if(input.m1 || input.m2) {
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
        
        if (game.paint[game.p] != null) {

            cursor.beginPath()
            for(let i = 0; i < 6; i++) {
                cursor.lineTo(Math.round(p[i].x / 1.5), Math.round(p[i].y / 1.5));
            };
            cursor.fillStyle = game.paint[game.p].fill;
            cursor.closePath();
            cursor.stroke();
            cursor.fill();
        }

        cursor.restore();
    },
    drawTiles() {
        //ctx.translate(canvas.width2 - (canvas.width2 * zoom), canvas.height2 - (canvas.height2 * zoom));
        onScreen = [];
        offScreen = [];

        for(let i = 0; i < allKeys.length; i++) {
            m[allKeys[i]].onOff();
        }

        for(let i = 0; i < onScreen.length; i++) {
            m[onScreen[i]].draw();
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
        //zoom = 15;
        requestAnimationFrame(cycle);
        update(); 
    },
    cycleTile() {
        if (input.m1) {
            const H = m[map.posToKey(hex_round(pixel_to_hex(Layout(layouts[LAYOUT], Point(TILE_SIZE, TILE_SIZE), Point(canvas.width2,canvas.height2)), Point(game.mouse.x - game.camera.x, game.mouse.y - game.camera.y))))]
            if (H != undefined && game.paint[game.p] != null){
                H.terrain = game.paint[game.p]; 
            }
        }
    }
};