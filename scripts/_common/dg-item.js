
/**
 * Items include ships (warfleet, holos, civilian), colonists and resources (basically anything that enters composition of a fleet).
 * 
 * @see https://manual.darkgalaxy.com/reference/list-of-colonists
 * @see https://manual.darkgalaxy.com/reference/list-of-ships
 * @see https://manual.darkgalaxy.com/books/quick-reference/page/list-of-resources
 */

const getItemId = (name) => String(name).replace(/\s/g, '_');
const getItemById = (id) => dgItemsMeta[id] || {};
const getItemByName = (name) => getItemById(getItemId(name));
const getItemScoreById = (id) => (dgItemsMeta[id] || {}).score || 0;
const getItemScoreByName = (name) => getItemScoreById(getItemId(name));

class dgItem {
    id;
    name;
    metal = 0;
    mineral = 0;
    energy = 0;
    food = 0;
    score = 0;
    warfleet = false;
    civilian = false;
    capacity = 0;

    constructor(name, options) {
        this.name = name;
        this.id = getItemId(name);
        mergeData(this, options);
        if (!this.score) {
            this.warfleet && (this.score = this.warfleetScore());
            this.civilian && (this.score = this.civilianScore());
        }
    }

    // 3x resource score
    warfleetScore() {
        const METAL_SCORE = 0.00012;
        const MINERAL_SCORE = 0.00018;
        const ENERGY_SCORE = 0.00036;
        const FOOD_SCORE = 0.00024;
        return this.metal * METAL_SCORE + this.mineral * MINERAL_SCORE + this.energy * ENERGY_SCORE + this.food * FOOD_SCORE;
    }

    // 2x res score
    civilianScore() {
        const METAL_SCORE = 0.00008;
        const MINERAL_SCORE = 0.00012;
        const ENERGY_SCORE = 0.00024;
        const FOOD_SCORE = 0.00016;
        return this.metal * METAL_SCORE + this.mineral * MINERAL_SCORE + this.energy * ENERGY_SCORE + this.food * FOOD_SCORE;
    }

}

const dgItemsMeta = {
    // wf
    Fighter: new dgItem("Fighter", { metal: 2000, mineral: 0, warfleet: true }), // default score: 0.24
    Bomber: new dgItem("Bomber", { metal: 0, mineral: 4000, warfleet: true }), // default score: 0.72
    Frigate: new dgItem("Frigate", { metal: 12000, mineral: 8000, warfleet: true }), // default score: 2.88
    Destroyer: new dgItem("Destroyer", { metal: 40000, mineral: 40000, warfleet: true }), // default score: 12
    Cruiser: new dgItem("Cruiser", { metal: 120000, mineral: 60000, warfleet: true }), // default score: 25.2
    Battleship: new dgItem("Battleship", { metal: 600000, mineral: 400000, warfleet: true }), // default score: 144
    // colonisation, invasion & transport
    Outpost_Ship: new dgItem("Outpost Ship", { metal: 30000, mineral: 20000, civilian: true }), // default score: 7.2
    Colonisation_Ship: new dgItem("Colonisation Ship", { metal: 600000, mineral: 400000, civilian: true, score: 144 }), // wf score: 144
    Invasion_Ship: new dgItem("Invasion Ship", { metal: 30000, mineral: 20000, civilian: true, capacity: 50000 }), // civilian score: 4.66    
    Freighter: new dgItem("Freighter", { metal: 24000, mineral: 16000, civilian: true, capacity: 100000 }), // civilian score: 3.84
    Merchant: new dgItem("Merchant", { metal: 48000, mineral: 32000, civilian: true, capacity: 250000 }), // civilian score: 7.68
    Trader: new dgItem("Trader", { metal: 72000, mineral: 48000, civilian: true, capacity: 625000 }), // civilian score: 11.52
    Hulk: new dgItem("Hulk", { metal: 120000, mineral: 80000, civilian: true, capacity: 1562500 }), // civilian score:: 19.2
    // Holo shit
    Holo_Projector: new dgItem("Holo Projector", { metal: 60000, mineral: 40000, energy: 120000, score: 57.6 }), // wf score: 57.6
    Holo_Fighter: new dgItem("Holo Fighter", { metal: 40, mineral: 0, energy: 390, score: 0.24 }), // copy fighter default score: 0.24
    Holo_Bomber: new dgItem("Holo Bomber", { metal: 0, mineral: 80, energy: 1200, score: 0.72 }), // copy bomber default score: 0.72
    Holo_Frigate: new dgItem("Holo Frigate", { metal: 240, mineral: 160, energy: 4800, score: 2.88 }), // copy frigate default score: 2.88
    Holo_Destroyer: new dgItem("Holo Destroyer", { metal: 800, mineral: 800, energy: 19980, score: 12 }), // copy destroyer default score: 12
    Holo_Cruiser: new dgItem("Holo Cruiser", { metal: 2400, mineral: 1200, energy: 42000, score: 25.2 }), // copy cruiser default score: 25.2
    Holo_Battleship: new dgItem("Holo Battleship", { metal: 12000, mineral: 8000, energy: 240000, score: 144 }), // copy battelship default score: 144
    // colonists
    Worker: new dgItem("Worker", { score: 0.0001 }),
    Soldier: new dgItem("Soldier", { metal: 12, mineral: 8, food: 20, score: 0.003 }),
    // base
    Metal: new dgItem("Metal", { metal: 1, score: 0.00004 }),
    Mineral: new dgItem("Mineral", { mineral: 1, score: 0.00006 }),
    Food: new dgItem("Food", { food: 1, score: 0.00008 }),
    Energy: new dgItem("Energy", { energy: 1, score: 0.00012 }),
};


const shipsOrder = ['Fighter', 'Bomber', 'Frigate', 'Destroyer', 'Cruiser', 'Battleship', 'Hulk', 'Trader', 'Merchant', 'Freighter', 'Invasion Ship'];
