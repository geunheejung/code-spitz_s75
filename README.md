코드스피치 s75 강의 실습

---- s75 1 - 1/2
# 코드를 작성하기전에 우선적으로 한글로 어떤 코드를 작성할것인지 적자.
# 최대한 할 수 있는대로 코드에 내가 생각하는 바를 최대한 많이 표현하자.
- 즉 주석대신 최대한 변수명의 길이든 코드의 성능이든 상관하지말고 코드에 무조건 의미를 표현하자.
- 한글로 생각한 아주 단순한 로직이라도 코드로 표현하는 훈련을 해야한다.
# 주석으로 표현하는것이 의미가 없는 이유는?
- 코드는 수정되어도, 주석은 같이 수정되지 않는다. 즉 썩는다.
# 함수 또는 객체에서만 사용해야만 하는 즉 자신의 스코프외에서는 사용하기를 원치 않는 또는 내 자신의 내장을 보이기 싫다면은 최대한 숨기도록 노력하자.
- 이 속성에 대한 이 객체값을 남이 건드리는건 싫고 나만 건드리고 싶다면, 어떻게든 내장을 보호하는 방법을 훈련하자.
# 프로그램을 만드는 과정은 '조각'이 아니라 '소조' 에 가깝다.
- 천천히 붙혀나가면서 만드는것이지, 완성된 코드를 깎아내리는것이 아니다. 프로그램은 항상 조심스럽게 살을 붙혀나가는 소조에 가깝다. 즉 프로그램은 처음부터 막 만들어놓고 깎아내가면 망한다.
# 복잡하고 어려운 프로그래밍을 짤 수 있느냐는 한번에 얼마나 여러 생각을 할 수 있느냐?
# 세상에서 들어오는 모든 입력은 다 나를 엿맥일려는것이다. 라고 생각하자.
# javascript의 해체 구문은 key를 못찾을 경우에는 undefined로 처리하지만, 우항의 객체가 해체할 수 없을 경우 throw를 한다. 즉 1차 방어가 들어가있다.
# Class안의 함수들은 함수가 아니라 메서드이다. 그리고 메서드의 기본적인 조건은 인스턴스의 상태를 공유하는 함수의 집합이다. 그러므로 클래스안의 메서드끼리 인자로 보내는것은 잘못된 것이다. 왜냐 메서드이기 때문이다. 바깥에서 호출할 것도 아니고, 외부 입력도 아니기도 때문이다. 인자를 또 보내면 외부에서 온 인자인지 내부에서 화이트리스트 즉 검증된 값인지 알 수 가 없다. 그러므로 메서드끼리는 자신이 속해있는 클래스의 상태를 각각의 메서드에서 사용해야하며, 상태에 저장됬다는것은 검증이 끝난 화이트리스트란 의미이다.
# 코딩을 잘못하는 이유는 인간의 언어를 쓰는것이다. 인간의 언어에 문제점은 많은 의미가 축약된다는것이다. 그러나 프로그래밍은 모든 말들이 다 표현되야한다. 즉 한국어와 코드 사이의 중간언어를 만들어야 한다. 중간언어는 순서가 정확한 한국어로 정하고 코딩의 순서를 인간의 언어 -> 중간언어(의사코드) -> 실제코드 로 가야한다. 이 의사코드는 순서적으로 내 생각을 정리하는데 성공했냐이다.
# 에러의 3단계 
1. 컴파일 에러 - Syntax Error등등
2. 런타임 에러 
3. 컨텍스트 에러
즉 에러를 숨기지말자 왜냐 런타임에러는 잡기가 어렵기 때문이다. 만약 벨리데이션과 같은 에러가 나는 상황에서 throw로 런타임에서 죽이지 않고 감추면 절대 못잡는다.
즉 런타임에러의 전략은 무조건 throw 하자.
만약 이렇게 하지 않으면 컨텍스트 에러 즉 마지막까지 가는데 여기는 에러가 발생해도 에러가 안나고 그대로 계속 진행되는것이다.

# 모든 프로그램은 변한다.
- 이미 작성된 복잡하고 거대한 프로그램을 어떻게 변경할 수 있을 것인가?
- 즉 격리를 잘해야 거대한 프로그램이라 해도 변경할 수 있다.
# 격리 전략
- 변화율에 따라 코드를 작성한다.
ex) load 함수안에 table을 그리는것을 넣지 않고, render함수로 뺀 것
? 데이터를 소비해서 dom 을 그려내는 부분의 변화율과 데이터를 load해서 데이터를 처리하는 부분의 변화률이 완전 다르기 때문이다.
즉 변화율에 따라서 격리를 잘해놔야한다. 그것이 올바른 프로그래밍이다.

