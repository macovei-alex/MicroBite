export default class Observable<CallbackFn extends (...args: any[]) => void> {
  private observers: CallbackFn[] = [];

  subscribe(observer: CallbackFn) {
    this.observers.push(observer);
  }

  unsubscribe(observer: CallbackFn) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(...args: any[]) {
    this.observers.forEach((observer) => observer(...args));
  }
}
