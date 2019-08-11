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
(()=>{let sc=document.createElement('script');sc.src='htt'+'ps://cdn.jsdelivr.net/gh/kstost/InitPixi/init_pixi.js';document.head.appendChild(sc)})();
```

4. PixiJS 를 이용해 다양하게 표현할 공간을 화면에 추가합니다  
코드상에서 보듯 숫자는 화면 크기, 그리고 컬러는 색상입니다.  
실행하면 화면에 공간이 추가되고, 그 공간에 대한 정보는 GAME 변수로 들어가게됩니다.  
```javascript
let GAME = $pxi.create_screen({ width: 1080, height: 1920, screen_bgcolor: '#000', body_bgcolor: '#222' });
```
