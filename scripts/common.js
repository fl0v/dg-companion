
const parseValue = (v) => parseInt(String(v).replace(/[,\+%]+/g, '')); // will normalize a value to be able to use it in Math operation '52,126' -> 52126; '+3,465' -> 3465; '70%' -> 70
const formatNumber = (v) => String(parseFloat(v).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); // same format as the rest of the values in ui
const formatNumberInt = (v) => String(Math.round(v)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // same format as the rest of the values in ui

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
        Object.keys(options || {}).forEach((key) => this[key] = options[key]);
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




