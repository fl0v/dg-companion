/**
 * Simple memo logic used for fleets, planets, ...
 * 
 * @TODO leverage chrome.storage.sync https://developer.chrome.com/docs/extensions/reference/api/storage
 */
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
        // chrome.storage.sync.get([itemId])
        //     .then((data) => {
        //         this.content = data[itemId];
        //         console.log('loaded', itemId, this.content);
        //     });
        this.content = localStorage.getItem(itemId) || '';
    }

    save() {
        const itemId = this.contentId();
        // chrome.storage.sync.set({ itemId: this.content })
        //     .then(() => console.log('saved', itemId, this.content));
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

    static planet = (id) => new Memo('planet-' + id);
    static fleet = (id) => new Memo('fleet-' + id);

}