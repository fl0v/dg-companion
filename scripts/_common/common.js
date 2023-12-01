
const cleanText = (s) => String(s).trim().replace(/[\n\t\s]+/g, ' ');
const parseValue = (v) => parseInt(String(v).replace(/[,\+%]+/g, '')); // will normalize a value to be able to use it in Math operation '52,126' -> 52126; '+3,465' -> 3465; '70%' -> 70
const formatNumber = (v) => String(parseFloat(v).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); // same format as the rest of the values in ui
const formatNumberInt = (v) => String(Math.round(v)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // same format as the rest of the values in ui
const toggleElement = (el, toggle) => { el.style = toggle ? 'display:block;' : 'display:none;'; };
const ucfirst = (str) => String(str).charAt(0).toUpperCase() + String(str).slice(1);
const lcfirst = (str) => String(str).charAt(0).toLowerCase() + String(str).slice(1);
const escapeRegExp = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

const MAX_INPUT_VALUE = '99999999';

const pe = (v, c, s) => String(v).padEnd(c, s || ' ');
const ps = (v, c, s) => String(v).padStart(c, s || ' ');
const pc = (v, c, s) => {
    const str = String(v);
    const pre = Math.floor((c - str.length) / 2);
    const suf = c - str.length - pre;
    return String(s || '').repeat(pre) + str + String(s || '').repeat(suf);
};

const copyToClipboard = (text, message, element) => {
    navigator.clipboard.writeText(text);
    message || (message = 'Data copied to cliboard!');
    globalMessage(message);
    if (element) {
        element.classList.toggle('content-copied');
        setTimeout(() => element.classList.toggle('content-copied'), 500);
    }
}

const mergeData = (model, data, onlyExisting) => Object.keys(data || {}).forEach((key) => {
    if (typeof model[key] === 'object' && model[key] !== null) {
        if (typeof data[key] === 'object') {
            mergeData(model[key], data[key], onlyExisting);
        }
    } else {
        if (onlyExisting && !(key in model)) {
            return;
        }
        model[key] = data[key];
    }
});

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

const getJsonPageData = () => {
    let jsonPageData = {};
    const jsPattern = /jsonPageData[\s]?=[\s]?(\{.*\});$/;
    Array.from(document.querySelectorAll('script')).every((script) => {
        if (jsPattern.test(script.innerHTML)) {
            const [, jsonStr] = script.innerHTML.match(jsPattern);
            jsonPageData = JSON.parse(jsonStr);
            return false;
        }
        return true;
    });
    console.log('jsonPageData', jsonPageData);
    return jsonPageData;
}

const getJsonPlayerData = () => {
    let jsonPlayerData = {};
    const jsPattern = /jsonPlayerData[\s]?=[\s]?(\{.*\});$/;
    Array.from(document.querySelectorAll('script')).every((script) => {
        if (jsPattern.test(script.innerHTML)) {
            const [, jsonStr] = script.innerHTML.match(jsPattern);
            jsonPlayerData = JSON.parse(jsonStr);
            return false;
        }
        return true;
    });
    console.log('jsonPlayerData', jsonPlayerData);
    return jsonPlayerData;
}

const getTurnStatus = () => {
    let turnStatus = {};
    const jsPattern = /turnStatus[\s]?=[\s]?(\{.*\});/;
    Array.from(document.querySelectorAll('script')).every((script) => {
        if (jsPattern.test(script.innerHTML)) {
            const [, jsonStr] = script.innerHTML.match(jsPattern);
            turnStatus = JSON.parse(jsonStr);
            return false;
        }
        return true;
    });
    console.log('turnStatus', turnStatus);
    return turnStatus;
}

//const currentTurn = () => document.querySelector('#turnNumber').innerText;
const currentTurn = () => getTurnStatus().turnNumber;

const schemeType = /class=\"(neutral|hostile|friendly|allied)\"/
const getSchemeType = (el) => {
    const r = schemeType.exec(el.outerHTML);
    return r[1] || 'unknown';
};


const globalMessage = (message, cssClass, timeout) => {
    timeout || (timeout = 1000);
    cssClass || (cssClass = '');
    const header = document.querySelector('#playerBox');
    if (!header) {
        console.log('missing header');
        return;
    }
    let globalMessage = document.querySelector('#globalMessage');
    if (!globalMessage) {
        header.insertAdjacentHTML('beforebegin', `<div id="globalMessage"></div>`);
        globalMessage = document.querySelector('#globalMessage');
    }
    globalMessage.insertAdjacentHTML('beforeend', `<div class="green ${cssClass}">${message}</div>`);
    setTimeout(() => {
        const msg = document.querySelector('#globalMessage > div:last-child');
        msg && msg.remove();
    }, timeout);
};


