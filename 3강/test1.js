const PROP = (_self, props) => Object.assign(_self, props);
const ERR = (erMsg = 'invalid') => { 
  throw erMsg; 
};

const IS_OVERRIDE = () => ERR('override');
const isInstance = (instanceObj, instanceClass) => instanceObj instanceof instanceClass;

const Task = class {
  static title(a, b) { return a._sortTitle(b); }
  
  constructor() {
    PROP(this, {
      _list: [],
    });
  }

  add(task) {
    if (isInstance(task, Task)) this._list.push(task);
    else ERR();
  }

  toggle(task) {
    if (isInstance(task, Task)) task._isComplete = !task._isComplete;
    else ERR();
  }

  remove(parent, task) {}

  /*
  {
    item: Task,
    children: [
      {
        item: Task,
        children: [

        ]
      },
      {
        item: Task,
        children: [
          {
            item: Task,
            children: [

            ]
          }
        ],
      },
    ]
  }
  */
  getResult(_sort, stateGroup) {
    /**
     * getResult 동작
     * 1. item은 자기 자신으로,
     * 2. children은 자기 자신의 자식들을 loop도는데 돌면서 다시 
     * 2.1 item은 자기 자신으로하고,
     * 2.2 children은 자기 자식들로 getResult 재귀를 돌아야한다. 그리고 list가 빈배열일 경우에 해당 children의 getResult loop가 끝난다.
     */

    const _list = [...this._list];

    const stateGrouping = stateGroup 
      ? [
        ..._list.filter(i => i._isComplete()),
        ..._list.filter(i => !i._isComplete()),
      ] 
      : [...list];

    return {
      item: this,
      children: (_sort ? stateGrouping.sort(_sort) : stateGrouping).map(v => v.getResult(_sort, stateGroup))
    }
  }

  _isComplete() { IS_OVERRIDE(); }
  _sortTitle() { IS_OVERRIDE(); }
  _sortDate() { IS_OVERRIDE(); }
}

const TaskList = class extends Task {
  _isComplete() {
    return;
  }
  _sortTitle() { return this; }
  _sortDate() { return this; }
}

const TaskItem = class extends Task {
  constructor(title, date = new Date()) {
    PROP(this, { 
      _title: title, 
      _date: date, 
      _isComplete: false
    });
  }

  toggle() {
    this._isComplete = !this._isComplete;
  }
  _isComplete() { return this._isComplete; }
  _sortTitle(task) { return this._title > task._title; }
  _sortDate(task) { return this._date > task._date; }
}

const list1 = new TaskList('이디야');
const sub = new TaskList('커피');
const sub1 = new TaskList('과자');
list1.add(sub);
list1.add(sub1);
const subsub1 = new TaskItem('배고프다.');
sub1.add(subsub1);
console.log(list1.getResult(Task.title, true));

// const subsub = new TaskItem('아메리카노');
// const subsub1 = new TaskItem('카페라뗴');

// sub.add(subsub);
// sub.add(subsub1);

// const subsub2 = new TaskItem('빼빼로');
// const subsub21 = new TaskItem('깐쵸');

// sub1.add(subsub2);
// sub1.add(subsub21);

// const renderer = new DomRenderer();
// renderer.render(list1);