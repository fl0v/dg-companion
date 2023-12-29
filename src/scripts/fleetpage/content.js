/**
 * Total score
 * 
 * @TODO wait time wizard
 * @TODO transfer all in fleet transfer page
 */
(function () {
    /*
     * 999999
     */
    Array.from(document.querySelectorAll('.transferRow input[type="number"]')).forEach((input) => {
        const row = input.closest('.transferRow');
        row.insertAdjacentHTML('beforeend', `<div class="left"><span class="add-max-icon" title="Click to fill max value"></span></div>`);
        row.addEventListener('click', e => {
            if (e.target.classList.contains('add-max-icon')) {
                const input = row.querySelector('input');
                input && (input.value = MAX_INPUT_VALUE);
            }
        });
    });
    Array.from(document.querySelectorAll('.fleetLeft .tableHeader')).forEach((row) => {
        if (/Amount/.test(row.innerText)) {
            row.querySelector(':last-child').insertAdjacentHTML('beforeend', `<span class="add-max-icon" title="Click to fill max value for all rows"></span>`);
            row.addEventListener('click', e => {
                if (e.target.classList.contains('add-max-icon')) {
                    Array.from(row.parentNode.querySelectorAll('.transferRow input')).forEach((item) => {
                        item.value = MAX_INPUT_VALUE;
                    });
                }
            });
        }
    });
    // transfer page headers
    Array.from(document.querySelectorAll('form input[name="sourceId"]')).forEach((el) => {
        const container = el.closest('.left');
        const header = container ? container.querySelector('.header') : null;
        if (container && header) {
            header.insertAdjacentHTML('beforeend', `<span class="add-max-icon" title="Click to fill max value for all rows"></span>`);
            header.addEventListener('click', e => {
                if (e.target.classList.contains('add-max-icon')) {
                    Array.from(container.querySelectorAll('.transferRow input[type="number"]')).forEach((item) => {
                        item.value = MAX_INPUT_VALUE;
                    });
                }
            });
        }
    });


    const fleetRightContainer = document.querySelector('#contentBox .right.fleetRight');
    const fleetActivityContainer = document.querySelector('#contentBox .fleetRight > .fleetRight .entry');
    const fleetHeader = document.querySelector('#contentBox > .header');
    if (!fleetRightContainer || !fleetHeader || !fleetActivityContainer) {
        return;
    }


    /*
     * Add some ids to fleet sections
     */
    Array.from(fleetRightContainer.querySelectorAll('.right > .header'))
        .forEach((h) => h.parentNode.setAttribute('id', buildId(h.innerText)));


    const [, fleetName] = /Fleet List -[\s«]+(.*)[»]?/i.exec(fleetHeader.innerText);
    const [, fleetId] = /\/([\d]+)\//.exec(document.location.href);
    const fleet = new dgFleet(cleanText(fleetName), {
        id: fleetId,
        status: cleanText(fleetActivityContainer.innerText),
    });

    /*
     * Add ships
     */
    const fleetItems = Array.from(fleetRightContainer.querySelectorAll('.entry'));
    const shipPattern = /([\d,]+)x\s(.*)/; // 6,123x Fighter
    const totalScore = fleetItems.reduce((carry, item) => {
        if (shipPattern.test(item.innerText)) {
            const [, cnt, name] = item.innerText.match(shipPattern);
            const score = parseValue(cnt) * getItemScoreByName(name);
            fleet.addShip(name, parseValue(cnt), score);
            item.querySelector('div:last-child').insertAdjacentHTML('beforeend', `${scoreTemplate(score)}`);
            carry += score;
        }
        return carry;
    }, 0);
    fleet.setScore(totalScore);


    /*
     * Show score
     */
    fleetRightContainer.insertAdjacentHTML('beforeend', scoreSectionTemplate(fleet.compositionWfScore, fleet.score));


    /*
     * Fleet/planet direct links
     */
    const transferToPlanetPattern = /location\/([\d]+)/;
    const transferToFleetPattern = /mobile\/([\d]+)/;
    Array.from(fleetRightContainer.querySelectorAll('#transfer-targets a'))
        .forEach((el) => {
            const url = el.getAttribute('href');
            if (transferToPlanetPattern.test(url)) {
                const [, toPlanetId] = transferToPlanetPattern.exec(url);
                el.setAttribute('title', Memo.planet(toPlanetId).content);
                el.parentNode.classList.add('d-flex');
                el.parentNode.classList.add('flex-jcsb');
                el.insertAdjacentHTML('afterend', `<a class="itemLink" href="${dgPlanet.planetUrl(toPlanetId)}"><i class="icon view-icon"></i></a>`);
            } else if (transferToFleetPattern.test(url)) {
                const [, toFleetId] = transferToFleetPattern.exec(url);
                el.setAttribute('title', Memo.fleet(toFleetId).content);
                el.parentNode.classList.add('d-flex');
                el.parentNode.classList.add('flex-jcsb');
                el.insertAdjacentHTML('afterend', `<a class="itemLink" href="${dgFleet.fleetUrl(toFleetId)}"><i class="icon view-icon"></i></a>`);
            }
        });



    /*
     * Saved fleets
     *     
     * @TODO remove any saved fleets on previous days
     */
    const totalFleets = new SavedFleets();
    totalFleets.hasFleetId(fleet.id) && totalFleets.addFleet(fleet, true); // refresh fleet data if it was saved already
    fleetRightContainer.insertAdjacentHTML('beforeend', savedFleetsSectionTemplate(totalFleets, true));
    const savedFleetsInner = fleetRightContainer.querySelector('#saved-fleets .saved-fleets-inner');

    // save fleet action/icon
    fleetRightContainer.querySelector('#fleet-composition .header')
        .insertAdjacentHTML('beforeend', `
            <span class="saveFleet right" title="Click to add/remove fleet to 'saved fleets'">
                <i class="icon ${totalFleets.hasFleetId(fleet.id) ? 'save-filled-icon' : 'save-icon'}"></i>
            </span>
        `);
    const saveIcon = fleetRightContainer.querySelector('#fleet-composition .saveFleet .icon');
    fleetRightContainer.querySelector('#fleet-composition .saveFleet')
        .addEventListener('click', (event) => {
            saveIcon.classList.toggle('save-icon')
            saveIcon.classList.toggle('save-filled-icon');
            if (totalFleets.hasFleetId(fleet.id)) {
                totalFleets.removeById(fleet.id, true);
            } else {
                totalFleets.addFleet(fleet, true);
            }
            savedFleetsInner.innerHTML = savedFleetsSectionTemplate(totalFleets, false);
        });

    // remove fleet
    savedFleetsInner.addEventListener('click', (event) => {
        const clicked = event.target.closest('.removeFleet');
        if (clicked) {
            event.stopPropagation();
            if (fleet.id == clicked.getAttribute('data-id')) {
                saveIcon.classList.toggle('save-icon');
                saveIcon.classList.toggle('save-filled-icon');
            }
            totalFleets.removeById(clicked.getAttribute('data-id'), true);
            savedFleetsInner.innerHTML = savedFleetsSectionTemplate(totalFleets, false);
            return false;
        }
    });

    // copy to clipboard
    const savedFleetsHeader = fleetRightContainer.querySelector('#saved-fleets .header');
    savedFleetsHeader.insertAdjacentHTML('beforeend', `
        <span class="copyPaste reset-font cursor-pointer right">
            <span class="xls"><i class="icon"></i> sheet</span>
            <span class="chat"><i class="icon"></i> chat</span>
        </span>
    `);
    savedFleetsHeader.querySelector('.copyPaste .xls').addEventListener('click', e => {
        e.preventDefault();
        copyToClipboard(totalFleets.exportXls(), 'Saved fleets data copied to cliboard!', e.target);
        return false;
    });
    savedFleetsHeader.querySelector('.copyPaste .chat').addEventListener('click', e => {
        e.preventDefault();
        copyToClipboard(totalFleets.exportText(), 'Saved fleets data copied to cliboard!', e.target);
        return false;
    });


    /*
     * Fleet memo
     */
    const centerItem = document.querySelector('#contentBox .fleetLeftInnerSmall');
    if (centerItem) {
        centerItem.parentNode.insertAdjacentHTML('beforeend',
            pageSection({
                id: 'fleet-memo',
                title: 'Memo',
                cssClass: 'left ofHidden lightBorder opacBackground seperator fleetLeftInnerSmall',
                content: `<div class="entry opacBackground memo-container"></div>`,
            })
        );
        Memo.fleet(fleet.id).init(document.querySelector('#fleet-memo .memo-container'));
    }


    /*
     * copy/paste summary
     */
    const fleetScore = `Score: ${formatNumber(fleet.score)} / wf: ${formatNumber(fleet.compositionWfScore)}`;
    const fleetCompositionStr = fleet.composition.reduce((carry, fl) => carry + `${pe(fl.name, 13)} ${ps(fl.count, 6)}\n`, ``).trim();
    const fleetQueue = Array.from(document.querySelectorAll('#fleetQueue .entry .nameColumn'));
    const fleetQueueStr = fleetQueue.reduce((carry, el) => carry + cleanText(el.innerText) + "\n", '').trim();

    fleetHeader.insertAdjacentHTML('afterbegin', `
        <span class="right copy-hint reset-font cursor-pointer">Copy fleet summary to clipboard</span>
    `);
    document.querySelector('#contentBox .copy-hint')
        .addEventListener('click', e => {
            e.preventDefault();
            copyToClipboard(textStats(), 'Fleet summary copied to clipboard!', e.target);
            return false;
        });

    const txtBorder = '====================';
    const txtSpacer = '--------------------';
    const textStats = () => {
        const data = [
            txtBorder,
            `Turn: ${currentTurn()} / Fleet: "${fleet.name}"`,
            fleet.status,
            fleetScore,
            txtSpacer,
            fleetCompositionStr,
            txtSpacer,
            `Full queue:`,
            fleetQueueStr,
            txtBorder,
        ];
        return data.join("\n");
    };
    console.log(textStats());

})();

