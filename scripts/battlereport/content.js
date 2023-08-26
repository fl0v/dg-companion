
let lost = {
    owned: {
        metal: 0,
        mineral: 0,
        score: 0,
    },
    allied: {
        metal: 0,
        mineral: 0,
        score: 0,
    },
    hostile: {
        metal: 0,
        mineral: 0,
        score: 0,
    },
};
let brscore = {
    before: {
        owned: 0,
        allied: 0,
        hostile: 0,
    },
    after: {
        owned: 0,
        allied: 0,
        hostile: 0,
    },
};

document.querySelectorAll(".report .unit").forEach((el) => {
    const shipName = el.children[0].innerText.trim();
    const owned_before = parseValue(el.children[1].innerText);
    const owned_after = parseValue(el.children[2].innerText);
    const allied_before = parseValue(el.children[3].innerText);
    const allied_after = parseValue(el.children[4].innerText);
    const hostile_before = parseValue(el.children[5].innerText);
    const hostile_after = parseValue(el.children[6].innerText);
    if (shipName in dgMeta) {
        brscore.before.owned += owned_before * dgMeta[shipName].score;
        brscore.after.owned += owned_after * dgMeta[shipName].score;
        brscore.before.allied += allied_before * dgMeta[shipName].score;
        brscore.after.allied += allied_after * dgMeta[shipName].score;
        brscore.before.hostile += hostile_before * dgMeta[shipName].score;
        brscore.after.hostile += hostile_after * dgMeta[shipName].score;

        /*
         * I'll use negtive number to emphasis the fact that these are lost resources
         */
        lost.owned.metal += (owned_after - owned_before) * dgMeta[shipName].metal;
        lost.owned.mineral += (owned_after - owned_before) * dgMeta[shipName].mineral;
        lost.owned.score += (owned_after - owned_before) * dgMeta[shipName].score;
        lost.allied.metal += (allied_after - allied_before) * dgMeta[shipName].metal;
        lost.allied.mineral += (allied_after - allied_before) * dgMeta[shipName].mineral;
        lost.allied.score += (allied_after - allied_before) * dgMeta[shipName].score;
        lost.hostile.metal += (hostile_after - hostile_before) * dgMeta[shipName].metal;
        lost.hostile.mineral += (hostile_after - hostile_before) * dgMeta[shipName].mineral;
        lost.hostile.score += (hostile_after - hostile_before) * dgMeta[shipName].score;
    }
});

const container = document.querySelector(".invasionReport .report");
if (container) {
    container.insertAdjacentHTML(
        "beforeend",
        `
        <tfooter>
            <tr class="unit">
                <td class="">Score</td>
                <td class="before">${formatNumber(brscore.before.owned)}</td>
                <td class="">${formatNumber(brscore.after.owned)}</td>
                <td class="before">${formatNumber(brscore.before.allied)}</td>
                <td class="">${formatNumber(brscore.after.allied)}</td>
                <td class="before">${formatNumber(brscore.before.hostile)}</td>
                <td class="">${formatNumber(brscore.after.hostile)}</td>
            </tr>
        </tfooter>
      `,
    );
    container.insertAdjacentHTML(
        "afterend",
        `
            <table class="report">
                <thead>
                    <tr class="top">
                        <td class="first">Resources Lost</td>
                        <td class="friendlyBack">Yours</td>
                        <td class="alliedBack">Allied</td>
                        <td class="hostileBack">Hostile</td>
                    </tr>
                </thead>
                <tbody>
                    <tr class="unit text-right">
                        <td class="opacBackground text-left">Score</td>
                        <td class="opacLightBackground">${formatNumber(lost.owned.score)}</td>
                        <td class="opacLightBackground">${formatNumber(lost.allied.score)}</td>
                        <td class="opacLightBackground">${formatNumber(lost.hostile.score)}</td>
                    </tr>
                    <tr class="unit text-right">
                        <td class="opacBackground text-left">Metal</td>
                        <td class="opacLightBackground">${formatNumber(lost.owned.metal)}</td>
                        <td class="opacLightBackground">${formatNumber(lost.allied.metal)}</td>
                        <td class="opacLightBackground">${formatNumber(lost.hostile.metal)}</td>
                    </tr>
                    <tr class="unit text-right">
                        <td class="opacBackground text-left">Mineral</td>
                        <td class="opacLightBackground">${formatNumber(lost.owned.mineral)}</td>
                        <td class="opacLightBackground">${formatNumber(lost.allied.mineral)}</td>
                        <td class="opacLightBackground">${formatNumber(lost.hostile.mineral)}</td>
                    </tr>
                    <tr class="unit text-right">
                        <td class="opacBackground text-left">Total (Yours + Allied)</td>
                        <td class="opacBackground" colspan="2">
                            ${formatNumber(
            lost.owned.metal + lost.owned.mineral + lost.allied.metal + lost.allied.mineral,
        )}
                        </td>
                        <td class="opacBackground">
                            ${formatNumber(lost.hostile.metal + lost.hostile.mineral)}
                        </td>
                    </tr>
                    <tr class="unit text-right">
                        <td class="opacBackground text-left">Total score lost</td>
                        <td class="opacBackground" colspan="2">
                            ${formatNumber(lost.owned.score + lost.allied.score)}
                        </td>
                        <td class="opacBackground">
                            ${formatNumber(lost.hostile.score)}
                        </td>
                    </tr>
                </tbody>
            </table>
        `,
    );
}

