const Renderer = class {
  constructor(list, parent) {
    this._parent = parent;   
    this._list = list;
    this._sort = Task.title;
  }
  add(parent, title, date) {
    parent.add(new TaskItem(title, date));
    this.render();
  }
  remove(parent, task) {
    parent.remove(task);
    this.render();
  }
  toggle(task) {
    if (task instanceof TaskItem) {
      task.toggle();
      this.render();
    }
  }

  render() {
    this._clear();        
    this._render(
      this._parent, 
      this._list, 
      this._list.getResult(this._sort), 
      0
    );
  }

  _clear() { throw 'overrid!'; }
}

const TodoItem = class extends HTMLElement {
  constructor(item, task) {
    super();
    Object.assign(this, { _item: item, _task: task });

    const shadow = this.attachShadow({ mode: 'open' });
    const { _title, _date, isComplete } = this._item;
    const h3 = document.createElement('h3');
    h3.innerHTML = this.getAttribute('data-title');
    const date = document.createElement('time');
    date.innerHTML = this.getAttribute('data-date').toString();
    date.setAttribute('datetime', this.getAttribute('data-date').toString());
    const button = createElement('button');
    button.innerHTML = this.getAttribute('data-isToggle') ? 'progress' : 'complete';
    button.addEventListener('click', () => {
      this._task.toggle(_item);
    });
    
    const sec = document.createElement('section');

    sec.appendChild(h3);
    sec.appendChild(date);
    sec.appendChild(button);

    console.log(sec);

    debugger
    shadow.appendChild(document.createElement('h3').innerHTML ='dasohjdpas');
  }
}

const DomRenderer = class extends Renderer {
  constructor(list, parent) {
    super(list, parent);
  }

  _clear() {  
    const parent = this._parent;
    parent.innerHTML = '';

    parent.appendChild('title,date'.split(',').reduce((nav,c)=>(
      nav.appendChild(
        el(
          'button', 
          'innerHTML', 
          c, 
          '@fontWeight', 
          this._sort == c ? 'bold' : 'normal',
          'addEventListener', 
          [
            'click', 
            e=>(this._sort = Task[c], this.render())
          ]
        )
      ), nav), 
      el('nav')
      )
    );
  }

  _render(
    base, 
    parent, 
    {item, children}, 
    depth
  ) {
    const temp = [];    
    if(item instanceof TaskList){
      temp.push(el('h2', 'innerHTML', item._title));
    } else{      
      temp.push(
        el(
          'h3', 
          'innerHTML', 
          item._title, 
          '@textDecoration', item.isComplete() ? 'line-through' : 'none'
        ), 
        el(
          'time', 
          'innerHTML', 
          item._date.toString(), 
          'datetime', 
          item._date.toString()
        ),
        el( 
          'button', 
          'innerHTML', 
          item.isComplete() ? 'progress' : 'complete', 
          'addEventListener', 
          ['click', _=>this.toggle(item)]
        ),
        el(
          'button', 
          'innerHTML', 
          'remove',
          'addEventListener', 
          ['click', _=>this.remove(parent, item)]
        )
      )
    }
    const sub = el(
      'section', 
      'appendChild', 
      el('input', 'type', 'text'),
      'appendChild', 
      el('button', 'innerHTML', 'addTask','addEventListener', ['click', e=>this.add(item, e.target.previousSibling.value)])
    );
    children.forEach(v=>{this._render(sub, item, v, depth + 1)});    
    temp.push(sub);
    const sec = el(
      'section',
      '@paddingLeft', '40px'
    );
    temp.forEach(v=>{  
      sec.appendChild(v);
    });        
    base.appendChild(sec);
  }
}

const ConsoleRenderer = class extends Renderer {
  constructor(list, parent) {
    super(list, parent);
    this.result = []
  }

  _clear() {
    // console.clear();
  }

  _render(
    base, 
    parent, 
    {item, children}, 
    depth,
    itemIndex
  ) {    
    const listStyle = `
      color: red;
      font-weight: bold;
      text-indent: ${depth * 10}px;
    `;
  
    const itemStyle = `
      font-weight: bold;
      text-indent: ${depth * 20}px;
      color: ${item.isComplete() ? '#ccc' : '#000'}
    `;

    if (children.length || item instanceof TaskList) {      
      console.log("%c%s", listStyle, `TITLE: ${item._title}`);
    } else {
      console.log("%c%s", itemStyle, `ITEM: ${item._title}`);
    }

    // if (!children.length) console.groupEnd();

    children.forEach((v, index)=>{
      this._render('', item, v, depth + 1, index);
    });    
  }

  _find(list, index = 0, cursorList) {
    list.forEach((v, i) => {
      debugger
      if (i.toString() === cursorList[index]) {  
        this.result.push(v);
        this._find(v.children, index + 1, cursorList);
      };
    });;
  }

  _add(depth, title) {
    const { item, children } = this._list.getResult();

    if (!depth) {
      item.add(new TaskList(title));
      this.render();
      return;
    }

    const cursorList = depth.split('.');

    this._find(children, 0, cursorList);
    
    const curr = this.result.pop();

    curr.item.add(new TaskItem(title));
    this.render();
  }

  _toggle(depth) {
    const { item, children } = this._list.getResult();

    if (!depth) {
      this.toggle(item);
      this.render();
      return;
    }
    const cursorList = depth.split('.');

    this._find(children, 0, cursorList);

    const curr = this.result.pop();

    if (curr instanceof TaskList) return;

    this.toggle(curr.item);

    
    this.render();
  }
}