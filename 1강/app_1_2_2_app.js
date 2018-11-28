// Data Load의 역할이 Data Supply로 바뀜. 왜냐? loader가 최종적으로 하는 일로 보면 Renderer에게 Data를 전해주는 일을 하기 때문이다.
// 즉 Data를 서버에서 load해오든 지역변수값을 주든 밖에서 봤을때는 데이터를 전해주는 역할을 하는것처럼 보이는것이다.
// 즉 loader는 data를 renderer에게 전해줄때 어떤 데이터일지에 대한 방법중 하나인것일뿐이다.
const mockFetch = (url) => {
  if (!url) throw 'invalid url';

  const data = {
    "title":"TIOBE Index for June 2017",
    "header":["Jun-17","Jun-16","Change","Programming Language","Ratings","Change"],
    "items":[
      [1,1,"","Java","14.49%","-6.30%"],
      [2,2,"","C","6.85%","-5.53%"],
      [3,3,"","C++","5.72%","-0.48%"],
      [4,4,"","Python","4.33%","0.43%"],
      [5,5,"","C#","3.53%","-0.26%"],
      [6,9,"","change","Visual Basic .NET","3.11%","0.76%"],
      [7,7,"","JavaScript","3.03%","0.44%"],
      [8,6,"change","PHP","2.77%","-0.45%"],
      [9,8,"change","Perl","2.31%","-0.09%"],
      [10,12,"change","Assembly language","2.25%","0.13%"],
      [11,10,"change","Ruby","2.22%","-0.11%"],
      [12,14,"change","Swift","2.21%","0.38%"],
      [13,13,"","Delphi/Object Pascal","2.16%","0.22%"],
      [14,16,"change","R","2.15%","0.61%"],
      [15,48,"change","Go","2.04%","1.83%"],
      [16,11,"change","Visual Basic,2.01%","-0.24%"],
      [17,17,"","MATLAB","2.00%","0.55%"],
      [18,15,"change","Objective-C","1.96%","0.25%"],
      [19,22,"change","Scratch","1.71%","0.76%"],
      [20,18,"change","PL/SQL","1.57%","0.22%"]
    ]
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 300);
  });
}

const Info = class {
  constructor(json) {
    const { title, header, items } = json;

    if (typeof title !== 'string' || !title) throw 'invalid title';
    if (!Array.isArray(header) || !header.length) throw 'invalid header';
    if (!Array.isArray(items) || !items.length) throw 'invalid items';

    items.forEach((v, idx) => {
      if (!Array.isArray(v)) throw 'invalid items: ' + idx;
      if (v.length !== header.length) {
        const [orignalLank, newLank, isChanged] = v;        
        if (orignalLank !== newLank && !isChanged) {
          v = v.splice(2, 1);
        }
      }
    });
    
    this._private = { title, header, items };    
  }
  get title(){ return this._private.title }  
  get header(){ return this._private.header }
  get items(){ return this._private.items }  
}

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
      const response = await mockFetch(this._data);
      // 임시 주석 처리
      // return await response.json();
      this._data = await response;      
      return await response;
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
    const { _private: { title, header, items } } = await data.getData();
    Object.assign(this, { title, header, items });    
    // Native Binding과 연결될 지점 즉 템플릿 메서드를 호출할 지점.
    // 즉 추상Renderer는 네이티브 로직과 완전히 분리됨.
    this._render();
  }

  _render() {
    throw 'TMPL - _render must overried';
  }  
}

const TableRenderer = class extends Renderer {
  constructor(parent) {
    super();
    this._parent = parent;
  }
  _render(){
    const parent = document.querySelector(this._parent);
    if(!parent) throw "invaildparent";
    
    const { title, items, header } = this;

    parent.innerHTML= "";
    const[table, caption] = "table,caption".split(",").map(v=>document.createElement(v));
    
    caption.innerHTML= title;
    table.appendChild(caption);
    table.appendChild(header.reduce(
      (thead, data)=>(
        thead.appendChild(document.createElement("th")).innerHTML= data, thead
      ),
      document.createElement("thead"))
    );
    parent.appendChild(items.reduce(
      (table, row)=>(
        table.appendChild(row.reduce(
          (tr, data)=>(
            tr.appendChild(document.createElement("td")).innerHTML= data, tr
          ),
          document.createElement("tr"))
        ), 
        table
      ),table
    ));
  }

}

const data = new JsonData('71_1.json');
const renderer = new TableRenderer('#data');
renderer.render(data);





/*

Data
JsonData
^
Info
v
Renderer 
this.info = info;
v 여기서 TableRenderer 도 info를 알게됨.
TableRenderer

그러면

Data
JsonData
^
Info
v
Renderer
this.title = info.title; 
this.header = info.header;
this.items = info.items;
TableRenderer

Renderer와 TableRenderer은 서로 같은 역할임

Renderer는 TableRenderer 즉 네이티브 바인딩 객체한테 어떤값을 그려야될지 제공하는 역할을 함.

그러므로 TableRenderer에게 값을 전해주면

더이상 Info가 바껴도 TableRenderer를 수정하지 않아도됨.

Renderer에서 Info의 변경사항에 맞게
TableRenderer에게 맞춰서 전달해주면 되기에

이제는

Info 와 TableRenderer 사이에 Renderer가 여파를 막아줌.


*/