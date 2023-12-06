
const scoreTemplate = (score) => `<span class="score neutral right"><em>${formatNumber(score.toFixed(2))}</em></span>`;

const fleetPageSection = (options) => `
    <div id="${options.id}" class="${options.cssClass || 'right ofHidden lightBorder opacDarkBackground seperator seperatorLeft fleetRight'}"> 
        <div class="header border">
            <img src="/images/buttons/construction.png" class="icon" width="28" height="29">
            ${options.title}
        </div> 
        ${options.content}                    
    </div>
`;

const scoreSectionTemplate = (wfScore, totalScore) => fleetPageSection({
    id: 'fleet-score',
    title: 'Score',
    content: `
        <div class="entry opacBackground" style="line-height: 24px; padding: 4px"> 
            <span class="left">Only war fleet</span>                 
            <span class="right">${scoreTemplate(wfScore)}</span> 
        </div> 
        <div class="entry opacLightBackground" style="line-height: 24px; padding: 4px"> 
            <span class="left">All ships and cargo</span>                 
            <span class="right">${scoreTemplate(totalScore)}</span> 
        </div> 
    `,
});

const savedFleetsSectionTemplate = (savedFleets, addHeader) => {
    const content = [];
    if (savedFleets.countFleets) {
        content.push(
            Object.values(savedFleets.allFleets)
                .reduce((carry, f) => carry + `
                    <div class="entry opacLightBackground relative-container" style="padding: 4px">
                        <a class="fleetName" href="${f.getUrl()}">${f.name}</a>
                        <span class="fleetStatus">${f.status}</span>
                        <span class="removeFleet cursor-pointer" data-id="${f.id}">&times;</span>
                    </div>
                `, '')
        );
        content.push(`
            <div class="entry opacBackground" style="padding: 4px">
                <div style="width:200px;margin-left:auto; margin-right:auto;">
                    ${fleetScanFleetGroupTemplate(savedFleets.totalFleet)}
                </div>
            </div>
        `);
    } else {
        content.push('<div class="entry opacBackground text-center" style="padding: 4px">No fleets saved</div>');
    }
    if (addHeader) {
        return fleetPageSection({
            id: 'saved-fleets',
            title: 'Saved fleets',
            content: `<div class="saved-fleets-inner">${content.join("\n")}</div>`,
        });
    } else {
        return content.join("\n");
    }
};
