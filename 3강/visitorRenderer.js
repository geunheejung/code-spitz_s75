/*
Renderer애서 vistor를 인자로 받아 필드로 set할 때 renderer 자기자신을 
vistor와 함께 set하는 이유는 Renderer객체가 Task와 vistor를 중계하는 메소드를
소유하고 있어서이다.

코드의 가독성은 알고리즘이 감춰지고, 커뮤니케이션이 활성화될 때 올라간다.
로직을 바라보지 않아야함.

객체가 단계별로 실행될 때 실행되는 단계가 확정되어있을 경우 이를 Life Cycle 이라한다.
vistor에서 reset메서드.

변화율이 다를때는 file채로 바꾸지 않게 해야한다.

Task와 Renderer와 DomVistor에서
변화율로 구분하자면
데이터모델을 제공해주는 Task나 그 구조에 맞게 중계해주는 Renderer보다는
Dom 네이티브로직을 처리하는 DomVistor가 변화률이 높기에 vistor로 분리함.
DomVistor를 바꾸는 이유는 그림이 맘에 안들 때,
Renderer가 바뀌는 이유는 Task라는 자료구조의 변화에 대응하기 위해.
변화하는 이유가 틀림. 그 이유가 바로 역할
그래서 DomVistor로 따로 분리해서 관리.

트랜잭션은 관리하기 어렵다.
현재 Task의 accept 메서드를 보면 

vistor의 start와 end는 
start와 end사이에 자식들의 컴포지션 처리가 들어가야한다는 암묵적인 순서가 존재한다.
이런 메서드를 트랜잭션이라 한다.
암묵적인 순서가 강제된 메서드.

트랜잭션

Renderer는 Controlor가 되고,
DomVistor는 View가 된다.
DomVistor는 Controlor가 제공해주는 메서드를 통해 Model을 업데이트한다.

Vistor패턴을 사용함으로써 Task의 컴포지트 구조에 의해 기존 Renderer도 컴포지트로 처리했던 오염을
끊어냄.

Dom에 대한 처리는 DomVistor에게 위임하였고,
기존에는 컴포지트로 이뤄진 자료구조를 받았기에 Renderer에서도 어쩔수없이 그림을 그릴 때 컴포지트로 그렸으나,
이제는 Task에서 컴포지트가 이뤄지면서 vistor를 받기에,
기존의 컴포지트는 유지되면서 컴포지트의 시작과 끝에 외부에서 받은 vistor의 start와 end를 호출하면
각각의 컴포지트 루프마다 처리를 외부에 위임하는것이된다.
그러면 Renderer에서 다시 컴포지트로 그림을 그리지 않아도
Dom 네이티브 로직을 처리하는 Vistor를 외부에서 받아오면
알아서 DomVistor에서는 컴포지트에서 보내주는 현재 루프의 정보로 그림만 그리면되기에 완전히 Dom 네이티브에만 관심이 있고,
나머지는 컴포지트를 돌리면서 문제 없이 vistor를 호출하는 컴포지트쪽에서 처리한다.
*/