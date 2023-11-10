/**
 * Adds required soldiers + important buildings, also ranks planet value using available space and resource %
 * @TODO add solders from food on planet if has Army_Baraks
 * @TODO enforce structures order
 * @TODO add scan results to storage + export csv of all stored scans
 */
(function () {

    const popPattern = /([\d,]+)\s+\/\s+([\d,]+)\s+\(([\d,]+)\s+available\)/; // will split population  data ex: '52,126 / 100,000 (47,126 available)'
    const solPattern = /^([\d,]+)/; // will parse soldiers data ex: '52,126'
    const resPattern = /([\d]+)%/; // will parse percentage ex: '70%'
    const requiredSoldiers = (workers, soldiers) => Math.ceil((workers / 15) + (soldiers * 1.5) + 1);
    const formatPercent = (v) => String(parseFloat(v).toFixed(2)) + '%';

    const important = [
        /Space_Tether/,
        /Hyperspace_Beacon/,
        /Jump_Gate/,
        /Comms_Satellite/,
        /Light_Weapons_Factory/,
        /([\d,]+)x\sArmy_Barracks/,
    ];

    let planetInfo = {
        ground: 0,
        orbit: 0,
        metal: 0,
        mineral: 0,
        food: 0,
        energy: 0,

        workers: 0,
        soldiers: 0,
        soldiersRequired: 0,
        soldiersMax: 0,
        housing: 0,

        summary: [], // ['JG', 'HB', '2xAB', 'COMMS']
    };

    // last #planetHeader in page (works on scan page and news page)
    const scanContainer = Array.from(document.querySelectorAll('#planetHeader')).pop();
    if (scanContainer) {
        /*
         * Extract general data about scanned planet: workers, solders, ground, orbit, resources
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
                planetInfo.orbit = parseInt(resText, 10); // @TODO add structures ocupied space
            } else if (resType.match(/Ground/)) {
                planetInfo.ground = parseInt(resText, 10); // @TODO add structures ocupied space
            }
        });
        planetInfo.soldiersRequired = requiredSoldiers(planetInfo.workers, planetInfo.soldiers);
        planetInfo.soldiersMax = requiredSoldiers(planetInfo.housing, planetInfo.soldiers);

        scanContainer.querySelectorAll('.resourceRow:last-child .data').forEach((el) => {
            const resText = el.innerText;
            const classList = el.classList;
            if (classList.contains('metal') && resPattern.test(resText)) {
                const [, rating] = resText.match(resPattern);
                planetInfo.metal = parseValue(rating);
            } else if (classList.contains('mineral') && resPattern.test(resText)) {
                const [, rating] = resText.match(resPattern);
                planetInfo.mineral = parseValue(rating);
            } else if (classList.contains('food') && resPattern.test(resText)) {
                const [, rating] = resText.match(resPattern);
                planetInfo.food = parseValue(rating);
            } else if (classList.contains('energy') && resPattern.test(resText)) {
                const [, rating] = resText.match(resPattern);
                planetInfo.energy = parseValue(rating);
            }
        });


        /*
         * Add info in page
         */
        if (planetInfo.metal > 0) {
            const rank = new dgPlanetRank(planetInfo);
            rank.initRank();
            scanContainer.querySelector('.planetHeadSection:nth-child(3) .lightBorder .left').insertAdjacentHTML('beforebegin', `
                <div class="right neutral">
                    <span class="required-soldier neutral">Soldiers required now: <b class="custom-accent">${formatNumberInt(planetInfo.soldiersRequired)}</b></span>
                    <span class="housing neutral">(Max: <b class="custom-accent">${formatNumberInt(planetInfo.soldiersMax)}</b>)</span>
                </div>
            `);

            const imgContainer = scanContainer.querySelector('#planetImage');
            if (imgContainer) {
                imgContainer.insertAdjacentHTML('beforeend', `
                    <span class="planet-rank">
                        <b class="custom-accent">${formatPercent(rank.rank.average)}</b>
                    </span>    
                `);
            }
        }
    }


    /*
     * Check structures and add the summary (houseing capacity, JG, HB, AB)
     */
    const scanHeader = scanContainer ? scanContainer.parentNode.querySelector('.header') : null; // scan result header
    if (scanHeader) {
        planetInfo.summary = Array.from(scanContainer.parentNode.querySelectorAll('.entry')).reduce((carry, el) => {
            const txt = el.innerText;
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



        scanHeader.insertAdjacentHTML('beforeend', `
            <div class="right scan-summary">
                Importat: ${planetInfo.summary.join(', ')}
            </div>
        `);
    }


})();

