const Loader = class {
  constructor() {
    // this._git = new Github(id, repo);
    this._router = new Map;    
  }
  add(ext, f, ...arg) {
    // ext: 확장자
    // f: 매칭됬을 때의 함수
    // ...arg: f(...arg)
    ext.split(',').forEach(v => this._router.set(v, [f, ...arg]));
  }

  load(v) {
    const ext = this._v.split('.').pop();
    if (!this._router.has(ext)) return;
    this._git.setParser(...this._router.get(ext));
    this._git.load(v);
  }
}

// 1. Image Loader, MdLoader 각각 전략 객체로 만든다.
// 2. Image Loader와 MdLoader는 구현층이고 추상층의 클래스를 만든다.
// 3. Github 클래스는 ImageLoader, MdLoader의 추상클래스와 대화한다.
// 4. 즉 Github 클래스와 추상 클래스는 프로토콜로 대화해야 한다.

/*


      

ImageLoader, 
MdLoader

각각의 서브 Loader 전략 객체들은 생성자에서 자신이 적용해야할 parent를 받는다.

서브 Loader의 추상층에서는 프로토콜을 생성해서 Github Class에게 전해준다.

_getParser
ImageLoader ->  gerParser(Protocal 을 준수한 데이터를 반환하도록 만듬)
                Loader -> Protocol -> Github
MdLoader    ->              f,        setParser
_gerParser                ...arg     프로토콜을 지켰는지 체크한다.
                                     프로토콜을 준수했을 경우 프로토콜.getParser로 set해야할 parser를 구해온다.


Github와 Loader 사이에 필수적으로 공유되어야하는 데이터는?
케이스에 매칭되었을때에 대한 값이 필요하다.                                     
*/

const ERR = (v) => { throw v; };
const PROP = (self, v) => Object.assign(self, v);

const Parser = class {
  constructor(_case, action) {    
    // 파라미터에 대한 벨리데이션 서술.

    PROP(this, { 
      case: _case,
      action 
    });
  }
}

// 프로토콜로 case와 그 case에 따른 처리를 받아야한다.

const Startagey = (_=> {
  return class {
    constructor(_parent) {
      PROP(this, { _parent });
    }
  
    get parser() {
      const _case = this._getCase();
      const action = () => this._getAction();
  
      return new Parser(_case, action);
    }

    _getCase() { ERR('must be overrided!'); }
    _getAction() { 
      ERR('must be overrided!'); 
    }
  }
})();


const ImageLoader = class extends Startagey {
  constructor(parent) {
    super(parent);
  }

  _getAction(v) {
    this._parent.src = 'data:text/plain;base64,' + v;
  }

  _getCase() {
    return 'jpg,png,gif';
  }
}

const MdLoader = class extends Startagey {
  constructor(parent) {
    super(parent);
  }

  _getAction(v) {
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

  _getCase() {
    return 'md';
  }
}

const loader = new Github('hikaMeng', 'codespitz75');

const img = new ImageLoader('#a');
loader.setParser(img);
loader.load('xx.png');

const md = new MdLoader('#b');
loader.setParser(md);
loader.load('xx.md');


/*

ImagerLoader에게 parenr만 보내면 img 전략 객체가 생성됨.

ImageLoader에서 

case 와
case에 대한 action을 등록해줘야함.

loader는 Github으로 만들고,
loader.setParser(전략객체)
를 보내고
loader.load로 path를 보낸다.

path에는 png 또는 md를 받음.

ImageLoader에서 case와 action을 반환하는것을 만든 다음
Startagey 에서 Loader에 add로 case와 action으로 image용 라우터 테이블을 만든 다음,

setParser할 때 인자로 받은 parser의 getParser를 호출해서 getParser의 결과가 Loader 의 instance인지 체크한다음,

Github의 load를 호출할 때 인자로 받은 path를 parser.load를 path를 보내준 다음 결과가 false일 경우 return;

true일 경우 parser.action(content) 를 보내준다.



ImageLoader -> Github.serParser(img)


Github 역할 - path로 받은 Github에서 데이터를 load해온다음 전략 객체로 받은 parser에게 data를 전달해준다.

Loader의 역할 case와 action을 받아서 라우트 테이블을 만든 다음 case를 key로 action을 value로 하여 라우트 테이블에 저장한다.



Github github API에 접근해서 데이터를 load해온다.
  - load(path)
    - path를 인자로 받아서 path와 base를 합쳐 url을 만든 다음 github api에 접근하여 path에 속하는 data를 받아온다.
    - 그리고 serParser 메서드에 의해 주입된 전략 객체에게 받아온 data를 전해준다.
  - setParser(starategyObject)
    - 전략 객체를 인자로 받아서 parser로 등록해준다.

Loader 라우팅 테이블을 관리하여 Github 클래스에게 보내줄 전략 객체를 등록 과 전달해준다.
  - add(ext, f, ...arg)
    - ext로 case를 받은 다음
    - f 로 해당 case에 대응하는 action 함수를 받고,
    - 그 후 인자들을 받아서 해당 case에 대응될 경우 action 함수를 호출하면서 인자로 보내준다.
  - load(v)
    - path를 인자로 받은 다음 라우팅 테이블에 해당 path와 매칭되는 case가 있을 경우 해당 케이스가 속해있는 값을 가져온 다음,
    - git.setParser로 매칭되는 값을 전략 객체로 등록해준 다음
    - git.load를 호출해서 path를 전해준다.

사용 코드를 보면 Github와 loader가 분리됨.



*/