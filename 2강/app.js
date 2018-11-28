// 상속 위임 - 템플릿 메소드 패턴
if (1) {
  const Github = class {
    constructor(id, repo) {
      this._base = `https//api.github.com/repos/${id}/${repo}/contents/`;    
    }
    load(path) {
      const id = `callback${Github._id++}`;
      const f = Github[id] = ({ data: { content } }) => {
        delete Github[id];
        document.head.removeChild(s);
        this._loaded(content);
      }
      const s = document.createElement('script');
      s.src = `${this._base}${path}?callback=Github. ${id}`;
      document.head.appendChild(s);
    }
    _loaded(v) { throw 'override!'; }
  }
  Github._id = 0;
  
  const ImageLoader = class extends Github {
    constructor(id, repo, target) {
      super(id, repo);
      this._target = target;
    }
    _loaded(v) {
      // if (image) 라면 이라는 케이스를 상속 위임을 통해 해결했다.
      this._target.src = `data:text/plain;base64,${v}`;
    }
  }
  
  const s75img = new ImageLoader(
    'hikaMaeng',
    'codespitz75',
    document.querySelector('#a')
  );
  s75img.load('einBig.png');
}

// 소유 위임
if (1) {
  const Github = class {
    constructor(id, repo) {
      this._base = `https//api.github.com/repos/${id}/${repo}/contents/`;    
    }
    load(path) {
      if (!this._parser) return;

      const id = `callback${Github._id++}`;
      const f = Github[id] = ({ data: { content } }) => {
        delete Github[id];
        document.head.removeChild(s);
        this._parser(content); // 위임 부분      
      }
      const s = document.createElement('script');
      s.src = `${this._base}${path}?callback=Github. ${id}`;
      document.head.appendChild(s);
    }
    // 위임 객체 Starategy Object - 전략 객체를 받아서 셋팅해준다.
    set parser(v) { 
      this._parser = v;
    }
  }
  Github._id = 0;

  const el = v => document.querySelector(v);
  // const parseMD = v => ...;
  const loader = new Github('hikaMaeng', 'codespitz75');
  const img = v => el('#a').src = 'data:text/plain;base64,' + v;
  // img 케이스일 경우에 대한 전략 객체를 셋팅해줌.
  loader.parser = img;
  // 공통된 부분의 load 메서드를 호출하면 미리 셋팅해둔 img 전용 전략 객체도 같이 호출됨.
  loader.load('xx.png');

  const md = v => el('#b').innerHTML = {};
  loader.parser = md;
  loader.load('xx.md');  
}

// 그러나 위 처럼 전략 객체를 셋팅해주면 셋팅해줄때 셀렉터가 고정적이기에 전용 함수가 되버린다.
// 자유변수를 통한 확장
if (1) {

  
}


