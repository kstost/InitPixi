(function (rsl, cb) {
    let lcs = 0;
    let llm = 10;
    let fail = [];
    let cbs = function () {
        let prg = lcs + fail.length;
        if (cb.progress) {
            cb.progress(Math.round((prg / rsl.length) * 100));
        } if (prg === rsl.length) {
            if (fail.length) {
                if (cb.fail) {
                    cb.fail(fail);
                }
            } else {
                if (cb.success) {
                    cb.success();
                }
            }
        }
    };
    let load_script = function (arg) {
        arg.cnt++;
        let url = arg.url;
        let scr = document.createElement('script');
        document.head.appendChild(scr);
        scr.onload = function () {
            lcs++;
            cbs();
        };
        scr.onerror = function () {
            scr.parentElement.removeChild(scr);
            if (llm > arg.cnt) {
                load_script(arg);
            } else {
                fail.push(url);
                cbs();
            }
        };
        scr.src = url;
    };
    rsl.forEach(url => {
        load_script({ url: url, cnt: 0 });
    });
})(((() => { try { extend_resource_list; return true; } catch (e) { return false; } })() ? extend_resource_list : []).concat([
    'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.0/pixi.js',
    'https://kstost.github.io/InitPixi/pixi-js-ksttool-3.js'
]), {
        progress: percent => {
            console.log('준비중', percent + '%');
            try {
                progress(percent);
            } catch (e) { }
        }, success: () => {
            console.log('준비완료');
            console.log('초기화가 완료되었습니다.\n지금부터 PixiJS 코드를 사용할 수 있습니다!');
            try {
                main();
            } catch (e) { }
        }
    });
