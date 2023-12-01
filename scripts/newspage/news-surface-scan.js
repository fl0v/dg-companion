
/**
 * @TODO check 'CreatingSoldier' from jsonPageData, it exposes training activity on enemy planet
 */
class NewsSurfaceScan extends NewsResourceScan {

    totals = {
        metal: 0,
        mineral: 0,
        food: 0,
        energy: 0,
        worker: 0,
        occupiedWorker: 0,
        soldier: 0,
    };
    houseingCapacity = 0;
    requiredSoldiers = 0;
    requiredSoldiersMax = 0;
    structures = [];
    summary = [];
    extra = [];
    importantStructures = [
        41, // Space_Tether,
        'Hyperspace_Beacon',
        'Jump_Gate',
        39, // Comms_Satellite
        47, // Light_Weapons_Factory
        51, // Army_Barracks
    ];

    constructor(turn) {
        super(turn);
        this.type = NewsParser.TYPE_SURFACE_SCAN;
    }

    parse(scanResult) {
        super.parse(scanResult);
        Array.from(scanResult.mobileUnitCount.unitList).forEach((item) => {
            if (item.groupId === NewsParser.STRUCTURES_GROUP) {
                this.structures.push(`${item.amount}x ${item.name}`);
                if (this.importantStructures.includes(item.id) || this.importantStructures.includes(item.name)) {
                    this.summary.push(item.name);
                }
                this.canExport = true;
            } else {
                const name = this.lookup[item.id] || lcfirst(item.name);
                this.totals[name] = item.amount;
                this.canExport = true;
            }
        });
        this.totals.worker += this.totals.occupiedWorker; // 'Worker' is in fact available workers
        this.requiredSoldiers = this.getRequiredSoldiers(this.totals.worker, this.totals.soldier);
        // @TODO add space ocupied by structures to total space (ground and orbit)
        this.planetRating = null; //new dgPlanetRating(this.stats); // with updated ground and orbit

    }

    setHouseingCapacity(houseingCapacity) {
        this.houseingCapacity = houseingCapacity;
        this.requiredSoldiersMax = this.getRequiredSoldiers(this.houseingCapacity, this.totals.soldier);
    }

    getRequiredSoldiers = (workers, soldiers) => Math.ceil((workers / 15) + (soldiers * 1.5) + 1);

    exportXls() {
        const data = [
            this.planet.coords,
            this.playerInfo.name + ' [' + this.playerInfo.alliance.tag + ']',
            '', // claim
            this.stats.metal + '%,  ' + formatNumberInt(this.totals.metal),
            this.stats.mineral + '%,  ' + formatNumberInt(this.totals.mineral),
            this.stats.food + '%,  ' + formatNumberInt(this.totals.food),
            this.stats.energy + '%,  ' + formatNumberInt(this.totals.energy),
            this.totals.worker,
            this.totals.soldier,
            this.requiredSoldiers,
            this.requiredSoldiersMax,
            this.turn,
            '(' + this.totals.occupiedWorker + ' occupied workers) ' + this.summary.join(', '),
            this.houseingCapacity,
        ];
        return data.join("\t"); // tabs will go to next cell
    }

    exportText() {
        const data = [
            ps(` Turn ${this.turn}`, 23, '='),
            this.planet.coords + ' ' + this.planet.name,
            `Owner: ${this.playerInfo.name} [${this.playerInfo.alliance.tag}]`,
            pc(' ' + this.type + ' ', 23, '-'),
            pe('Metal:', 9) + ps(formatNumberInt(this.totals.metal), 14) + ' (' + this.stats.metal + '%)',
            pe('Mineral:', 9) + ps(formatNumberInt(this.totals.mineral), 14) + ' (' + this.stats.mineral + '%)',
            pe('Food:', 9) + ps(formatNumberInt(this.totals.food), 14) + ' (' + this.stats.food + '%)',
            pe('Energy:', 9) + ps(formatNumberInt(this.totals.energy), 14) + ' (' + this.stats.energy + '%)',
            ps('', 23, '-'),
            pe('Ground:', 14) + ps(this.stats.ground, 9),
            pe('Orbit:', 14) + ps(this.stats.orbit, 9),
            //pe('Rating:', 14) + ps(formatNumber(this.planetRating.rating.average), 9), // useless because th ground/oribt is not total
            ps('', 23, '-'),
            pe('Workers:', 14) + ps(formatNumberInt(this.totals.worker), 9),
            pe('Occupied:', 14) + ps(formatNumberInt(this.totals.occupiedWorker), 9),
            pe('Soldiers:', 14) + ps(formatNumberInt(this.totals.soldier), 9),
            pe('Required:', 14) + ps(formatNumberInt(this.requiredSoldiers), 9),
            ps('', 23, '-'),
            pe('Workers max:', 14) + ps(formatNumberInt(this.houseingCapacity), 9),
            pe('Required max:', 14) + ps(formatNumberInt(this.requiredSoldiersMax), 9),
            ps('', 23, '-'),
            `Summary: ${this.summary.join(', ')}`,
            ps('', 23, '='),
        ];
        return "\n" + data.join("\n") + "\n";
    }
}
