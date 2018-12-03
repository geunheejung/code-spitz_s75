const el = v => document.querySelector(v);

const _parser = (v) => {
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

// jspnp loader

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
      
      super([[ext, (v) => action(v, ...arg)]]);
    }
  
    getExt(ext) { return ext.split('.').pop(); }
  
    hasIn(ext) {
      return this.has(this.getExt(ext));
    }
  
    action(ext) {
      const _action = this.get(ext.split('.').pop());
      if (!_action) return;
  
      return _action;
    }
  
    add(ext, action, ...arg) {
      CHECK_RULE(ext, action);

      this.set(ext, (v) => action(v, ...arg));
    }
  }
})();

const Loader = class {
  constructor() {
    Object.assign(this, { routerTable: new Map })
  }  

  addRepo(repoKey, gitId, repoName) {
    if (!repoKey || !gitId || !repoName) throw 'invalid params!';    
    const { routerTable } = this;  

    if (routerTable.has(repoKey)) throw '이미 해당 레퍼지토리가 등록되어 있습니다.';

    const _github = new Github(gitId, repoName);
    const subRouterTable = new Map;
    routerTable.set(repoKey, [_github, subRouterTable]);
  }

  addRouter(repoKey, ext, strategyObj, parent, ...arg) {
    if (!repoKey || !parent) throw 'invalid parmas!';
    if (!(strategyObj instanceof StrategyObj)) throw 'invalid strategyObj params!';

    const { routerTable } = this;
  
    const [ _, subRouterTable ] = routerTable.get(repoKey);
  
    const action = (v, ...arg) => strategyObj.action(v, parent, ...arg);

    ext.split(',').forEach(v => {
      subRouterTable.set(v, new Router(v, action, ...arg));
    });
  }

  load(repoKey, path) {
    const { routerTable } = this;
    const _routerTable = routerTable.get(repoKey);
    if (!_routerTable) throw 'addRepo로 githubRouterTable을 등록해주세요.';
    const [ _github, subRouterTable ] = _routerTable;

    const _path = path.split('.').pop();
    const parser = subRouterTable.get(_path);

    _github.setParser(parser);
    _github.load(path);
  }
}

const StrategyObj = class {
  constructor() {}
  action(v, parent, ...arg) {
    if (!parent) throw 'invalid element';
    this._action(v, parent, ...arg);
  }

  _action() {
    throw 'must be overried!';
  }
}

const ImageLoader = class extends StrategyObj {
  _action(v, parent, ...arg) {
    parent.src = 'data:text/plain;base64,' + v;
  }
}

const MdLoader = class extends StrategyObj {
  _action(v, parent, ...arg) {
    parent.innerHTML = _parser(v);       
  }
}

const TxtLoader = class extends StrategyObj {
  _action(v, parent, ...arg) {
    parent.innerHTML = _parser(v);       
  }
}

const loader = new Loader;
const img = new ImageLoader;
const md = new MdLoader;
loader.addRepo('nuber-client', 'geunheejung', 'nuber-client');
loader.addRouter('nuber-client', 'jpg,png,gif', img, el('#a'));
loader.addRouter('nuber-client', 'md', md, el('#b'));

loader.addRepo('nuber-server', 'geunheejung', 'nuber-server');
loader.addRouter('nuber-server', 'md', md, el('#a'));

loader.load('nuber-client', 'README.md');
loader.load('nuber-server', 'README.md');