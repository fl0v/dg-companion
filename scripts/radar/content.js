/**
 * Quick filters + quick search, systems shortcuts.
 * Qarning of any incoming wf.
 */

const searchMinLength = 3; // search only if atleast 3 chars
const allRadars = Array.from(document.querySelectorAll('#planetList .planetHeadSection'));
const allFleets = Array.from(document.querySelectorAll('#planetList .entry'));

// will hide a radar if all entries are hidden
const checkFleets = () => allRadars.forEach((el) => {
    const hasFleets = Array.from(el.querySelectorAll('.entry'))
        .reduce((carry, entry) => carry || entry.style.display !== 'none', false);
    el.parentNode.classList.toggle('hide', !hasFleets);
});

const showAllFleets = () => {
    allFleets.forEach((el) => toggleElement(el, true));
    checkFleets();
};


let allPlanets = [];
let allSystems = [];
let systemsLinks = [];
allRadars.forEach((el) => {
    const text = el.querySelector(':first-child').innerText;
    const p = new Planet(text);
    if (p.isValid()) {
        el.id = p.id;
        allPlanets.push(p);
        if (!allSystems.includes(p.coordsSystem)) {
            allSystems.push(p.coordsSystem);
            systemsLinks.push(p.linkSystem());
        } else {
            el.parentNode.classList.add('collapsed');
        }

        el.querySelector('.planetName')
            .insertAdjacentHTML('afterend', `
                <div class="actions right">
                    <span class="collapse">[&minus;]</span>
                    <span class="expand">[&plus;]</span>
                </div>
            `);
        el.querySelector('.actions')
            .addEventListener('click', (event) => {
                el.parentNode.classList.toggle('collapsed', !event.target.classList.contains('expand'));
            });
    }
});

/*
 * Lets build a companion box with shortcuts to each radar
 */
const container = document.querySelector('#contentBox');
if (container) {
    container.classList.add("relative-container");
    container.insertAdjacentHTML('afterbegin', `
        <div class="radar-companion-container">
            <div class="lightBorder opacDarkBackground radar-companion">
                <div class="links-container">
                    ${systemsLinks.join(' ')}
                    <span class="top"><a href="#">Top</a></span>
                </div>
            </div>
        </div>
    `);
}

/**
 * Add a quick filter/search box
 */
const buildFilterOption = (label, value) => {
    return `
            <label for="id-qf-${value}">
                <input type="radio" name="quickFilter" id="id-qf-${value}" value="${value}" />
                <span class="label">${label}</span>
            </label>
        `;
};
const header = document.querySelector('#contentBox > .header');
if (header) {
    header.classList.add('d-flex');
    header.insertAdjacentHTML('beforeend', `
        <span id="quick-filter">
            ${buildFilterOption('All fleets', 'any-any')}
            ${buildFilterOption('Only owned', 'friendly-any')}
            ${buildFilterOption('Alliance', 'friendly_allied-any')}
            ${buildFilterOption('Alliance attacking', 'friendly_allied-hostile')}
            ${buildFilterOption('Hostile', 'hostile-any')}
            ${buildFilterOption('Hostile attacking', 'hostile-friendly_allied')}
        </span>
        <span id="quick-search">
            <input id="input-quick-search" type="text" name="quickSearch" value="" placeholder="Quick search..." />
        </span>
        `);
}
const inputSearch = document.querySelector('#input-quick-search');
const inputFilterAll = document.querySelector('#id-qf-any-any');
const parseEntry = (entry) => {
    const elName = entry.querySelector('.name');
    const elOwner = entry.querySelector('.owner');
    const elOwnerType = entry.querySelector('.owner > *');
    const elDestinationType = entry.querySelector('.destination .friendly, .destination .allied, .destination .hostile, .destination .neutral');
    const elDestination = entry.querySelector('.destination');
    const elScore = entry.querySelector('.score');
    const elTurns = entry.querySelector('.turns');
    const elParent = entry.closest('.planetHeadSection');
    return {
        owner: elOwner ? elOwner.innerText.trim() : '',
        ownerType: elOwnerType ? elOwnerType.className : '',
        destinationType: elDestinationType ? elDestinationType.className : '',
        destination: elDestination ? elDestination.innerText.trim() : '',
        name: elName ? elName.innerText.trim() : '',
        score: elScore ? elScore.innerText.trim() : '',
        turns: elTurns ? elTurns.innerText.trim() : '',
        parent: elParent ? elParent.id : '',
        //el: entry.cloneNode(true),
    };
};

// quick filter fleets
document.querySelector('#quick-filter')
    .addEventListener('input', (event) => {
        inputSearch.value = '';
        const [owner, destination] = event.target.value.split('-');
        allFleets.forEach((el) => {
            const info = parseEntry(el);
            let valid = true;
            valid = valid && (owner == 'any' || owner.includes(info.ownerType));
            valid = valid && (destination == 'any' || destination.includes(info.destinationType));
            toggleElement(el, valid);
        });
        checkFleets();
    })
    ;

// quick search action
const filterFleets = (search) => {
    showAllFleets();
    allFleets.forEach((el) => {
        const searchPattern = new RegExp(search, 'gi');
        toggleElement(el, el.innerText.match(searchPattern));
    });
    checkFleets();
};
inputSearch.addEventListener('keydown', (event) => {
    if (event.keyCode == 27) {
        event.target.value = '';
        showAllFleets();
    }
});
inputSearch.addEventListener('input', (event) => {
    const search = event.target.value;
    if (String(search).length >= searchMinLength) {
        inputFilterAll.checked = true;
        filterFleets(search);
    }
});

/**
 * Incoming warning
 */
let incoming = {};
allFleets.forEach((entry) => {
    const info = parseEntry(entry);
    if (info.ownerType == 'hostile' && ['friendly', 'allied'].includes(info.destinationType)) {
        if (!incoming[info.destination]) {
            incoming[info.destination] = info;
        }
        entry.insertAdjacentHTML('beforeend', '<span class="incoming-warning blinking">!</span>');
    }
});
const incomingMessages = Object.entries(incoming)
    .reduce((carry, fleet) => {
        carry.push('<a class="incoming-destination" href="#' + fleet[1].parent + '">' + fleet[1].destination + '</a>');
        return carry;
    }, [])
    ;
if (header && incomingMessages.length) {
    header.insertAdjacentHTML('afterend', `
            <div id="incoming" class="opacBackground padding">
            Incoming on: ${incomingMessages.join(', ')} <span class="incoming-warning blinking">!</span>
            </div>
        `);
    document.querySelector('#incoming').addEventListener('click', (event) => {
        event.preventDefault();
        inputSearch.value = event.target.innerText;
        inputSearch.dispatchEvent(new Event('input'));
        return false;
    });
}
