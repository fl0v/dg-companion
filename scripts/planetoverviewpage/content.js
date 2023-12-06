/**
 * Planet overview pages (building, production and training).
 * - add 9999 function
 * - planet memo
 */
(function () {

    /*
     * 9999
     */
    Array.from(document.querySelectorAll('#addQueue .availableItem.entry input[type="number"]')).forEach((input) => {
        const row = input.closest('.entry');
        const nameCol = row.querySelector('.nameCol');
        if (nameCol) {
            nameCol.insertAdjacentHTML('beforeend', `<span class="add-max-icon" title="Click to fill max value"></span>`);
            nameCol.addEventListener('click', e => {
                if (e.target.classList.contains('add-max-icon')) {
                    const input = row.querySelector('input');
                    input && (input.value = MAX_INPUT_VALUE);
                }
            });
        }
    });


    /*
     * Planet memo
     */
    const queueContainer = document.querySelector('#queue');
    const [, planetId] = /\/([\d]+)\//.exec(document.location.href);
    if (queueContainer && planetId) {
        queueContainer.insertAdjacentHTML('afterend',
            pageSection({
                id: 'planet-memo',
                title: 'Memo',
                cssClass: 'ofHidden lightBorder opacDarkBackground seperator',
                content: `<div class="entry opacBackground memo-container"></div>`,
            })
        );
        (new Memo('planet-' + planetId)).init(document.querySelector('#planet-memo .memo-container'));
    }

})();