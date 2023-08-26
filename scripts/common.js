
const parseValue = (v) => parseInt(String(v).replace(/[,\+%]+/g, '')); // will normalize a value to be able to use it in Math operation '52,126' -> 52126; '+3,465' -> 3465; '70%' -> 70
const formatNumber = (v) => String(parseFloat(v).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); // same format as the rest of the values in ui
const formatNumberInt = (v) => String(Math.round(v)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // same format as the rest of the values in ui

// from https://manual.darkgalaxy.com/reference/list-of-ships
const dgMeta = {
    Fighter: { name: "Fighter", metal: 2000, mineral: 0, score: 0.24 },
    Bomber: { name: "Bomber", metal: 0, mineral: 4000, score: 0.72 },
    Frigate: { name: "Frigate", metal: 12000, mineral: 8000, score: 2.88 },
    Destroyer: { name: "Destroyer", metal: 40000, mineral: 40000, score: 12 },
    Cruiser: { name: "Cruiser", metal: 120000, mineral: 60000, score: 25.2 },
    Battleship: { name: "Battleship", metal: 600000, mineral: 400000, score: 144 },
    Outpost_Ship: { name: "Outpost Ship", metal: 30000, mineral: 20000, score: 0 },
    Invasion_Ship: { name: "Invasion Ship", metal: 30000, mineral: 20000, score: 4.66 },
    Freighter: { name: "Freighter", metal: 24000, mineral: 16000, score: 3.66 },
    Trader: { name: "Trader", metal: 72000, mineral: 48000, score: 0 },
    Holo_Projector: { name: "Holo Projector", metal: 400, mineral: 200, score: 0 },
    Holo_Fighter: { name: "Holo Fighter", metal: 100, mineral: 0, score: 0 },
    Holo_Bomber: { name: "Holo Bomber", metal: 0, mineral: 200, score: 0 },
    Holo_Frigate: { name: "Holo Frigate", metal: 600, mineral: 400, score: 0 },
    Holo_Destroyer: { name: "Holo Destroyer", metal: 2000, mineral: 2000, score: 0 },
    Holo_Cruiser: { name: "Holo Cruiser", metal: 6000, mineral: 3000, score: 0 },
    Holo_Battleship: { name: "Holo Battleship", metal: 30000, mineral: 20000, score: 0 },
    Worker: { name: "Worker", metal: 0, mineral: 0, score: 0.0001 },
    Soldier: { name: "Soldier", metal: 30, mineral: 20, score: 0.003 },
    Metal: { name: "Metal", metal: 1, mineral: 0, score: 0 },
    Mineral: { name: "Mineral", metal: 0, mineral: 1, score: 0 },
    Food: { name: "Food", metal: 0, mineral: 0, score: 0 },
    Energy: { name: "Energy", metal: 0, mineral: 0, score: 0 },
};


const getMetaId = (name) => String(name).replace(/\s/g, '_');
const getMetaScoreById = (id) => (dgMeta[id] || {}).score || 0;
const getMetaScoreByName = (name) => getMetaScoreById(getMetaId(name));

const shipsOrder = ['Fighter', 'Bomber', 'Frigate', 'Destroyer', 'Cruiser', 'Battleship', 'Trader', 'Freighter', 'Invasion Ship'];

const dgState = {
    andromeda: {
        start: new Date('30 Aug 2023 18:00:00 GMT'),
    }
}




