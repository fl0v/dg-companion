/**
 * Total score
 * 
 * @TODO wait time wizard
 * @TODO transfer all in fleet transfer page
 * @TODO 9999 link in fleet transfer page
 */

const shipPattern = /([\d,]+)x\s(.*)/; // 6,123x Fighter
const scoreTemplate = (unitScore, label) => `
    <span class="score neutral right"><em>${formatNumber(unitScore.toFixed(2))}</em> ${label}</span>
`;

const fleetComposition = [];
const [totalScore, wfScore] = Array.from(document.querySelectorAll('#contentBox .fleetRight .entry'))
    .reduce((carry, item) => {
        if (shipPattern.test(item.innerText)) {
            const [, cnt, name] = item.innerText.match(shipPattern);
            const ss = parseValue(cnt) * getItemScoreByName(name);
            fleetComposition.push({
                cnt: cnt,
                name: name,
            });
            carry[0] += ss;
            if (getItemByName(name).warfleet) {
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
                <span class="left">WarFleet only</span>                 
                <span class="right">${scoreTemplate(wfScore, 'score')}</span> 
            </div> 
            <div class="entry opacLightBackground" style="line-height: 24px; padding: 4px"> 
                <span class="left">Total</span>                 
                <span class="right">${scoreTemplate(totalScore, 'score')}</span> 
            </div> 
       </div>
    `);

/*
 * 999999
 */
Array.from(document.querySelectorAll('.fleetLeft .transferRow')).forEach((row) => {
    row.insertAdjacentHTML('beforeend', `<div class="left"><span class="add-max-icon" title="Click to fill max value"></span></div>`);
    row.addEventListener('click', e => {
        if (e.target.classList.contains('add-max-icon')) {
            const input = row.querySelector('input').value = MAX_INPUT_VALUE;
        }
    });
});
Array.from(document.querySelectorAll('.fleetLeft .tableHeader')).forEach((row) => {
    if (/Amount/.test(row.innerText)) {
        row.querySelector(':last-child').insertAdjacentHTML('beforeend', `<span class="add-max-icon" title="Click to fill max value for all rows"></span>`);
        row.addEventListener('click', e => {
            if (e.target.classList.contains('add-max-icon')) {
                Array.from(row.parentNode.querySelectorAll('.transferRow input')).forEach((item) => {
                    item.value = MAX_INPUT_VALUE;
                });
            }
        });
    }
});


/*
 * copy/paste summary
 */
const fleetHeader = String(document.querySelector('#contentBox > .header').innerText);
const [, fleetName] = /Fleet List -[\s«]+(.*)[»]?/i.exec(fleetHeader);
const fleetActivity = cleanText(document.querySelector('#contentBox .fleetRight > .fleetRight .entry').innerText);
const fleetScore = `Score: ${formatNumber(totalScore)} / wf: ${formatNumber(wfScore)}`;
const fleetCompositionStr = fleetComposition.reduce((carry, fl) => carry + `${pe(fl.name, 13)} ${ps(fl.cnt, 6)}\n`, ``);
const fleetQueue = Array.from(document.querySelectorAll('#fleetQueue .entry .nameColumn'));
const fleetQueueStr = fleetQueue.reduce((carry, el) => carry + cleanText(el.innerText) + "\n", '');

document.querySelector('#contentBox > .header')
    .insertAdjacentHTML('afterbegin', `
        <span class="right copy-hint cursor-pointer">Click to copy to clipboard</span>
    `);
document.querySelector('#contentBox .copy-hint')
    .addEventListener('click', e => {
        e.preventDefault();
        copyToClipboard(textStats(), 'Fleet summary copied to clipboard!', e.target);
        return false;
    });
const txtBorder = '====================';
const txtSpacer = '--------------------';
const textStats = () => `
${txtBorder}
Turn: ${currentTurn()} / Fleet: "${fleetName.trim()}"
${fleetActivity} 
${fleetScore}
${txtSpacer}
${fleetCompositionStr.trim()}
${txtSpacer}
Full queue:
${fleetQueueStr.trim()}
${txtBorder}
`;

console.log(textStats());
