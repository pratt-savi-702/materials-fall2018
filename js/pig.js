window.addEventListener('load', function() {
    var w = window, d = document, cur = 0,
        style = d.head.appendChild(d.createElement('style'));
    function go(n) { w.scrollTo(0, w.innerHeight * (cur = n) + 1); }
    function set() {
        style.innerHTML = '.slide {display:block;' +
            'height:' + window.innerHeight + 'px;}';
    }

    function next() {
        go(++cur);
    }
    function prev() {
        go(Math.max(0, --cur));
    }

    function inGridMode() {
        return d.body.classList.contains('grid-mode');
    }

    function toggleGridMode() {
        d.body.classList.toggle('grid-mode');
        if (!inGridMode()) {
            go(cur);
        }
        else {
            d.querySelectorAll('.slide').item(cur).scrollIntoView();
        }
    }

    d.querySelectorAll('.slide').forEach(function (slide, index) {
        slide.addEventListener('click', function (e) {
            if (inGridMode()) {
                d.body.classList.toggle('grid-mode');
                cur = index;
                go(cur);
            }
        });
    });

    w.addEventListener('resize', function () {
        set();
        go(cur);
    });
    w.addEventListener('scroll', function update(e) {
        if (inGridMode()) return;
        cur = Math.floor(w.scrollY / w.innerHeight);
        if (w.location.hash !== cur) w.location.hash = cur;
        e.preventDefault();
    });
    w.addEventListener('DOMMouseScroll', function(e) {
        e.preventDefault();
    });
    d.addEventListener('keydown', function(e) {
        if (e.which === 39 || e.which === 34) {
            if (inGridMode()) return;
            next();
            e.preventDefault();
        }
        if (e.which === 37 || e.which === 33) {
            if (inGridMode()) return;
            prev();
            e.preventDefault();
        }
        if (e.key === 'g') {
            toggleGridMode();
        }
    });
    function hash() {
        return Math.max(parseInt(window.location.hash.substring(1), 10), 0);
    }
    if (window.location.hash) cur = hash() || cur;
    window.onhashchange = function() { if (hash() !== cur) go(hash()); };
    set();
    go(cur);

    if (Hammer) {
        var hammertime = new Hammer(document.body, {});
        hammertime.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });

        hammertime.on('pandown panup', function (e) {
            if (e && e.gesture) e.gesture.preventDefault();
        });

        hammertime.on('swiperight', function (e) {
            prev();
            if (e && e.gesture) e.gesture.preventDefault();
        });
        hammertime.on('swipeleft', function (e) {
            next();
            if (e && e.gesture) e.gesture.preventDefault();
        });
    }
});
