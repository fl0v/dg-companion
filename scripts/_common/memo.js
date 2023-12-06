class Memo {
    static PREFIX = 'memo-';

    id;
    content = '';
    container;

    constructor(id) {
        this.id = id;
        this.load();
    }

    contentId() {
        return buildId(Memo.PREFIX + this.id);
    }

    load() {
        const itemId = this.contentId();
        this.content = localStorage.getItem(itemId);
        console.log('loaded', itemId, this.content);
    }

    save() {
        localStorage.setItem(this.contentId(), this.content);
    }

    init(container) {
        const domId = this.contentId();
        container.insertAdjacentHTML('beforeend', `<textarea id="${domId}" class="memo-input"></textarea>`);
        const input = container.querySelector('#' + domId);
        input.value = this.content;
        input.addEventListener('input', (event) => {
            this.content = event.target.value;
            this.save();
        });
    }

}