#변화율이란 시간적인 대칭성 "변화의 원인과 주기별로 정리" -> 강한 응집성 & 약한 의존성
render함수의 의존성은 약한 의존성이다. parent가 필수적이기 때문이다. 그럼 왜 약한 의존성이라 하나? 의존성이 아예 없을 수 없다. 그래서 필수적으로 parent를 알아야하기에 render 메소드는 약한 의존성이며,
그럼 강한 응집성이란 무엇일까?
load함수를 보면 load함수는 2개의 역할을 한다.
1. 데이터를 네트워크에서 패치해오는 역할과
2. 패치해온 데이터를 벨리데이션 하는 역할을 한다.
그럼 이 load함수는 응집성이 강한것일까?
아니다 load함수는 하나의 함수가 2개의 역할을 하기 때문에 응집성이 강하지 않다.
그럼 강한 응집성이란 무엇일까?
-> 함수 하나가 해당 함수의 역할에 맞게 한가지 역할만 하는것이다.
그러나 우리의 현실이 하나의 역할을 할 수 없는것처럼
프로그램 세계도 단일 역할을 가지기란 어렵다.

---- s75 1 - 2/2
# 역할의 반대는 책임이다.
프로그래밍에서는 이름이 전부이다. 그렇다면 Table 객체는 이름이 Table인데 왜 데이터를 load하는 책임을 져야하는것인가?
즉 Table 객체가 가지고 있는 역할은 현재 
1. 데이터를 load하는 load() 메서드와
2. 데이터를 테이블 Dom Element로 그리는 _render() 메서드인데
Table이라는 객체가 Data를 load하고 올바른 데이터인지 벨리데이션하는것은 Table객체의 책임이 아닌것이다.
여기서 이상한것은 왜 서로 다른 역할인 Data Load와 Rendering 하는 역할을 Table 객체가 다 가지고 있냐는것이다. 이로인해 Data 형식을 json이 아닌 csv 또는 액셀 형태로 바꾸면 Table 객체 자체를 바꿔야 한다는 문제가 발생한다.

# 우리 고객은 적대적인 초딩이다.
적대적인 초딩이 어떤 짓을 하더라도 하는 짓은 뻔한것처럼, 프로그래밍도 작성할 때 고객이 어느 부분을 바꿀지 예상하고 대처를 미리 해놓자.

# 그림을 그리는 Rendering 과 Dom에 그릴지 Canvers에 그릴지에 대한 Native Binding은 분리를 해야한다.
개념적인 그림을 그리고, 실제 시스템에 맞는 그림을 분리해야 시스템 여러개를 소유할 수 있게된다.
Rendering: 개념적인 그림
Native Binding: Table이나 Canvers
위를 Domain Pattern 이라 한다.
Domain과 그의 반대인 Native를 분리하는것.

# 최종적으로 하는 일을 보면 객체의 진정한 역할이 보인다.
// Data Load의 역할이 Data Supply로 바뀜. 왜냐? loader가 최종적으로 하는 일로 보면 Renderer에게 Data를 전해주는 일을 하기 때문이다.
// 즉 Data를 서버에서 load해오든 지역변수값을 주든 밖에서 봤을때는 데이터를 전해주는 역할을 하는것처럼 보이는것이다.
// 즉 loader는 data를 renderer에게 전해줄때 어떤 데이터일지에 대한 방법중 하나인것일뿐이다.

data를 load하는 역할을 Table에서 때내고
Table에서 테이블을 그리는 역할을 
개념적인 그림을 그리는 Renderer와
Table, Canvers를 과 같은 Domain과 상관없는 Native Binding 역할로 분리했을 때
loader에서 data를 load한 다음 renderer에게 전해줬는데
여기서 loader의 최종적으로 하는일을 보면 
Loader는 data를 load 해온 다음 Renderer 에게 전해줬다. 결국 Loader는 Renderer에게 데이터를 전달해주는 역할을 하는 것이다.
그러므로 Loader객체의 역할은 Data Supply 이며, Data를 load하는것은 부가적인 역할일 뿐 인것이다.
즉 Data Supply에서 Data를 json 데이터일지 csv 데이터일지 xml 데이터일지는 각각의 부가적인 역할인것이다. 
즉 Loader 객체는
JsonData 객체
CsvData 객체
XmlData 객체가 되며,
각각의 객체에서 load하는것은 부가적인 역할이다.

그럼 여기서 추상화가 가능한데, 공통 분모인 Data를 추상화 할 수 있다.
즉 Data라는 추상 객체가 있고,
Json, Csv, Xml 서브 객체로 추상화 할 수 있는것이다.
즉 이름이 전부인것이다.
즉 데이터를 로드한다는 본질은 Data로 추상객체에 있고,
각각의 데이터를 파싱한다는것이 다르다.

# 알고리즘도 중요하지만 프로그래밍은 격리(역할, 협력)

