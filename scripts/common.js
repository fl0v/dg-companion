
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

/**
 * @see https://manual.darkgalaxy.com/reference/list-of-colonists
 * @see https://manual.darkgalaxy.com/reference/list-of-ships
 */
const dgMeta = {
    Fighter: { name: "Fighter", metal: 2000, mineral: 0, score: 0.24, warfleet: true },
    Bomber: { name: "Bomber", metal: 0, mineral: 4000, score: 0.72, warfleet: true },
    Frigate: { name: "Frigate", metal: 12000, mineral: 8000, score: 2.88, warfleet: true },
    Destroyer: { name: "Destroyer", metal: 40000, mineral: 40000, score: 12, warfleet: true },
    Cruiser: { name: "Cruiser", metal: 120000, mineral: 60000, score: 25.2, warfleet: true },
    Battleship: { name: "Battleship", metal: 600000, mineral: 400000, score: 144, warfleet: true },
    Outpost_Ship: { name: "Outpost Ship", metal: 30000, mineral: 20000, score: 0, warfleet: false },
    Invasion_Ship: { name: "Invasion Ship", metal: 30000, mineral: 20000, score: 4.66, warfleet: false },
    Freighter: { name: "Freighter", metal: 24000, mineral: 16000, score: 3.66, warfleet: false },
    Trader: { name: "Trader", metal: 72000, mineral: 48000, score: 0, warfleet: false },
    Holo_Projector: { name: "Holo Projector", metal: 400, mineral: 200, score: 0, warfleet: false },
    Holo_Fighter: { name: "Holo Fighter", metal: 100, mineral: 0, score: 0, warfleet: false },
    Holo_Bomber: { name: "Holo Bomber", metal: 0, mineral: 200, score: 0, warfleet: false },
    Holo_Frigate: { name: "Holo Frigate", metal: 600, mineral: 400, score: 0, warfleet: false },
    Holo_Destroyer: { name: "Holo Destroyer", metal: 2000, mineral: 2000, score: 0, warfleet: false },
    Holo_Cruiser: { name: "Holo Cruiser", metal: 6000, mineral: 3000, score: 0, warfleet: false },
    Holo_Battleship: { name: "Holo Battleship", metal: 30000, mineral: 20000, score: 0, warfleet: false },
    Worker: { name: "Worker", metal: 0, mineral: 0, score: 0.0001, warfleet: false },
    Soldier: { name: "Soldier", metal: 30, mineral: 20, score: 0.003, warfleet: false },
    Metal: { name: "Metal", metal: 1, mineral: 0, score: 0, warfleet: false },
    Mineral: { name: "Mineral", metal: 0, mineral: 1, score: 0, warfleet: false },
    Food: { name: "Food", metal: 0, mineral: 0, score: 0, warfleet: false },
    Energy: { name: "Energy", metal: 0, mineral: 0, score: 0, warfleet: false },
};


const getMetaId = (name) => String(name).replace(/\s/g, '_');
const getMetaById = (id) => dgMeta[id] || {};
const getMetaByName = (name) => getMetaById(getMetaId(name));
const getMetaScoreById = (id) => (dgMeta[id] || {}).score || 0;
const getMetaScoreByName = (name) => getMetaScoreById(getMetaId(name));

const shipsOrder = ['Fighter', 'Bomber', 'Frigate', 'Destroyer', 'Cruiser', 'Battleship', 'Trader', 'Freighter', 'Invasion Ship'];


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

    linkSystem() {
        return `<a class="system" href="#${this.id}">${this.coordsSystem}</a>`;
    }

}




