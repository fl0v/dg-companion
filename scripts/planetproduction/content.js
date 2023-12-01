/**
 * Planet production (and training).
 *  - add 9999 function
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

})();