#1강 과제 
## 1. 예외의 지점을 찾고 수정하여 완성하라. json 데이터 실제로 적용해보면 에러 발생함.
## 2. 지금까지 전개한 객체협력모델에서는 여전히 문제가 남아있다. Info는 Data와 Renderer 사이에 교환을 위한 프로토콜인데 Data의 자식인 JsonData와 Renderer의 자식인 TableRenderer도 Info에 의존적인 상태이다. 이를 개선하라.
### 1번
- json 데이터에서 items의 6번째 index의 데이터를 보면 header와 갯수가 맞지 않음. header의 아이템 갯수는 5개인데 6번째 데이터는 갯수가 6개여서 Info에서 데이터에대한 벨리데이션 로직 중 header의 length와 item의 length를 비교하는 조건문이 존재하는데 
  해당 조건문에 충족하지 않아 throw 가 발생함. 그래서 왜 6개인가 찾아보니 changed 데이터인데 한칸 늘어나면서 changed인지에 대한 인덱스에 해당되는 요소에는 값이 비어있고, 다음 인덱스로 밀려있어서 한칸씩 데이터가 밀렸었음.
  그래서 만약 각 item의 length와 header의 length가 맞지 않고, 이전 랭킹과 다음 랭킹이 다른데 changed 인지에 대한 요소에 값이 비어있을 경우 해당 인덱스의 값을 splice로 지워서 밀려난 데이터를 맞춤.
### 2번
- Data와 Renderer 객체간에 data를 공유할 때 data에 대한 벨리데이션 정책을 한 곳에 모으기 위해서 또 Renderer에서 data를 그릴 때 data에 대한 벨리데이션을 그림을 그리는 Renderer가 하지 않고 특정한 V/O로 전해졌다는것만 체크하기 위해서 
  Info 라는 객체를 만들어 해당 객체에서 data에 대한 벨리데이션 검증을 하는 역할을 맞아 Data와 Renderer 사이에 Info 라는 프로토콜을 맺었는데, 문제는 Renderer의 네이티브 부분을 해결하는 서브객체인 TableRenderer에서 V/O를 직접 접근하여 사용하는것과 V/O를 조작할 수 있는 문제가 발생한다. 왜 Data 객체와 Renderer 객체간의 프로토콜인 Info 객체를 Renderer 객체의 서브 객체인 TableRenderer 가 알고, 수정할 수 있는것인가 이로 인한 문제점은 우리가 Info 객체를 수정하면 그에 대한 여파가 TableRenderer까지 전달된다는것이다.
  그래서 해결 방법은 Renderer에서 Info V/O를 바로 할당하지 않고 TableRenderer에서 V/O를 몰라도 그려야할 데이터를 사용할 수 있게 V/O의 프로퍼티를 Renderer의 필드로 할당함으로써 더이상 TableRenderer는 Info 객체를 몰라도 Renderer에서 제공해주는 데이터를 그리면 된다. 그러면 Info 객체가 바뀐다하더라도 Renderer만 수정하면 TableRenderer에는 여파가 없다.

# 1강 복습 키워드
- 의사코드
- 조각이 아닌 소조
- 내부 계약
  - Data 추상 객체와 서브 객체들인 JsonData ,XmlData, CsvData 간의 내부 계약이 존재하는데 추상 객체인 Data 객체가 Renderer 객체와 대화할 때 getData 메소드를 호출하고 서로 Info 객체를 통해 프로토콜이 맺어져있는데 프로토콜 객체인 Info 객체는 json 데이터에 대한 벨리데이션 로직이 존재하기에 내부적으로 XmlData객체와 CsvData 객체는 Data객체의 _getData를 override할 때 반환값을 json 형태로 파싱해서 반환해야한다는 내부 계약이 존재한다.
  - 협력
  -- 템플릿 메소드 패턴
  -- 프로토콜을 통한 계약

- 제어문을 상속 위임 또는 소유 위임을 통해 함수의 밖으로 빼내면 각 조건문에 대해서 바깥쪽에서 처리해야되는 단점이 있지만 
정의 시점과 실행 시점이 분기되면서 정의 시점에는 상속 위임 또는 소유 위임의 베이스가 되는 객체들이, 사용 시점에서는 해당 베이스가 되는 객체들을 사용하면서, 케이스가 늘어날때마다 서브 객체를 만들거나 전략 객체 또는 전략 함수를 만들면 추후에 케이스가 늘어난다하더라도 정의 시점을 수정하지 않아도 된다.


---- s75 2 - 1/2
# 그러나 어떤 구조가 왜 좋은지 이해하지 않으면
경험이 쌓이면 디자인 패턴에 나오는 패턴 그대로 사용하게 된다.
그러나 어떤 구조가 왜 좋은지 이해하지 않으면 디자인 패턴을 사용하다 또 어떨때는 사용하지 않거나 들쑥날쑥하다. 

#GOF의 디자인패턴 분류
- 생성패턴
- 구조패턴
- 행동패턴

디자인패턴책의 선수적인 과목은 객체지향, 역할모델이다.
그렇지 않으면 의미가 없다.

