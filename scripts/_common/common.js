
const cleanText = (s) => String(s).trim().replace(/[\n\t\s]+/g, ' ');
const parseValue = (v) => parseInt(String(v).replace(/[,\+%]+/g, '')); // will normalize a value to be able to use it in Math operation '52,126' -> 52126; '+3,465' -> 3465; '70%' -> 70
const formatNumber = (v) => String(parseFloat(v).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); // same format as the rest of the values in ui
const formatNumberInt = (v) => String(Math.round(v)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // same format as the rest of the values in ui
const toggleElement = (el, toggle) => { el.style = toggle ? 'display:block;' : 'display:none;'; };
const mergeData = (model, data) => Object.keys(data || {}).forEach((key) => model[key] = data[key]);
const resetFilters = (filters, exclude) => {
    Array.from(filters).forEach((el) => {
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

const currentTurn = () => document.querySelector('#turnNumber').innerText;

const schemeType = /class=\"(neutral|hostile|friendly|allied)\"/
const getSchemeType = (el) => {
    const r = schemeType.exec(el.outerHTML);
    return r[1] || 'unknown';
};



