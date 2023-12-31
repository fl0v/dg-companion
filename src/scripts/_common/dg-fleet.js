class dgFleet {

    static TYPE_FRIENDLY = 'friendly';
    static TYPE_ALLIED = 'allied';
    static TYPE_HOSTILE = 'hostile';
    static TYPE_NEUTRAL = 'neutral';

    /**
     * For now it is used in fleet scan to enfore one common order for all listings
     */
    static SHIPS_ORDER = ['Fighter', 'Bomber', 'Frigate', 'Destroyer', 'Cruiser', 'Battleship', 'Hulk', 'Trader', 'Merchant', 'Freighter', 'Invasion Ship'];

    id;
    name = '';
    status = '';
    moveTurns;
    hasShips = false;
    score = 0; // on radar
    forcedScore = false;
    type = dgFleet.TYPE_NEUTRAL;

    player = {
        id: 0,
        name: '',
        alliance: {
            id: 0,
            name: '',
            tag: '',
        },
    };
    origin = new dgPlanet();
    destination = new dgPlanet();
    composition = []; // [{name:'', count:0, score:0},...]
    compositionWfScore = 0; // actual score

    constructor(name, options) {
        this.setName(name);
        mergeData(this, options);
    }

    setScore(score) {
        this.forcedScore = true;
        this.score = score;
    }

    setName(name) {
        this.name = name;
    }

    setStatus(status) {
        this.status = status;
    }

    setPlayer(data) {
        if (data && data.name) {
            mergeData(this.player, data, true);
        }
    }

    setOrigin(data) {
        if (data && data.coordinates) {
            this.origin = new dgPlanet(data.coordinates.join('.') + ' ' + (data.name || ''));
        }
    }

    setDestination(data) {
        if (data && data.coordinates) {
            this.destination = new dgPlanet(data.coordinates.join('.') + ' ' + (data.name || ''));
        }
    }

    addShip(shipName, shipCount, score) {
        const idx = this.composition.findIndex((s) => s && (s.name === shipName));
        score || (score = getItemScoreByName(shipName) * shipCount);
        if (idx > -1) {
            this.composition[idx].count += shipCount;
            this.composition[idx].score += score;
        } else {
            this.composition.push({
                name: shipName,
                count: shipCount,
                score: score,
            });
        }
        if (getItemByName(shipName).warfleet) {
            this.compositionWfScore += score;
        }
        if (!this.forcedScore) {
            this.score += score;
        }
        shipCount > 0 && (this.hasShips = true);
    }

    detectType(playerAccount) {
        if (playerAccount && playerAccount.id) {
            if (this.player.id === playerAccount.id) {
                this.type = dgFleet.TYPE_FRIENDLY;
            } else if (
                playerAccount.alliance
                && playerAccount.alliance.name
                && this.player.alliance.name === playerAccount.alliance.name
            ) {
                this.type = dgFleet.TYPE_ALLIED;
            } else {
                this.type = dgFleet.TYPE_HOSTILE;
            }
        }
    }

    isFriendly() { return this.type === dgFleet.TYPE_FRIENDLY; }
    isAllied() { return this.type === dgFleet.TYPE_ALLIED; }
    isHostile() { return this.type === dgFleet.TYPE_HOSTILE; }

    addFleet(fleet) {
        this.addComposition(fleet.composition);
    }

    addComposition(composition) {
        composition.forEach((s) => this.addShip(s.name, s.count, s.score));
    }

    sortComposition() {
        dgFleet.sortShips(this.composition);
    }

    getUrl = () => dgFleet.fleetUrl(this.id);

    /**
     * Only used to enforce a normalised order of ships when we export/display fleet compositions
     */
    static sortShips(composition) {
        const index = Object.fromEntries(Object.entries(dgFleet.SHIPS_ORDER).map(a => a.reverse()))
        composition.sort((a, b) => {
            const aOrder = parseInt(index[a.name] || 9999, 10);
            const bOrder = parseInt(index[b.name] || 9999, 10);
            return (aOrder > bOrder) - (aOrder < bOrder);
        });
    }

    static fleetUrl = (id) => `/fleet/${id}/`;
}