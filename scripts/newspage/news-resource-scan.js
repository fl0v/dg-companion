
class NewsResourceScan extends NewsParser {
    stats = {
        metal: 0,
        mineral: 0,
        food: 0,
        energy: 0,
        ground: 0,
        orbit: 0,
    }
    planetRating = new dgPlanetRating();

    constructor(turn) {
        super(turn);
        this.type = NewsParser.TYPE_RESOURCE_SCAN;
    }

    parse(scanResult) {
        super.parse(scanResult);
        Array.from(scanResult.locationUnitCount.unitList).forEach((item) => {
            const name = this.lookup[item.id] || lcfirst(item.name);
            this.stats[name] = item.amount;
            this.canExport = true;
        });
        this.planetRating = new dgPlanetRating(this.stats);
    }

    exportXls() {
        const data = [
            this.planet.coords,
            this.playerInfo.id ? this.playerInfo.name + ' [' + this.playerInfo.alliance.tag + ']' : '', // claim
            this.stats.metal,
            this.stats.mineral,
            this.stats.food,
            this.stats.energy,
            this.stats.ground,
            this.stats.orbit,
            formatNumber(this.planetRating.rating.average),
        ];
        return data.join("\t"); // tabs will go to next cell
    }

    exportText() {
        const data = [];
        data.push(ps(` Turn ${this.turn}`, 23, '='));
        data.push(`${this.planet.coords} ${this.planet.name}`);
        data.push(ps('', 23, '-'));
        data.push(pe('Metal:', 14) + ps(this.stats.metal, 8) + '%');
        data.push(pe('Mineral:', 14) + ps(this.stats.mineral, 8) + '%');
        data.push(pe('Food:', 14) + ps(this.stats.food, 8) + '%');
        data.push(pe('Energy:', 14) + ps(this.stats.energy, 8) + '%');
        data.push(ps('', 23, '-'));
        data.push(pe('Ground:', 14) + ps(this.stats.ground, 9));
        data.push(pe('Orbit:', 14) + ps(this.stats.orbit, 9));
        data.push(pe('Rating:', 14) + ps(formatNumber(this.planetRating.rating.average), 9));
        data.push(ps('', 23, '='));
        return "\n" + data.join("\n") + "\n";
    }
}