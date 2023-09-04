/**
 * Anything that can be build on a planet
 */

class dgStructure {
    id;
    name;
    score = 0;
    order = 9999;

    constructor(name, options) {
        this.name = name;
        this.id = getItemId(name);
        mergeData(this, options);
    }
}

const dgStructuresMeta = {
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
