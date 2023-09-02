/**
 * Research summary
 * @TODO copy to cliboard
 */

/*
 * Index all researched/in queue items
 */

const researchImgPattern = /\/([^\/]+)\.png/;
const titlePattern1 = /Enables Construction of ([^<]+)</;
const titlePattern2 = />([^<]+)</;
const bonusPattern = /\sby\s([\d%]+)/;
const itemsList = Array.from(document.querySelectorAll('form .researchButton'));
const allResearchedItems = [];
const inQueue = [];
itemsList.forEach((el) => {
    if (el.classList.contains('researchDone') || el.classList.contains('researchQueued')) {
        const imgUrl = el.querySelector('.researchImage img').src;
        const done = el.classList.contains('researchDone');
        const infoEl = el.querySelector('.infoText');
        const queue = !done && infoEl ? parseInt(infoEl.innerText, 10) : 0;
        const code = researchImgPattern.exec(imgUrl);
        let title = el.getAttribute('oldtitle');
        let bonus = null;
        if (titlePattern1.test(title)) {
            [, title] = titlePattern1.exec(title);
        } else {
            [, title] = titlePattern2.exec(title);
            [, bonus] = bonusPattern.exec(title);
        }
        const parent = el.parentNode.querySelector('.researchTitle > div:nth-child(1)');
        const item = {
            parent: parent ? parent.innerText : '',
            title: title,
            bonus: bonus,
            code: code[1] ?? '',
            image: imgUrl,
            done: done,
            queue: queue,
        };
        allResearchedItems.push(item);
        item.queue && (inQueue[item.queue] = item);
    }
});


/*
 * group items by research types
 */

class ResearchType {
    name;
    currentBonus;
    items = [];

    constructor(name, currentBonus) {
        this.name = name;
        this.currentBonus = this.extractBonus(currentBonus);
        this.currentBonus = this.currentBonus == '0%' || this.currentBonus == '' ? null : this.currentBonus;
        this.items = this.filterItems(allResearchedItems);
    }

    extractBonus(str) {
        const m = /([\d%]+)/.exec(String(str));
        return m && m[1] ? m[1] : '';
    }

    filterItems(allDone) {
        return allDone.reduce((carry, item) => {
            if (item.done && item.parent === this.name) {
                carry.push(item);
            }
            return carry;
        }, []);
    }

    buildSummary(includeBonus) {
        return this.items.reduce((carry, item) => {
            if (item.bonus) {
                if (includeBonus) {
                    carry.push('+' + item.bonus);
                }
            } else {
                carry.push(item.title);
            }
            return carry;
        }, []);
    }
}

const researchTypesList = Array.from(document.querySelectorAll('.researchTitle'));
const allResearchTypes = [];
researchTypesList.forEach((el) => {
    const type = el.querySelector('div:nth-child(1)');
    const currentBonus = el.querySelector('div:nth-child(2)');
    if (type) {
        allResearchTypes.push(new ResearchType(type.innerText, currentBonus ? currentBonus.innerText : ''));
    }
});
console.log('allResearchTypes', allResearchTypes);


/*
 * Add summary box
 */

const summaryResearchDone = () => {
    const items = allResearchTypes.reduce((carry, research) => {
        let summary = [];
        if (research.currentBonus) {
            summary.push('+' + research.currentBonus);
        }
        summary = summary.concat(research.buildSummary());
        if (summary.length) {
            carry.push('<li><b>' + research.name + ':</b> ' + summary.join(', ') + '</li>');
        }
        return carry;
    }, []);
    return items.join('');
};

const summaryResearchQueue = () => {
    return inQueue.reduce((carry, item) => {
        return carry + '<li>' + item.title + '</li>';
    }, '');
};

const topBox = document.querySelector('#contentBox .opacBackground > .lightBorder');
topBox.insertAdjacentHTML('afterbegin', `
    <div class="right researchSummary">
        <div class="padding researched">
            <h4>Summary:</h4>
            <ul>${summaryResearchDone()}</ul>
        </div>
        <div class="padding in-queue">
            <h4>In queue:</h4>
            <ol>${summaryResearchQueue()}</ol>
        </div>
    </div>
`);
