/**
 * Total score by ETA/Alliance
 * 
 * @todo simulate combat action
 */
(function () {
    const jsonPageData = getJsonPageData();
    const supported = [
        NewsParser.TYPE_FLEET_SCAN,
    ];
    if (!supported.includes(jsonPageData.scanType)) {
        return;
    }

    const processor = NewsParserFactory.factory(jsonPageData.scanType, jsonPageData.turnNumber);
    processor.parse(jsonPageData.scanResult || jsonPageData);
    console.log('parsed', processor);

    const fleetHeader = Array.from(document.querySelectorAll('#contentBox .header')).find((el) => el.innerText === 'Fleet List');
    if (!fleetHeader) {
        return;
    }
    fleetHeader.parentNode.classList.add('fleet-list'); // to enable some style fixes


    /*
     * extract fleet composition because is not available yet in jsonPageData
     */
    const allShipsInScan = []; // Keep a global list of all ships in scan so we present a normalised sorted list    
    const allFleets = Array.from(fleetHeader.parentNode.querySelectorAll(':scope > .left'));
    allFleets.forEach((el) => {
        const fleetShipsEl = Array.from(el.querySelectorAll('table tr'));
        const fleetEl = el.querySelector(':scope > div .left b');
        const playerEl = el.querySelector('.playerName');
        if (!fleetEl || !fleetShipsEl.length) {
            return;
        }

        const playerName = playerEl.innerText.trim();
        const fleetName = fleetEl.innerText.trim();
        const fleetComp = [];
        fleetShipsEl.forEach((el) => {
            // each ship
            const cells = el.querySelectorAll('td');
            const ship = {
                name: cells[0].innerText.trim(),
                count: parseValue(cells[1].innerText),
            };
            processor.addFleetShips(playerName, fleetName, ship.name, ship.count);
            allShipsInScan.includes(ship.name) || allShipsInScan.push(ship.name);
        });

        const fleetModel = processor.findFleet(playerName, fleetName);
        if (fleetModel) {
            const footer = [
                `<div class="score-container neutral left">
                    score <b title="actual warfleet">${fleetModel.compositionWfScore.toFixed(2)}</b> / <b title="on radar">${fleetModel.score.toFixed(2)}</b>
                </div>`,
                fleetModel.moveTurns > 0 && fleetModel.origin.isValid() ? `<div class="score-container neutral right">coming from <b>${fleetModel.origin.fullName()}</b></div>` : '',
            ];
            el.insertAdjacentHTML('beforeend', footer.join(''));
        }
    });

    /*
     * Prepare totals to be used in templates
     */

    const groupFleetsByAlliance = (fleets) => {
        const shipsInRow = []; // normalise the list of ships for all blocks on the same row
        const totalsByAlliance = [];
        if (processor.showFriendly) {
            const friendlyFleet = new dgFleet(processor.accountPlayer.name, { type: dgFleet.TYPE_FRIENDLY });
            fleets.filter((f) => f.isFriendly())
                .forEach((f) => friendlyFleet.addFleet(f));
            friendlyFleet.composition.forEach((s) => shipsInRow.includes(s.name) || shipsInRow.push(s.name));
            totalsByAlliance.push(friendlyFleet);
        }
        if (processor.showAllied) {
            const alliedFleet = new dgFleet(processor.accountPlayer.alliance.name, { type: dgFleet.TYPE_ALLIED });
            fleets.filter((f) => f.isAllied())
                .forEach((f) => alliedFleet.addFleet(f));
            alliedFleet.composition.forEach((s) => shipsInRow.includes(s.name) || shipsInRow.push(s.name));
            totalsByAlliance.push(alliedFleet);
        }
        if (processor.showHostile) {
            // add hostile alliances
            Object.values(processor.alliances)
                .filter((a) => a.name !== processor.accountPlayer.alliance.name) // for some reason current player is missing alliance id :(
                .forEach((a) => {
                    const allianceFleet = new dgFleet(a.name, { type: dgFleet.TYPE_HOSTILE });
                    fleets.filter((f) => f.isHostile() && f.player.alliance.name === a.name)
                        .forEach((f) => allianceFleet.addFleet(f));
                    allianceFleet.composition.forEach((s) => shipsInRow.includes(s.name) || shipsInRow.push(s.name));
                    totalsByAlliance.push(allianceFleet);
                });
            // add non-aligned players
            processor.players
                .filter((p) => p.alliance.name.length === 0) // without alliance                            
                .forEach((p) => {
                    if (processor.accountPlayer.alliance.name.length === 0 && processor.accountPlayer.id !== p.id) {
                        return; // if current player has no alliance then make sure is skipped in hostiles iteration
                    }
                    const playerFleet = new dgFleet(p.name, { type: dgFleet.TYPE_HOSTILE });
                    fleets.filter((f) => f.isHostile() && f.player.id === p.id)
                        .forEach((f) => playerFleet.addFleet(f));
                    playerFleet.composition.forEach((s) => shipsInRow.includes(s.name) || shipsInRow.push(s.name));
                    totalsByAlliance.push(playerFleet);
                });
        }
        // add missing ships so its easy to compare groupedfleets
        totalsByAlliance.forEach((f) => {
            shipsInRow.forEach((ship) => f.addShip(ship, 0, 0))
        });
        return totalsByAlliance;
    };

    const totalsByEta = [
        {
            name: 'Total',
            grouped: groupFleetsByAlliance(processor.fleets),
        }
    ];
    processor.fleetsByEta.forEach((fleets, eta) => {
        totalsByEta.push({
            name: 'ETA ' + eta,
            grouped: groupFleetsByAlliance(fleets)
        });
    });

    fleetHeader.parentNode.insertAdjacentHTML('beforebegin', `
        <div class="seperator"></div>
        <div id="fleetScanSummary" class="lightBorder ofHidden opacDarBackground">
            <div class="header border pageTitle">
                Fleet Summary
            </div>
        </div>
    `);
    const summaryContainer = document.querySelector('#fleetScanSummary');

    totalsByEta.forEach((t) => {
        summaryContainer.insertAdjacentHTML('beforeend', `
            <div class="lightBorder ofHidden opacDarkBackground fleetscanTotals">
                ${fleetScanPageRowTemplate(t.name, t.grouped)}
            </div>
        `);
    });

})();