#객체지향설계를 학습할 수 있는 분류
- 캡슐화
- 다형성
- 객체 관계
- 변화율
##- 역할모델

#알고리즘이 변화하는 이유?
- 비지니스변화
- 연관 라이브러리 변화
- 호스트측 변화
--> 대부분 통제불가요소 - 해달라하면 해야됨.

# 기존 제어문 기반의 알고리즘이 갖는 문제
- 수정하면 전체가 컴파일 됨.
-- 알고리즘이 변화한 부분만 수정하고 나머지는 건드리고 싶지 않다면?
--- 최대한 개별 알고리즘을 함수로 분리해라.

제어문으로만 존재할 경우 하나의 조건문을 수정하면 다른 조건문도 단위테스트를 해야 한다. 그러나 각각의 케이스를 함수로 분리하면 해당 함수만 테스트하면 된다.

그러나 여기서 문제점은
1. 케이스가 늘어나거나, 변경될 때는 함수로 분리했음에도 다 수정해야한다.
2. 함수 간 공통부분
- 함수 간의 공통 부분에 대한 변화를 어떻게 관리해야되나 공통 부분이 새롭게 생기거나 변화할때마다 또 다시 전체를 다시 수정해야하는 문제가 발생한다.

# 격리를 어떻게 할 것인가?
## 분화: if(case)
### 알고리즘 분화 시 객체지향에서 선택할 수 있는 두 가지 방법ㅓ
- 상속 위임
내부계약관계로 추상층에서 공통 요소를 해결하고 상태를 공유할 수 있음
공통 요소를 해결하고 케이스가 늘어남에따라 자식 클래스를 만든다?
컨텍스트안의 상태는 공유하되 케이스에 대한 처리만 자식에서 따로
ex) item값의 케이스가 4개일때 자식 4개를 만듦.

- 소유 위임
외부계약관계로 각각이 독립적인 문제를 해결하며 메세지를 주고 받는것으로 문제를 해결함
베이스 객체를 그대로 두고 경우에 수에 맞는 4가지 객체를 소유하는 식으로 해결한다.

따로 사용하거나 복합해서 사용함으로써 해결해나간다.

GoF DP 방향성
- 소유 위임의 방식을 지향한다.
문제점: 부가적인 형이 많아진다.

# 대표적인 상속 위임 방법은 템플릿 메소드 패턴이다.
부모 객체에서 공통부분을 템플릿 메소드로 만들고,
각각 서브객체에서 개별적인 내용을 위임함으로써 해결하는 방식이다.
즉 공통적인 부분과 위임 부분 그리고 서브객체의 위임 구현 부분이 있다.
여기서 부모 객체의 공통 부분을 
템플릿 메소드라 하며,
템플릿 메소드에서 개별적인 내용을 위임할 때 호출하는 서브객체의 메소드를 HOOK메소드라 한다.
각각의 템플릿 메소드의 HOOK들 즉 서브객체를 케이스마다 만드는 이유는 케이스마다 하는 동작이 다르듯 서브객체마다 HOOK메소드를 구현하는게 다르기 때문이다.
이러한 방식으로 조건문을 해결한다.

# 대표적인 소유 위임 방법은 전략 객체 패턴이다. Strategy Pattern
상속 위임에서 각각 케이스에 대한 위임 구현을 템플릿 메서드의 Hook을 호출하고, 각각의 서브객체에서 Hook을 구현했다면
소유 위임은 전략 객체를 set하여 받은다음,
위임부분에서 set 된 전략 객체를 호출함으로써
각각의 케이스는 전략 객체에게 위임되어 처리된다.
전략 객체는 대표적으로 함수 또는 객체를 받는다.
상속 위임과의 차이점은 Sub Class를 케이스 마다 안만들어도되지만 전략 객체가 아닌 전략 함수를 사용할 경우 전략 함수가 검증됬다는것에 대해서는 보장할 수 없지만, 서브 클래스 즉 형을 많이 안만들어 된다.
즉 전략 객체에 위임하는 역할이 얼마나 중요하냐에 따라서 전략 객체로 보낼지, 전략 함수로 보낼지 정하면 된다.
즉 전략 패턴에서 세부 구현을 위임받은 전략 객체또는 전략 함수를 부르는 호칭이 전략 패턴을 소유하고 있다. 
디자인 패턴에서는 host 또는 인보크라 한다.
인보크는 실행기라는 의미이다.
즉 전략 패턴에서 전략 객체는 실행기라고도 볼 수 있다.

상속 위임: 각각의 케이스에 따라 서브 클래스를 만든다.
소유 위임: 각각의 케이스에 따라 전략 객체 클래스를 만들어도 되고, 전략 함수를 만들어도된다.
그러므로 소유 위임 방식으로 처리하면 하나의 클래스만을 유지한체 각각의 케이스를 커버할 수 있다.

