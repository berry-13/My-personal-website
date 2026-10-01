(function () {
    var root = document.documentElement;
    var stored = null;
    try {
        stored = localStorage.getItem("theme");
    } catch (e) {}
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) {
        root.classList.add("dark");
    }

    // Hero animation waits for the web fonts so the headline never reflows; give up after 1.2s
    var ready = function () {
        root.classList.add("fonts-ready");
    };
    if (document.fonts && document.fonts.load) {
        // Request the faces explicitly; fonts.ready alone can resolve before any load has started
        Promise.all([
            document.fonts.load("400 1em Newsreader"),
            document.fonts.load("400 1em 'JetBrains Mono'"),
        ]).then(ready, ready);
        setTimeout(ready, 1200);
    } else {
        ready();
    }
})();
