

const elGameState = document.querySelector('#game-state ul');

dgRoundsMeta.forEach((round) => {
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


/*
 * WIP
 */


// document.getElementById('options').addEventListener('change', (event) => {
//   event.preventDefault();
//   console.log('changed', event.taget.name, event.target.checked);
//   let settings = {};
//   settings[event.target.name] = event.target.checked;
//   saveSettings(settings);
//   return false
// });


