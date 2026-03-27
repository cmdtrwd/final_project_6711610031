// Vanilla JavaScript for scroll interactions and animations

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar Effect
    const navbar = document.getElementById('navbar');
    
    // Add event listener to window scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Run once on load to catch if page is already scrolled vertically
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // 2. Hamburger Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-icon');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBackdrop = document.getElementById('mobile-menu-backdrop');

    function openMobileMenu() {
        mobileMenu.classList.add('is-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuBtn.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // prevent background scroll
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuBtn.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    if (menuBtn && mobileMenu) {
        // Toggle on hamburger click
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu();
        });

        // Close when clicking backdrop
        mobileBackdrop.addEventListener('click', closeMobileMenu);

        // Close when a link inside the menu is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }


    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserverOptions = {
        root: null, // Viewport
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before the item hits the bottom
        threshold: 0.15 // 15% of the element must be visible
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the visible class to trigger CSS animation
                entry.target.classList.add('visible');
                // Stop observing once animated to avoid repeated triggering
                observer.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    // Attach observer to all elements with '.fade-in' class
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // 3. Preloader & Spline Integration
    const preloader = document.getElementById('preloader');
    const spline = document.querySelector('spline-viewer');
    
    let isPreloaderRemoved = false;
    const hidePreloader = () => {
        if (isPreloaderRemoved) return;
        isPreloaderRemoved = true;
        
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        }
    };

    if (preloader) {
        // Lock body scroll while loading
        document.body.style.overflow = 'hidden';
        
        // Listen to Spline load event
        if (spline) {
            spline.addEventListener('load', hidePreloader);
        } else {
            // Fallback for subpages without Spline
            window.addEventListener('load', hidePreloader);
        }
        
        // Supreme fallback timeout (e.g. 7 seconds max wait)
        setTimeout(hidePreloader, 7000);
    }

    // 4. Smooth Forward Scroll Events for Spline Viewer
    if (spline) {
        let currentScrollY = window.scrollY;
        let targetScrollY = window.scrollY;
        let isAnimating = false;

        function lerpScroll() {
            if (!isAnimating) return;

            // Calculate distance
            const diff = targetScrollY - currentScrollY;
            
            // If we are close enough, snap to target and stop animating
            if (Math.abs(diff) < 1) {
                window.scrollTo(0, targetScrollY);
                currentScrollY = targetScrollY;
                isAnimating = false;
                return;
            }

            // Lerp (linear interpolation) for that buttery smooth momentum
            currentScrollY += diff * 0.1;
            window.scrollTo(0, currentScrollY);
            
            requestAnimationFrame(lerpScroll);
        }

        spline.addEventListener('wheel', (e) => {
            // Apply a speed multiplier depending on wheel delta (trackpad vs mouse wheel)
            const speed = 1.5; 
            targetScrollY += e.deltaY * speed;
            
            // Clamp strictly to document boundaries to prevent overshoot bouncing
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));

            if (!isAnimating) {
                isAnimating = true;
                currentScrollY = window.scrollY;
                requestAnimationFrame(lerpScroll);
            }
        });

        // Sync targetScrollY if user scrolls natively outside the Spline canvas
        window.addEventListener('scroll', () => {
            if (!isAnimating) {
                targetScrollY = window.scrollY;
                currentScrollY = window.scrollY;
            }
        });
    }

    // 5. Initialize 3D Neural Line Background
    if (document.getElementById('particles-js')) {
        // Ensure Particles.js is loaded from CDN before executing
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } }, // Moderate density
                    color: { value: "#00f0ff" }, // Uniform neon Cyan
                    shape: { type: "circle" },
                    opacity: { value: 0.4, random: false }, // Balanced visual rest
                    size: { value: 2, random: true }, // Standard nodes
                    line_linked: {
                        enable: true,
                        distance: 180,
                        color: "#00f0ff", // Neon Cyan Lines
                        opacity: 0.3, // Soft glowing links
                        width: 1 // Standard width
                    },
                    move: {
                        enable: true,
                        speed: 1, // Restful drifting
                        direction: "none",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: false }, // Hover is disabled to prevent stealing Spline events
                        onclick: { enable: false },
                        resize: true
                    }
                },
                retina_detect: true
            });
        }
    }


});
