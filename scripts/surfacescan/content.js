/**
 * Ads required soldiers + important buildings
 * @TODO add solderis from food on planet if has Army_Baraks
 * @TODO enforce structures solder
 */

const popPattern = /([\d,]+)\s+\/\s+([\d,]+)\s+\(([\d,]+)\s+available\)/; // will split population  data ex: '52,126 / 100,000 (47,126 available)'
const solPattern = /^([\d,]+)/; // will parse soldiers data ex: '52,126'
const requiredSoldiers = (workers, soldiers) => Math.ceil((workers / 15) + (soldiers * 1.5) + 1);

const important = [
    /Space_Tether/,
    /Hyperspace_Beacon/,
    /Jump_Gate/,
    /Comms_Satellite/,
    /Light_Weapons_Factory/,
    /([\d,]+)x\sArmy_Barracks/,
];

let planetInfo = {
    workers: 0,
    soldiers: 0,
    soldiersRequired: 0,
    soldiersMax: 0,
    housing: 0,
    summary: [], // ['JG', 'HB', '2xAB', 'COMMS']
};

// last #planetHeader in page (works on scan page and news page)
const scanContainer = Array.from(document.querySelectorAll('#planetHeader')).pop();
const scanHeader = scanContainer ? scanContainer.parentNode.querySelector('.header') : null; // scan result header

if (scanContainer && scanHeader) {
    scanContainer.querySelectorAll('.resource img').forEach((el) => {
        const resText = el.closest('.resource').innerText;
        const resType = el.getAttribute('title');
        if (resType == 'Workers' && popPattern.test(resText)) {
            const [, total, housing] = resText.match(popPattern);
            planetInfo.workers = parseValue(total);
            planetInfo.housing = parseValue(housing);
        } else if (resType == 'Soldiers' && solPattern.test(resText)) {
            const [, soldiers] = resText.match(solPattern);
            planetInfo.soldiers = parseValue(soldiers);
        }
    });
    planetInfo.soldiersRequired = requiredSoldiers(planetInfo.workers, planetInfo.soldiers);
    planetInfo.soldiersMax = requiredSoldiers(planetInfo.housing, planetInfo.soldiers);

    /**
     * Identify houseing capacity and JG, HB, AB
     */
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


    /**
     * Add info only if we have parsed workers or soldiers, otherwise is anot a surface scan
     */
    scanContainer.querySelector('.planetHeadSection:nth-child(3) .lightBorder .left').insertAdjacentHTML('beforebegin', `
            <div class="right neutral">
                <span class="required-soldier neutral">Soldiers required now: <b class="custom-accent">${formatNumberInt(planetInfo.soldiersRequired)}</b></span>
                <span class="housing neutral">(Max: <b class="custom-accent">${formatNumberInt(planetInfo.soldiersMax)}</b>)</span>
            </div>
        `);
    scanHeader.insertAdjacentHTML('beforeend', `
            <div class="right scan-summary">
                Importat: ${planetInfo.summary.join(', ')}
            </div>
        `);
}

