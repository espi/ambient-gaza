// Theme toggle functionality
function initThemeToggle() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }

    // Initialize theme based on system preference
    setTheme(prefersDarkScheme.matches);

    // Listen for system theme changes
    prefersDarkScheme.addListener((e) => setTheme(e.matches));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const bandcampIframe = document.querySelector('.bandcamp-embed iframe');

    function updateBandcampTheme(isDark) {
        if (bandcampIframe) {
            const baseUrl = 'https://bandcamp.com/EmbeddedPlayer/album=2550048061/size=large/';
            const params = new URLSearchParams({
                bgcol: isDark ? '333333' : 'ffffff',
                linkcol: isDark ? '0f91ff' : '0687f5',
                tracklist: 'false',
                artwork: 'small',
                transparent: 'true'
            });
            bandcampIframe.src = `${baseUrl}${params.toString()}/`;
        }
    }

    function setTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateBandcampTheme(isDark);
    }

    // Check for saved theme preference, otherwise use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark);
    }

    // Toggle theme
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme !== 'dark');
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });

    // Mobile menu functionality
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.site-header')) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        }
    });

    // Share functionality
    const copyLinkButton = document.querySelector('.copy-link');
    if (copyLinkButton) {
        copyLinkButton.addEventListener('click', async () => {
            const url = copyLinkButton.dataset.url;
            try {
                await navigator.clipboard.writeText(url);
                const originalText = copyLinkButton.textContent;
                copyLinkButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyLinkButton.innerHTML = `
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"/>
                        </svg>
                        Copy Link
                    `;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    }
}); 