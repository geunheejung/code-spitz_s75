const Table =(_=>{
  const Private = Symbol('Private');
  return class {
    constructor(parent) {
      if(typeof parent != 'string' || !parent) throw 'invalid param';
      this[Private] = { parent };
    }
    async load(url) {
      const response = await fetch(url)
      if (!response.ok) throw 'invalid response';
      const json = await response.json();
      const { title, header, items } = json;
      if (!items.length) throw 'no items';
      Object.assign(this[Private], { title, header, items });
      this._render();
    }
    _render() {
      // 부모, 데이터 체크
      const fields = this[Private],
            parent = document.querySelector(fields.parent);
      if (!parent) throw 'invalid parent';      
      if (!fields.items || !fields.items.length) {        
        // fields즉 데이터에 대한 검증은 load에서 이미 되었어야 하고, render에 있으면 안된다.
        // 그리고 load에서는 items의 length가 없으면 throw로 프로그램을 죽였는데
        // render에서는 죽이지 않는다. 이것은 에러에 대한 정책이 서로 달랐을떄의 문제이다.
        // 말이 안된다. 데이터 정책이 양쪽에 있기 때문이다.
        parent.innerHTML = 'no data';
        return;
      } else parent.innerHTML = '';
      // table생성      
      // 캡션을 title로      
      // 부모 먼저 체크하는 이유는 부모가 존재하지 않으면 table을 만들필요가 없다. 순서가 있는 의사코드를 작성하는 이유
      // render를 load시점에서 하지 않은 이유는 비동기이기 때문이다. render를 하는 시점에 부모가 존재만 하면 되니깐 최대한 render를 하는 시점을 뒤로 미루는것이 좋다.
      // 테이블 만들 시점에 꼭 부모가 존재하지 않아도 된다. 즉 load가 완료된 시점에 부모가 존재만 하면 된다. 즉 테이블 만들 시점에 부모가 존재하게 하기 위해서 미리 부모를 만들어놓는 선행 작업을 하지 않아도 되기에 _render에서 부모를 체크한다.
      const table = document.createElement('table');
      const caption = document.createElement('caption');
      caption.innerHTML = fields.title;
      table.appendChild(caption);
      // header를 thead로
      table.appendChild(
        fields.header.reduce((thead, data) => {
          const th = document.createElement('th');
          th.innerHTML = data;
          thead.appendChild(th);
          return thead;
        }, document.createElement('thead'))
      );
      // items를 tr로
      // 부모에 table삽입
      parent.appendChild(
        fields.items.reduce((table, row) => {
          table.appendChild(
            row.reduce((tr, data) => {
              const td = document.createElement('td');
              td.innerHTML = data;
              tr.appendChild('td');
              return tr;
            }, document.createElement('tr'))
          );
          return table;
        }, table)
      );
    }
  }
})();

const table = new Table('#data');
table.load('71_1.json');

