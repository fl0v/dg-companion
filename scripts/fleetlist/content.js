

const coordsPattern = /(\d+)\.(\d+)\.(\d+).(\d+)[\s](.*)/;
const searchMinLength = 3; // search only if atleast 3 chars

const header = document.querySelector('#contentBox > .header');
const listPlanets = Array.from(document.querySelectorAll('#contentBox .entry .coords'));
const listFleets = Array.from(document.querySelectorAll('#contentBox .entry'));

/*
 * Index all fleets & planets
 */

const planets = {
    neutral: {},
    neutralSorted: [],
    hostile: {},
    hostileSorted: [],
    friendly: {},
    friendlySorted: [],
};

const parsePlanet = (el) => {
    let id = el.innerText;
    let sys = el.innerText;
    if (el.innerText.match(coordsPattern)) {
        const [, x, y, z, w, name] = coordsPattern.exec(el.innerText);
        id = ['p', x, y, z, w].join('-');
        sys = ['s', x, y, z].join('-');
    }
    return {
        id: id,
        sys: sys,
        name: el.innerText,
        type: '',
    }
}

listPlanets.forEach((el) => {
    const pl = parsePlanet(el);
    const [, type] = /class=\"(neutral|hostile|friendly)\"/.exec(el.innerHTML);
    pl.type = type;
    planets[type][pl.id] = pl;
    const row = el.closest('.entry');
    row.classList.add(pl.id);
    row.classList.add('t-' + type);
    if (row.innerText.match(/Moving\sfrom/)) {
        row.classList.add('t-moving');
    } else if (row.innerText.match(/Waiting\sat/)) {
        row.classList.add('t-waiting');
    }
});
Object.entries(planets.neutral).forEach((a) => planets.neutralSorted.push(a[1]));
Object.entries(planets.hostile).forEach((a) => planets.hostileSorted.push(a[1]));
Object.entries(planets.friendly).forEach((a) => planets.friendlySorted.push(a[1]));
planets.neutralSorted.sort((a, b) => a.id.localeCompare(b.id));
planets.hostileSorted.sort((a, b) => a.id.localeCompare(b.id));
planets.friendlySorted.sort((a, b) => a.id.localeCompare(b.id));


/*
 * Build filter & search form
 */

const radioOption = (label, value, selected) => {
    return `<label for="id-qf-${value}">
                <input type="radio" name="quickFilter" class="filter" id="id-qf-${value}" value="${value}" ${selected}/>
                <span class="label">${label}</span>
            </label>`;
};

const buildItemsHtml = (planetsSorted) => {
    let itemsHtml = '';
    planetsSorted.forEach((o) => {
        itemsHtml += `
            <option value="${o.id}">${o.name}</options>
        `;
    });
    return itemsHtml;
}

if (header) {
    header.classList.add('d-flex');
    header.insertAdjacentHTML('beforeend', `
        <span id="quick-filter">
            <label for="id-qf-planet">
                <button id="id-qf-reset">Reset</button>
                <select id="id-qf-planet" class="filter" placeholder="Filter by planet">
                    <option selected>Filter by planet</option>
                    <optgroup label="Friendly">
                        ${buildItemsHtml(planets.friendlySorted)}
                    </optgroup>
                    <optgroup label="Hostile">
                        ${buildItemsHtml(planets.hostileSorted)}
                    </optgroup>
                    <optgroup label="Neutral">
                        ${buildItemsHtml(planets.neutralSorted)}
                    </optgroup>
                </select>
            </label>  
            ${radioOption('Fleets waiting', 't-waiting')}
            ${radioOption('Hostile planets', 't-hostile')}
        </span>
        <span id="quick-search">
            <input id="input-quick-search" class="filter" type="text" name="quickSearch" value="" placeholder="Quick search..." />
        </span>
    `);
}


/*
 * Run filters & search
 */

const elSearchInput = document.querySelector('#input-quick-search');
const elFiltersContainer = document.querySelector('#quick-filter');
const elResetFilters = document.querySelector('#quick-filter #id-qf-reset');

const toggleFleet = (el, toggle) => { el.style = toggle ? 'display:block;' : 'display:none;'; };
const resetFleets = () => listFleets.forEach((el) => toggleFleet(el, true));
const searchFleets = (search) => {
    const searchPattern = new RegExp(search, 'gi');
    listFleets.forEach((el) => toggleFleet(el, el.innerText.match(searchPattern)));
};
const resetFilters = (exclude) => {
    Array.from(header.querySelectorAll('.filter')).forEach((el) => {
        if (el !== exclude) {
            if (el.options) {
                Array.from(el.options).forEach((opt) => opt.selected = false);
            } else if (el.checked) {
                el.checked = false;
            } else if (el.type === 'text' && String(el.value).length > 0) {
                el.value = '';
            }
        }
    });
};

elResetFilters.addEventListener('click', () => { resetFilters(); resetFleets(); });
elFiltersContainer.addEventListener('input', (event) => {
    resetFilters(event.target);
    resetFleets();
    const filterByValue = event.target.value;
    listFleets.forEach((el) => toggleFleet(el, el.classList.contains(filterByValue)));
});
elSearchInput.addEventListener('keydown', (event) => {
    if (event.keyCode == 27) {
        resetFilters();
        resetFleets();
    }
});
elSearchInput.addEventListener('input', (event) => {
    resetFilters(event.target);
    const search = event.target.value;
    if (String(search).length >= searchMinLength) {
        searchFleets(search);
    } else {
        resetFleets();
    }
});