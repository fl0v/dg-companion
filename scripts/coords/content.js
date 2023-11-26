/**
 * Will copy to cliboard any planet coordinates.
 * Paste logic will apply:
 * - in planet scan page /.../comms/
 * - fleet overview page /fleet/.../
 */
(function () {
    /*
     * Navigation page
     */
    Array.from(document.querySelectorAll('div.navigation .planets .coords')).forEach((item) => {
        item.classList.add('coords-container');
        item.querySelector('img').classList.add('coords-copy');
        item.querySelector('img').classList.add('cursor-pointer');
        item.querySelector('span').classList.add('coords-inner');
    });
    /*
     * Planets list & global radar page
     */
    Array.from(document.querySelectorAll('#planetList .planetHeadSection .coords')).forEach((item) => {
        item.classList.add('coords-container');
        item.querySelector('img').classList.add('coords-copy');
        item.querySelector('img').classList.add('cursor-pointer');
        item.querySelector('span').classList.add('coords-inner');
    });
    /*
    * Planet radar page
    */
    Array.from(document.querySelectorAll('#radarList .entry .coords')).forEach((item) => {
        item.classList.add('coords-container');
        item.querySelector('img').classList.add('coords-copy');
        item.querySelector('img').classList.add('cursor-pointer');
        item.querySelector('span').classList.add('coords-inner');
    });
    /*
     * Planet page
     */
    Array.from(document.querySelectorAll('#planetHeader .planetHeadSection .coords')).forEach((item) => {
        item.parentNode.classList.add('coords-container');
        item.querySelector('img').classList.add('coords-copy');
        item.querySelector('img').classList.add('cursor-pointer');
        item.classList.add('coords-inner');
    });
    /*
     * Fleets page
     */
    Array.from(document.querySelectorAll('#contentBox .entry .activity .coords')).forEach((item) => {
        item.classList.add('coords-container');
        item.querySelector('img').classList.add('coords-copy');
        item.querySelector('img').classList.add('cursor-pointer');
        item.querySelector('span').classList.add('coords-inner');
    });
    /*
     * Fleet overview page
     */
    Array.from(document.querySelectorAll('#contentBox .fleetRight .entry .coords')).forEach((item) => {
        item.classList.add('coords-container');
        item.querySelector('img').classList.add('coords-copy');
        item.querySelector('img').classList.add('cursor-pointer');
        item.querySelector('span').classList.add('coords-inner');
    });


    Array.from(document.querySelectorAll('.coords-container .coords-copy')).forEach((el) => {
        el.addEventListener('click', (event) => {
            const p = event.target.closest('.coords-container');
            const c = p.querySelector('.coords-inner');
            c && copyToClipboard(c.innerText, 'Coordinates copied to cliboard!', c);
        });
    });

    /*
     * Paste coords in split inputs
     */
    Array.from(document.querySelectorAll('.coordsInput')).forEach((container) => {
        const submit = container.querySelector('input[type="Submit"]');
        const inputs = Array.from(container.querySelectorAll('input[type="number"]'));
        inputs[0] && inputs[0].addEventListener('paste', (event) => {
            const values = (event.clipboardData || window.clipboardData).getData("text").split('.');
            if (values.length === 4) {
                values.forEach((v, idx) => {
                    inputs[idx].value = v;
                });
                submit && submit.focus();
            }
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
    });

})();