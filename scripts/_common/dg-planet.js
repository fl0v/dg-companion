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
        return `<a class="system" href="#${this.id}" ${attributes}>${this.coordsSystem}</a>`;
    }

}


class dgPlanetRating {
    groundSpace;
    orbitSpace;
    metalRate;
    mineralRate;
    foodRate;
    energyRate;

    rating = {
        energy: 0,
        food: 0,
        metal: 0,
        mineral: 0,
        average: 0,
    };

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

    initRating() {
        const baseEnergyScore = this.energyRate * this.orbitSpace;
        const energyReference = this.reference.energy * this.reference.orbit;
        const energyIndex = baseEnergyScore / energyReference;

        const baseFoodScore = this.foodRate * this.orbitSpace * energyIndex;
        const baseMetalScore = this.metalRate * this.groundSpace * energyIndex;
        const baseMineralScore = this.mineralRate * this.groundSpace * energyIndex;
        /*
         * normalized values: 100 = reference value
         */
        this.rating.energy = baseEnergyScore / this.reference.orbit;
        this.rating.food = baseFoodScore / this.reference.orbit;
        this.rating.metal = baseMetalScore / this.reference.ground;
        this.rating.mineral = baseMineralScore / this.reference.ground;
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