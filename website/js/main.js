// ==========================================
// VISIONARY PATH SERVICES - Main JavaScript
// ==========================================

// --- Popup Functions ---
function openPopup() {
    document.getElementById('popupOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closePopup() {
    document.getElementById('popupOverlay').classList.remove('active');
    document.body.style.overflow = '';
}
function closePopupOutside(e) {
    if (e.target === document.getElementById('popupOverlay')) closePopup();
}

// --- Mobile Menu ---
function toggleMenu() {
    const links = document.getElementById('navLinks');
    const cta = document.querySelector('.nav-cta');
    links.classList.toggle('open');
    if (cta) cta.classList.toggle('open');
}

// --- Navbar scroll effect ---
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 60) {
            navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.12)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        }
    }
});

// --- Simple AOS (Animate on Scroll) ---
function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    el.classList.add('aos-animate');
                }, parseInt(delay));
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(el => observer.observe(el));
}

// --- Form Submit ---
function submitForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = '✓ Submitted! We\'ll contact you soon.';
    btn.style.background = '#10b981';
    setTimeout(() => {
        closePopup();
        btn.textContent = 'Submit Enquiry →';
        btn.style.background = '';
        e.target.reset();
    }, 2500);
}

// --- Counter animation ---
function animateCounters() {
    const counters = document.querySelectorAll('.count-up');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initAOS();

    // Trigger counter animation when stats are visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    const statsBanner = document.querySelector('.stats-banner');
    if (statsBanner) statsObserver.observe(statsBanner);
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (navLinks && hamburger && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove('open');
    }
});
