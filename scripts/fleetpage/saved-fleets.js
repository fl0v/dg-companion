/**
 * Saves multiple fleets together to generate a combined total
 * 
 * @TODO leverage chrome.storage.session thru service workers https://developer.chrome.com/docs/extensions/reference/api/storage
 */
class SavedFleets {

    storageKey = 'savedFleets';

    turn = currentTurn();
    totalFleet = new dgFleet('Total');
    allFleets = {};
    countFleets = 0;

    constructor() {
        this.loadFromStorage();
    }

    addFleet(addFleet, save) {
        let reset = false;
        if (this.allFleets[addFleet.id]) {
            reset = true;
        } else {
            this.totalFleet.addFleet(addFleet);
            this.countFleets++;
        }
        this.allFleets[addFleet.id] = addFleet;
        reset && this.buildTotalFleet();
        save && this.saveToStorage();
    }

    buildTotalFleet() {
        this.totalFleet = new dgFleet('Total');
        Object.values(this.allFleets).forEach((f) => this.totalFleet.addFleet(f));
    }

    removeById(id, save) {
        if (this.allFleets[id]) {
            delete this.allFleets[id];
            this.countFleets--;
            this.buildTotalFleet();
            save && this.saveToStorage();
        }
    }

    loadFromStorage() {
        const allFleets = JSON.parse(localStorage.getItem(this.storageKey));
        Object.values(allFleets).forEach((f) => this.addFleet(new dgFleet(f.name, f)));
    }

    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.allFleets));
    }

    exportText() {
        this.totalFleet.sortComposition();
        const data = [];
        data.push(pc(' Fleets ready / ' + this.turn + ' ', 25, '='));
        data.push(
            Object.values(this.allFleets)
                .reduce((carry, f) => carry + '[' + f.name + '] ' + f.status, '')
        );
        data.push(ps('', 25, '-'));
        this.totalFleet.composition
            //.filter()
            .forEach((s) => data.push(pe(s.name, 13) + ps(s.count, 12)));
        data.push(ps('', 25, '-'));
        data.push(pe('Score', 10) + ps(formatNumber(this.totalFleet.score), 15));
        data.push(pe('WF only', 10) + ps(formatNumber(this.totalFleet.compositionWfScore), 15));
        data.push(ps('', 25, '='));
        return data.join("\n");
    }

    exportXls() {
        const customOrder = [
            'Soldier',
            'Invasion Ship',
            'Fighter',
            'Bomber',
            'Frigate',
            'Destroyer',
            'Cruiser',
            'Battleship',
            'Worker',
        ];
        const ships = {};
        this.totalFleet.composition
            .forEach((s) => ships[s.name] = s.count);

        const data = [];
        customOrder.forEach((s) => data.push(ships[s] || 0));
        data.push(this.totalFleet.compositionWfScore);
        return data.join("\t"); // each tab will go to next cell
    }
}