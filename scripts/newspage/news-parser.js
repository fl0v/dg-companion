
class NewsParserFactory {
    static factory(type, turn) {
        switch (type) {
            case NewsParser.TYPE_RESOURCE_SCAN:
                return new NewsResourceScan(turn);
                break;

            case NewsParser.TYPE_SURFACE_SCAN:
                return new NewsSurfaceScan(turn);
                break;

            case NewsParser.TYPE_FLEET_SCAN:
                return new NewsFleetScan(turn);
                break;

            case NewsParser.TYPE_INVADE_PLANET:
                return new NewsInvadePlanet(turn);
                break;

            default:
                console.log('Unrecognised scan type', type);
                return new NewsParser(turn);
                break;
        };
    }
}


class NewsParser {
    static TYPE_RESOURCE_SCAN = 'Resource_Scan';
    static TYPE_SURFACE_SCAN = 'Surface_Scan';
    static TYPE_FLEET_SCAN = 'Fleet_Scan';
    static TYPE_INVADE_PLANET = 'Invade_Planet';

    static STRUCTURES_GROUP = 3;
    static RESOURCES_GROUP = 9;
    static COLONISTS_GROUP = 7;

    turn;
    type;
    planet = new dgPlanet();
    /** 
     * player from scan info
     */
    playerInfo = {
        id: 0,
        name: '',
        alliance: {
            id: 0,
            name: '',
            tag: '',
        },
    };
    /**
     * player from current session
     */
    accountPlayer = {
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
        mergeData(this.accountPlayer, getJsonPlayerData(), true);
    }

    parse(scanResult) {
        console.log('scan', this.type, 'result', scanResult);
        if (scanResult && scanResult.playerInfo) {
            this.initPlayer(scanResult.playerInfo);
            this.initPlanet(scanResult);
        } else if (scanResult && scanResult.location && scanResult.location.playerInfo) {
            this.initPlayer(scanResult.location.playerInfo);
            this.initPlanet(scanResult.location);
        }
    }

    initPlanet(data) {
        if (data && data.coordinates) {
            this.planet = new dgPlanet(data.coordinates.join('.') + ' ' + (data.name || ''));
        }
    }

    initPlayer(data) {
        if (data && data.name) {
            mergeData(this.playerInfo, data, true);
        }
    }

    exportXls() {
        alert('not supported');
    }

    exportText() {
        alert('not supported');
    }
}
