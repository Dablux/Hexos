var m = {};
var allKeys= [];
var grass = [];
var stone = [];
var tree = [];
var water = [];
var sand = [];
var innerHalf = [];
var outerHalf = [];

const map = {
    generate(r) {
        allKeys= [];
        grass = [];
        stone = [];
        tree = [];
        water = [];
        sand = [];
        innerHalf = [];
        outerHalf = [];

        map.island(r);

        innerHalf = allKeys.filter(t => Math.abs(m[t].pos.q) <= Math.round(ISLAND_RADIUS / 2) && Math.abs(m[t].pos.r) <= Math.round(ISLAND_RADIUS / 2) && Math.abs(m[t].pos.s) <= Math.round(ISLAND_RADIUS / 2))

        outerHalf = allKeys.filter(t => Math.abs(m[t].pos.q) >= Math.round(ISLAND_RADIUS / 2) || Math.abs(m[t].pos.r) >= Math.round(ISLAND_RADIUS / 2) || Math.abs(m[t].pos.s) >= Math.round(ISLAND_RADIUS / 2))

        map.splatter(10, m[map.getRandomKey(innerHalf)].pos, tileGrass);
        map.splatter(7, m[map.getRandomKey(innerHalf)].pos, tileGrass);
        map.splatter(7, m[map.getRandomKey(innerHalf)].pos, tileGrass);
        map.splatter(6, m[map.getRandomKey(innerHalf)].pos, tileGrass);

        map.splatter(6, m[map.getRandomKey(outerHalf)].pos, tileGrass);
        map.splatter(5, m[map.getRandomKey(outerHalf)].pos, tileGrass);
        map.splatter(4, m[map.getRandomKey(outerHalf)].pos, tileGrass);
        map.splatter(5, m[map.getRandomKey(outerHalf)].pos, tileGrass);
        map.splatter(4, m[map.getRandomKey(outerHalf)].pos, tileGrass);

        map.splatter(8, m[map.getRandomKey(grass)].pos, tileSand);

        map.splatter(7, m[map.getRandomKey(grass)].pos, tileTree);
        map.splatter(7, m[map.getRandomKey(grass)].pos, tileStone);

        map.splatter(3, m[map.getRandomKey(grass)].pos, tileTree);
        map.splatter(3, m[map.getRandomKey(grass)].pos, tileTree);
        map.splatter(2, m[map.getRandomKey(grass)].pos, tileStone);
        map.splatter(2, m[map.getRandomKey(grass)].pos, tileStone);
        map.splatter(2, m[map.getRandomKey(stone)].pos, tileStone);
        map.splatter(2, m[map.getRandomKey(tree)].pos, tileTree);

        map.splatter(3, m[map.getRandomKey(stone)].pos, tileSand);

        map.beach();
    },
    addToMap(tiles) {
        for(let i = 0; i < tiles.length; i++) {
            let t = new Tile(tiles[i].q, tiles[i].r, tiles[i].s, tileWater);
            m[t.key] = t; 
            water.push(t);
            allKeys.push(t.key);
        }
    },
    posToKey(pos = {q: 0, r: 0, s: 0}) {
        return pos.q.toString() + "," + pos.r.toString() + "," + pos.s.toString();
    },
    tileInMap(tile = {q:0, r:0, s:0}) {
        return map.posToKey(tile) in m
    },
    getRandomKey(list = allKeys) {
        return list[Math.floor(rand() * list.length)];
    },
    ring(radius, base = {q: 0, r: 0, s: 0}, returnKeys = true) {
        let tiles = [];
        let keys = [];
        let h = hex_add(Hex(base.q, base.r, base.s), hex_scale(hex_direction(4), radius));

        for(let i = 0; i < 6; i++) {
            for(let j = 0; j < radius; j++) {
                tiles.push(h);
                keys.push(map.posToKey(h));
                h = hex_neighbor(h, i);
            }
        }
        
        if(returnKeys) {
            return keys
        }else{
            return tiles
        }
    },
    island(radius, base = {q:0, r:0, s:0}) {
        map.addToMap([map.posToKey(base)]);
        for(let i = 0; i < radius+1; i++) {
            map.addToMap(map.ring(i, base, false));
        }
    },
    updateTileTypes(keys, type) {
        for(let i = 0; i < keys.length; i++) {
            m[keys[i]].terrain = type;
        }
        grass = allKeys.filter(t => m[t].type == "grass");
        stone = allKeys.filter(t => m[t].type == "stone");
        tree = allKeys.filter(t => m[t].type == "tree");
        water = allKeys.filter(t => m[t].type == "water");
        sand = allKeys.filter(t => m[t].type == "sand");
        update();
    },
    splatter(radius, base, type, solid = true) {
        let keys = [];
        let extraKeys = [];
        var p = Math.round(50 / radius);
        keys.push(map.posToKey(base));

        for(let i = 0; i < radius + 1; i++) {
            let r = map.ring(i + 1, base);
            for(let j = 0; j < r.length; j++) {
                let c = Math.floor(rand() * 50) + 1;
                if(c > i * p && r[j] in m) {
                    keys.push(r[j])
                }
            }
        }

        if(solid) {
            for(let i = 0; i < keys.length; i++) {
                let r = map.ring(1, m[keys[i]].pos);
                for(let j = 0; j < r.length; j++) {
                    if(r[j] in m && !(r[j] in keys) && !(r[j] in extraKeys)) { 
                        extraKeys.push(r[j]);   
                    }
                }
            }
            for(let i = 0; i < extraKeys.length; i++) {
                keys.push(extraKeys[i]);
            }
        }

        map.updateTileTypes(keys, type);
    },
    beach() {
        let keys = [];
        for(let i = 0; i < grass.length; i++) {
            let r = map.ring(1, m[grass[i]].pos);
            for(let j = 0; j < r.length; j++) {
                if(r[j] in m && !(grass[i] in keys) && m[r[j]].type == "water") {
                    keys.push(grass[i])
                }
            }
        }
        map.updateTileTypes(keys, tileSand);
    }
};