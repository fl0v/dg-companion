
// WIP

const companionMeta = [
    {
        name: 'allianceRanking',
        label: 'Enhance alliance ranking page',
        default: true,
    },
    {
        name: 'battleReport',
        label: 'Enhance battle report page',
        default: true,
    },
    {
        name: 'fleetScan',
        label: 'Enhance fleet scan page',
        default: true,
    },
    {
        name: 'planetsStats',
        label: 'Add planets stats',
        default: true,
    },
    {
        name: 'radarPage',
        label: 'Enhance radar page',
        default: true,
    },

];


const usefullLinks = [
    {
        label: 'Manual',
        url: 'https://manual.darkgalaxy.com/',
        category: 'Official',
    },
    {
        label: 'Discord',
        url: 'https://discord.gg/rmsMdPM',
        category: 'Official',
    },
    {
        label: 'helloweenpt.com tools',
        url: 'https://helloweenpt.com/darkgalaxy/',
        category: 'Tools',
    },
    {
        label: 'Resource calculator',
        url: 'https://n00b.org.uk/res.html',
        category: 'Tools',
    },
    {
        label: 'BO builder',
        url: 'https://bo.n00b.org.uk',
        category: 'Tools',
    },
    {
        label: 'Arcopix user scripts',
        url: 'https://github.com/Arcopix/dg-tools',
        cateogry: 'Scripts',
    },
    {
        label: 'Fl0v user scripts',
        url: 'https://github.com/fl0v/dg',
        cateogry: 'Scripts',
    },
];


const getSettings = () => {
    return chrome.storage.sync.get(settings, (items) => {
        // document.getElementById(__setting__).value = items.__setting__;
    });
}

const saveSettings = (settings) => {
    chrome.storage.sync.set(settings, () => {
        // settings saved feedback
        // const status = document.getElementById('status');
        //   status.textContent = 'Settings saved.';
        //   setTimeout(() => {
        //     status.textContent = '';
        //   }, 750);
    });
    chrome.runtime.sendMessage({
        name: "settings",
        data: settings,
    });

};