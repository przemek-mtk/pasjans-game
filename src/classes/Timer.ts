import { ITimer } from "../interfaces/ITimer";

export class Timer implements ITimer {
  private seconds: number = 0;
  private timer: number;

  constructor(public container: HTMLDivElement) {
    this.setTimerContext();
  }
  // odpowiada za poprawne wyświetlenie czasu
  private setTimerContext() {
    let min: number | string = Math.floor((this.seconds % 3600) / 60);
    let sec: number | string = this.seconds % 60;
    let hours: number | string = 0;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    if (this.seconds >= 3600) {
      hours = Math.floor(this.seconds / 3600);
      hours = hours < 10 ? "0" + hours : hours;
      this.container.textContent = `Time: ${hours}:${min}:${sec}`;
    } else {
      this.container.textContent = `Time: ${min}:${sec}`;
    }
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
