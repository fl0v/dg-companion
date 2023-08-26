

const elGameState = document.querySelector('#game-state ul');

dgRoundsMeta.forEach((round) => {
  if (round.hasStarted() && !round.hasEnded()) {
    elGameState.insertAdjacentHTML('beforeend', `
      <li>
        ${round.name} turn ${round.getTurn()}
      </li>
    `);
  } else if (!round.hasStarted() && !round.hasEnded()) {
    const start = round.start.toLocaleDateString('en-GB', {
      timeZone: 'UTC',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    elGameState.insertAdjacentHTML('beforeend', `
      <li>
        ${round.name} will start on ${start}
      </li>
    `);
  }
});


















const settings = {
  allianceRanking: true,
  radarPage: false,
};

chrome.storage.sync.get(settings, (items) => {
  // document.getElementById('color').value = items.favoriteColor;
  // document.getElementById('like').checked = items.likesColor;
});

// document.getElementById('options').addEventListener('change', (event) => {
//   event.preventDefault();
//   console.log('changed', event.taget.name, event.target.checked);
//   settings[event.target.name] = event.target.checked;
//   saveSettings(settings);
//   return false
// });


const saveSettings = (settings) => {
  chrome.storage.sync.set(settings, () => {
    // settings saved feedback
    // const status = document.getElementById('status');
    //   status.textContent = 'Options saved.';
    //   setTimeout(() => {
    //     status.textContent = '';
    //   }, 750);
  });
  chrome.runtime.sendMessage({
    name: "settings",
    data: settings,
  });

};

