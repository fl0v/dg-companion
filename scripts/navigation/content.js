/*
 * Just copy to cliboard on click on navigation icon near planet coords
 */

const navigation = document.querySelector('div.navigation');
navigation && navigation.addEventListener('click', (event) => {
    const el = event.target.closest('.coords');
    if (el) {
        navigator.clipboard.writeText(el.innerText);
        el.classList.toggle('copied');
        globalMessage('Coordinates copied to cliboard!');
        setTimeout(() => el.classList.toggle('copied'), 500);
    }
});