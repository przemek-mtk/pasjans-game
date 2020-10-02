export class History {
  private _history = new Map();

  setHistory(key: number, value) {
    this._history.set(key, value);
  }

  getHistory(key: number) {
    this._history.get(key)
  }

}