
const cleanText = (s) => String(s).trim().replace(/[\n\t\s]+/g, ' ');
const parseValue = (v) => parseInt(String(v).replace(/[,\+%]+/g, '')); // will normalize a value to be able to use it in Math operation '52,126' -> 52126; '+3,465' -> 3465; '70%' -> 70
const formatNumber = (v) => String(parseFloat(v).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); // same format as the rest of the values in ui
const formatNumberInt = (v) => String(Math.round(v)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // same format as the rest of the values in ui
const toggleElement = (el, toggle) => { el.style = toggle ? 'display:block;' : 'display:none;'; };
const mergeData = (model, data) => Object.keys(data || {}).forEach((key) => model[key] = data[key]);
const resetFilters = (filters, exclude) => {
    Array.from(filters).forEach((el) => {
        if (el !== exclude) {
            if (el.options) {
                Array.from(el.options).forEach((opt) => opt.selected = false);
            } else if (el.checked) {
                el.checked = false;
            } else if (el.type === 'text' && String(el.value).length > 0) {
                el.value = '';
            }
        }
    });
};
const currentTurn = () => document.querySelector('#turnNumber').innerText;
const schemeType = /class=\"(neutral|hostile|friendly|allied)\"/
const getSchemeType = (el) => {
    const r = schemeType.exec(el.outerHTML);
    return r[1] || 'unknown';
};

const getMetaId = (name) => String(name).replace(/\s/g, '_');
const getMetaById = (id) => dgMeta[id] || {};
const getMetaByName = (name) => getMetaById(getMetaId(name));
const getMetaScoreById = (id) => (dgMeta[id] || {}).score || 0;
const getMetaScoreByName = (name) => getMetaScoreById(getMetaId(name));

const shipsOrder = ['Fighter', 'Bomber', 'Frigate', 'Destroyer', 'Cruiser', 'Battleship', 'Trader', 'Freighter', 'Invasion Ship'];

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
        this.id = getMetaId(name);
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

/**
 * @see https://manual.darkgalaxy.com/reference/list-of-colonists
 * @see https://manual.darkgalaxy.com/reference/list-of-ships
 * @see https://manual.darkgalaxy.com/books/quick-reference/page/list-of-resources
 */
const dgMeta = {
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



const dgStructures = {
    Outpost: { order: 1 },
    Colony: { order: 2 },
    Metropolis: { order: 3 },

    Living_Quarters: { order: 5 },
    Habitat: { order: 6 },
    Leisure_Centre: { order: 7 },
    Medical_Centre: { order: 8 },
    Hospital: { order: 9 },

    Launch_Site: { order: 11 },
    Comms_Satellite: { order: 12 },
    Space_Tether: { order: 13 },
    Hyperspace_Beacon: { order: 14 },
    Jump_Gate: { order: 15 },

    Ship_Yard: { order: 20 },
    Space_Dock: { order: 21 },
    Light_Weapons_Factory: { order: 22 },
    Heavy_Weapons_Factory: { order: 23 },
    Holo_Generator: { order: 24 },
    Army_Barracks: { order: 25 },

    Metal_Refinery: { order: 30 },
    Mineral_Processor: { order: 31 },
    Resource_Converter: { order: 32 },

    Core_Metal_Mine: { order: 35 },
    Core_Mineral_Extractor: { order: 36 },
    Hydroponics_Lab: { order: 37 },
    Solar_Array: { order: 38 },

    Metal_Mine: { order: 41 },
    Mineral_Extractor: { order: 42 },
    Farm: { order: 43 },
    Solar_Generator: { order: 44 },

}


class dgRound {
    name = '';
    url = 'https://www.darkgalaxy.com';
    signups;
    start;
    end;
    turnLength;

    constructor(name, options) {
        this.name = name;
        mergeData(this, options);
    }

    canSignup() {
        return this.signups && (new Date() > this.signups);
    }

    hasStarted() {
        return this.start && (new Date() > this.start);
    }

    hasEnded() {
        return this.end && (new Date() > this.end);
    }

    getTurn() {
        const ms = 1000 * 60 * 60;
        const now = new Date();
        return Math.floor((now - this.start) / ms);
    }

    getTurnsTotal() {
        const ms = 1000 * 60 * 60;
        return Math.floor((this.end - this.start) / ms);
    }

    getTurnsToGo() {
        return this.getTurnsTotal() - this.getTurn();
    }
}

/**
 * @see https://darkgalaxy.com/
 */
const dgRoundsMeta = [
    new dgRound('Andromeda 1', {
        url: 'https://andromeda.darkgalaxy.com',
        signups: null,
        start: new Date('30 Jul 2023 18:00:00'),
        end: new Date(' 10 Sept 2023 18:00:00'),
        turnLength: 3600,
    }),
    new dgRound('Andromeda 2', {
        url: 'https://andromeda.darkgalaxy.com',
        signups: new Date('1 Oct 2023 12:00:00'),
        start: new Date('29 Oct 2023 18:00:00'),
        end: new Date(' 17 Dec 2023 18:00:00'),
        turnLength: 3600,
    })
];

/**
 * 
 */
class Planet {
    id;
    name;
    galaxy;
    sector;
    system;
    number;
    coords;
    coordsSector;
    coordsSystem;

    coordsPattern = /(\d+)\.(\d+)\.(\d+).(\d+)/;
    fullNamePattern = /(\d+)\.(\d+)\.(\d+).(\d+)[\s]([A-Za-z\d\s]+)/;

    constructor(text, options) {
        const data = this.parsePlanet(text);
        data && mergeData(this, data);
        options && mergeData(this, options);
        if (this.isValid()) {
            this.id = [this.galaxy, this.sector, this.system, this.number].join('-');
            this.coords = [this.galaxy, this.sector, this.system, this.number].join('.');
            this.coordsSector = [this.galaxy, this.sector].join('.');
            this.coordsSystem = [this.galaxy, this.sector, this.system].join('.');
        }
    }

    validPlanet(text) {
        return String(text).match(this.coordsPattern);
    }

    isValid() {
        return this.galaxy && this.sector && this.system && this.number;
    }

    parsePlanet(text) {
        if (this.validPlanet(text)) {
            const [, ga, se, sy, pn, name] = this.fullNamePattern.exec(String(text));
            return {
                galaxy: ga,
                sector: se,
                system: sy,
                number: pn,
                name: name,
            };
        }
    }

    linkSystem(attributes) {
        return `<a class="system" href="#${this.id}" ${attributes}>${this.coordsSystem}</a>`;
    }

}




