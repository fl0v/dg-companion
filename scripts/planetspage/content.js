/**
 * Planets stats + activities summary with copy to cliboard feature.
 * Info box besides each planet with total output + warning if stored resources are more then 24h outuput.
 */

const resourceTypePattern = /src="\/images\/units\/small\/([^\.]+)\./; // used to detect the resource type using the image url
const resPattern = /([\d,]+)\s+\(([\+\d,]+)\)\s+([\d%]+)/; // will split resource data ex: '52,126 (+3,465) 70%'
const popPattern = /([\d,]+)\s+\/\s+[\d,]+\s+\(([\+\d,]+)\s+available\)/; // will split population  data ex: '52,126 (47,126 available)'
const othPattern = /([\d,]+)/; // simple value for other resources

const buildPattern = /\/planet\/([\d]+)\/$/;
const prodPattern = /\/planet\/([\d]+)\/production\/$/;
const trainPattern = /\/planet\/([\d]+)\/training\/$/;
const buildMsgPattern = /Building:\s(.*)\s\(([\d]+)/;
const notBuildMsgPattern = /Building:\sNone/gi;
const prodMsgPattern = /Ship\sYard:\s([\d,]+)x\s(.*)\s\(([\d]+)/;
const trainMsgPattern = /Barracks:\s([\d,]+)x\s(.*)\s\(([\d]+)/;

const allResources = Array.from(document.querySelectorAll('.planetHeadSection .resource'));
const allActivities = Array.from(document.querySelectorAll('#planetList .planetHeadSection .left.resource a'));
const allPlanets = Array.from(document.querySelectorAll('#planetList > #planetList'));
const planetsData = [];
const addPlanetStored = (index, res, value) => {
    planetsData[index] || (planetsData[index] = { total: 0, totalProd: 0 });
    planetsData[index][res] = value;
    planetsData[index]['total'] += value;
}
const addPlanetProduction = (index, res, value) => {
    planetsData[index] || (planetsData[index] = { total: 0, totalProd: 0 });
    planetsData[index][res + 'Prod'] = value;
    planetsData[index]['totalProd'] += value;
}


/*
 * Lets aggregate stats data
 */

let totalStats = {
    planetsCount: 0,
    orbit: 0,
    ground: 0,
    soldiers: 0,
    workers: 0,
    workersAvg: 0,
    workersAvailable: 0,
    metal: 0,
    metalProd: 0,
    metalAvgRate: 0,
    mineral: 0,
    mineralProd: 0,
    mineralAvgRate: 0,
    food: 0,
    foodProd: 0,
    foodAvgRate: 0,
    energy: 0,
    energyProd: 0,
    energyAvgRate: 0,
};

allResources.forEach((element) => {
    const contentHtml = element.innerHTML;
    const contentTxt = element.innerText;
    let type = '';
    if (resourceTypePattern.test(contentHtml)) {
        [, type] = contentHtml.match(resourceTypePattern);
    }
    if (type == 'metal') {
        totalStats.planetsCount++; // each time we encounter a metal value we also increment the planets count

        let values = contentTxt.match(resPattern);
        addPlanetStored(totalStats.planetsCount - 1, 'metal', parseValue(values[1]));
        addPlanetProduction(totalStats.planetsCount - 1, 'metal', parseValue(values[2]));
        totalStats.metal += parseValue(values[1]);
        totalStats.metalProd += parseValue(values[2]);
        totalStats.metalAvgRate += parseValue(values[3]); // we'll divide by planets count at the end
    } else if (type == 'mineral') {
        let values = contentTxt.match(resPattern);
        addPlanetStored(totalStats.planetsCount - 1, 'mineral', parseValue(values[1]));
        addPlanetProduction(totalStats.planetsCount - 1, 'mineral', parseValue(values[2]));
        totalStats.mineral += parseValue(values[1]);
        totalStats.mineralProd += parseValue(values[2]);
        totalStats.mineralAvgRate += parseValue(values[3]); // we'll divide by planets count at the end
    } else if (type == 'food') {
        let values = contentTxt.match(resPattern);
        addPlanetStored(totalStats.planetsCount - 1, 'food', parseValue(values[1]));
        addPlanetProduction(totalStats.planetsCount - 1, 'food', parseValue(values[2]));
        totalStats.food += parseValue(values[1]);
        totalStats.foodProd += parseValue(values[2]);
        totalStats.foodAvgRate += parseValue(values[3]); // we'll divide by planets count at the end
    } else if (type == 'energy') {
        let values = contentTxt.match(resPattern);
        addPlanetStored(totalStats.planetsCount - 1, 'energy', parseValue(values[1]));
        addPlanetProduction(totalStats.planetsCount - 1, 'energy', parseValue(values[2]));
        totalStats.energy += parseValue(values[1]);
        totalStats.energyProd += parseValue(values[2]);
        totalStats.energyAvgRate += parseValue(values[3]); // we'll divide by planets count at the end
    } else if (type == 'worker') {
        let values = contentTxt.match(popPattern);
        totalStats.workers += parseValue(values[1]);
        totalStats.workersAvailable += parseValue(values[2]);
    } else if (type == 'soldier') {
        let values = contentTxt.match(othPattern);
        totalStats.soldiers += parseValue(values[1]);
    } else if (type == 'ground') {
        let values = contentTxt.match(othPattern);
        totalStats.ground += parseValue(values[1]);
    } else if (type == 'orbit') {
        let values = contentTxt.match(othPattern);
        totalStats.orbit += parseValue(values[1]);
    }
});
totalStats.metalAvgRate = (totalStats.metalAvgRate / totalStats.planetsCount).toFixed(2);
totalStats.mineralAvgRate = (totalStats.mineralAvgRate / totalStats.planetsCount).toFixed(2);
totalStats.foodAvgRate = (totalStats.foodAvgRate / totalStats.planetsCount).toFixed(2);
totalStats.energyAvgRate = (totalStats.energyAvgRate / totalStats.planetsCount).toFixed(2);
totalStats.workersAvg = (totalStats.workers / totalStats.planetsCount).toFixed(2);


/*
 * Lets add info box
 */

allPlanets.forEach((el, index) => {
    const extraCls = [];
    if (planetsData[index]['totalProd'] * 24 < planetsData[index]['total']) {
        extraCls.push('warning');
    }
    el.classList.add('planet-container');
    el.insertAdjacentHTML('afterbegin', `
        <div class="info-box ${extraCls.join(' ')}">
            <div class="total">Total:<br/>${formatNumberInt(planetsData[index]['total'])}</div>
            <div class="prod">&plus; ${formatNumberInt(planetsData[index]['totalProd'])}</div>
        </div>
    `);
});


/*
 * Lets build a summary of all activity
 */

let activity = {
    building: {},
    training: {},
    producing: {}
};
let planets = {
    notBuilding: [],
    notProducing: [],
    notTraining: []
};

allActivities.forEach((el) => {
    const msg = el.parentNode.innerText;

    // Training first
    if (trainPattern.test(el.href) && trainMsgPattern.test(msg)) {
        const [, cnt, unit, ttf] = msg.match(trainMsgPattern);
        activity.training[unit] = (activity.training[unit] || 0) + parseValue(cnt);

        // SY Production
    } else if (prodPattern.test(el.href) && prodMsgPattern.test(msg)) {
        const [, cnt, unit, ttf] = msg.match(prodMsgPattern);
        activity.producing[unit] = (activity.producing[unit] || 0) + parseValue(cnt);

        // Buildings
    } else if (buildPattern.test(el.href) && buildMsgPattern.test(msg)) {
        const [, unit, ttf] = msg.match(buildMsgPattern);
        activity.building[unit] = activity.building[unit] || 0;
        activity.building[unit]++;
    } else if (buildPattern.test(el.href) && notBuildMsgPattern.test(msg)) {
        const planet = el.closest('.locationWrapper');
        const coords = planet.querySelector('.coords').innerText;
        const name = planet.querySelector('.planetName').innerText;
        planets.notBuilding.push({ coords: coords, name: name, href: el.href });
    }
});


/*
 * Produce summary with html if cls is provided, otherwise simple text for copy paste
 */
const activitySummary = (label, collection, cls) => {
    let msgs = Object.entries(collection).reduce((carry, a) => {
        carry.push(cls ? '<span class="activity-item"><b>' + a[1] + '</b>x ' + a[0] + '</span>' : a[1] + 'x ' + a[0]);
        return carry;
    }, []);
    if (msgs.length) {
        return cls ? '<div class="' + cls + '">' + label + ' ' + msgs.join(', ') + '</div>' : label + ' ' + msgs.join(', ');
    }
    return '';
};

const planetsList = (label, planets, cls) => {
    let msgs = planets.reduce((carry, a) => {
        carry.push(cls ? `<a class="planet-item" href="${a.href}">(<b>${a.coords}</b>) ${a.name}</a>` : `(${a.coords}) ${a.name})`);
        return carry;
    }, []);
    if (msgs.length) {
        return cls ? '<div class="' + cls + '">' + label + ' ' + msgs.join(', ') + '</div>' : label + ' ' + msgs.join(', ');
    }
    return '';
};


/*
 * add a nice top panel for the planet list
 */

const resourceTemplate = (code, content) =>
    `
        <div class="left seperatorRight">
            <img src="/images/units/small/${code}.gif" title="${code}">
        </div>
        <span>${content}</span>
    `;

document.querySelector('#planetList').insertAdjacentHTML('afterbegin',
    `
        <div class="opacDarkBackground lightBorder ofHidden seperator planetStats expanded">
            <span class="right copy-hint">Click to copy to clipboard</span>
            <div class="header border">
                Total resources (planets: ${totalStats.planetsCount})
                <span class="actions">
                    <span class="collapse">[ - ]</span>
                    <span class="expand">[ &plus; ]</span>
                </span>
            </div>
            <div class="planetStatsContent d-flex d-flex-jcsb">
                <div class="resource-container">
                    <div class="resource metal">
                        ${resourceTemplate('metal', formatNumberInt(totalStats.metal) + ' (+' + formatNumberInt(totalStats.metalProd) + ') AVG: ' + formatNumber(totalStats.metalAvgRate) + '%')}
                    </div>
                    <div class="resource mineral">
                        ${resourceTemplate('mineral', formatNumberInt(totalStats.mineral) + ' (+' + formatNumberInt(totalStats.mineralProd) + ') AVG: ' + formatNumber(totalStats.mineralAvgRate) + '%')}
                    </div>
                    <div class="resource food">
                        ${resourceTemplate('food', formatNumberInt(totalStats.food) + ' (+' + formatNumberInt(totalStats.foodProd) + ') AVG: ' + formatNumber(totalStats.foodAvgRate) + '%')}
                    </div>
                    <div class="resource energy">
                        ${resourceTemplate('energy', formatNumberInt(totalStats.energy) + ' (+' + formatNumberInt(totalStats.energyProd) + ') AVG: ' + formatNumber(totalStats.energyAvgRate) + '%')}
                    </div>
                </div>
                <div class="activity-container d-flex-grow">
                    <div class="d-flex d-flex-jce">
                        <div class="resource population">
                            ${resourceTemplate('worker', formatNumberInt(totalStats.workers) + ' / AVG: ' + formatNumberInt(totalStats.workersAvg))}
                        </div>
                        <div class="resource solider">
                            ${resourceTemplate('soldier', formatNumberInt(totalStats.soldiers))}
                        </div>
                        <div class="resource ground">
                            ${resourceTemplate('ground', formatNumberInt(totalStats.ground))}
                        </div>
                        <div class="resource orbit">
                            ${resourceTemplate('orbit', formatNumberInt(totalStats.orbit))}
                        </div>
                    </div>
                    <div class="activity">
                        ${activitySummary('Producing:', activity.producing, 'activity-producing')}
                        ${activitySummary(', Training:', activity.training, 'activity-training')}
                        ${activitySummary('Building:', activity.building, 'activity-building')}
                        ${planetsList('Planets not building anything:', planets.notBuilding, 'planets-not-building')}
                    </div>
                </div>
            </div>
        </div>
    `
);

const planetStats = document.querySelector('.planetStats');
planetStats.querySelector('.actions').addEventListener('click', (event) => {
    planetStats.classList.toggle('collapsed', !event.target.classList.contains('expand'));
})


/*
 * copy/paste
 */

const copy = document.querySelector('.planetStats .copy-hint');
copy.style.cursor = 'pointer';
copy.addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText(textStats());
});
const txtBorder = '====================';
const txtSpacer = '--------------------';
const pe = (s, c) => String(s).padEnd(c, ' ');
const ps = (s, c) => String(s).padStart(c, ' ');
const textStats = () => {
    const pl = 11; // pad label 11 spaces at the end
    const pv = 7; // pad values with 7 spaces at the start
    var c = txtBorder + "\n";
    c += " Planets " + totalStats.planetsCount + ' / Turn ' + currentTurn() + "\n";
    c += txtSpacer + "\n";
    c += pe(" Metal:", pl) + ps(formatNumberInt(totalStats.metal), pv) + ps('(+' + formatNumberInt(totalStats.metalProd) + ')', pv + 4) + ps(formatNumber(totalStats.metalAvgRate) + '%', pv + 2) + " (avg)\n";
    c += pe(" Mineral:", pl) + ps(formatNumberInt(totalStats.mineral), pv) + ps('(+' + formatNumberInt(totalStats.mineralProd) + ')', pv + 4) + ps(formatNumber(totalStats.mineralAvgRate) + '%', pv + 2) + " (avg)\n";
    c += pe(" Food:", pl) + ps(formatNumberInt(totalStats.food), pv) + ps('(+' + formatNumberInt(totalStats.foodProd) + ')', pv + 4) + ps(formatNumber(totalStats.foodAvgRate) + '%', pv + 2) + " (avg)\n";
    c += pe(" Energy:", pl) + ps(formatNumberInt(totalStats.energy), pv) + ps('(+' + formatNumberInt(totalStats.energyProd) + ')', pv + 4) + ps(formatNumber(totalStats.energyAvgRate) + '%', pv + 2) + " (avg)\n";
    c += txtSpacer + "\n";
    c += pe(" Workers:", pl) + formatNumberInt(totalStats.workers) + ' / AVG: ' + formatNumber(totalStats.workersAvg) + "\n";
    c += pe(" Soldiers:", pl) + formatNumberInt(totalStats.soldiers) + "\n";
    c += pe(" Ground:", pl) + formatNumberInt(totalStats.ground) + "\n";
    c += pe(" Orbit:", pl) + formatNumberInt(totalStats.orbit) + "\n";
    c += txtSpacer;
    c += activitySummary("\n Producing:", activity.producing);
    c += activitySummary("\n Training:", activity.training);
    c += activitySummary("\n Building:", activity.building);
    c += "\n" + txtBorder + "\n";
    return c;
};

console.log(textStats());
