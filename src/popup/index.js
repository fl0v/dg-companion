

const elGameState = document.querySelector('#game-state ul');

dgGamesMeta.forEach((round) => {
  if (round.hasStarted() && !round.hasEnded()) {
    elGameState.insertAdjacentHTML('beforeend', `
      <li>
        <a href="${round.url}" target="_blank">${round.name}</a> turn ${round.getTurn()} / to go: ${round.getTurnsToGo()}
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
        <a href="${round.url}" target="_blank">${round.name}</a> will start on ${start}
      </li>
    `);
  }
});


const changelog = document.querySelector('#changelog');
const version = document.querySelector('#version');
const manifestData = chrome.runtime.getManifest();
version.innerHTML = `<small>(${manifestData.version})</small>`;

/*
const url = chrome.runtime.getURL('CHANGELOG.md');
fetch(url)
  .then((response) => response.text())
  .then((text) => {
    console.log(text);
    changelog.innerHTML = `Change history: <pre>${text}</pre>`;
  });
*/

