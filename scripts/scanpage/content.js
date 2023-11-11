/**
 * Adds required soldiers + important buildings, also ranks planet value using available space and resource %
 * @TODO add solders from food on planet if has Army_Baraks
 * @TODO enforce structures order
 * @TODO add scan results to storage + export csv of all stored scans
 */
(function () {

    const popPattern = /([\d,]+)\s+\/\s+([\d,]+)\s+\(([\d,]+)\s+available\)/; // will split population  data ex: '52,126 / 100,000 (47,126 available)'
    const solPattern = /^([\d,]+)/; // will parse soldiers data ex: '52,126'
    const percentPattern = /^([\d]+)%$/; // will parse percentage ex: '70%'
    const amountPattern = /^([\d,]+)$/; // 52,126
    const requiredSoldiers = (workers, soldiers) => Math.ceil((workers / 15) + (soldiers * 1.5) + 1);

    const pe = (v, c, s) => String(v).padEnd(c, s || ' ');
    const ps = (v, c, s) => String(v).padStart(c, s || ' ');
    const statsXlxRow = (planetInfo) => {
        let cells = [];
        if (planetInfo.owner === 'This planet is unoccupied.') { // colo mode
            cells = [
                planetInfo.coords,
                '', // claim
                planetInfo.stats.metal,
                planetInfo.stats.mineral,
                planetInfo.stats.food,
                planetInfo.stats.energy,
                planetInfo.stats.ground,
                planetInfo.stats.orbit,
                formatNumber(planetInfo.rating.average),
            ];
        } else { // inv mode
            cells = [
                planetInfo.coords,
                planetInfo.owner,
                '', // claim
                planetInfo.stats.metal + '%,  ' + formatNumberInt(planetInfo.resources.metal),
                planetInfo.stats.mineral + '%,  ' + formatNumberInt(planetInfo.resources.mineral),
                planetInfo.stats.food + '%,  ' + formatNumberInt(planetInfo.resources.food),
                planetInfo.stats.energy + '%,  ' + formatNumberInt(planetInfo.resources.energy),
                formatNumberInt(planetInfo.workers),
                formatNumberInt(planetInfo.soldiers),
                formatNumberInt(planetInfo.soldiersRequired),
                planetInfo.turn,
                planetInfo.summary.join(', '),
            ];
        }
        return cells.join("\t");
    };
    const statsText = (planetInfo) => {
        const rows = [];
        rows.push(ps(` Turn ${planetInfo.turn}`, 23, '='));
        if (planetInfo.owner === 'This planet is unoccupied.') { // colo mode
            rows.push(`Planet: ${planetInfo.coords} Uninhabited`);
            rows.push(ps('', 23, '-'));
            rows.push(pe('Metal:', 14) + ps(planetInfo.stats.metal, 8) + '%');
            rows.push(pe('Mineral:', 14) + ps(planetInfo.stats.mineral, 8) + '%');
            rows.push(pe('Food:', 14) + ps(planetInfo.stats.food, 8) + '%');
            rows.push(pe('Energy:', 14) + ps(planetInfo.stats.energy, 8) + '%');
            rows.push(ps('', 23, '-'));
            rows.push(pe('Ground:', 14) + ps(planetInfo.stats.ground, 9));
            rows.push(pe('Orbit:', 14) + ps(planetInfo.stats.orbit, 9));
            rows.push(pe('Rating:', 14) + ps(formatNumber(planetInfo.rating.average), 9));
            rows.push(ps('', 23, '='));
        } else { // inv mode
            rows.push(`Planet: ${planetInfo.coords} ${planetInfo.name}`);
            rows.push(`Owner: ${planetInfo.owner}`);
            rows.push(ps('', 23, '-'));
            rows.push(pe('Metal:', 14) + ps(planetInfo.stats.metal, 8) + '%' + ps(formatNumberInt(planetInfo.resources.metal), 12));
            rows.push(pe('Mineral:', 14) + ps(planetInfo.stats.mineral, 8) + '%' + ps(formatNumberInt(planetInfo.resources.mineral), 12));
            rows.push(pe('Food:', 14) + ps(planetInfo.stats.food, 8) + '%' + ps(formatNumberInt(planetInfo.resources.food), 12));
            rows.push(pe('Energy:', 14) + ps(planetInfo.stats.energy, 8) + '%' + ps(formatNumberInt(planetInfo.resources.energy), 12));
            rows.push(ps('', 23, '-'));
            rows.push(pe('Ground:', 14) + ps(planetInfo.stats.ground, 9));
            rows.push(pe('Orbit:', 14) + ps(planetInfo.stats.orbit, 9));
            rows.push(pe('Rating:', 14) + ps(formatNumber(planetInfo.rating.average), 9));
            rows.push(ps('', 23, '-'));
            rows.push(pe('Workers:', 14) + ps(formatNumberInt(planetInfo.workers), 9));
            rows.push(pe('Soldiers:', 14) + ps(formatNumberInt(planetInfo.soldiers), 9));
            rows.push(pe('Soldiers req:', 14) + ps(formatNumberInt(planetInfo.soldiersRequired), 9));
            rows.push(`Structures: ${planetInfo.structures.join(', ')}`);
            rows.push(ps('', 23, '='));
        }
        return "\n" + rows.join("\n") + "\n";
    };

    const planetInfo = {
        /*
         * Meta
         */
        turn: currentTurn(),
        coords: '',
        name: '',
        owner: '',

        /*
         * Scan data
         */
        workers: 0,
        soldiers: 0,
        stats: {
            ground: 0,
            orbit: 0,
            metal: 0,
            mineral: 0,
            food: 0,
            energy: 0,
        },
        resources: {
            metal: 0,
            mineral: 0,
            food: 0,
            energy: 0,
        },
        structures: [], // all
        summary: [], // important structures ['JG', 'HB', '2xAB', 'COMMS']

        /*
         * Compiled data
         */
        housing: 0,
        soldiersRequired: 0,
        soldiersMax: 0,
        rating: false,
        export: false,
    };

    const important = [
        /Space_Tether/,
        /Hyperspace_Beacon/,
        /Jump_Gate/,
        /Comms_Satellite/,
        /Light_Weapons_Factory/,
        /([\d,]+)x\sArmy_Barracks/,
    ];

    // last #planetHeader in page (works on scan page and news page)
    const scanContainer = Array.from(document.querySelectorAll('#planetHeader')).pop();
    const planetName = scanContainer ? scanContainer.querySelector('.planetName') : null;
    const scanHeader = scanContainer ? scanContainer.parentNode.querySelector('.header') : null; // scan result header
    const ownerContainer = scanContainer ? scanContainer.querySelector('.planetHeadSection:nth-child(3)') : null;

    if (scanContainer) {
        planetInfo.coords = scanContainer.querySelector('.coords').innerText;
        planetInfo.name = planetName.innerText;
        planetInfo.owner = String(ownerContainer.innerText).replace(/Owner:\s/, '');

        /*
         * Workers, Soldiers, Orbit, Ground
         */
        scanContainer.querySelectorAll('.resource img').forEach((el) => {
            const resText = el.closest('.resource').innerText;
            const resType = el.getAttribute('title');
            if (resType.match(/Workers/) && popPattern.test(resText)) {
                const [, total, housing] = resText.match(popPattern);
                planetInfo.workers = parseValue(total);
                planetInfo.housing = parseValue(housing);
            } else if (resType.match(/Soldiers/) && solPattern.test(resText)) {
                const [, soldiers] = resText.match(solPattern);
                planetInfo.soldiers = parseValue(soldiers);
            } else if (resType.match(/Orbit/)) {
                planetInfo.stats.orbit = parseInt(resText, 10); // @TODO add structures ocupied space
            } else if (resType.match(/Ground/)) {
                planetInfo.stats.ground = parseInt(resText, 10); // @TODO add structures ocupied space
            }
        });
        planetInfo.soldiersRequired = requiredSoldiers(planetInfo.workers, planetInfo.soldiers);
        planetInfo.soldiersMax = requiredSoldiers(planetInfo.housing, planetInfo.soldiers);

        /*
         * Resources
         */
        scanContainer.querySelectorAll('.resourceRow .data').forEach((el) => {
            const resText = el.innerText;
            const classList = el.classList;
            if (classList.contains('metal')) {
                if (percentPattern.test(resText)) {
                    const [, val] = resText.match(percentPattern);
                    planetInfo.stats.metal = parseValue(val);
                } else if (amountPattern.test(resText)) {
                    const [, val] = resText.match(amountPattern);
                    planetInfo.resources.metal = parseValue(val);
                }
            } else if (classList.contains('mineral')) {
                if (percentPattern.test(resText)) {
                    const [, val] = resText.match(percentPattern);
                    planetInfo.stats.mineral = parseValue(val);
                } else if (amountPattern.test(resText)) {
                    const [, val] = resText.match(amountPattern);
                    planetInfo.resources.mineral = parseValue(val);
                }
            } else if (classList.contains('food')) {
                if (percentPattern.test(resText)) {
                    const [, val] = resText.match(percentPattern);
                    planetInfo.stats.food = parseValue(val);
                } else if (amountPattern.test(resText)) {
                    const [, val] = resText.match(amountPattern);
                    planetInfo.resources.food = parseValue(val);
                }
            } else if (classList.contains('energy')) {
                if (percentPattern.test(resText)) {
                    const [, val] = resText.match(percentPattern);
                    planetInfo.stats.energy = parseValue(val);
                } else if (amountPattern.test(resText)) {
                    const [, val] = resText.match(amountPattern);
                    planetInfo.resources.energy = parseValue(val);
                }
            }
        });

        /*
         * Structures
         */
        if (scanHeader) {
            planetInfo.summary = Array.from(scanContainer.parentNode.querySelectorAll('.entry')).reduce((carry, el) => {
                const txt = el.innerText;
                planetInfo.structures.push(txt);
                const matched = important.reduce((matched, pattern) => {
                    if (!matched && pattern.test(txt)) {
                        matched = true;
                    }
                    return matched;
                }, false);
                if (matched) {
                    carry.push(txt);
                }
                return carry;
            }, []);
        }

        /*
         * Add info: Planet rating
         */
        if (planetInfo.stats.metal > 0) {
            const rating = new dgPlanetRating(planetInfo.stats);
            planetInfo.rating = rating.rating;
            planetInfo.export = true;
            const imgContainer = scanContainer.querySelector('#planetImage');
            imgContainer && imgContainer.insertAdjacentHTML('beforeend', `
                <span class="planet-rank">
                    <b class="custom-accent" title="Planet rating">${formatNumber(planetInfo.rating.average)}</b>
                </span>    
            `);
        }

        /*
         * Add info: Req soldiers
         */
        if (planetInfo.workers > 0) {
            planetInfo.export = true;
            scanContainer.querySelector('.planetHeadSection:nth-child(3) .lightBorder .left').insertAdjacentHTML('beforebegin', `
                <div class="right neutral">
                    <span class="required-soldier neutral">Soldiers required now: <b class="custom-accent">${formatNumberInt(planetInfo.soldiersRequired)}</b></span>
                    <span class="housing neutral">(Max: <b class="custom-accent">${formatNumberInt(planetInfo.soldiersMax)}</b>)</span>
                </div>
            `);
        }

        /*
         * Add info: Important structures
         */
        if (planetInfo.summary.length > 0) {
            planetInfo.export = true;
            scanHeader.insertAdjacentHTML('beforeend', `
                <div class="right scan-summary">
                    Importat: ${planetInfo.summary.join(', ')}
                </div>
            `);
        }

        /*
         * Copy to cliboard
         */
        if (planetName && planetInfo.export) {
            planetName.insertAdjacentHTML('afterend', `
                <span class="left copyPaste">
                    <span class="xls"><i class="icon"></i> sheet</span>
                    <span class="chat"><i class="icon"></i> chat</span>
                </span>
            `);
            planetName.parentNode.querySelector('.copyPaste .xls').addEventListener('click', e => {
                e.preventDefault();
                navigator.clipboard.writeText(statsXlxRow(planetInfo));
                globalMessage('Data copied to cliboard!');
            });
            planetName.parentNode.querySelector('.copyPaste .chat').addEventListener('click', e => {
                e.preventDefault();
                navigator.clipboard.writeText(statsText(planetInfo));
                globalMessage('Data copied to cliboard!');
            });
        }

        console.log('scanned planet', planetInfo, statsText(planetInfo));
    }
})();

