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
    return `
        <div class="lightBorder column">
            <div class="opacLightBackground ofHidden padding">
                <div class="${fleet.type}">
                    <div class="allianceName">${fleet.name}</div>
                </div>
            </div>
            <table><tbody>
                ${tplBody}
            </tbody></table>
            <div class="score-container neutral opacLightBackground">(score <b>${fleet.compositionWfScore.toFixed(2)}</b>)</div>
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
        <div class="d-flex">
            ${tplBody}
        </div>
    `;
};