/*
 * copy paste planet coords
 */
const inputs = Array.from(document.querySelectorAll('.coordsInput input[type="number"]'));
const submit = document.querySelector('.coordsInput input[type="Submit"]');
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