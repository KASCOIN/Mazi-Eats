const navOptions = document.querySelectorAll('.routes');
        const body = document.body;
        const currentPage = body.classList[0];
        console.log('This is the: ', currentPage);

        navOptions.forEach(option => {
            console.log('Checking option: ', option.classList[1], currentPage == option.classList[1]);
            if (option.classList[1] === currentPage) {
                option.classList.add('nav-active');
            } else {
                option.classList.remove('nav-active');
            }
        })

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.warn('Service worker registration failed:', error);
        });
    });
}