/**
 * Anything that can be build on a planet
 * @WIP
 */

class dgStructure {
    id;
    name;
    require = {
        metal: 0,
        mineral: 0,
        energy: 0,
        ground: 0,
        orbit: 0,
        turns: 0,
        workers: 0,
    };
    score = 0;
    order = 9999;

    constructor(name, data) {
        this.name = name;
        this.id = getItemId(name);
        mergeData(this, data);
    }
}

const dgStructuresMeta = {
    Outpost: new dgStructure('Outpost', { order: 1, require: { ground: 1 } }),
    Colony: new dgStructure('Colony', { order: 2, require: { ground: 2, metal: 60000, mineral: 40000, turns: 24, workers: 50000 } }),
    Metropolis: new dgStructure('Metropolis', { order: 3, require: { ground: 4, metal: 120000, mineral: 80000, turns: 48, workers: 160000 } }),

    Living_Quarters: new dgStructure('Living Quarters', { order: 5, require: { ground: 1, metal: 2400, mineral: 1600, energy: 10, turns: 6, workers: 25000 } }),
    Habitat: new dgStructure('Habitat', { order: 6, require: { orbit: 1, metal: 4800, mineral: 3200, energy: 20, turns: 6, workers: 25000 } }),
    Leisure_Centre: new dgStructure('Leisure Centre', { order: 7, require: { ground: 2, metal: 12000, mineral: 8000, energy: 10, turns: 8, workers: 10000 } }),
    Medical_Centre: new dgStructure('Medical Centre', { order: 8, require: { ground: 2, metal: 21000, mineral: 14000, energy: 10, turns: 10, workers: 20000 } }),
    Hospital: new dgStructure('Hospital', { order: 9, require: { ground: 2, metal: 36000, mineral: 24000, energy: 20, turns: 16, workers: 40000 } }),

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
