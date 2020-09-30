export class History {
    constructor() {
        this.history = new Map();
    }
    setHistory(key, value) {
        this.history.set(key, value);
    }
    getHistory(key) {
        this.history.get(key);
    }
}