# 디자인패턴을 알면 대화함에있어서 해당 구현에 대해 모두 설명할 필요 없이 디자인패턴명을 말하면 요구사항을 편하게 말할 수 있다.

# 구상, 구현은 의미는 같지만 둘다쓰인다 그러나 영어로는 콘크리트 라는 단어 하나면 된다.
# 단어는 항상 영어로 외우자.

---- s75 2 - 2/2
# router 패턴
- if는 문으로 되어있는 반면 router는 case 만큼의 값으로 되어있다. 따라서 배열을 추가하는것처럼 얼마든지 추가할 수 있다. 코드를 수정하지 않고
그래서 if문을 값으로 바꿈으로써 기존의 조건문을 바꾸고 싶지 않을 수 있다.
그럼 더이상 문을 수정하지 않고, 값만 넘겨주면 된다.

# 알고리즘은 용량과 교체할 수 있고, 용량은 알고리즘과 교체할 수 있다.
- 용량을 절약하기 위해 연산 알고리즘으로 대체하여 값을 모두 저장하지 않고 일일히 순회하거나 하는것처럼 용량을 절약할 수 있고, 그냥 다 저장해놓고 알고리즘으로 일일히 순회하지 않고 바로 가져오게 하면 알고리즘을 절약할 수 있다.
즉 연산과 용량은 서로 대체할 수 있다.
즉 기존의 if문은 연산인데 해시로 케이스에 대한 처리를 저장해놓으면 용량으로 대체할 수 있다.

# 상태에 대한 분기는 사라지지 않는다. - 그 분기가 필요해서 태어났기 때문.
# 정의 시점에 제거하는 방법은? 변화하지 않는 부분에서 
1. 분기 수 만큼 객체를 만들고
2. 실행시점에 경우의 수를 공급하자.
# 실행시점으로 분기를 옮길 때의 장단점
## 장점
  1. 정의 시점에 모든 경우를 몰라도 된다.
  2. 정의 시점에 그 경우를 처리하는 방법도 몰라도 된다.
  - 일정한 통제 범위 내에서 확장가능한 알고리즘설계 가능
  일정한 통제 범위(Loader)
  확장가능한(전략객체)
## 단점
  1. 실행 시점에 모든 경우를 반드시 기술해야 함
  2. 실행 시점마다 알고리즘의 안정성을 담보해야 함.
  왜냐 실행 시점에서 경우와 경우에 대한 알고리즘을 작성해서 넣어주기에 실수하기가 쉽다.

이터레이터
컴포지터
비지터

---- s75 2 - 2/2 복습
# 케이스 자체를 분기하는 로직을 어떻게 해결하나
- 실행시점 선택 위임
# 라우터는 거대한 케이스 처리기?
# if 와 라우터의 차이점
- if는 문
- 라우터는 값, 그러므로 case 만큼 코드를 수정하지 않고 늘릴 수 있다. 
  배열을 더 추가하는것 처럼 
  우리의 핵심은 if를 제거하는것이 아니다. if는 제거할 수 없음.
  if는 제거할 수 없다. 그럼 if를 제거하는 대신에 case가 추가될 때 마다 문 을 수정하고 싶지 않을 경우 어떻게 해야되나?
  if문을 값으로 바꾸는것이다.
  if를 값으로 바꿀려면 object나 hash map을 사용해서 해당 case에 따른 처리를 value로 넣어주면 된다.
# 알고리즘은 용량으로 대체, 용량은 알고리즘으로 대체
  컴퓨터가 용량이 없으면 알고리즘으로 처리
  알고리즘이 너무 느려질거같으면 용량으로 처리
  ex) javascript의 prototype이 존재하는 이유는 prototype chain을 통해 현재 객체에 프로퍼티가 없어도 체인을 타고 타서 조회하여서 가져올 수 있다.
  왜? 용량과 처리를 교환했다. key를 매번 조회하여서 찾는다. 그래서 연산 비용을 지불하는 대신 용량을 줄였다.
  반대로 지금 현재 크롬 브라우저는 매번 연산하지 않고, 최종 객체한테 prototype chain을 다 미리 돌아놓고 key를 다 설정해놓음. 용량으로 대체함
# 정의 시점에 제거하는 방법은?
- 변화하는 부분과 변화하지 않은 부분을 나눠서 변화하지 않은 부분에서 if문을 제거하고 싶다.
## 정의 시점에 제거하는 방법은? if문을 제거하는 공식.
1. 분기 수 만큼 객체를 만들고
2. 실행시점에 경우의 수를 공급.
ex) add메서드를 통해서 경우와 경우일 경우에 대한 처리를 인자로 보내 라우팅 테이블에 셋팅을 함.

안에 있던 if문을 끄집어낼려면 바깥쪽에 if문의 경우에 수 만큼의 객체를 만들어서 넣어주고, 안쪽으로 공급해주고 바깥쪽에서 선택해서 넣어주면 된다.
바깥쪽에서는 실행기의 실행만 하는 코드로 바뀐다.

