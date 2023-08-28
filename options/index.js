
// default options
let options = {
  syncUrl: '', // to use for warfleet centrlisation, radar centralisation
  syncToken: '', // usper individual token
  themeUrl: '', // include external css to customise ui
  allianceColors: '[RoF] #ff0000 [SoL] #9f0000',
};

// Saves options to chrome.storage
const saveOptions = () => {

  // @todo collect options from document

  chrome.storage.sync.set(options, () => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(options, (items) => {

    document.getElementById('idSyncUrl').value = items.syncUrl;
    document.getElementById('idSyncToken').value = items.syncToken;
    document.getElementById('idThemeUrl').value = items.themeUrl;
    document.getElementById('idAllianceCollors').value = items.allianceColors;
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);

document.getElementById('save').addEventListener('click', saveOptions);