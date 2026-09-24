/**
 * Visionary Path Services - Motion & UI/UX Promax Animation Engine
 * Powered by Framer Motion / Motion One & Web Animations API
 */

(function () {
    'use strict';

    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Sleek Reading Progress Indicator Bar
    function initScrollProgressBar() {
        if (document.getElementById('scrollProgressBar')) return;
        const bar = document.createElement('div');
        bar.id = 'scrollProgressBar';
        bar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 2.5px;
            width: 0%;
            background: linear-gradient(90deg, #059669 0%, #1d4ed8 100%);
            z-index: 10005;
            pointer-events: none;
            transition: width 0.08s ease-out;
            opacity: 0.9;
        `;
        document.body.appendChild(bar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
        }, { passive: true });
    }

    // 2. Dynamic Navbar Glassmorphism & Elevation on Scroll
    function initNavbarElevation() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        function updateNavbar() {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled-elevated');
            } else {
                navbar.classList.remove('scrolled-elevated');
            }
        }

        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar();
    }

    // 3. Staggered Scroll-Triggered Spring Reveals
    function initScrollReveals() {
        if (prefersReducedMotion) return;

        // Candidate sections to animate
        const revealTargets = document.querySelectorAll(`
            .pan-card,
            .pillar-item,
            .why-feature-card,
            .country-card,
            .core-card,
            .mbbs-card,
            .lender-card,
            .process-step,
            .loan-card,
            .faq-item
        `);

        if (!revealTargets.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const el = entry.target;
                const delay = parseInt(el.dataset.delay || '0', 10);

                if (entry.isIntersecting) {
                    if (el.motionTimer) clearTimeout(el.motionTimer);
                    el.motionTimer = setTimeout(() => {
                        el.classList.add('motion-revealed');
                    }, delay);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -30px 0px',
            threshold: 0.1
        });

        // Group sibling cards to create staggered delays
        const cardContainers = document.querySelectorAll(`
            .pan-india-cards,
            .pillars-grid,
            .why-nine-grid,
            .countries-grid,
            .lenders-grid,
            .core-focus-grid,
            .process-steps,
            .loan-grid
        `);

        cardContainers.forEach(container => {
            const children = Array.from(container.children);
            children.forEach((child, index) => {
                child.dataset.delay = `${index * 60}`;
                child.classList.add('motion-init');
                observer.observe(child);
            });
        });

        // Also observe standalone cards not in listed containers
        revealTargets.forEach(el => {
            if (!el.classList.contains('motion-init')) {
                el.classList.add('motion-init');
                observer.observe(el);
            }
        });
    }

    // 4. Subtle Tactile Microinteractions (Clean CSS-driven elevation, no dizzying 3D tilts)
    function initCardTilt() {
        // Disabling erratic 3D tilts for clean, high-grade FinTech interaction stability
    }

    // 5. Tactile Button Spring Press Feedback
    function initButtonPress() {
        const buttons = document.querySelectorAll('.btn, .pan-card, .faq-question, .emi-preset-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'scale(0.97)';
                btn.style.transition = 'transform 0.08s ease-out';
            });
            const resetBtn = () => {
                btn.style.transform = '';
            };
            btn.addEventListener('mouseup', resetBtn);
            btn.addEventListener('mouseleave', resetBtn);
        });
    }

    // 6. Interactive Animated Numbers Counter (Smooth single trigger with graceful completion)
    function initAnimatedCounters() {
        if (prefersReducedMotion) return;

        const counterTargets = document.querySelectorAll('.pan-card-num, .core-card-num, .w-num, .stat-val');
        if (!counterTargets.length) return;

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const el = entry.target;
                if (!el.dataset.fullText) {
                    el.dataset.fullText = el.textContent.trim();
                }
                const originalText = el.dataset.fullText;
                const numMatch = originalText.match(/\d+/);
                if (!numMatch) return;

                if (entry.isIntersecting) {
                    const targetNum = parseInt(numMatch[0], 10);
                    const isZeroPrefixed = originalText.startsWith('0') && targetNum < 10;
                    let start = 0;
                    const duration = 650;
                    const startTime = performance.now();

                    function step(now) {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease-out cubic
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(start + (targetNum - start) * easeProgress);

                        el.textContent = isZeroPrefixed ? `0${current}` : originalText.replace(/\d+/, current);

                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            el.textContent = originalText;
                        }
                    }

                    requestAnimationFrame(step);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.15 });

        counterTargets.forEach(el => counterObserver.observe(el));
    }

    // 7. Progressive Lazy Loading Feature
    function initLazyLoading() {
        const images = document.querySelectorAll('img');
        if (!images.length) return;

        // Apply native lazy loading & async decoding to all images
        images.forEach(img => {
            if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            if (!img.getAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            img.classList.add('vps-lazy');

            // If already cached/loaded, mark as loaded immediately
            if (img.complete && img.naturalHeight !== 0) {
                img.classList.add('vps-lazy-loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('vps-lazy-loaded');
                }, { once: true });
            }
        });

        // IntersectionObserver for lazy background image elements or delayed loading
        const lazyElements = document.querySelectorAll('[data-lazy-src], [data-lazy-bg]');
        if (lazyElements.length) {
            const lazyObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        if (el.dataset.lazySrc) {
                            el.src = el.dataset.lazySrc;
                            el.removeAttribute('data-lazy-src');
                        }
                        if (el.dataset.lazyBg) {
                            el.style.backgroundImage = `url('${el.dataset.lazyBg}')`;
                            el.removeAttribute('data-lazy-bg');
                        }
                        el.classList.add('vps-lazy-loaded');
                        obs.unobserve(el);
                    }
                });
            }, {
                rootMargin: '200px 0px',
                threshold: 0.01
            });

            lazyElements.forEach(el => lazyObserver.observe(el));
        }
    }

    // 8. Initialize Everything when DOM is Ready
    function init() {
        initScrollProgressBar();
        initNavbarElevation();
        initScrollReveals();
        initCardTilt();
        initButtonPress();
        initAnimatedCounters();
        initLazyLoading();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export to window
    window.VPSMotion = {
        init,
        prefersReducedMotion
    };
})();
