
// default options
let options = {
  syncUrl: '',
  syncToken: '',
  themeUrl: '',
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

    document.getElementById('idSyncUrl').checked = items.syncUrl;
    document.getElementById('idSyncToken').checked = items.syncToken;
    document.getElementById('idThemeUrl').value = items.themeUrl;
    document.getElementById('idAllianceCollors').value = items.allianceColors;
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);

document.getElementById('save').addEventListener('click', saveOptions);