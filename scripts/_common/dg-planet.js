/**
 * requires common.js
 */
class dgPlanet {
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
        return `<a class="planet-system" href="#${this.id}" ${attributes}>${this.coordsSystem}</a>`;
    }

    linkCoords(attributes) {
        return `<a class="planet-coords" href="#${this.id}" ${attributes}>${this.coords}</a>`;
    }

    fullName() {
        return `${this.coords} ${this.name}`;
    }

}


class dgPlanetRating {
    ground;
    orbit;
    metal;
    mineral;
    food;
    energy;

    rating = {
        metal: 0,
        mineral: 0,
        food: 0,
        energy: 0,
        average: 0,
    };

    /**
     * Optimal planet
     */
    reference = {
        ground: 80,
        orbit: 60,
        metal: 100,
        mineral: 100,
        food: 100,
        energy: 100,
    };

    weight = {
        metal: 1.0,
        mineral: 1.0,
        food: 1.2,
        energy: 0.8,
    };

    constructor(data) {
        data && mergeData(this, data);
        this.init();
    }

    init(indexed) {
        const baseEnergyScore = this.energy * this.orbit;
        const energyReference = this.reference.energy * this.reference.orbit;
        const energyIndex = baseEnergyScore / energyReference;

        const baseFoodScore = this.food * this.orbit;
        const foodReference = this.reference.food * this.reference.orbit;
        const foodIndex = baseFoodScore / foodReference;

        const baseMetalScore = this.metal * this.ground;
        const baseMineralScore = this.mineral * this.ground;

        /*
         * normalized values: 100 = reference value
         */
        this.rating.energy = baseEnergyScore / this.reference.orbit;
        this.rating.food = baseFoodScore / this.reference.orbit * (indexed ? energyIndex : 1);
        this.rating.metal = baseMetalScore / this.reference.ground * (indexed ? energyIndex : 1);
        this.rating.mineral = baseMineralScore / this.reference.ground * (indexed ? energyIndex : 1);
        /*
         * weighted average
         */
        this.rating.average = 0;
        this.rating.average += this.rating.metal * this.weight.metal;
        this.rating.average += this.rating.mineral * this.weight.mineral;
        this.rating.average += this.rating.food * this.weight.food;
        this.rating.average += this.rating.energy * this.weight.energy;
        this.rating.average = this.rating.average / 4;
    }

}