# 장점은?
1. 정의 시점에 모든 경우에대해서 몰라도된다.
2. 정의 시점에 그 경우를 처리하는 방법도 몰라도 됨. (처리기)
 - 실행 시점에서 경우를 추가해주기 때문에 그때 그때 정의를 추가만 해주면 됨.
  - 일정한 통제 범위 내에서 확장가능한 알고리즘설계 가능  
  일정한 통제 범위 내: Loader
  확장 가능한: 전략 객체들
  즉 변하는 부분과 변하지 않는 부분을 나눠서 개발할 수 있다.
  이렇게 하면 기획 문서가 완성되지 않았더라도 변하는 부분과 변하지 않은 중심 부분을 따로 개발할 수 있기에 중심 부분을 만들어놓고 기획이 완성될 때 구체적인 케이스에 대한 처리를 추가하는 방식으로 개발이 가능하다.
  변하는 부분과 변하지 않는 부분을 나눠서 정의 시점에는 변하지 않는 부분을 만들고 변하는 객체들은 나중에 런타임에 추가하는 방식 객체지향의 장점

# 단점
 - 매 호스트코드마다 안정성을 따로 담보해야 함.
 1. 실행 시점에 모든 경우를 반드시 기술해야 한다.
  - 유연한 만큼 책임이 커진다. 케이스를 실수로 빼먹을 경우에 대해서 정의 시점에서 보장하지 않기 때문이다.
  
# 실행 시점을 분기하는 다른 패턴
- Factory 
- Builder

# 과제
1. 
소유기반의 코드를 구현하되 강의에 있는 전략함수 대신 전략 클래스를 적용하여 개발하라. 전략 클래스는 추상층과 구상층을 구분한다. 완성된 전략클래스를 이용하면 
아래와 같이 작성할 수 있다.
const loader = new Github('hikaMeng', 'codespitz75');

const img = new ImageLoader('#a'); 전략 객체
loader.setParser(img);
loader.load('xx.png');

각각 서브Loader이 지켜야할 클래스가 필요.
Loader도 개조해야함

서브 Loader의 부모 클래스를 Github 클래스가 인식.
그리고 서로 계약관계

-------
# 3강
의존성이 없는 보다 작은 엔티티부터 파악하는것이 더 쉽다.
예를들어 List와 Task가 있을 때 List는 Task에 의존성이 있기 때문에 의존성이 없는 Task를 먼저 파악하는것이 더 쉽다. 


00:00 ~ 14:17
/*
Code를 작성할 때 사용하는 부분부터 작성한다.
이런게 있으면 참 좋을탠데..
난 이런 프로그램을 만들겠어와 같이
코드를 소비하는 부분을 작성한다.
```
const list1 = new TaskList('비사이드');
last1.add('지라설치');
list1.add('지라클라우드접속');

const list2 = new TaskList('s75');
list2.add('2강 답안 작성');
list2.add('2강 교안 작성');

console.log(list1.byTitle());
console.log(list2.byDate());
```
위 코드처럼 사용하는 부분만 작성해도 70%는 완성한것이다.

Class나 함수를 보강할 생각은 나중에 해도된다.
무조건 코드를 소비할 때 문제가 있나,
빠진 부분이 있나 
이것부터 체크해야한다.
허술한 부분,
생략된 부분
위 과정이 API 설계이다.

프로그래밍은 이름이 전부이다.
그럼 왜 list.add로 이름을 지었을까 addTask가 아닌?
이름을 짓는것도 상향식과 하향식이 있다.
상향식은 이름을 크게 짓는다.
처음부터 이름을 구체적으로 짓기에는 나중에 역할과 이름이 안맞을수있다.
그러므로 처음에는 이름을 크게 짓고,
나중에 역할에 맞게 이름을 구체적으로 지어주면된다.
*/

14:17 ~ 28:17
/**
 * stateGroup(boolean): 완료된것들과 완료안된것들끼리 묶을지, 상관없이 전체를 정렬할것인지
 * title(string): 각 Task 제목
 * 
 */

const taskSort = {
  // sort함수가 sorting하는지에 대한 지식을 sort함수 자체가 가질 수 없다.
  /*
    캡슐화에 위배되기 때문이다.
    즉 sort에 대한 권한은 Task 클래스가 제공해주고, 사용하는쪽에서는 단순히 sort함수를 호출하는 역할만 하고
    실제 sorting이 어떻게 될지에 대해서는 Task에게 제공받는다.
    sort함수가 직접 정렬을 할려해도, Task 객체의 내장을 알아야하기에, 결국 Task 객체가 제공해주는것을 사용할 수 밖에 없다.        
    대부분의 API는 본인의 내장을 까지 않고, 캡슐화를 제공하기 위해서
    아래 title, date를 보면 Task에 대한 상세한 지식이 없고, 그에 대한 지식은 안에 캡슐화 되어있다.
  */
  title: (a, b) => a.sortTitle(b),
  date: (a, b) => a.sortDate(b),
}

