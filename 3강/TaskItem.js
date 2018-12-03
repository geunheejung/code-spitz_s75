const TaskItem = class extends Task {
  constructor(title, date = Date.now()) {
    super(title);
    this._date = date;
    this._isComplete = false;
  }
  
  isComplete() { return this._isComplete; }
  sortTitle(task) { return this._title > task._title; }
  sortDate(task) { return this._date > task._date; }

  toggle() { this._isComplete = !this._isComplete; }
}