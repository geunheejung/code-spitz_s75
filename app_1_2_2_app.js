// Data Load의 역할이 Data Supply로 바뀜. 왜냐? loader가 최종적으로 하는 일로 보면 Renderer에게 Data를 전해주는 일을 하기 때문이다.
// 즉 Data를 서버에서 load해오든 지역변수값을 주든 밖에서 봤을때는 데이터를 전해주는 역할을 하는것처럼 보이는것이다.
// 즉 loader는 data를 renderer에게 전해줄때 어떤 데이터일지에 대한 방법중 하나인것일뿐이다.
const loader = new loader('71_1.json');

const Info = class {
  constructor(json) {
    const { title, header, items } = json;
    if (typeof title !== 'stirng' || !title) throw 'invalid title';
    if (!Array.isArray(header) || !header.length) throw 'invalid header';
    if (!Array.isArray(items) || !items.length) throw 'invalid items';
    items.forEach((v, idx) => {
      if (!Array.isArray(v) || v.length !== header.length) {
        throw 'invalid items: ' + idx;
      }
    });
    this._private = { title, header, items };
  }
  get title(){ return this._private.title }  
  get header(){ return this._private.header }
  get items(){ return this._private.items }  
}

loader.load(json => {  
  const renderer = new renderer();
  // 문제(json 데이터를 검증하지 않고 보내줌) -> VALUE OBJECT로 바꿔서 보낸다. 즉 검증된 데이터를 보내준다.
  renderer.setData(json);
  renderer.render();
});
const Data = class {
  async getData() { 
    // 추상 객체인 Data에서 getData의 반환값이 Info 객체라는 외부 프로토콜을 충족하기 위해
    // _getData메서드를 만들고 템플릿 메서드 패턴으로 각각의 서브객체들이 _getData 템플릿을 Hook으로 채우며,
    // 외부 객체와의 프로토콜인 getData는 서브객체에서 채운 hook메서드 _getData의 반환값으로 Info 객체를 만들어 반환한다.
    // 그런데 Info객체는 json 형태에 대한 벨리데이션 알고리즘이 담겨있고 그 json 데이터가 검증되었다는것을 보장하는 역할을 하는데
    // 그럼 각각의 XML DATA와 CSV DATA는 어떻게 해야되나?
    // 여기서 내부 프로토콜이 생기는데 내부 프로토콜은 _getData라는 템플릿 메서드의 hook의 반환값 즉 각각의 서브객체만의 Data들은
    // json형태로 파싱해서 반환해야한다는 내부 프로토콜이 생겼다.
    const json = await this._getData();
    return new Info(json);
  }
  async _getData() {
    throw '_getData must overrided';
  }
};

const JsonData = class extends Data {
  constructor(data) {
    super();
    this._data = data;
  }
  async _getData() {
    if (typeof this._data === 'string') {
      const response = await fetch(this._data);
      return await response.json();
    } else return this._data;    
  }
}

const Renderer = class {
  constructor() {}  
  async render(data) {
    // 기존의 data에 대한 검증을 JsonData로 위임함으로써 우리는 type만 검증하면 안전한 데이터라는것을 보장받을 수 있게 됬다. -> 강타입 체크
    // 즉 Type으로 알고리즘을 대체했다. 왜냐 데이터를 검증하는 수많은 알고리즘을 함축적으로 '데이타 형' 으로 표현함.
    // 알고리즘은 역할을 위해서 존재한다. 이 타입이 오면 Data의 역할은 끝난것이다.
    // 즉 각각의 객체끼리 타입으로 통신해야한다. 즉 V/O로 통신한다. 
    // JsonData가 아닌 추상객체인 Data로 타입을 체크하는 이유는 모든 서브 객체는 Data라는 공통적인 추상 객체의 서브객체이기에 추상객체인 Data로 체크한다.
    // 현재 Data추상객체와 각각의 서브객체들은 각각의 서브 객체마다 단지 파싱 방법은 정의해놓은것뿐이다. 실제로 우리가 Data가 검증되었다는것은 추상객체인 Data객체에서 책임지기때문에 Data로 타입을 검증해야 한다.
    if (!(data instanceof Data)) throw 'invalid data type';
    // JsonData에서 data를 가져오는 getData가 async 메서드이기에 render 또한 async로 작성되어있어야한다. 그렇지 않으면 data.getData와 render의 절차가 맞지 않기 때문이다.
    // 이러한 현상을 async 전파라한다. promise 전파와 같은 개념 왜냐 async는 내장적으로 promise로 구성되어있기 때문이다.
    // 여기서 문제점은 우리는 타입 체크를 Data객체로 체크하고 있지만 Data 추상 객체에는 Info 객체를 반환하는것을 보장하지 않는다.
    const info = await data.getData();
    // Native Binding과 연결될 지점 즉 템플릿 메서드를 호출할 지점.
    // 즉 추상Renderer는 네이티브 로직과 완전히 분리됨.
    console.log(info.title, info.header, info.items);
  }
}

const data = new JsonData('71_1.json');
const renderer = new Renderer();
renderer.render(data);