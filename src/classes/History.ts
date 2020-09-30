export class History {
  private history = new Map();

  setHistory(key: number, value) {
    this.history.set(key, value);
  }

  getHistory(key: number) {
    this.history.get(key)
  }

}