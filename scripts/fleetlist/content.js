/**
 * Add a quick filter/search box
 */
const radioOption = (label, value) => {
    return `
            <label for="id-qf-${value}">
                <input type="radio" name="quickFilter" id="id-qf-${value}" value="${value}" />
                <span class="label">${label}</span>
            </label>
        `;
};

const selectElement = (label, options) => {
    return `
            <label for="id-qf-${value}">
                <span class="label">${label}</span>
                <select id="id-qf-${value}">
                    <option selected></option>
                    <option value="0.0.0.0">BluePlanet (0.0.0.0)</option>
                </select>
            </label>
        `;
}

const planets = [];
Array.from(document.querySelectorAll('#contentBox .entry .coords')).forEach((el) => {
    console.log(el);
});

const header = document.querySelector('#contentBox > .header');
if (header) {
    header.classList.add('d-flex');
    header.insertAdjacentHTML('beforeend', `
        <span id="quick-filter">
            ${radioOption('All fleets', 'any-any')}
            ${radioOption('All waiting', 'waiting')}
            ${radioOption('Attacking', 'attacking')}
            ${selectElement('By planet', planets)}          
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
