export class Timer {
    constructor(container) {
        this.container = container;
        this.seconds = 0;
        this.setTimerContext();
    }
    // odpowiada za poprawne wyświetlenie czasu
    setTimerContext() {
        let min = Math.floor(this.seconds / 60);
        let sec = this.seconds % 60;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        this.container.textContent = `Time: ${min}:${sec}`;
    }
    // start zegara
    startTimer() {
        this.timer = setInterval(() => {
            this.seconds += 1;
            this.setTimerContext();
        }, 1000);
    }
    // reset zegara przy "new game"
    resetTimer() {
        clearInterval(this.timer);
        this.seconds = 0;
        this.setTimerContext();
        this.startTimer();
    }
}
