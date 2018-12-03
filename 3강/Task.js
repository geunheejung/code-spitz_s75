const Task = class {
  static title(a, b) { return a.sortTitle(b); }
  static date(a, b) { return a.sortDate(b); }

  constructor(title) {
    if (!title) throw 'invalid title';
    else this._title = title;
    this._list = [];
  }

  // TaskList 클래스의 add,remove,_getList 행위가 일치하기에 TaskList 클래스의 메소드가 복사되어서 왔다.(행동이 똑같)
  add(task) {
    if (task instanceof Task) this._list.push(task);
    else throw 'invalid';
  }
  remove(task) {
    const list = this._list;
    if (list.includes(task)) list.splice(list.indexOf(task), 1);    
  }
    
  getResult(sort, stateGroup) {
    const _list = [...this._list];        
    // 외부에 노출되는 행위는 부모가 getResult메소드로 노출하되,  
    return {
      // 각각의 Task에 대한 형태는 자식의 _getResult hook메소드를 호출함으로써 위임함.
      item: this,
      children: (
        !stateGroup 
          ? _list.sort(sort) 
          : [
            ..._list.filter(task => !task.isComplete()).sort(sort),
            ..._list.filter(task => task.isComplete()).sort(sort)
          ]
      ).map(
        /*
          Task의 getResult를 호출함으로써 재귀호출함으로써
          부모의 getResult가 호출되면 부모가 소유하고 있는 자식들 즉 Task들의 getResult가 호출되고,
          또 자식들의 getResult가 호출되면서 자식들이 소유하고 있는 Task의 getResult가 호출됨으로써 
          트리 구조 형태로 부모의 getResult가 전파된다. 그리고 더이상 getResult를 호출할 자식이 없다면
          다시 부모로 자식들의 getResult결과가 올라온다.
        */
        task => task.getResult(sort, stateGroup)
      )
    }
  }
  // Task 부모 클래스 수준에서 이미 아래 메서드들이 확정되어있어야됨. 부모 수준에서 이미 사용.  
  isComplete() { throw 'override'; }
  sortTitle() { throw 'override'; }
  sortDate() { throw 'override'; }
}