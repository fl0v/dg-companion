
class NewsFleetScan extends NewsParser {
    fleets = []; // normal index
    players = []; // by id
    alliances = {}; // by alliance name because current account alliance has id 0 :(

    fleetsByPlayer = [];
    fleetsByEta = [];

    showFriendly = false;
    showAllied = false;
    showHostile = false;

    constructor(turn) {
        super(turn);
        this.type = NewsParser.TYPE_FLEET_SCAN;
    }

    parse(scanResult) {
        super.parse(scanResult);
        Array.from(scanResult.mobileList).forEach((item) => {
            const fl = new dgFleet(item.name, {
                id: item.id || 0,
                moveTurns: item.moveTurns || 0,
                score: item.score || 0,
            });
            item.player && fl.setPlayer(item.player);
            item.origin && fl.setOrigin(item.origin);
            item.destination && fl.setDestination(item.destination);
            fl.detectType(this.accountPlayer);
            this.showFriendly = this.showFriendly || fl.type === dgFleet.TYPE_FRIENDLY;
            this.showAllied = this.showAllied || fl.type === dgFleet.TYPE_ALLIED;
            this.showHostile = this.showHostile || fl.type === dgFleet.TYPE_HOSTILE;
            console.log('Fleet', fl.name, 'from', fl.origin.fullName(), 'to', fl.destination.fullName(), 'eta', fl.moveTurns, 'score', fl.score);

            // index all fleets
            this.fleets.push(fl);

            // index by player (used to lookup fleets by name, see findFleet)
            if (fl.player && fl.player.id) {
                this.players[fl.player.id] || (this.players[fl.player.id] = fl.player);
                this.fleetsByPlayer[fl.player.id] || (this.fleetsByPlayer[fl.player.id] = []);
                this.fleetsByPlayer[fl.player.id].push(fl);

                // build alliance list
                if (fl.player.alliance && fl.player.alliance.name) {
                    this.alliances[fl.player.alliance.name] || (this.alliances[fl.player.alliance.name] = fl.player.alliance);
                }
            }

            // index by eta
            this.fleetsByEta[fl.moveTurns] || (this.fleetsByEta[fl.moveTurns] = []);
            this.fleetsByEta[fl.moveTurns].push(fl);
        });
    }

    /**
     * Unfortunetly fleets with same name from same player will be grouped together
     */
    findFleet(playerName, fleetName) {
        const player = this.players.find((p) => p && (p.name === playerName));
        if (player && player.id && this.fleetsByPlayer[player.id]) {
            return this.fleetsByPlayer[player.id].find((f) => f && (f.name === fleetName));
        }
    }

    addFleetShips(playerName, fleetName, shipName, count) {
        const fleet = this.findFleet(playerName, fleetName);
        if (fleet) {
            fleet.addComposition(shipName, count);
        }
    }
}