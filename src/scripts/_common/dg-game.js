/**
 * @see https://darkgalaxy.com/ for scheduled rounds
 */

class dgGame {
    name = '';
    url = 'https://www.darkgalaxy.com';
    signups;
    start;
    end;
    turnLength;

    constructor(name, options) {
        this.name = name;
        mergeData(this, options);
    }

    canSignup() {
        return this.signups && (new Date() > this.signups);
    }

    hasStarted() {
        return this.start && (new Date() > this.start);
    }

    hasEnded() {
        return this.end && (new Date() > this.end);
    }

    getTurn() {
        const ms = 1000 * 60 * 60;
        const now = new Date();
        return Math.floor((now - this.start) / ms);
    }

    getTurnsTotal() {
        const ms = 1000 * 60 * 60;
        return Math.floor((this.end - this.start) / ms);
    }

    getTurnsToGo() {
        return this.getTurnsTotal() - this.getTurn();
    }
}


const dgGamesMeta = [
    // new dgGame('Andromeda 1', {
    //     url: 'https://andromeda.darkgalaxy.com',
    //     signups: null,
    //     start: new Date('30 Jul 2023 18:00:00'),
    //     end: new Date(' 10 Sept 2023 18:00:00'),
    //     turnLength: 3600,
    // }),
    new dgGame('Andromeda 2', {
        url: 'https://andromeda.darkgalaxy.com',
        signups: new Date('1 Oct 2023 12:00:00'),
        start: new Date('29 Oct 2023 18:00:00'),
        end: new Date(' 17 Dec 2023 18:00:00'),
        turnLength: 3600,
    })
];
