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
    // Music Player Handling
    const spotifyPlayerEmbed = document.querySelector('.spotify-embed .responsive-embed');
    const bandcampPlayerEmbed = document.querySelector('.bandcamp-embed .responsive-embed');
    const spotifyPlayerIframe = spotifyPlayerEmbed?.querySelector('iframe');
    const bandcampPlayerIframe = bandcampPlayerEmbed?.querySelector('iframe');

    // Add loading states
    if (spotifyPlayerEmbed) spotifyPlayerEmbed.classList.add('loading');
    if (bandcampPlayerEmbed) bandcampPlayerEmbed.classList.add('loading');

    // Handle Spotify embed
    if (spotifyPlayerIframe) {
        spotifyPlayerIframe.addEventListener('load', () => {
            spotifyPlayerEmbed.classList.remove('loading');
        });

        spotifyPlayerIframe.addEventListener('error', () => {
            spotifyPlayerEmbed.innerHTML = `
                <div class="embed-error">
                    <p>Failed to load Spotify player. Please try refreshing the page.</p>
                </div>
            `;
        });
    }

    // Handle Bandcamp embed and theme
    if (bandcampPlayerIframe) {
        bandcampPlayerIframe.addEventListener('load', () => {
            bandcampPlayerEmbed.classList.remove('loading');
        });

        bandcampPlayerIframe.addEventListener('error', () => {
            bandcampPlayerEmbed.innerHTML = `
                <div class="embed-error">
                    <p>Failed to load Bandcamp player. Please try refreshing the page.</p>
                </div>
            `;
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');

    function updateBandcampTheme(isDark) {
        if (bandcampPlayerIframe) {
            const baseUrl = 'https://bandcamp.com/EmbeddedPlayer/album=2550048061/size=large/';
            const params = new URLSearchParams({
                bgcol: isDark ? '333333' : 'ffffff',
                linkcol: isDark ? '0f91ff' : '0687f5',
                tracklist: 'false',
                artwork: 'small',
                transparent: 'true'
            });
            bandcampPlayerIframe.src = `${baseUrl}${params.toString()}/`;
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

    // Donation form handling
    const donationForm = document.getElementById('donation-form');
    const donationSelect = document.getElementById('donation-amount');
    const customAmount = document.getElementById('custom-amount');
    const tierButtons = document.querySelectorAll('.tier-select-button');
    const recurringCheckbox = document.getElementById('recurring-donation');

    // Handle tier selection
    tierButtons.forEach(button => {
        button.addEventListener('click', () => {
            const amount = button.dataset.amount;
            donationSelect.value = amount;
            customAmount.style.display = 'none';

            // Scroll to form
            document.querySelector('.donation-form-container').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    });

    // Handle custom amount toggle
    if (donationSelect && customAmount) {
        donationSelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customAmount.style.display = 'block';
                customAmount.focus();
            } else {
                customAmount.style.display = 'none';
            }
        });
    }

    // Handle form submission
    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = donationSelect.value === 'custom' ? customAmount.value : donationSelect.value;
            const isRecurring = recurringCheckbox.checked;

            // Validate amount
            if (!amount || isNaN(amount) || amount <= 0) {
                alert('Please enter a valid donation amount');
                return;
            }

            // Add amount to form
            const amountInput = document.createElement('input');
            amountInput.type = 'hidden';
            amountInput.name = 'amount';
            amountInput.value = amount;
            donationForm.appendChild(amountInput);

            // Add recurring flag if checked
            if (isRecurring) {
                const recurringInput = document.createElement('input');
                recurringInput.type = 'hidden';
                recurringInput.name = 'recurring';
                recurringInput.value = '1';
                donationForm.appendChild(recurringInput);
            }

            // Submit form
            donationForm.submit();
        });
    }

    // Progress bar animation
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        // Animate progress bar on scroll into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBar.style.width = progressBar.dataset.progress || '0%';
                }
            });
        }, { threshold: 0.5 });

        observer.observe(progressBar);
    }

    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length) {
        const animateValue = (element, start, end, duration) => {
            const range = end - start;
            const increment = range / (duration / 16);
            let current = start;
            const timer = setInterval(() => {
                current += increment;
                if (current >= end) {
                    clearInterval(timer);
                    current = end;
                }
                element.textContent = current.toLocaleString('en-US', {
                    style: element.dataset.format === 'currency' ? 'currency' : 'decimal',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            }, 16);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const value = parseFloat(element.textContent.replace(/[^0-9.-]+/g, ''));
                    animateValue(element, 0, value, 2000);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    // Audio preview functionality
    const audioPreview = document.getElementById('ambient-preview');
    const playButton = document.getElementById('play-preview');

    if (audioPreview && playButton) {
        playButton.addEventListener('click', () => {
            if (audioPreview.paused) {
                audioPreview.play();
                playButton.classList.add('playing');
            } else {
                audioPreview.pause();
                playButton.classList.remove('playing');
            }
        });

        audioPreview.addEventListener('ended', () => {
            playButton.classList.remove('playing');
        });

        // Preload audio when user interacts with the page
        document.addEventListener('click', () => {
            audioPreview.load();
        }, { once: true });
    }

    // Track preview functionality
    const previewButtons = document.querySelectorAll('.preview-button');
    let currentAudio = null;
    let currentButton = null;

    previewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const previewUrl = button.dataset.preview;

            // If there's already a preview playing
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentButton.classList.remove('playing');

                // If clicking the same button, just stop playback
                if (currentButton === button) {
                    currentAudio = null;
                    currentButton = null;
                    return;
                }
            }

            // Play new preview
            const audio = new Audio(previewUrl);
            audio.addEventListener('ended', () => {
                button.classList.remove('playing');
                currentAudio = null;
                currentButton = null;
            });

            audio.play().catch(error => {
                console.error('Error playing preview:', error);
                button.innerHTML = `
                    <span class="preview-icon">⚠️</span>
                    <span class="preview-text">Error</span>
                `;
            });

            button.classList.add('playing');
            currentAudio = audio;
            currentButton = button;
        });
    });

    // Stop preview playback when starting Spotify or Bandcamp players
    [spotifyPlayerIframe, bandcampPlayerIframe].forEach(iframe => {
        if (iframe) {
            iframe.addEventListener('load', () => {
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    currentButton.classList.remove('playing');
                    currentAudio = null;
                    currentButton = null;
                }
            });
        }
    });
}); 