/**
 * Templates used to display fleet scan summary
 */

const fleetScanShipTemplate = (name, count) => `
    <tr class="opacBackground lightBorderBottom">
        <td class="padding">${name}</td>
        <td class="padding" style="width:70px;text-align:right;">${count > 0 ? count : ''}</td>
    </tr>
`;

/**
 * Column block for one alliance or for owned fleets
 */
const fleetScanFleetGroupTemplate = (fleet) => {
    dgFleet.sortShips(fleet.composition);
    const tplBody = fleet.composition
        //.filter()
        .reduce((carry, s) => carry + fleetScanShipTemplate(s.name, s.count), '');
    const score = [];
    fleet.compositionWfScore && score.push(`<b title="wf score">${fleet.compositionWfScore.toFixed(2)}</b>`);
    fleet.score && score.push(`<b title="total score">${fleet.score.toFixed(2)}</b>`);
    return `
        <div class="lightBorder column">
            <div class="opacLightBackground ofHidden padding">
                <div class="${fleet.type}">
                    <div class="fleetBlockTitle">${fleet.name}</div>
                </div>
            </div>
            <table><tbody>
                ${tplBody}
            </tbody></table>
            <div class="fleetBlockScoreContainer text-center neutral opacLightBackground">${score.length ? `(score ${score.join(' / ')})` : ''}</div>
        </div>
    `;
}

/**
 * A big row for all fleets arriving at the same time (totals)
 * ex: {rowCount: 0, type: 'friendly', title: 'Alliance', score: 0, fleet: { shipName: 0, ...}}
 */
const fleetScanPageRowTemplate = (title, groups) => {
    let tplBody = '';
    groups.forEach((f) => {
        if (f.hasShips) {
            tplBody += fleetScanFleetGroupTemplate(f);
        } else {
            tplBody += '<div class="column"></div>'; // just spacer to keep the column for owned fleets
        }
    });
    return `
        <div class="header border">${title}</div>
        <div class="d-flex-row-wrap ws-nowrap">
            ${tplBody}
        </div>
    `;
};