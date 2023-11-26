/**
 * Will copy to cliboard any planet coordinates
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

})();