const TaskList = class extends Task {
  constructor(title) { super(title); }
  
  isComplete() {}
  sortTitle() { return this; }
  sortDate() { return this; }
}