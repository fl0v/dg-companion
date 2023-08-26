const shipPattern = /([\d,]+)x\s(.*)/; // 6,123x Fighter


const realShips = ['Fighter', 'Bomber', 'Frigate', 'Destroyer', 'Cruiser', 'Battleship'];

/**
 * @see https://manual.darkgalaxy.com/reference/list-of-colonists
 * @see https://manual.darkgalaxy.com/reference/list-of-ships
 */
const score = {
    'Fighter': 0.3,
    'Bomber': 0.99,
    'Frigate': 4.38,
    'Destroyer': 22.5,
    'Cruiser': 55.2,
    'Battleship': 378,
    'Outpost Ship': 31.2,
    'Invasion Ship': 31.2,
    'Trader': 38.88,
    'Freighter': 10.56,
    'Holo Projector': 0.456,
    'Holo Fighter': 0.075,
    'Holo Bomber': 0.293,
    'Holo Frigate': 1.505,
    'Holo Destroyer': 9.375,
    'Holo Cruiser': 25.7,
    'Holo Battleship': 193.5,
    'Soldier': 0.003,
    'Worker': 0.001,
};

const scoreTemplate = (unitScore, label) => `<span class="score neutral right"><em>${formatNumber(unitScore.toFixed(2))}</em> ${label}</span>`


const [totalScore, wfScore] = Array.from(document.querySelectorAll('#contentBox .fleetRight .entry'))
    .reduce((carry, item) => {
        //console.log('item', item.innerText);
        if (shipPattern.test(item.innerText)) {
            const [, cnt, name] = item.innerText.match(shipPattern);
            const ss = parseValue(cnt) * getMetaScoreByName(name);
            //console.log('cnt', cnt, 'name', name, ss);
            carry[0] += ss;
            if (getMetaByName(name).warfleet) {
                carry[1] += ss;
            }
            item.querySelector('div:last-child').insertAdjacentHTML('beforeend', `${scoreTemplate(ss, 'score')}`);
        }
        return carry;
    }, [0, 0]);
document.querySelector('#contentBox .right.fleetRight')
    .insertAdjacentHTML('beforeend', `
        <div class="right ofHidden lightBorder opacDarkBackground seperator seperatorLeft fleetRight"> 
            <div class="header border">
                <img src="/images/buttons/construction.png" class="icon" width="28" height="29">
                Score
            </div> 
            <div class="entry opacBackground" style="line-height: 24px; padding: 4px"> 
                <span class="left">Warfleeet only</span>                 
                <span class="right">${scoreTemplate(wfScore, 'score')}</span> 
            </div> 
            <div class="entry opacLightBackground" style="line-height: 24px; padding: 4px"> 
                <span class="left">Total</span>                 
                <span class="right">${scoreTemplate(totalScore, 'score')}</span> 
            </div> 
       </div>
    `);