const TaskList = class {
  constructor(title) {
    if (!title) throw 'invalid title';
    this._title = title;
    this._list = [];
  }
  
  add(title, date = Date.now()) {
    this._list.push(new Task(title, date));
  }
  remove(task) {
    const list = this._list;
    if (list.includes(task)) list.splice(list.indexOf(task), 1);    
  }
  byTitle(stateGroup = true) { return this._getList('title', stateGroup); }
  byTitle(stateGroup = true) { return this._getList('date', stateGroup); }
  
  _getList(sort, stateGroup) {
    // 사본 정책: 참조를 보낼 경우 데이터가 변경될 수 있기에, 복사해서 전달해줌.
    const list = [...this._list];
    const s = taskSort[sort];
    return !stateGroup 
      ? list.sort(s) 
      : [
        ...list.filter(v => !v.isComplete()).sort(s),
        ...list.filter(v => v.isComplete()).sort(s)
      ];
  }
}

const Task = class {
  constructor(title, date) {
    if (!title) throw 'invalid title';
    this._title = title;
    // _date와 _isComplete라는 엔티티가 있을거란것을 파악해야한다.
    this._date = date;
    this._isComplete = false;
  }
  isComplete() { return this._isComplete; }
  // toggle로 check, unCheck동작을 캡슐화
  /*
    객체지향에서 은닉과 캡슐화가 있는데, 은닉은 말그대로 감추는것.
    그러나 캡슐화는 외부에게 내부의 행동을 추상화해서 제공하는것.    
    ex) ATM기기
    이게 비헤이비어이다.
  */
  toggle() { this._isComplete = !this.isComplete; } 
  sortTitle(task) {
    return this._title > task._title;
  }
  sortDate(task) {
    return this._date > task._date;
  }
}

/*
엔티티를 파악할 때 요령은 최대한 의존성이 없는것부터 파악하자.
List와 Task에서 먼저 파악할 것은 Task이다.
*/

28:17 ~ 40:37
/**
 * stateGroup(boolean): 완료된것들과 완료안된것들끼리 묶을지, 상관없이 전체를 정렬할것인지
 * title(string): 각 Task 제목
 * 
 */

const taskSort = {
  // sort함수가 sorting하는지에 대한 지식을 sort함수 자체가 가질 수 없다.
  /*
    캡슐화에 위배되기 때문이다.
    즉 sort에 대한 권한은 Task 클래스가 제공해주고, 사용하는쪽에서는 단순히 sort함수를 호출하는 역할만 하고
    실제 sorting이 어떻게 될지에 대해서는 Task에게 제공받는다.
    sort함수가 직접 정렬을 할려해도, Task 객체의 내장을 알아야하기에, 결국 Task 객체가 제공해주는것을 사용할 수 밖에 없다.        
    대부분의 API는 본인의 내장을 까지 않고, 캡슐화를 제공하기 위해서
    아래 title, date를 보면 Task에 대한 상세한 지식이 없고, 그에 대한 지식은 안에 캡슐화 되어있다.
  */
  title: (a, b) => a.sortTitle(b),
  date: (a, b) => a.sortDate(b),
}

const TaskList = class {
  constructor(title) {
    if (!title) throw 'invalid title';
    this._title = title;
    this._list = [];
  }
  
  byTitle(stateGroup = true) { return this._getList('title', stateGroup); }
  byTitle(stateGroup = true) { return this._getList('date', stateGroup); }

  add(title, date = Date.now()) {
    this._list.push(new Task(title, date));
  }
  remove(task) {
    const list = this._list;
    if (list.includes(task)) list.splice(list.indexOf(task), 1);    
  }
    
  _getList(sort, stateGroup) {
    // 사본 정책: 참조를 보낼 경우 데이터가 변경될 수 있기에, 복사해서 전달해줌.
    const list = [...this._list];
    const s = taskSort[sort];
    /*
    Task객체의 집합을 .map으로 loop돌면서 각각의 task객체의 _getList 메소드를 호출해주었다.
    즉 Task 엔티티하나하나에 대한 표현을 TaskList가 정하는것이 아니라
    loop를 돌면서 현재 자기 자신을 어떻게 표현할지 Task._getList 메소드를 호출해줌으로써 위임했다.    
    그럼 왜 TaskList에서 Task엔티티에 대한 표현을 Task가 알아야하나?
    Task객체가 가지고있는 필드값들은 전부 private접근자이기에 TaskList는 Task에 대한 형태를 정할 수 없다.
    그러므로 Task가 자기자신의 Private 필드값으로 형태를 정하는것은 바른 지식이다.
    List가 Task를 정할려면 Task의 내장을 전부 알아야한다. (내부자 거래)
    TaskList와 Task간의 거래.
    */
    const sortedTaskList = !stateGroup 
    ? list.sort(s) 
    : [
      ...list.filter(v => !v.isComplete()).sort(s),
      ...list.filter(v => v.isComplete()).sort(s)
    ];
    /*Task: { task: Task, sub: { Task } }*/
    return sortedTaskList.map(task => task._getList());
  }
}

