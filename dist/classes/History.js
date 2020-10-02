export class History {
    constructor() {
        this._history = new Map();
    }
    setHistory(key, value) {
        this._history.set(key, value);
    }
    getHistory(key) {
        this._history.get(key);
    }
}
