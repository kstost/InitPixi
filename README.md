# InitPixi

PixiJS 라이브러리를 로드하고 초기화를 간단히 처리해줄 수 있도록 돕는 코드입니다  
누구던 특별한 개발환경 없이 웹브라우저만 있으면 개발자도구의 콘솔에서도 경험해볼 수 있습니다  

## 사용법

1. 크롬등의 브라우저를 켜고 주소창에 *about:blank* 를 입력하고 엔터를 칩니다. 그러면 흰 화면이 나옵니다.

2. 크롬브라우저의 개발자도구의 콘솔을 켭니다. 켜는 방법은 맥에선 *CMD + Alt + J*, 윈도우즈에선 *Ctrl + Shift + J*

3. 콘솔에 아래 코드를 입력합니다.  
이 코드는 현재 빈 페이지에 PixiJS 엔진 관련 리소스를 로드하여 초기화 합니다.  
초기화가 완료되면 "준비완료" 라고 뜨고, 그 다음부터는 PixiJS 관련 코드를 사용할 수 있습니다.  

```javascript
(()=>{let sc=document.createElement('script');sc.src='htt'+'ps://kstost.github.io/InitPixi/pixi_loader_3.js';document.head.appendChild(sc)})();
```

4. PixiJS 를 이용해 다양하게 표현할 공간을 화면에 추가합니다  
코드상에서 보듯 숫자는 화면 크기, 그리고 컬러는 색상입니다.  
실행하면 화면에 공간이 추가되고, 그 공간에 대한 정보는 GAME 변수로 들어가게됩니다.  
```javascript
let GAME = $pxi.create_screen({ width: 1080, height: 1920, screen_bgcolor: '#000', body_bgcolor: '#222' });
```

5. 공간에 원을 추가합니다  
drawCircle 함수의 인자의 1, 2번째는 원의 중심점 좌표 x, y 인데 0으로 해두고 3번째인자만 수정해주세요 3번째인자는 반지름입니다.  
```javascript
let circle = new PIXI.Graphics();
circle.beginFill(0x99FF99);
circle.drawCircle(0, 0, 320);
circle.endFill();
GAME.stage.addChild(circle);
```

6. 원의 중심점을 이동합니다  
만약 원을 drawCircle(10, 20, 320) 이렇게 만들었다면  
아래 코드 실행시에는 실제 화면상 보이기를 x:510 y:620 좌표로 이동하게 됩니다.  
```javascript
circle.position.x = 500;
circle.position.y = 600;
```

7. 원의 스케일도 바꿔봅시다  
```javascript
circle.scale.x = 0.3;
```

8. 회전도 시켜봅시다  
대입해준 값이 약간 복잡하게 생겼는데요.  
각도에 대한 수치인데 단위는 우리가 익숙한 직각은 90도 이런 모양인 Degree가 아니라  
Radian 단위를 사용합니다 90도는 3.14 / 2 로 표현됩니다.  
자바스크립트 상수인 Math.PI 는 원주율값인 3.141592653589793 가 들어가있습니다.  

```javascript
circle.rotation = (Math.PI / 4); // 45도로 틀어준다
```

9. 원을 클릭해봅시다  
interactive 속성의 기본은 false 이고 이 값을 true 로 해주지 않으면 이벤트를 걸어줘도 작동하지 않습니다.  
```javascript
circle.interactive = true;
circle.mousedown = function (event) {
    this.position.x += 10;
};
```

10. 애니메이션효과를 줘봅시다  
컴퓨터 성능이 따라주는 한 1초에 60회 animation 함수를 실행해준다.  
1초에 60회를 실행할수 있다면 delta_time 은 1이다  
컴퓨터 성능이 따라주지 못하면 1초에 60회를 채우지 못할 수 있다.  
성능이 따라주지 못해 1초에 30회를 실행한다면 delta_time 은 2이다  
성능이 따라주지 못해 1초에 2회를 실행한다면 delta_time 은 30이다  
즉 1초안에 실행한 횟수 곱하기 delta_time 은 60인 셈이다.  
```javascript
let animation = function (delta_time) {
    circle.position.x += 3 * delta_time;
};
PIXI.Ticker.shared.add(animation);
```

11. 위 애니메이션 코드를 실행하면 원은 오른쪽으로 사라지고 없다.
6번에서 했던 포지션 바꾸기로 다시 데려와보자
```javascript
circle.position.x = 0;
```

## 콘솔이 아닌 웹페이지에 js 포함시켜서 사용하는 법

1. 아래 코드 복사해서 html 파일에 넣어서 열어보자

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <!-- 이렇게 js 파일 추가하고 -->
    <script src="https://kstost.github.io/InitPixi/pixi_loader_3.js"></script>
    <script>

        // onload 시점에 create_screen 코드를 실행해주세요
        window.onload = function () {

            // 화면 생성
            // GAME.stage 안에 화면에 대한 정보가 들어가게됩니다
            let GAME = $pxi.create_screen({ width: 1080, height: 1120, screen_bgcolor: '#000', body_bgcolor: '#222' });

            // 그래픽 요소를 생성해서 화면에 추가
            let circle = new PIXI.Graphics();
            circle.beginFill(0x99FF99);
            circle.drawCircle(0, 0, 320);
            circle.endFill();
            GAME.stage.addChild(circle);

            // 그래픽 요소의 위치를 변경
            circle.position.x = 1080 / 2;
            circle.position.y = 1120 / 2;

            // x축의 스케일을 줄여서 찌그러트리기
            circle.scale.x = 0.2;

            // 글씨를 화면에 추가
            let label = new PIXI.Text('글씨', new PIXI.TextStyle({
                fontFamily: "Arial",
                fontSize: 100,
                fill: "white",
            }));
            label.anchor.x = 0.5;
            label.anchor.y = 0.5;
            label.position.y = (1120 - 50) - 50;
            label.position.x = 1080 / 2;
            GAME.stage.addChild(label);

            // 매프레임마다 회전값을 바꾸기
            let animation = function (delta_time) {
                circle.rotation += 0.01 * delta_time;
                label.text = (Math.round((circle.rotation * 360) / (Math.PI * 2)) % 360) + '°';
            };
            PIXI.Ticker.shared.add(animation);

        }
    </script>
</head>

<body>
</body>

</html>
```
