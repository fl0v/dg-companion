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