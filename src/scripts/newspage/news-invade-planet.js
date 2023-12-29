
class NewsInvadePlanet extends NewsParser {
    stats = {
        metal: 0,
        mineral: 0,
        food: 0,
        research: 0,
    }

    constructor(turn) {
        super(turn);
        this.type = NewsParser.TYPE_INVADE_PLANET;
    }

    parse(scanResult) {
        super.parse(scanResult);
    }

    exportXls() {
        const data = [
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
        data.push(ps('', 23, '='));
        return "\n" + data.join("\n") + "\n";
    }
}