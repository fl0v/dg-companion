/**
 * Average score + sorting
 */   

const parentList = document.querySelector('.rankingsList');
const rows = Array.from(parentList.querySelectorAll('.entry'));
const header = parentList.querySelector('.tableHeader');
const scoreHeader = header.querySelector('.score');
const membersHeader = header.querySelector('.members');

const getScore = (row) => {
    let score = row.querySelector('.score').innerText;
    return parseInt(score.replace(/,/g, ''), 10);
};

const getMembersCount = (row) => {
    let count = row.querySelector('.members').innerText;
    return parseInt(count, 10);
};

// Add average
rows.forEach((row) => {
    const score = getScore(row);
    const members = getMembersCount(row);
    const avg = score > 0 ? (score / members).toFixed(2) : null;

    // store data to use it for sorting
    row.dataset.score = score;
    row.dataset.average = avg;
    row.dataset.members = members;

    // add value in row
    const scoreEl = row.querySelector('.score');
    scoreEl.classList.toggle('right', false);
    scoreEl.classList.toggle('left', true);
    scoreEl.insertAdjacentHTML('afterend', `<div class="left average">${avg}</div>`);
});

// Add 'Average' header
header.insertAdjacentHTML('beforeend', `<div class="title average"><a href="#">Avg</a></div>`);
// Add other sort links
scoreHeader.innerHTML = '<a href="#">Score</a>';
membersHeader.innerHTML = '<a href="#">Members</a>';

// Sorting
header.addEventListener('click', (event) => {
    event.preventDefault();
    const clicked = event.target.closest('.title');
    if (clicked.classList.contains('average')) {
        rows.sort((a, b) => b.dataset.average - a.dataset.average);
    } else if (clicked.classList.contains('members')) {
        rows.sort((a, b) => b.dataset.members - a.dataset.members);
    } else {
        rows.sort((a, b) => b.dataset.score - a.dataset.score);
    }
    rows.forEach((row, idx) => row.querySelector('.rank').innerText = idx + 1); // update rank
    parentList.replaceChildren(header, ...rows);
    return false;
});
