
class ScanProcessorFactory {
    static factory(type, turn) {
        switch (type) {
            case ScanProcessor.TYPE_RESOURCE_SCAN:
                return new ResourceScanProcessor(turn);
                break;

            case ScanProcessor.TYPE_SURFACE_SCAN:
                return new SurfaceScanProcessor(turn);
                break;

            case ScanProcessor.TYPE_FLEET_SCAN:
                return new FleetScanProcessor(turn);
                break;

            default:
                console.log('Unrecognised scan type', type);
                return new ScanProcessor(turn);
                break;
        };
    }
}

class ScanProcessor {
    static TYPE_RESOURCE_SCAN = 'Resource_Scan';
    static TYPE_SURFACE_SCAN = 'Surface_Scan';
    static TYPE_FLEET_SCAN = 'Fleet_Scan';

    static STRUCTURES_GROUP = 3;
    static RESOURCES_GROUP = 9;
    static COLONISTS_GROUP = 7;

    turn;
    type;
    planet = new dgPlanet();
    playerInfo = {
        id: 0,
        name: '',
        alliance: {
            id: 0,
            name: '',
            tag: '',
        },
    };

    lookup = {
        '8': 'ground',
        '9': 'orbit',
        '15': 'metal',
        '16': 'mineral',
        '17': 'food',
        '18': 'energy',
    };

    canExport = false;

    constructor(turn) {
        this.turn = turn;
    }

    parse(scanResult) {
        console.log('scanResult', scanResult);
        this.planet = new dgPlanet(scanResult.coordinates.join('.') + ' ' + scanResult.name);
        mergeData(this.playerInfo, scanResult.playerInfo, true);
    }

    exportXls() {
        alert('not supported');
    }

    exportText() {
        alert('not supported');
    }
}

class ResourceScanProcessor extends ScanProcessor {
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
        this.type = ScanProcessor.TYPE_RESOURCE_SCAN;
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

class SurfaceScanProcessor extends ResourceScanProcessor {

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
        this.type = ScanProcessor.TYPE_SURFACE_SCAN;
    }

    parse(scanResult) {
        super.parse(scanResult);
        Array.from(scanResult.mobileUnitCount.unitList).forEach((item) => {
            if (item.groupId === ScanProcessor.STRUCTURES_GROUP) {
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
            pe('Required max:', 14) + ps(formatNumberInt(this.requiredSoldiersMax), 9),
            ps('', 23, '-'),
            `Summary: ${this.summary.join(', ')}`,
            ps('', 23, '='),
        ];
        return "\n" + data.join("\n") + "\n";
    }
}


class FleetScanProcessor extends ScanProcessor {
    fleetsByPlayer = {};
    fleetsByAlliance = {};
    fleetsByEta = {};

    // indexes
    ships = []; // all ships present in any fleet to build consistent summary
    players = {};
    alliances = {};

    constructor(turn) {
        super(turn);
        this.type = ScanProcessor.TYPE_FLEET_SCAN;
    }

    parse(scanResult) {
        super.parse(scanResult);
        Array.from(scanResult.mobileList).forEach((item) => {
            // console.log('item', item);
            const alliance = item.player.alliance ? [
                item.player.alliance.id,
                '[' + item.player.alliance.tag + ']',
                item.player.alliance.name,
            ] : [];
            console.log('ETA', item.moveTurns, 'name', item.name, 'total score', item.score, 'owner', item.player.id, item.player.name, 'alliance', alliance.join(' '));
        });
    }

    addFleet(name, playerId, playerName, allianceTag, allianceName, eta, fleet) {
        this.aliances[allianceTag] = allianceName;
        this.players[playerId] = playerName;

        this.fleetsByPlayer[playerId] || (this.fleetsByPlayer[playerId] = []);
        this.fleetsByPlayer[playerId].push(fleet);

        this.fleetsByAlliance[allianceTag] || (this.fleetsByAlliance[allianceTag] = []);
        this.fleetsByAlliance[allianceTag].push(fleet);

        this.fleetsByEta[eta] || (this.fleetsByEta[eta] = []);
        this.fleetsByEta[eta].push(fleet);
    }
}