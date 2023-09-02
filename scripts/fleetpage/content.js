/**
 * Total score
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
            const ss = parseValue(cnt) * getMetaScoreByName(name);
            fleetComposition.push({
                cnt: cnt,
                name: name,
            });
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


/*
 * copy/paste
 */
const txtBorder = '====================';
const txtSpacer = '--------------------';
const pe = (s, c) => String(s).padEnd(c, ' ');
const ps = (s, c) => String(s).padStart(c, ' ');

const fleetHeader = String(document.querySelector('#contentBox > .header').innerText);
const [, fleetName] = /Fleet List -[\s«]+(.*)[»]?/i.exec(fleetHeader);
const fleetActivity = cleanText(document.querySelector('#contentBox .fleetRight > .fleetRight .entry').innerText);
const fleetScore = `Score: ${formatNumber(totalScore)} / wf: ${formatNumber(wfScore)}`;
const fleetCompositionStr = fleetComposition.reduce((carry, fl) => carry + `${pe(fl.name, 13)} ${ps(fl.cnt, 6)}\n`, ``);
const fleetQueue = Array.from(document.querySelectorAll('#fleetQueue .entry .nameColumn'));
const fleetQueueStr = fleetQueue.reduce((carry, el) => carry + cleanText(el.innerText) + "\n", '');

document.querySelector('#contentBox > .header')
    .insertAdjacentHTML('afterbegin', `
        <span class="right copy-hint">Click to copy to clipboard</span>
    `);
document.querySelector('#contentBox .copy-hint')
    .addEventListener('click', e => {
        e.preventDefault();
        navigator.clipboard.writeText(textStats());
    });

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
