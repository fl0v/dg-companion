/**
 * Quick filters + quick search, systems shortcuts.
 * Warning of any incoming wf.
 * 
 * @TODO add interception warnings
 */
(function () {

    const searchMinLength = 3; // search only if atleast 3 chars
    const planetsList = [];
    const systemsList = [];
    const systemsLinks = [];
    const allRadars = Array.from(document.querySelectorAll('#planetList .planetHeadSection'));
    const allFleets = Array.from(document.querySelectorAll('#planetList .entry'));
    const container = document.querySelector('#contentBox');
    const header = document.querySelector('#contentBox > .header');


    /*
    * Helpers
    */

    // will hide a radar if all entries are hidden
    const checkFleets = () => allRadars.forEach((el) => {
        const hasFleets = Array.from(el.querySelectorAll('.entry'))
            .reduce((carry, entry) => carry || entry.style.display !== 'none', false);
        toggleElement(el.parentNode, hasFleets);
    });

    const searchInput = (value, trigger) => {
        value || (value = '');
        trigger || (trigger = false);
        const inputSearch = document.querySelector('#input-quick-search');
        console.log('search by ', value, 'trigger', trigger);
        inputSearch && (inputSearch.value = value);
        inputSearch && trigger && (inputSearch.dispatchEvent(new Event('input')));
    };

    const showAllFleets = () => {
        console.log('show all');
        const inputFilterAll = document.querySelector('#id-qf-any-any');
        inputFilterAll && (inputFilterAll.checked = true);
        allFleets.forEach((el) => toggleElement(el, true));
        checkFleets();
    };

    const filterBySearch = (search) => {
        console.log('filter by search', search);
        showAllFleets();
        searchInput(search); // dont trigger search        
        allFleets.forEach((el) => {
            const searchPattern = new RegExp(escapeRegExp(search), 'gi');
            toggleElement(el, el.innerText.match(searchPattern));
        });
        checkFleets();
    };

    const filterBySystem = (system) => {
        console.log('filter by system', system);
        showAllFleets();
        searchInput(); // reset
        system || (system = 'all');
        if (system === 'all' || system === '') {
            return;
        }
        allRadars.forEach((el) => toggleElement(el.parentNode, el.getAttribute('data-system') === system));
    };

    const parseEntry = (entry) => {
        const elName = entry.querySelector('.name');
        const elOwner = entry.querySelector('.owner');
        const elOwnerType = entry.querySelector('.owner > *');
        const elDestinationType = entry.querySelector('.destination .friendly, .destination .allied, .destination .hostile, .destination .neutral');
        const elDestination = entry.querySelector('.destination .coords');
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
        };
    };

    const buildFilterOption = (label, value) => {
        return `
            <label for="id-qf-${value}">
                <input type="radio" name="quickFilter" id="id-qf-${value}" value="${value}" />
                <span class="label">${label}</span>
            </label>
        `;
    };


    /*
     * Index radar list
     */

    allRadars.forEach((el) => {
        const text = el.querySelector(':first-child').innerText;
        const p = new dgPlanet(text);
        if (p.isValid()) {
            el.id = p.id;
            planetsList.push(p);
            if (!systemsList.includes(p.coordsSystem)) {
                el.setAttribute('data-system', p.coordsSystem); // used by filterSystem()
                systemsList.push(p.coordsSystem);
                systemsLinks.push(p.linkSystem("data-system=\"" + p.coordsSystem + "\""));
            }

            /*
            * Filter by links on each radar header
            */
            el.querySelector('.planetName')
                .insertAdjacentHTML('afterend', `
                    <div class="actions">
                        <!-- [${p.linkCoords(`data-search="${p.fullName()}" title="Filter by ${p.fullName()}"`)}] -->
                        [${p.linkSystem(`data-system="${p.coordsSystem}" title="Filter by system ${p.coordsSystem}"`)}]
                    </div>
                `);
            el.querySelector('.actions')
                .addEventListener('click', (event) => {
                    const system = event.target.getAttribute('data-system');
                    if (system) {
                        event.preventDefault();
                        filterBySystem(event.target.getAttribute('data-system'));
                        return false;
                    }
                    const search = event.target.getAttribute('data-search');
                    if (search) {
                        event.preventDefault();
                        filterBySearch(search);
                        return false;
                    }
                });
        }
    });


    /*
     * Add filter by for each planet/player
     * @TODO optimise this with one event on main container
     */
    if (container) {
        Array.from(container.querySelectorAll('#planetList .entry .coords')).forEach((el) => {
            el.insertAdjacentHTML('afterend', `<span class="filter-by-planet search-icon cursor-pointer"></span>`);
            el.parentNode.querySelector('.filter-by-planet')
                .addEventListener('click', (event) => {
                    filterBySearch(el.innerText);
                });
        });
        Array.from(container.querySelectorAll('#planetList .entry .owner')).forEach((el) => {
            el.insertAdjacentHTML('beforeend', `<span class="filter-by-owner search-icon cursor-pointer"></span>`);
            el.parentNode.querySelector('.filter-by-owner')
                .addEventListener('click', (event) => {
                    filterBySearch(el.innerText);
                });
        });
    }


    /*
     * Systems summary with links
     */

    if (container) {
        container.classList.add("relative-container");
        container.insertAdjacentHTML('afterbegin', `
            <div class="radar-companion-container">
                <div class="lightBorder opacDarkBackground radar-companion">
                    <div class="links-container">
                        ${systemsLinks.join(' ')}
                        <span class="top"><a href="#" data-system="all">All</a></span>
                    </div>
                </div>
            </div>
        `);
        container.querySelector('.radar-companion .links-container')
            .addEventListener('click', (event) => {
                const system = event.target.getAttribute('data-system');
                if (system) {
                    event.preventDefault();
                    filterBySystem(event.target.getAttribute('data-system'));
                    return false;
                }
            });
    }


    /*
    * Quick filter/search box
    */

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

        // quick filter fleets
        header.querySelector('#quick-filter')
            .addEventListener('input', (event) => {
                const [owner, destination] = event.target.value.split('-');
                console.log('filter by', owner, '-', destination);
                searchInput(); // reset
                allFleets.forEach((el) => {
                    const info = parseEntry(el);
                    let valid = true;
                    valid = valid && (owner == 'any' || owner.includes(info.ownerType));
                    valid = valid && (destination == 'any' || destination.includes(info.destinationType));
                    toggleElement(el, valid);
                });
                checkFleets();
            });

        // quick search
        const inputSearch = header.querySelector('#input-quick-search');
        inputSearch.addEventListener('keydown', (event) => {
            if (event.keyCode == 27) {
                event.target.value = '';
                showAllFleets();
            }
        });
        inputSearch.addEventListener('input', (event) => {
            const search = event.target.value;
            if (String(search).length >= searchMinLength) {
                filterBySearch(search);
            }
        });
    }

    /**
     * Incoming warning
     */
    if (header) {
        const incoming = {
            friendly: {},
            allied: {},
        };
        allFleets.forEach((entry) => {
            const info = parseEntry(entry);
            if (info.ownerType == 'hostile' && ['friendly', 'allied'].includes(info.destinationType)) {
                incoming[info.destinationType][info.destination] || (incoming[info.destinationType][info.destination] = info);
                entry.insertAdjacentHTML('beforeend', `<span class="incoming-warning incoming-warning-${info.destinationType} blinking">!</span>`);
            }
        });
        const incomingMessages = (destinations) => Object.entries(destinations)
            .reduce((carry, fleet) => {
                carry.push(`<a class="incoming-destination coords" data-search="${fleet[1].destination}" href="#${fleet[1].parent}"><span>${fleet[1].destination}</span></a>`);
                return carry;
            }, []);
        const incomingFriendlyMessages = incomingMessages(incoming.friendly);
        const incomingAlliedMessages = incomingMessages(incoming.allied);
        const banner = [];
        incomingFriendlyMessages.length && banner.push(`
            <div class="incoming-owned opacBackground lightBorder padding flex-row-wrap">
                <span class="incoming-label">Incoming to <b class="friendly">owned</b> planets:</span> ${incomingFriendlyMessages.join('')} <span class="incoming-label"><b class="incoming-warning blinking">!</b></span>
            </div>
        `);
        incomingAlliedMessages.length && banner.push(`
            <div class="incoming-allied opacBackground lightBorder padding flex-row-wrap">
                <span class="incoming-label">Incoming to <b class="allied">allied</b> planets:</span> ${incomingAlliedMessages.join('')} <span class="incoming-label"><b class="incoming-warning blinking">!</b></span>
            </div>
        `);
        if (banner.length) {
            header.insertAdjacentHTML('afterend', `
                <div class="opacBackground ofHidden padding">                
                    <div class="opacDarkBackground lightBorder" id="incoming">
                        ${banner.join("\n")}                        
                    </div>                
                </div>
            `);
            document.querySelector('#incoming').addEventListener('click', (event) => {
                let link = event.target;
                if (!link.classList.contains('incoming-destination')) {
                    link = link.closest('.incoming-destination');
                }
                const search = link.getAttribute('data-search');
                if (search) {
                    event.preventDefault();
                    searchInput(search, true); // search by text
                    return false;
                }
            });
        }
    }

})();