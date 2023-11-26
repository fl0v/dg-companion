/**
 * Adds required soldiers + important buildings, also rates planet using size and resource %
 * Uses provided jsonPageData.
 * 
 * @TODO add max soldiers (from pop grouth and food on planet if has Army_Baraks)
 * @TODO enforce structures order
 * @TODO add scan results to storage + export csv of all stored scans
 * @TODO calculate initial ground, orbit space
 * @TODO import feetscan script into this one
 */
(function () {

    const jsonPageData = getJsonPageData();
    const processor = ScanProcessorFactory.factory(jsonPageData.scanType, jsonPageData.turnNumber);
    processor.parse(jsonPageData.scanResult);

    // last #planetHeader in page (works on scan page and news page)
    const scanContainer = Array.from(document.querySelectorAll('#planetHeader')).pop();
    const scanHeader = scanContainer ? scanContainer.parentNode.querySelector('.header') : null; // scan result header
    const planetName = scanContainer ? scanContainer.querySelector('.planetName') : null;
    const imgContainer = scanContainer ? scanContainer.querySelector('#planetImage') : null;
    const ownerContainer = scanContainer ? scanContainer.querySelector('.planetHeadSection:nth-child(3)') : null;

    /*
     * Workers capacity
     */
    if (processor.type === ScanProcessor.TYPE_SURFACE_SCAN && scanContainer) {
        const popPattern = /([\d,]+)\s+\/\s+([\d,]+)\s+\(([\d,]+)\s+available\)/; // will split population  data ex: '52,126 / 100,000 (47,126 available)' 
        scanContainer.querySelectorAll('.resource img').forEach((el) => {
            const resText = el.closest('.resource').innerText;
            const resType = el.getAttribute('title');
            if (resType.match(/Workers/) && popPattern.test(resText)) {
                const [, total, housing, available] = resText.match(popPattern);
                processor.setHouseingCapacity(parseValue(housing));
            }
        });
    }

    /*
     * Rating info under planet image
     */
    if (imgContainer && processor.planetRating) {
        imgContainer.insertAdjacentHTML('beforeend', `
            <span class="planet-rating">
                <b class="custom-accent" title="Planet rating">${formatNumber(processor.planetRating.rating.average)}</b>
            </span>    
        `);
    }

    /*
     * Add info: Req soldiers
     */
    if (scanContainer && processor.requiredSoldiers > 0) {
        scanContainer.querySelector('.planetHeadSection:nth-child(3) .lightBorder .left')
            .insertAdjacentHTML('beforebegin', `
            <div class="right neutral">
                <span class="required-soldier neutral">Soldiers required: <b class="custom-accent">${formatNumberInt(processor.requiredSoldiers)}</b></span>
                <span class="housing neutral">(Max: <b class="custom-accent">${formatNumberInt(processor.requiredSoldiersMax)}</b>)</span>
            </div>
        `);
    }

    /*
     * Add info: Important structures
     */
    if (scanHeader && processor.summary && processor.summary.length > 0) {
        scanHeader.insertAdjacentHTML('beforeend', `
            <div class="right scan-summary">
                Importat: ${processor.summary.join(', ')}
            </div>
        `);
    }

    /*
     * Copy to cliboard / export
     */
    if (planetName && processor.canExport) {
        planetName.insertAdjacentHTML('afterend', `
            <span class="left copyPaste">
                <span class="xls"><i class="icon"></i> sheet</span>
                <span class="chat"><i class="icon"></i> chat</span>
            </span>
        `);
        planetName.parentNode.querySelector('.copyPaste .xls').addEventListener('click', e => {
            e.preventDefault();
            copyToClipboard(processor.exportXls(), 'Scan sheet data copied to cliboard!', e.target);
            return false;
        });
        planetName.parentNode.querySelector('.copyPaste .chat').addEventListener('click', e => {
            e.preventDefault();
            copyToClipboard(processor.exportText(), 'Scan data copied to cliboard!', e.target);
            return false;
        });
        console.log(processor.type, processor.exportText());
    }


})();

