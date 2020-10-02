export class Timer {
    constructor(container) {
        this.container = container;
        this._seconds = 0;
        this._setTimerContext();
    }
    // odpowiada za poprawne wyświetlenie czasu
    _setTimerContext() {
        let min = Math.floor((this._seconds % 3600) / 60);
        let sec = this._seconds % 60;
        let hours = 0;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        if (this._seconds >= 3600) {
            hours = Math.floor(this._seconds / 3600);
            hours = hours < 10 ? "0" + hours : hours;
            this.container.textContent = `Time: ${hours}:${min}:${sec}`;
        }
        else {
            this.container.textContent = `Time: ${min}:${sec}`;
        }
    }
    // start zegara
    startTimer() {
        this._timer = setInterval(() => {
            this._seconds += 1;
            this._setTimerContext();
        }, 1000);
    }
    // reset zegara przy "new game"
    resetTimer() {
        clearInterval(this._timer);
        this._seconds = 0;
        this._setTimerContext();
        this.startTimer();
    }
}
