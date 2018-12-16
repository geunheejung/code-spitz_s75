const Observer = class {
  observe() { override(); }
}

const Subject = class {
  constructor() {
    prop(this, { _observers: new Set() });    
  }

  addObserver(o) {
    if (!is(o, Observer)) err();
    console.log(this._observers);
    this._observers.add(o);
  }
  removeObserver(o) {
    if (!is(o, Observer)) err();
    this._observers.delete(o);
  }
  notify() {
    this._observers.forEach(o => o.observe());
  }
}

const TaskObserver = class extends Observer {
  constructor(_task) {
    super();
    prop(this, { _task });
  }
  observe() {
    this._task.notify();
  }
}

const Task = class extends Subject {
  static title(a, b) { return a.title.localeCompare(b.title); }
  static date(a, b) { return a._date > b._date; }
  constructor(_title = err(), _date = new Date) {
    super();
    prop(this, { 
      _title, 
      _date,
      _list: [],
      _observer: new TaskObserver(this),
      _stateGroup: true,
    });
  }
  get title() { return this._title; }
  get date() { 
    return this._date.toUTCString(); 
  }
  add(task) {
    if (!is(task, Task)) err();
    this._list.push(task);
    task.addObserver(this._observer);
    this.notify();
  }
  remove(parent, task) {
    const list = this._list;
    if (!is(task, Task)) err();
    parent.list.splice(list.indexOf(task), 1);
    task.removeObserver(this._observer);
    this.notify();
  } 
  getResult(sort, stateGroup = true) {
    const list = this._list;        
    
    const _list = stateGroup 
      ? [
        ...list.filter(v => !v.isComplete()).sort(sort),
        ...list.filter(v => v.isComplete()).sort(sort)
      ]
      : [...list].sort(sort);

    return {
      item: this,
      children: _list.map(v => v.getResult(sort, stateGroup))
    };
  }

  isComplete() { override(); }
}

const TaskItem = class extends Task {
  constructor(title, date) {
    super(title, date);
    this._isComplete = false;
  }
  isComplete() { return this._isComplete; }
  toggle() { 
    this._isComplete = !this._isComplete; 
    this.notify();
  }
};

const TaskList = class extends Task {
  constructor(title, date) { super(title, date); }
  isComplete() { }
};

const Renderer = class extends Observer {
  constructor(_list = err(), _vistor = err()) {    
    super();
    prop(this, { 
      _list, 
      _vistor: prop(
        _vistor, { 
          renderer: this, 
        }),      
      _sort: 'title',
      _stateGroup: true, 
    });
    _list.addObserver(this);
  }

  observe() {
    this.render();
  }

  add(parent, title, date) {
    if (!is(parent, Task)) err();
    parent.add(new TaskItem(title, date));    
  }
  remove(parent, task) {
    if (!is(parent, Task) || !is(task, Task)) err();
    parent.remove(task);    
  }
  toggle(task) {
    if (!is(task, TaskItem)) err();
    task.toggle();    
  }
  render() {
    this._render();    
  }
  toggleGrouping() {
    this._stateGroup = !this._stateGroup;
    this.render();
  }
  _render() {
    override();
  }
}

const Visitor = class {
  set renderer(v) { this._renderer = v; }
  reset() { override(); }
  operation(sort, stateGroup, task) {
    this._start(task);

    task.getResult(sort, stateGroup).children.forEach(
      ({ item }) => this.operation(sort, stateGroup, item)
    );

    this._end();
  }
  _start(task) { override(); }
  _end() { override(); }
}

const DomVisitor = class extends Visitor {
  constructor(_parent) {
    super();
    prop(this, { _parent });
  }
  reset() {
    this._current = el(sel(this._parent), 'innerHTML', '');    
  }
  _start(task) {
    if (!is(this._renderer, Renderer)) err();
    switch (true) {
      case is(task, TaskItem): this._item(task); break;
      case is(task, TaskList): this._list(task); break;
    }

    this._current = this._current.appendChild(el('section', 
      '@marginLeft', '15px',
      'appendChild', el('input', 'type', 'text'),
      'appendChild', el('button', 'innerHTML', 'addTask', 
        'addEventListener', ['click', e => this._renderer.add(task, e.target.previousSibling.value)])
    ));
  }
  _end() {
    this._current = this._current.parentNode;
  }
  _list(task) {
    this._current.appendChild(el('h2', 'innerHTML', task.title));    
  }
  _item(task) {
    [
      el(
        'h3', 'innerHTML', task.title, 
        '@textDecoration', task.date, 
        'datetime', task.date
      ),
      el(
        'time', 'innerHTML', task.date, 
        'datetime', task.date
      ),
      el(
        'button', 'innerHTML', task.isComplete() ? 'progress' : 'complete', 
        'addEventListener', ['click', _ => this._renderer.toggle(task)]
      ),
      el(
        'button', 'innerHTML', 'remove', 
        'addEventListener', ['click', _ => {
          this._renderer.remove(parent, task);
        }]
      ),
    ].forEach(v => this._current.appendChild(v));
  }
}

const DomRenderer = class extends Renderer {
  constructor(_list, _vistor, _parent = err()) {
    super(_list, _vistor);
    const initalState = { _parent };
    prop(this, initalState);
  }

  _render() {
    // 부모 템플릿 메소드의 HOOK
    // 기본 요소를 그려야함.
    this._vistor.reset();
    this._renderTaskGrouping();
    this._vistor.operation(Task[this._sort], this._stateGroup, this._list);    
  }

  _renderTaskGrouping() {
    this._current = el(sel(this._parent), 'innerHTML', '');        
    [
      el(
        'button', 'innerHTML', '완료, 미완료로 구분',
        'addEventListener', ['click', _ => {
          this.toggleGrouping();
        }]
      ),
      el(
        'button', 'innerHTML', '구분없이 보기',
        'addEventListener', ['click', _ => {
          this.toggleGrouping();
        }]
      ),
    ].forEach(v => {
      this._current.appendChild(v);
    });
  }
}


const list1 = new TaskList('s75');
const item1 = new TaskItem('3강교안작성');
list1.add(item1);
const sub1 = new TaskItem('코드정리');
item1.add(sub1);
const subsub1 = new TaskItem('subsub1');
sub1.add(subsub1);

// const todo = new Renderer(list1, new DomVisitor('#todo'), new DomRenderer('#todo'));

const todo = new DomRenderer(list1, new DomVisitor('#todo'), '#todo');

todo.render();
// 어떤 객체가 어떠한 단계별로 실행될 때 실행되는 단계가 확정되어 있을 경우 lifeCycle이라 한다.
/*
vistor를 도입함으로써 Renderer객체에는 더이상 컴포지트 로직이 제거되었다.
Renderer자체가 Vistor가 되도되지만 Vistor를 분리한 이유는 변화율 때문이다.
Renderer자체가 바뀔일은 자료구조가 바뀌지 않은 이상 변화가 되지 않지만,
DomVistor는 View와 관련된 모든 변화에 영향이 있기에, 
Renderer와 Vistor를 분리하고, Vistor와 DomVistor를 분리한것이다.
변화율이 역할의 정체다.
역할을 나누는 기준이 변화율이 크다.
변화율에 따라 역할을 나눠야 단위 테스트를할 때도 변화가 자주되는 부분만 테스트할 수 있다.
*/