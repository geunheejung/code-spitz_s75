const Github = class {
  constructor(id, repo) {
    
    this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;    
  }
  load(path) {
    if (!this._parser) throw 'must be parser!';
    if (!this._parser.hasIn(path)) return;   

    const id = `callback${Github._id++}`;
    const f = Github[id] = ({ data: { content } }) => {      
      delete Github[id];
      document.head.removeChild(s);
      const action = this._parser.action(path);

      console.log(action);

      debugger

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

const Router = (_=>{  
  const CHECK_RULE = (ext, action) => {
    if (!ext) throw 'invalid ext!';
    if (!action) throw 'invalid action!';      
  }

  const getExt = (_ext, _action, ...arg) => {
    const map = _ext.split(',').map(v => ([ v, (v) => _action(v, ...arg) ]));
    return map;
  }

  return class extends Map {
    constructor(ext, action, ...arg) {
      CHECK_RULE(ext, action);  
      super(getExt(ext, action, ...arg)); 
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
  
    add(ext, action, ...arg) {
      CHECK_RULE(ext, action);

      this.set(ext, (v) => action(v, ...arg));
    }
  }
})();

const Loader = class {
  constructor(_parent, ext, action, ...arg) {
    Object.assign(this, { 
      _parent: document.querySelector(_parent),
      _router: null,
    });

    if (!this._router) {
      Object.assign(this, { 
        _router: new Router(
          ext, 
          (v, ...arg) => { 
            if (!this._parent) throw 'invalid _parent!';
            action(v, this._parent, ...arg);
          }, 
          ...arg
        )
      });

      return this._router;
    } else return this._router;
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

const MdLoader = class extends Loader {
  constructor(_parent) {
    super(
      _parent,
      'md',
      (v) => {
        const d64 =v=>decodeURIComponent(atob(v).split('').map(c=>'%' + ('00' +c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        
        return d64(v).split('\n').map(
          v=>{
            let i = 3;
            while(i--){
              if(v.startsWith('#'.repeat(i + 1))) return `<h${i + 1}>${v.substr(i + 1)}</h${i + 1}>`;
            }
            return v;
          }).join('<br>');
      }
    )
  }
}

const loader = new Github('geunheejung', 'nuber-client');

const img = new ImageLoader('#a');
const md = new MdLoader('#b');
loader.setParser(img);
loader.setParser(md);