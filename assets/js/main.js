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
    const galleryGrid = document.getElementById('community-gallery');
    const loadMoreBtn = document.getElementById('load-more-gallery');
    let currentPage = 1;

    if (galleryGrid && loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            try {
                // Simulate loading more items
                loadMoreBtn.textContent = 'Loading...';
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Add new gallery items
                const newItems = [
                    {
                        image: 'assets/images/gallery/gallery4.jpg',
                        title: 'Community Spirit',
                        author: 'Maya H.'
                    },
                    {
                        image: 'assets/images/gallery/gallery5.jpg',
                        title: 'Musical Heritage',
                        author: 'Karim S.'
                    },
                    {
                        image: 'assets/images/gallery/gallery6.jpg',
                        title: 'Unity in Art',
                        author: 'Nour A.'
                    }
                ];

                newItems.forEach(item => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    galleryItem.innerHTML = `
                        <img src="${item.image}" alt="${item.title}" loading="lazy">
                        <div class="gallery-overlay">
                            <h5>${item.title}</h5>
                            <p>By ${item.author}</p>
                        </div>
                    `;
                    galleryGrid.appendChild(galleryItem);
                });

                currentPage++;
                if (currentPage >= 3) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.textContent = 'Load More';
                }
            } catch (error) {
                console.error('Error loading gallery items:', error);
                loadMoreBtn.textContent = 'Error loading items';
            }
        });
    }

    // Contribution Buttons
    const submitArtworkBtn = document.getElementById('submit-artwork-btn');
    const uploadMusicBtn = document.getElementById('upload-music-btn');

    if (submitArtworkBtn) {
        submitArtworkBtn.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Submit Artwork</h3>
                    <form id="artwork-form" class="story-form">
                        <div class="form-group">
                            <label for="artwork-title">Artwork Title</label>
                            <input type="text" id="artwork-title" name="title" required>
                        </div>
                        <div class="form-group">
                            <label for="artwork-description">Description</label>
                            <textarea id="artwork-description" name="description" rows="3" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="artwork-file">Upload Artwork</label>
                            <input type="file" id="artwork-file" name="artwork" accept="image/*" required>
                        </div>
                        <button type="submit" class="submit-button">Submit Artwork</button>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);
            handleModal(modal);
        });
    }

    if (uploadMusicBtn) {
        uploadMusicBtn.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Upload Music</h3>
                    <form id="music-form" class="story-form">
                        <div class="form-group">
                            <label for="track-title">Track Title</label>
                            <input type="text" id="track-title" name="title" required>
                        </div>
                        <div class="form-group">
                            <label for="track-description">Description</label>
                            <textarea id="track-description" name="description" rows="3" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="track-file">Upload Audio File</label>
                            <input type="file" id="track-file" name="track" accept="audio/*" required>
                        </div>
                        <button type="submit" class="submit-button">Upload Track</button>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);
            handleModal(modal);
        });
    }

    // Helper function for modal handling
    function handleModal(modal) {
        const closeBtn = modal.querySelector('.close-modal');
        const form = modal.querySelector('form');

        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically send the form data to your server
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Thank You!</h3>
                    <p>Your submission has been received. We'll review it and get back to you soon.</p>
                    <button class="close-button">Close</button>
                </div>
            `;

            const closeButton = modal.querySelector('.close-button');
            closeButton.addEventListener('click', () => {
                modal.remove();
            });
        });
    }

}); // End of DOMContentLoaded 