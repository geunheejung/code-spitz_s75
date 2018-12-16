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

  accept(sort, stateGroup, visitor) {
    visitor.start(sort, stateGroup, this);
    const { children } = this.getResult(sort, stateGroup);
    children.forEach(({ item }) => {
      item.accept(sort, stateGroup, visitor);
    });
    // end가 필요한 이유는 vistor는 tree구조에서 가장 꼬리 정점까지 내려갈 경우 다음 트리로 넘어가야되기에
    //  현재 children이 없을 경우 현재 visitor가 end되면서 한 정점씩 end()와 함께 돌아오고, 다음 자식 트리로 넘어가는 역할.
    visitor.end();
  }
    
  getResult(sort, stateGroup) {
    const list = this._list;        
    // 외부에 노출되는 행위는 부모가 getResult메소드로 노출하되,  

    return {
      // 각각의 Task에 대한 형태는 자식의 _getResult hook메소드를 호출함으로써 위임함.
      item: this,
      children: (
        !stateGroup 
          ? [...list].sort(sort)  
          : [
            ..._list.filter(task => !task.isComplete()).sort(sort),
            ...list.filter(task => task.isComplete()).sort(sort)
          ]
      ).map(
        /*
          Task의 getResult를 호출함으로써 재귀호출함으로써
          부모의 getResult가 호출되면 부모가 소유하고 있는 자식들 즉 Task들의 getResult가 호출되고,
          또 자식들의 getResult가 호출되면서 자식들이 소유하고 있는 Task의 getResult가 호출됨으로써 
          트리 구조 형태로 부모의 getResult가 전파된다. 그리고 더이상 getResult를 호출할 자식이 없다면
          다시 부모로 자식들의 getResult결과가 올라온다.
        */
        task => {          
          return task.getResult(sort, stateGroup);
        }
      )
    }
  }
  // Task 부모 클래스 수준에서 이미 아래 메서드들이 확정되어있어야됨. 부모 수준에서 이미 사용.  
  isComplete() { throw 'override'; }
  sortTitle() { throw 'override'; }
  sortDate() { throw 'override'; }
}

/*
행위를 추상화하는 시작이 컴포지트 패턴이다.
컴포지트 패턴을 정복해야 그 후의 패턴을 알 수 있다.

컴포지트 패턴에서 vistor의 역할은 현재 컴포지션의 시작 이전과 종료 이후에 start, end를 호출해주는 역할이 전부이다.
그러나 이러한 vistor를 올바르게 호출하는 역할은 컴포지션이 이뤄지는 객체의 역할이다.
Array로 예를들면 Array.forEach 메서드또한 loop만 돌고 각 루프에 대한 행동들은 외부에게 위임하는 vistor 패턴인데,
여기서 vistor의 역할은 단순히 외부에게 현재 배열의 요소에 대한 정보를 전달해주는 역할만 하고,
이 vistor가 올바르게 동작하게 하는것은 사실 Array의 구조에 문제가 없어 forEach가 올바르게 동작해야되는것처럼 말이다.

Renderer의 역할
Task와 협조하여, Task에 대한 그림을 그릴 수 있게 vistor를 중계하는 행위.
vistor에게 네이티브 로직에 대한 처리를 위임함으로써 Renderer에서 네이티브 로직을 분리할 수 있다.
*/
