import { ITimer } from "../interfaces/ITimer";

export class Timer implements ITimer {
  private seconds: number = 0;
  private timer: number;

  constructor(public container: HTMLDivElement) {
    this.setTimerContext();
  }
  // odpowiada za poprawne wyświetlenie czasu
  private setTimerContext() {
    let min: number | string = Math.floor(this.seconds / 60);
    let sec: number | string = this.seconds % 60;
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
