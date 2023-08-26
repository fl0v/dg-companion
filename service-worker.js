console.log("Hi from background script file");


// chrome.browserAction.setBadgeBackgroundColor({ color: [190, 190, 190, 230] });
// chrome.browserAction.setBadgeText({ text: "12" });





// chrome.tabs.onCreated.addListener(tab => {
//     chrome.browserAction.setBadgeBackgroundColor({ color: '#F00' }, () => {
//         chrome.browserAction.setBadgeText({ text: '123' });
//     });
// });


const dgState = {
    andromeda: {
        start: new Date('30 Jul 2023 18:00:00'),
    }
}

const updateTurn = () => {
    const ms = 1000 * 60 * 60;
    const now = new Date();
    const turns = parseInt((now - dgState.andromeda.start) / ms, 10);
    //chrome.action.setBadgeBackgroundColor({ color: [190, 190, 190, 230] });
    chrome.action.setBadgeText({ text: turns.toString() });
};

//chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => updateTurn());


let rule1 = {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: '.darkgalaxy.com' }
        })
    ],
    actions: [updateTurn()]
};


chrome.runtime.onInstalled.addListener(function (details) {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([rule1]);
    });
});



// const updateIcon = tabId => {
//   const icon = isDisabled() ? icons.disabled : icons.enabled;
//   chrome.pageAction.setIcon({ tabId, path: icon });
// };
// chrome.tabs.onUpdated.addListener(updateIcon);








