const el = v => document.querySelector(v);
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
      this._parser.action(content); // 위임 부분      
    }
    const s = document.createElement('script');
    s.src = `${this._base}${path}?callback=Github.${id}`;
    document.head.appendChild(s);
  }
  // 위임 객체 Starategy Object - 전략 객체를 받아서 셋팅해준다.
  setParser(starategyObject) { 
    if (!(starategyObject.parser instanceof Parser)) throw 'invalid protocol!';
    // 전략 객체를 셋팅할 때 함수와 인자를 받음으로써 사용할 때 제한 없이 사용할 수 있게 바꿈.
    this._parser = starategyObject.parser;
  }
}
Github._id = 0;
