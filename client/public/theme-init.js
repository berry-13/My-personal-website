// Prevent flash of wrong theme - runs synchronously before React
(function() {
    var theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    }
})();
