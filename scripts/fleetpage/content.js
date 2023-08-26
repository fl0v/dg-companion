
const shipPattern = /([\d,]+)x\s(.*)/; // 6,123x Fighter
const scoreTemplate = (unitScore, label) => `
    <span class="score neutral right"><em>${formatNumber(unitScore.toFixed(2))}</em> ${label}</span>
`;

const [totalScore, wfScore] = Array.from(document.querySelectorAll('#contentBox .fleetRight .entry'))
    .reduce((carry, item) => {
        if (shipPattern.test(item.innerText)) {
            const [, cnt, name] = item.innerText.match(shipPattern);
            const ss = parseValue(cnt) * getMetaScoreByName(name);
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

