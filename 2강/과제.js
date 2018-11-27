const Github = class {
  constructor(id, repo) {
    this._base = `https//api.github.com/repos/${id}/${repo}/contents/`;    
  }
  load(path) {
    if (!this._parser) throw 'must be parser!';
    if (!this._parser.hasIn(path)) return;   

    const id = `callback${Github._id++}`;
    const f = Github[id] = ({ data: { content } }) => {      
      delete Github[id];
      document.head.removeChild(s);
      const action = this._parser.action(path);
      action(content); // 위임 부분      
    }
    const s = document.createElement('script');
    s.src = `${this._base}${path}?callback=Github.${id}`;
    document.head.appendChild(s);
  }
  // 위임 객체 Starategy Object - 전략 객체를 받아서 셋팅해준다.
  setParser(router) { 
    if (!(router instanceof Router)) throw 'invalid protocol!';
    // 전략 객체를 셋팅할 때 함수와 인자를 받음으로써 사용할 때 제한 없이 사용할 수 있게 바꿈.
    this._parser = router;
  }
}
Github._id = 0;


const Router = class extends Map {
  constructor(ext, action, ...arg) {
    if (!ext) throw 'invalid ext!';
    if (!action) throw 'invalid action!';

    const map = ext.split(',').map(v => ([ v, (v) => action(v, ...arg) ]));

    super(map); 
  }

  getExt(ext) { return ext.split('.').pop(); }

  hasIn(ext) {
    return this.has(this.getExt(ext));
  }

  action(ext) {
    const _action = this.get(this.getExt(ext));
    if (!_action) return;

    _action();
  }
}

const Loader = class {
  constructor(_parent, ext, action, ...arg) {
    Object.assign(this, { _parent: document.querySelector(_parent) });
    
    return new Router(
      ext, 
      (v, ...arg) => { 
        if (!this._parent) throw 'invalid _parent!';
        action(v, document.querySelector(this._parent), ...arg);
      }, 
      ...arg
    );
  }
}

const ImageLoader = class extends Loader {
  constructor(_parent) {
    super(
      _parent,
      'jpg,gif,png',
      (v, parent, ...arg) => parent.src = 'data:text/plain;base64,' + v,
    );
  }
}

const loader = new Github('hikaMeng', 'codespitz75');

const img = new ImageLoader('#a');
loader.setParser(img);
loader.load('xx.png');