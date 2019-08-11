let $pxi = {
   create_screen: function (arg) {
      document.body.style.backgroundColor = arg.body_bgcolor;
      document.body.style.overflow = 'hidden';
      return $pxi.init(arg.width, arg.height, arg.fps_monitor, arg);
   },
   common: {
      make_blink: function (graphics, spd) {
         let lmt = spd;
         let prd = 0;
         let mdd = true;
         let move1 = function (dt) {
            if (mdd) {
               prd += 1 * dt;
               if (prd >= lmt) {
                  prd = lmt;
                  mdd = !mdd;
               }
            } else {
               prd -= 1 * dt;
               if (prd <= 0) {
                  prd = 0;
                  mdd = !mdd;
               }
            }
            graphics.alpha = prd / lmt;
         };
         PIXI.Ticker.shared.add(move1);
         return move1;
      },
      uniquue: function () {
         let uniqu_counter = vs.get('uniqu_counter');
         if (uniqu_counter === undefined) {
            vs.set('uniqu_counter', 1);
            uniqu_counter = vs.get('uniqu_counter');
         }
         vs.set('uniqu_counter', uniqu_counter + 1);
         return uniqu_counter;
      },
      isPc: function () {
         return !((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent));
      },
   },
   init: function (GAME_WIDTH, GAME_HEIGHT, fps_monitor, arg) {
      let rtn = {};
      $pxi.GAME_WIDTH = GAME_WIDTH;
      $pxi.GAME_HEIGHT = GAME_HEIGHT;
      let app = new PIXI.Application({
         width: GAME_WIDTH,
         height: GAME_HEIGHT,
         autoResize: true,
         transparent: false,
         resolution: $pxi.display.getRatio(),
         backgroundColor: arg.screen_bgcolor ? arg.screen_bgcolor : '#000',
         antialias: true
      });
      app.renderer.view.style.border = "0px";
      app.renderer.view.style.position = "absolute";
      rtn.app = app.app;
      rtn.stage = app.stage;
      rtn.renderer = app.renderer;
      try { rtn.g_localAdvStorage = new LocalAdvStorage(); } catch (e) { }
      try { rtn.vs = new AdvStore(); } catch (e) { }
      ['blocks', 'moving_things', 'aiming_line', 'extend_balls'].forEach(key => {
         try { rtn[key] = new AdvDict(); } catch (e) { }
      });
      $pxi.VS = rtn.vs;
      $pxi.APP = rtn.app;
      $pxi.STAGE = rtn.stage;
      $pxi.RENDERER = app.renderer;
      $pxi.display.setResizeEvent({ stage: rtn.stage, renderer: app.renderer });
      document.body.appendChild(app.renderer.view);
      if (fps_monitor) {
         try { (function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); stats.showPanel(0); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })(); } catch (e) { }
      }
      return rtn;
   },
   display: {
      vrRatio: function () {
         let width = $pxi.GAME_WIDTH;
         let height = $pxi.GAME_HEIGHT;
         return Math.min(window.innerWidth / width, window.innerHeight / height);
      },
      getRatio: function () {
         return window.devicePixelRatio;
      },
      resize: function (arg) {
         let stage = arg.stage;
         let renderer = arg.renderer;
         let ratio = $pxi.display.vrRatio();
         let ppirt = $pxi.display.getRatio();
         let width = window.innerWidth;
         let height = window.innerWidth * ($pxi.GAME_HEIGHT / $pxi.GAME_WIDTH);
         if (window.innerHeight < height) {
            height = window.innerHeight;
            width = ($pxi.GAME_WIDTH * height) / $pxi.GAME_HEIGHT;
         }
         let rrv = function (renderer, width, height) {
            let ppirt = $pxi.display.getRatio();
            renderer.resize(width, height);
            let width2 = (renderer.view.width / window.innerWidth) / ppirt;
            let height2 = (renderer.view.height / window.innerHeight) / ppirt;
            return { width: width2, height: height2 };
         };
         let sz = rrv(renderer, width, height);
         let tt = 1;
         tt = sz.height;
         stage.scale.x = stage.scale.y = ratio / tt;
         renderer.resize(width / tt, height / tt);
         if (renderer.view.width / ppirt > window.innerWidth) {
            tt = sz.width;
            stage.scale.x = stage.scale.y = ratio / tt;
            renderer.resize(width / tt, height / tt);
         }
         renderer.view.style.top = ((window.innerHeight - renderer.view.height / ppirt) / 2) + 'px';
         renderer.view.style.left = ((window.innerWidth - renderer.view.width / ppirt) / 2) + 'px';
      },
      setResizeEvent: function (arg) {
         window.addEventListener("resize", (function () {
            $pxi.display.resize(this);
         }).bind(arg));
         window.dispatchEvent(new Event('resize'));
      },
   },
   cco: function (value) {
      return (value / $pxi.display.vrRatio());
   },
};