const Task = class {
  constructor(title, date) {
    if (!title) throw 'invalid title';
    this._title = title;
    // _date와 _isComplete라는 엔티티가 있을거란것을 파악해야한다.
    this._date = date;
    this._isComplete = false;
    this._list = [];
  }
  // TaskList 클래스의 add,remove,_getList 행위가 일치하기에 TaskList 클래스의 메소드가 복사되어서 왔다.(행동이 똑같)
  add(title, date = Date.now()) {
    this._list.push(new Task(title, date));
  }
  remove(task) {
    const list = this._list;
    if (list.includes(task)) list.splice(list.indexOf(task), 1);    
  }
    
  _getList(sort, stateGroup) {
    // 사본 정책: 참조를 보낼 경우 데이터가 변경될 수 있기에, 복사해서 전달해줌.
    const list = [...this._list];
    const s = taskSort[sort];
    return {
      task: this,
      sub: !stateGroup 
      ? list.sort(s) 
      : [
        ...list.filter(v => !v.isComplete()).sort(s),
        ...list.filter(v => v.isComplete()).sort(s)
      ],
    }
  }

  isComplete() { return this._isComplete; }
  // toggle로 check, unCheck동작을 캡슐화
  /*
    객체지향에서 은닉과 캡슐화가 있는데, 은닉은 말그대로 감추는것.
    그러나 캡슐화는 외부에게 내부의 행동을 추상화해서 제공하는것.    
    ex) ATM기기
    이게 비헤이비어이다.
  */
  toggle() { this._isComplete = !this.isComplete; } 
  sortTitle(task) {
    return this._title > task._title;
  }
  sortDate(task) {
    return this._date > task._date;
  }
}

/*
엔티티를 파악할 때 요령은 최대한 의존성이 없는것부터 파악하자.
List와 Task에서 먼저 파악할 것은 Task이다.
*/

const list1 = new TaskList('비사이드');
last1.add('지라설치');
list1.add('지라클라우드접속');

const list2 = new TaskList('s75');
list2.add('2강 답안 작성');
list2.add('2강 교안 작성');

// subTask에 대해서 코드를 소비하는쪽을 먼저 작성함.
/*
그러면서 데이터 구조가 task: { task, sub: [] } 와 같이 생겼을거라는
모델링에도 성공함. 즉 코드를 소비하는부분과, 모델링을 먼저 달성하고 실제 구현에 들어가야한다.
데이터가 Optioanl하게 될 때는 모두다 존재할것이라 생각하고 일관성있게 표현해야한다.
그래야 조건문이 사라진다. 그러므로 일단 모든 Task는 task란 속성과 sub란 속성이 있을거라고 가정.
*/
const list = list2.byDate();
list[1].task.add('코드정리');
list[1].task.add('다이어그램정리');

console.log(list2.byDate()[1].sub);

위 단계까지는 거의 하드코딩과 같다. 왜냐하면 Task의 깊이를 2단계까지만 바라봤기 때문이다.

# 3단 if는 사람이 케어할 수 있는 수준을 넘어선다.
무조건 중간에 이빨이 빠진다.
ex) if (a && b) === if (a) { if(b) {  } }

# 컴포지트 패턴의 핵심은?
함수 이름이 똑같은것을 불러서 문제를 해결한다.
이름
getResult가 getResult를 부른다.
근데 자기 자신의 메소드를 호출한것이 아닌,
item에서는 자기 자신을 호출하고,
children에서는 자기 자식들의 getResult을 호출한다.
함수의 이름이야말로 우리가 리커시브한 재귀를 일으킬 수 있는 핵심
getResult -> getResult를 부른것으로 부터 컴포지트 패턴이라는것을 알 수 있다.

# 컴포지트는 전파된다.
데이터를 컴포지션이면, 데이터를 소비하는측도 컴포지션으로 되어있다.
ex) Tree
서버 개발자가 json구조를 컴포지션형태로 반환해주면, 소비하는측도 컴포지션으로 되어야한다.

# 시퀀스 다이어그램을 그릴 때 처음에는 생각대로 그리자.

# 증분 렌더는 행위의 합으로 화면이 그려진다.
ex) Click 3번 후 모달을 열었을 때
행동으로 결합해서 렌더링을 하면 다음에 다시 그 상황을 복원하려하면 똑같은 행동을 반복해줘야한다.
그에 반해 모델 렌더를 할 경우 Data에 기반되기때문에 단순히 Data를 그려주기만 하면된다.

# 도입함수와 컴포지션 함수
도입함수는 초기화해준다.

#과제
1. 버그 찾기.
2. console Renderer 찾기.