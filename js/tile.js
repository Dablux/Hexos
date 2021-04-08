const layouts = [layout_flat, layout_pointy];

class Tile {
    constructor(q = 0, r = 0, s = 0, terrain = {type: "none", fill: "#aaa", stroke: "#888"}, size = settings.TILE_SIZE) {
      this.pos = {
        q: q,
        r: r,
        s: s
      };
      this.terrain = terrain;
      this.type = terrain.type;
      this.fill = terrain.fill;
      this.stroke = terrain.stroke;
      this.size = size;
      this.tag = "";
      this.key = this.pos.q.toString() + "," + this.pos.r.toString() + "," + this.pos.s.toString();
    }
    layout() {
        return Layout(layouts[settings.LAYOUT], Point(this.size, this.size), Point(0,0))
    };
    points() {
       return polygon_corners(this.layout(), Hex(this.pos.q, this.pos.r, this.pos.s));
    };
    set terrain(t) {
        this.__terrain = t;
        this.type = this.__terrain.type;
        this.fill = this.__terrain.fill;
        this.stroke = this.__terrain.stroke;

    };
    draw() {
        let p = this.points()
        ctx.beginPath();
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = 1;
        for(let i = 0; i < 6; i++) {
            ctx.lineTo(p[i].x + canvas.width2, p[i].y + canvas.height2);
        };
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
};

const cursorHex = {
    pos: {
        x: 0,
        y: 0,
        z: 0
    },
    fill: "#000",
    size: 16,
    layout() {
        return Layout(layouts[settings.LAYOUT], Point(this.size, this.size), Point(0,0))
    },
    points() {
       return polygon_corners(this.layout(), Hex(this.pos.x, this.pos.y, this.pos.z));
    },
    draw() {},
    setSize(size) {
        this.size = size;
    }
};

//Tile presets
tileGrass = {
    type: "grass",
    fill: "#8a8",
    stroke: "#000"
};
tileStone = {
    type: "stone",
    fill: "#888",
    stroke: "#000"
};
tileTree = {
    type: "tree",
    fill: "#061",
    stroke: "#000"
};
tileWater = {
    type: "water",
    fill: "#08d",
    stroke: "#000"
};
tileSand = {
    type: "sand",
    fill: "#ff7",
    stroke: "#000"
};
