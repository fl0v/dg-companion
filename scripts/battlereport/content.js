/**
 * Lost resources
 */

(function () {

    const container = document.querySelector(".invasionReport .report");
    const title = document.querySelector("#contentBox .pageTitle");
    if (!title || title.innerText.trim() !== 'Combat Report') {
        return;
    }

    const items = Array.from(document.querySelectorAll(".report .unit"));

    let lost = {
        owned: {
            metal: 0,
            mineral: 0,
            food: 0,
            energy: 0,
            score: 0,
        },
        allied: {
            metal: 0,
            mineral: 0,
            food: 0,
            energy: 0,
            score: 0,
        },
        hostile: {
            metal: 0,
            mineral: 0,
            food: 0,
            energy: 0,
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

    items.forEach((el) => {
        const itemId = el.children[0].innerText.trim();
        const owned_before = parseValue(el.children[1].innerText);
        const owned_after = parseValue(el.children[2].innerText);
        const allied_before = parseValue(el.children[3].innerText);
        const allied_after = parseValue(el.children[4].innerText);
        const hostile_before = parseValue(el.children[5].innerText);
        const hostile_after = parseValue(el.children[6].innerText);
        const item = getItemById(itemId);
        if (item.score) {
            brscore.before.owned += owned_before * item.score;
            brscore.after.owned += owned_after * item.score;
            brscore.before.allied += allied_before * item.score;
            brscore.after.allied += allied_after * item.score;
            brscore.before.hostile += hostile_before * item.score;
            brscore.after.hostile += hostile_after * item.score;

            /*
             * I'll use negtive number to emphasis the fact that these are lost resources
             */
            lost.owned.metal += (owned_after - owned_before) * item.metal;
            lost.owned.mineral += (owned_after - owned_before) * item.mineral;
            lost.owned.food += (owned_after - owned_before) * item.food;
            lost.owned.energy += (owned_after - owned_before) * item.energy;
            lost.owned.score += (owned_after - owned_before) * item.score;

            lost.allied.metal += (allied_after - allied_before) * item.metal;
            lost.allied.mineral += (allied_after - allied_before) * item.mineral;
            lost.allied.food += (allied_after - allied_before) * item.food;
            lost.allied.energy += (allied_after - allied_before) * item.energy;
            lost.allied.score += (allied_after - allied_before) * item.score;

            lost.hostile.metal += (hostile_after - hostile_before) * item.metal;
            lost.hostile.mineral += (hostile_after - hostile_before) * item.mineral;
            lost.hostile.food += (hostile_after - hostile_before) * item.food;
            lost.hostile.energy += (hostile_after - hostile_before) * item.energy;
            lost.hostile.score += (hostile_after - hostile_before) * item.score;
        }
    });

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
                        <td class="opacLightBackground">${formatNumberInt(lost.owned.metal)}</td>
                        <td class="opacLightBackground">${formatNumberInt(lost.allied.metal)}</td>
                        <td class="opacLightBackground">${formatNumberInt(lost.hostile.metal)}</td>
                    </tr>
                    <tr class="unit text-right">
                        <td class="opacBackground text-left">Mineral</td>
                        <td class="opacLightBackground">${formatNumberInt(lost.owned.mineral)}</td>
                        <td class="opacLightBackground">${formatNumberInt(lost.allied.mineral)}</td>
                        <td class="opacLightBackground">${formatNumberInt(lost.hostile.mineral)}</td>
                    </tr>
                     <tr class="unit text-right">
                        <td class="opacBackground text-left">Food</td>
                        <td class="opacLightBackground">${formatNumberInt(lost.owned.food)}</td>
                        <td class="opacLightBackground">${formatNumberInt(lost.allied.food)}</td>
                        <td class="opacLightBackground">${formatNumberInt(lost.hostile.food)}</td>
                    </tr>
                    <tr class="unit text-right">
                        <td class="opacBackground text-left">Energy</td>
                        <td class="opacLightBackground">${formatNumberInt(lost.owned.energy)}</td>
                        <td class="opacLightBackground">${formatNumberInt(lost.allied.energy)}</td>
                        <td class="opacLightBackground">${formatNumberInt(lost.hostile.energy)}</td>
                    </tr>
                    <tr class="unit text-right">
                        <td class="opacBackground text-left">Total (Yours + Allied)</td>
                        <td class="opacBackground" colspan="2">
                            ${formatNumberInt(lost.owned.metal + lost.owned.mineral + lost.owned.food + lost.owned.energy
            + lost.allied.metal + lost.allied.mineral + lost.allied.food + lost.allied.energy)}
                        </td>
                        <td class="opacBackground">
                            ${formatNumberInt(lost.hostile.metal + lost.hostile.mineral + lost.hostile.food + lost.hostile.energy)}
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
        `
    );

})();

