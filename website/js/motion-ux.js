/**
 * Visionary Path Services - Framer Motion & UI/UX Animation Engine
 * Production Promax Motion System powered by Framer Motion (window.Motion)
 * Covers every page site-wide with responsive, physics-based springs and micro-interactions.
 */

(function () {
    'use strict';

    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper: Safely grab Motion API
    function getMotion() {
        if (typeof window !== 'undefined' && window.Motion) {
            return window.Motion;
        }
        return null;
    }

    // 1. Sleek Reading Progress Indicator Bar
    function initScrollProgressBar() {
        let bar = document.getElementById('scrollProgressBar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'scrollProgressBar';
            bar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                width: 100%;
                transform-origin: 0% 50%;
                transform: scaleX(0);
                background: linear-gradient(90deg, #10b981 0%, #059669 40%, #1d4ed8 100%);
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.45);
                z-index: 10005;
                pointer-events: none;
                will-change: transform;
            `;
            document.body.appendChild(bar);
        }

        const M = getMotion();
        if (M && typeof M.scroll === 'function') {
            try {
                M.scroll((progress) => {
                    const clamped = Math.min(1, Math.max(0, progress));
                    bar.style.transform = `scaleX(${clamped})`;
                });
                return;
            } catch (err) {
                console.warn('VPSMotion: scroll progress bar fallback', err);
            }
        }

        // Vanilla fallback if scroll API is unavailable
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;
            bar.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollPercent))})`;
        }, { passive: true });
    }

    // 2. Dynamic Navbar Glassmorphism & Elevation on Scroll
    function initNavbarElevation() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let isElevated = false;
        function updateNavbar() {
            const shouldElevate = window.scrollY > 20;
            if (shouldElevate !== isElevated) {
                isElevated = shouldElevate;
                if (isElevated) {
                    navbar.classList.add('scrolled-elevated');
                } else {
                    navbar.classList.remove('scrolled-elevated');
                }
            }
        }

        const M = getMotion();
        if (M && typeof M.scroll === 'function') {
            try {
                M.scroll(() => {
                    updateNavbar();
                });
                updateNavbar();
                return;
            } catch (e) {}
        }

        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar();
    }

    // 3. Hero & Page Header Entrance Choreography
    function initHeroAnimations() {
        if (prefersReducedMotion) return;
        const M = getMotion();
        if (!M || typeof M.animate !== 'function') return;

        // Hero badge / eyebrow entrance
        const heroBadges = document.querySelectorAll(`
            .hero-badge,
            .page-hero-eyebrow,
            .hero-tag,
            .badge-hero,
            .hero-badge-wrap
        `);
        heroBadges.forEach(badge => {
            M.animate(badge, {
                opacity: [0, 1],
                y: [-18, 0],
                scale: [0.92, 1]
            }, {
                duration: 0.6,
                easing: [0.16, 1, 0.3, 1]
            });
        });

        // Main Hero Headings
        const heroHeadings = document.querySelectorAll(`
            .hero h1,
            .page-hero h1,
            .exact-hero h1,
            .blog-hub-hero h1,
            .hero-title
        `);
        heroHeadings.forEach(h1 => {
            M.animate(h1, {
                opacity: [0, 1],
                y: [28, 0]
            }, {
                duration: 0.7,
                delay: 0.08,
                easing: [0.22, 1, 0.36, 1]
            });
        });

        // Hero Subtitle / Lead text
        const heroSubtitles = document.querySelectorAll(`
            .hero p,
            .page-hero p,
            .exact-hero p,
            .blog-hub-hero p,
            .hero-subtitle
        `);
        heroSubtitles.forEach(sub => {
            M.animate(sub, {
                opacity: [0, 1],
                y: [20, 0]
            }, {
                duration: 0.6,
                delay: 0.18,
                easing: [0.22, 1, 0.36, 1]
            });
        });

        // Hero Action Buttons
        const heroActionBtns = document.querySelectorAll(`
            .hero-btns,
            .cta-btns,
            .hero-actions,
            .page-hero-cta
        `);
        heroActionBtns.forEach(btnsWrap => {
            const btnElements = Array.from(btnsWrap.children);
            if (btnElements.length) {
                const staggerFn = typeof M.stagger === 'function' ? M.stagger(0.08, { startDelay: 0.25 }) : 0.25;
                M.animate(btnElements, {
                    opacity: [0, 1],
                    y: [16, 0],
                    scale: [0.95, 1]
                }, {
                    duration: 0.5,
                    delay: staggerFn,
                    easing: [0.16, 1, 0.3, 1]
                });
            }
        });

        // Hero Trust Badges / Stats Strip
        const trustStrips = document.querySelectorAll(`
            .hero-trust,
            .trust-strip,
            .hero-stats-row,
            .hero-badges-row
        `);
        trustStrips.forEach(strip => {
            M.animate(strip, {
                opacity: [0, 1],
                y: [20, 0]
            }, {
                duration: 0.65,
                delay: 0.32,
                easing: [0.22, 1, 0.36, 1]
            });
        });

        // Hero Visual / Card Animation
        const heroVisuals = document.querySelectorAll(`
            .hero-visual,
            .hero-image-wrap,
            .page-hero-visual,
            .hero-visual-card
        `);
        heroVisuals.forEach(visual => {
            M.animate(visual, {
                opacity: [0, 1],
                scale: [0.94, 1],
                y: [16, 0]
            }, {
                duration: 0.8,
                delay: 0.2,
                easing: [0.16, 1, 0.3, 1]
            });
        });

        // Subtle ambient float for decorative floating badges
        const floatingBadges = document.querySelectorAll(`
            .badge-float,
            .floating-badge,
            .hero-card-floating,
            .stat-badge-floating
        `);
        floatingBadges.forEach((badge, idx) => {
            const duration = 4.0 + (idx * 0.5);
            M.animate(badge, {
                y: [-5, 5, -5]
            }, {
                duration: duration,
                repeat: Infinity,
                easing: 'easeInOut'
            });
        });
    }

    // 4. Section Header Entrances
    function initSectionHeaders() {
        if (prefersReducedMotion) return;
        const M = getMotion();
        if (!M || typeof M.inView !== 'function') return;

        const headers = document.querySelectorAll(`
            .section-header,
            .sec-header,
            .page-section-header,
            .calculator-header,
            .cta-header
        `);

        headers.forEach(header => {
            M.inView(header, () => {
                M.animate(header, {
                    opacity: [0, 1],
                    y: [26, 0]
                }, {
                    duration: 0.6,
                    easing: [0.22, 1, 0.36, 1]
                });
            }, { amount: 0.15 });
        });
    }

    // 5. Staggered Scroll-Triggered Card & Grid Reveals
    function initCardGridReveals() {
        if (prefersReducedMotion) return;
        const M = getMotion();
        if (!M || typeof M.animate !== 'function') {
            // CSS fallback if Motion is unavailable
            initFallbackObserver();
            return;
        }

        // Containers whose children should animate with staggered delay
        const cardContainers = document.querySelectorAll(`
            .pan-india-cards,
            .pillars-grid,
            .why-nine-grid,
            .countries-grid,
            .lenders-grid,
            .core-focus-grid,
            .process-steps,
            .process-grid,
            .loan-grid,
            .services-grid,
            .loan-types-grid,
            .blog-grid,
            .blogs-grid,
            .contact-methods-list,
            .country-stats-grid,
            .universities-grid,
            .docs-cards-grid,
            .calculator-cards-grid,
            .features-grid,
            .benefits-grid,
            .stats-grid,
            .faq-list
        `);

        const observedElements = new Set();

        cardContainers.forEach(container => {
            const children = Array.from(container.children).filter(c => c.nodeType === 1);
            if (!children.length) return;

            children.forEach(c => observedElements.add(c));

            if (typeof M.inView === 'function') {
                M.inView(container, () => {
                    const staggerFn = typeof M.stagger === 'function' 
                        ? M.stagger(0.065, { startDelay: 0.04 }) 
                        : 0.05;

                    M.animate(children, {
                        opacity: [0, 1],
                        y: [30, 0],
                        scale: [0.97, 1]
                    }, {
                        duration: 0.55,
                        delay: staggerFn,
                        easing: [0.22, 1, 0.36, 1]
                    });
                }, { amount: 0.12 });
            }
        });

        // Standalone cards not inside grid containers
        const standaloneCards = document.querySelectorAll(`
            .pan-card,
            .pillar-item,
            .why-feature-card,
            .country-card,
            .core-card,
            .mbbs-card,
            .lender-card,
            .process-step,
            .process-card,
            .loan-card,
            .loan-option-card,
            .service-card,
            .who-card,
            .step-card,
            .docs-card,
            .faq-item,
            .blog-card,
            .contact-method-card,
            .country-stat-box,
            .uni-tag,
            .feature-box,
            .stat-card
        `);

        standaloneCards.forEach(card => {
            if (observedElements.has(card)) return;
            observedElements.add(card);

            if (typeof M.inView === 'function') {
                M.inView(card, () => {
                    M.animate(card, {
                        opacity: [0, 1],
                        y: [26, 0]
                    }, {
                        duration: 0.5,
                        easing: [0.22, 1, 0.36, 1]
                    });
                }, { amount: 0.15 });
            }
        });
    }

    // 6. Universal data-aos Translation Engine
    // Translates existing data-aos attributes seamlessly to Framer Motion spring physics
    function initDataAosConverter() {
        if (prefersReducedMotion) return;
        const M = getMotion();
        if (!M || typeof M.inView !== 'function') return;

        const aosElements = document.querySelectorAll('[data-aos]');
        if (!aosElements.length) return;

        aosElements.forEach(el => {
            const aosType = el.getAttribute('data-aos') || 'fade-up';
            const delayMs = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
            const delaySec = Math.max(0, delayMs / 1000);
            const durationMs = parseInt(el.getAttribute('data-aos-duration') || '550', 10);
            const durationSec = Math.max(0.2, durationMs / 1000);

            let keyframes = { opacity: [0, 1], y: [28, 0] };

            if (aosType === 'fade-down') {
                keyframes = { opacity: [0, 1], y: [-28, 0] };
            } else if (aosType === 'fade-left') {
                keyframes = { opacity: [0, 1], x: [30, 0] };
            } else if (aosType === 'fade-right') {
                keyframes = { opacity: [0, 1], x: [-30, 0] };
            } else if (aosType === 'zoom-in') {
                keyframes = { opacity: [0, 1], scale: [0.92, 1] };
            } else if (aosType === 'zoom-out') {
                keyframes = { opacity: [0, 1], scale: [1.08, 1] };
            }

            M.inView(el, () => {
                M.animate(el, keyframes, {
                    duration: durationSec,
                    delay: delaySec,
                    easing: [0.22, 1, 0.36, 1]
                });
            }, { amount: 0.15 });
        });
    }

    // 7. Interactive Framer Motion Animated Numbers Counter
    function initAnimatedCounters() {
        if (prefersReducedMotion) return;
        const M = getMotion();

        const counterTargets = document.querySelectorAll(`
            .pan-card-num,
            .core-card-num,
            .w-num,
            .stat-val,
            .stat-number,
            .country-stat-val,
            .stat-box-val,
            .counter-num
        `);
        if (!counterTargets.length) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                obs.unobserve(el);

                if (!el.dataset.fullText) {
                    el.dataset.fullText = el.textContent.trim();
                }
                const originalText = el.dataset.fullText;
                const numMatch = originalText.match(/\d+/);
                if (!numMatch) return;

                const targetNum = parseInt(numMatch[0], 10);
                const isZeroPrefixed = originalText.startsWith('0') && targetNum < 10;

                if (M && typeof M.animate === 'function') {
                    try {
                        M.animate(0, targetNum, {
                            duration: 1.25,
                            easing: [0.16, 1, 0.3, 1],
                            onUpdate: (latest) => {
                                const current = Math.floor(latest);
                                el.textContent = isZeroPrefixed ? `0${current}` : originalText.replace(/\d+/, current);
                            }
                        }).then(() => {
                            el.textContent = originalText;
                        });
                        return;
                    } catch (err) {}
                }

                // Fallback requestAnimationFrame counter
                let start = 0;
                const duration = 750;
                const startTime = performance.now();
                function step(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
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
            });
        }, { threshold: 0.15 });

        counterTargets.forEach(el => observer.observe(el));
    }

    // 8. Tactile Spring Micro-Interactions on Buttons & Cards
    function initTactileMicrointeractions() {
        const M = getMotion();
        if (!M || typeof M.animate !== 'function' || prefersReducedMotion) return;

        // Button Spring Press & Lift
        const buttons = document.querySelectorAll(`
            .btn,
            .btn-primary,
            .btn-secondary,
            .btn-consultation,
            .btn-submit-enquiry,
            .calc-tab-btn,
            .emi-preset-btn,
            .floating-eligibility-btn
        `);

        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                M.animate(btn, { y: -2, scale: 1.02 }, { duration: 0.2, easing: 'easeOut' });
            });
            btn.addEventListener('mousedown', () => {
                M.animate(btn, { scale: 0.96, y: 1 }, { duration: 0.08, easing: 'easeOut' });
            });
            const resetBtn = () => {
                M.animate(btn, { scale: 1, y: 0 }, { duration: 0.25, easing: 'easeOut' });
            };
            btn.addEventListener('mouseup', resetBtn);
            btn.addEventListener('mouseleave', resetBtn);
        });

        // Interactive Card Elevation
        const cards = document.querySelectorAll(`
            .pan-card,
            .pillar-item,
            .country-card,
            .lender-card,
            .core-card,
            .loan-card,
            .service-card,
            .blog-card,
            .docs-card,
            .why-feature-card
        `);

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                M.animate(card, { y: -5, scale: 1.01 }, { duration: 0.25, easing: [0.16, 1, 0.3, 1] });
            });
            card.addEventListener('mouseleave', () => {
                M.animate(card, { y: 0, scale: 1 }, { duration: 0.3, easing: [0.16, 1, 0.3, 1] });
            });
        });
    }

    // 9. Floating Action Buttons (WhatsApp & Quick Eligibility)
    function initFloatingCtaAnimations() {
        if (prefersReducedMotion) return;
        const M = getMotion();
        if (!M || typeof M.animate !== 'function') return;

        // WhatsApp float entrance and hover
        const waFloat = document.querySelector('.whatsapp-float');
        if (waFloat) {
            M.animate(waFloat, {
                scale: [0, 1.12, 1],
                opacity: [0, 1]
            }, {
                duration: 0.65,
                delay: 0.6,
                easing: [0.16, 1, 0.3, 1]
            });

            waFloat.addEventListener('mouseenter', () => {
                M.animate(waFloat, { scale: 1.1, rotate: [0, -6, 6, 0] }, { duration: 0.35, easing: 'easeOut' });
            });
            waFloat.addEventListener('mouseleave', () => {
                M.animate(waFloat, { scale: 1, rotate: 0 }, { duration: 0.3, easing: 'easeOut' });
            });
        }

        // Quick Eligibility Floating Button entrance
        const floatEligibility = document.getElementById('floatingEligibilityBtn');
        if (floatEligibility) {
            M.animate(floatEligibility, {
                y: [40, 0],
                opacity: [0, 1]
            }, {
                duration: 0.65,
                delay: 0.75,
                easing: [0.16, 1, 0.3, 1]
            });
        }
    }

    // 10. Interactive FAQ Accordion Transitions
    function initFaqAnimations() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        const M = getMotion();
        if (!M || typeof M.animate !== 'function' || prefersReducedMotion) return;

        faqQuestions.forEach(q => {
            q.addEventListener('click', () => {
                const item = q.closest('.faq-item');
                if (!item) return;
                const answer = item.querySelector('.faq-answer');
                if (!answer) return;

                setTimeout(() => {
                    if (item.classList.contains('active')) {
                        M.animate(answer, {
                            opacity: [0, 1],
                            y: [-8, 0]
                        }, {
                            duration: 0.3,
                            easing: [0.16, 1, 0.3, 1]
                        });
                    }
                }, 10);
            });
        });
    }

    // 11. Modal & Thank You Screen Animations
    function animateModalOpen(overlay) {
        const M = getMotion();
        if (!M || typeof M.animate !== 'function' || prefersReducedMotion) return;

        const dialog = overlay.querySelector('.popup-dialog, .lead-modal-content, .modal-dialog') || overlay.firstElementChild;
        M.animate(overlay, { opacity: [0, 1] }, { duration: 0.25, easing: 'easeOut' });
        if (dialog) {
            M.animate(dialog, {
                opacity: [0, 1],
                scale: [0.92, 1],
                y: [20, 0]
            }, {
                duration: 0.38,
                easing: [0.16, 1, 0.3, 1]
            });
        }
    }

    function animateModalClose(overlay, onFinish) {
        const M = getMotion();
        if (!M || typeof M.animate !== 'function' || prefersReducedMotion) {
            if (onFinish) onFinish();
            return;
        }

        const dialog = overlay.querySelector('.popup-dialog, .lead-modal-content, .modal-dialog') || overlay.firstElementChild;
        const anims = [
            M.animate(overlay, { opacity: [1, 0] }, { duration: 0.2, easing: 'easeIn' })
        ];
        if (dialog) {
            anims.push(
                M.animate(dialog, { opacity: [1, 0], scale: [1, 0.94], y: [0, 15] }, { duration: 0.2, easing: 'easeIn' })
            );
        }
        Promise.all(anims).then(() => {
            if (onFinish) onFinish();
        });
    }

    function animateThankYouScreen(container) {
        const M = getMotion();
        if (!M || typeof M.animate !== 'function' || prefersReducedMotion) return;

        const card = container.querySelector('.vps-thankyou-screen') || container;
        const icon = container.querySelector('.vps-thankyou-icon, .vps-checkmark-svg');

        if (card) {
            M.animate(card, {
                opacity: [0, 1],
                scale: [0.88, 1.02, 1],
                y: [16, 0]
            }, {
                duration: 0.5,
                easing: [0.16, 1, 0.3, 1]
            });
        }
        if (icon) {
            M.animate(icon, {
                scale: [0, 1.25, 1],
                rotate: [-20, 0]
            }, {
                duration: 0.6,
                delay: 0.1,
                easing: 'easeOut'
            });
        }
    }

    // 12. Progressive Lazy Loading Feature
    function initLazyLoading() {
        const images = document.querySelectorAll('img');
        if (!images.length) return;

        images.forEach(img => {
            const isAboveTheFold = img.closest('.hero, .page-hero, .exact-hero, .blog-hub-hero, .blog-header, .top-bar, .navbar, .logo') || img.hasAttribute('data-no-lazy');
            if (isAboveTheFold) {
                if (img.getAttribute('loading') === 'lazy') {
                    img.removeAttribute('loading');
                }
                img.setAttribute('loading', 'eager');
                img.setAttribute('fetchpriority', 'high');
            } else if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            if (!img.getAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            img.classList.add('vps-lazy');

            if (img.complete && img.naturalHeight !== 0) {
                img.classList.add('vps-lazy-loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('vps-lazy-loaded');
                }, { once: true });
            }
        });
    }

    // Fallback IntersectionObserver for scroll reveals if Motion library is absent
    function initFallbackObserver() {
        const revealTargets = document.querySelectorAll('.motion-init, [data-aos]');
        if (!revealTargets.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const el = entry.target;
                const delay = parseInt(el.dataset.delay || el.dataset.aosDelay || '0', 10);
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

        revealTargets.forEach(el => observer.observe(el));
    }

    // 13. Initialize Everything when DOM is Ready
    function init() {
        initScrollProgressBar();
        initNavbarElevation();
        initHeroAnimations();
        initSectionHeaders();
        initCardGridReveals();
        initDataAosConverter();
        initAnimatedCounters();
        initTactileMicrointeractions();
        initFloatingCtaAnimations();
        initFaqAnimations();
        initLazyLoading();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export to window for external integration
    window.VPSMotion = {
        init,
        prefersReducedMotion,
        animateModalOpen,
        animateModalClose,
        animateThankYouScreen,
        getMotion
    };
})();
