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

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = mainNav.querySelectorAll('a');
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
    }

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

    // Impact Stories Section
    const shareStoryBtn = document.getElementById('share-story-btn');
    if (shareStoryBtn) {
        shareStoryBtn.addEventListener('click', () => {
            // Create modal for story submission
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Share Your Story</h3>
                    <form id="story-form" class="story-form">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="location">Location</label>
                            <input type="text" id="location" name="location" required>
                        </div>
                        <div class="form-group">
                            <label for="story">Your Story</label>
                            <textarea id="story" name="story" rows="5" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="media">Add Photos (optional)</label>
                            <input type="file" id="media" name="media" accept="image/*" multiple>
                        </div>
                        <button type="submit" class="submit-button">Submit Story</button>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Handle modal close
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });

            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // Handle form submission
            const storyForm = modal.querySelector('#story-form');
            storyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Here you would typically send the form data to your server
                // For now, we'll just show a success message
                modal.innerHTML = `
                    <div class="modal-content">
                        <h3>Thank You!</h3>
                        <p>Your story has been submitted successfully. We'll review it and share it with our community soon.</p>
                        <button class="close-button">Close</button>
                    </div>
                `;

                const closeButton = modal.querySelector('.close-button');
                closeButton.addEventListener('click', () => {
                    modal.remove();
                });
            });
        });
    }

    // Animate story cards on scroll
    const storyCards = document.querySelectorAll('.story-card');
    if (storyCards.length) {
        const storyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    storyObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        storyCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            storyObserver.observe(card);
        });
    }

    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            timelineObserver.observe(item);
        });
    }

    // Animate voice cards on scroll
    const voiceCards = document.querySelectorAll('.voice-card');
    if (voiceCards.length) {
        const voiceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    voiceObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        voiceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
            voiceObserver.observe(card);
        });
    }

    // Community Hub - Sound Map
    const soundMap = document.getElementById('gaza-sound-map');
    const playAllSoundsBtn = document.getElementById('play-all-sounds');
    const soundFilters = document.querySelectorAll('.filter-btn');

    if (soundMap) {
        // Initialize map (using a mapping service like Leaflet.js or Google Maps)
        // This is a placeholder for the actual map implementation
        const initMap = () => {
            soundMap.querySelector('.map-loading').style.display = 'none';
            // Add map initialization code here
        };

        // Load map after a short delay to simulate loading
        setTimeout(initMap, 1000);

        // Handle sound filters
        soundFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                soundFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                // Add filter functionality here
            });
        });

        // Handle play all sounds
        if (playAllSoundsBtn) {
            playAllSoundsBtn.addEventListener('click', () => {
                const isPlaying = playAllSoundsBtn.classList.contains('playing');
                if (isPlaying) {
                    playAllSoundsBtn.classList.remove('playing');
                    playAllSoundsBtn.querySelector('.control-icon').textContent = '▶';
                    // Stop all sounds
                } else {
                    playAllSoundsBtn.classList.add('playing');
                    playAllSoundsBtn.querySelector('.control-icon').textContent = '⏸';
                    // Play all sounds
                }
            });
        }
    }

    // Community Gallery
    const galleryGrid = document.querySelector('.gallery-grid');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let currentPage = 1;

    async function loadMoreGalleryItems() {
        try {
            // Simulate loading more items
            const newItems = [
                {
                    image: 'https://placehold.co/800x600/234/fff?text=Community+Art',
                    title: 'Community Art Project',
                    description: 'Local artists coming together'
                },
                {
                    image: 'https://placehold.co/800x600/234/fff?text=Music+Session',
                    title: 'Street Music Session',
                    description: 'Sharing culture through music'
                },
                {
                    image: 'https://placehold.co/800x600/234/fff?text=Youth+Program',
                    title: 'Youth Engagement',
                    description: 'Building future leaders'
                }
            ];

            newItems.forEach(item => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="gallery-image">
                    <div class="gallery-overlay">
                        <h5>${item.title}</h5>
                        <p>${item.description}</p>
                    </div>
                `;
                galleryGrid.appendChild(galleryItem);
            });

            currentPage++;

            // Hide load more button after loading all items
            if (currentPage >= 3) {
                loadMoreBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading gallery items:', error);
        }
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreGalleryItems);
    }

    // Contribution Form
    const contributionForm = document.querySelector('.contribution-form');
    if (contributionForm) {
        contributionForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contributionForm);
            const submitBtn = contributionForm.querySelector('button[type="submit"]');

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';

                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success';
                successMessage.textContent = 'Thank you for your contribution! We will review it shortly.';
                contributionForm.insertAdjacentElement('beforebegin', successMessage);

                // Reset form
                contributionForm.reset();

                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            } catch (error) {
                console.error('Error submitting contribution:', error);

                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-error';
                errorMessage.textContent = 'An error occurred. Please try again later.';
                contributionForm.insertAdjacentElement('beforebegin', errorMessage);

                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Contribution';
            }
        });
    }

    // Resource Center
    const resourceGroups = document.querySelectorAll('.resource-group');
    resourceGroups.forEach(group => {
        const heading = group.querySelector('h4');
        const list = group.querySelector('.resource-list');

        if (heading && list) {
            heading.addEventListener('click', () => {
                const isExpanded = list.style.maxHeight;

                // Collapse all other lists
                document.querySelectorAll('.resource-list').forEach(otherList => {
                    if (otherList !== list) {
                        otherList.style.maxHeight = null;
                    }
                });

                // Toggle current list
                list.style.maxHeight = isExpanded ? null : `${list.scrollHeight}px`;
            });
        }
    });

    // Newsletter Form Handling
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value;

            // Validate email
            if (!email || !email.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }

            // Show loading state
            const submitBtn = newsletterForm.querySelector('.subscribe-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;

            try {
                // Here you would typically send the email to your server
                // For now, we'll simulate a successful subscription
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Show success message
                newsletterForm.innerHTML = `
                    <div class="success-message">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <p>Thank you for subscribing! We'll keep you updated on our latest news and impact stories.</p>
                    </div>
                `;
            } catch (error) {
                console.error('Error subscribing to newsletter:', error);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                alert('Failed to subscribe. Please try again later.');
            }
        });
    }

    // Cookie Consent Management
    const cookieConsent = {
        init() {
            if (!this.hasUserConsent()) {
                this.showConsentModal();
            }
            this.bindEvents();
        },

        hasUserConsent() {
            return localStorage.getItem('cookieConsent') !== null;
        },

        showConsentModal() {
            const modal = document.createElement('div');
            modal.className = 'cookie-consent';
            modal.innerHTML = `
                <div class="container">
                    <div class="cookie-consent-text">
                        <h3>Cookie Settings</h3>
                        <p>We use cookies to enhance your experience and analyze our website traffic. By clicking "Accept All", you consent to our use of cookies. Visit our <a href="cookies.html">Cookie Policy</a> to learn more.</p>
                    </div>
                    <div class="cookie-consent-actions">
                        <button class="cookie-accept">Accept All</button>
                        <button class="cookie-reject">Reject Non-Essential</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            // Ensure the modal is visible
            modal.style.display = 'block';
        },

        bindEvents() {
            document.addEventListener('click', (e) => {
                if (e.target.matches('.cookie-accept')) {
                    this.acceptAll();
                } else if (e.target.matches('.cookie-reject')) {
                    this.rejectNonEssential();
                }
            });
        },

        acceptAll() {
            localStorage.setItem('cookieConsent', 'all');
            this.hideConsentModal();
            this.initializeAnalytics();
        },

        rejectNonEssential() {
            localStorage.setItem('cookieConsent', 'essential');
            this.hideConsentModal();
        },

        hideConsentModal() {
            const modal = document.querySelector('.cookie-consent');
            if (modal) {
                modal.remove();
            }
        },

        initializeAnalytics() {
            // Initialize analytics only if user has accepted all cookies
            if (localStorage.getItem('cookieConsent') === 'all') {
                // Add your analytics initialization code here
                console.log('Analytics initialized');
            }
        }
    };

    // Initialize cookie consent immediately when script loads
    cookieConsent.init();

    const soundData = [
        {
            name: "Morning Market",
            category: "urban",
            location: [31.5017, 34.4668],
            description: "The bustling sounds of Gaza City's morning market",
            audioUrl: "https://assets.mixkit.co/music/preview/mixkit-market-day-568.mp3"
        },
        {
            name: "Mediterranean Waves",
            category: "nature",
            location: [31.5225, 34.4512],
            description: "Peaceful waves along Gaza's Mediterranean coast",
            audioUrl: "https://assets.mixkit.co/music/preview/mixkit-waves-and-birds-165.mp3"
        },
        {
            name: "Evening Call to Prayer",
            category: "cultural",
            location: [31.5139, 34.4503],
            description: "The melodic evening call to prayer echoing through the city",
            audioUrl: "https://assets.mixkit.co/music/preview/mixkit-spiritual-moment-538.mp3"
        }
    ];

}); // End of DOMContentLoaded 