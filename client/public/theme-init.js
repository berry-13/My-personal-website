(function () {
    var stored = null;
    try {
        stored = localStorage.getItem("theme");
    } catch (e) {}
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) {
        document.documentElement.classList.add("dark");
    }
})();
