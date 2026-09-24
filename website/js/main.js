// ==========================================
// VISIONARY PATH SERVICES - Main JavaScript
// ==========================================

// --- Polished Lead Generation Popup Engine ---
const POPUP_COOLDOWN_MS = 15 * 60 * 1000; // 15-minute cool-down after dismissal

function isPopupDismissedRecently() {
    try {
        const dismissedTime = sessionStorage.getItem('vps_popup_dismissed_time');
        if (!dismissedTime) return false;
        return (Date.now() - parseInt(dismissedTime, 10)) < POPUP_COOLDOWN_MS;
    } catch (err) {
        return false;
    }
}

function resetPopupState() {
    try {
        sessionStorage.removeItem('vps_popup_dismissed_time');
        sessionStorage.removeItem('vps_popup_dismissed');
    } catch (err) {}
    console.log('VPS Popup state reset. Auto-triggers active.');
}

function openPopup() {
    const overlay = document.getElementById('popupOverlay');
    if (overlay) {
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        // Focus first field
        setTimeout(() => {
            const firstInput = overlay.querySelector('input:not([type="hidden"]):not([readonly])');
            if (firstInput) firstInput.focus();
        }, 150);
    }
    const floatBtn = document.getElementById('floatingEligibilityBtn');
    if (floatBtn) {
        floatBtn.classList.add('hide');
    }
}

function closePopup() {
    const overlay = document.getElementById('popupOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('modal-open');
    try {
        sessionStorage.setItem('vps_popup_dismissed_time', Date.now().toString());
        sessionStorage.setItem('vps_popup_dismissed', 'true');
    } catch (err) {}

    // Show floating quick-access button so interested users can re-open anytime
    const floatBtn = document.getElementById('floatingEligibilityBtn');
    if (floatBtn) {
        floatBtn.classList.remove('hide');
    }
}

function closePopupOutside(e) {
    if (e.target === document.getElementById('popupOverlay')) closePopup();
}

// Helper to quickly copy Phone to WhatsApp input
function copyPhoneToWhatsApp() {
    const phone = document.getElementById('popupPhone');
    const wa = document.getElementById('popupWhatsApp');
    if (phone && wa) {
        wa.value = phone.value;
        wa.focus();
    }
}

function syncWhatsApp(inputEl) {
    // Optional live sync
}

// Ensures floating quick-access CTA button exists on the page
function ensureFloatingButton() {
    if (!document.getElementById('floatingEligibilityBtn')) {
        const btn = document.createElement('button');
        btn.id = 'floatingEligibilityBtn';
        btn.className = 'floating-eligibility-btn';
        btn.setAttribute('onclick', 'openPopup()');
        btn.setAttribute('aria-label', 'Check Loan Eligibility Free');
        btn.innerHTML = '<span class="floating-btn-pulse"></span><i class="fas fa-bolt"></i><span>Check Eligibility <strong class="badge-free">FREE</strong></span>';
        document.body.appendChild(btn);
    }
}

// High-Intent Respectful Engagement Trigger Engine:
// 1. High Scroll Intent (>65% scroll depth or reaching CTA footer)
// 2. High Engagement Time (45-second thoughtful reading)
// 3. Desktop Exit-Intent (user cursor genuinely leaves top of window)
// 4. URL query param preview (?popup=1 or ?test_popup=true)
function initMarketingPopupEngine() {
    let triggered = false;

    ensureFloatingButton();

    // Check if test parameter is present in URL to trigger immediately
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('popup') || urlParams.has('test_popup') || urlParams.has('enquiry')) {
        setTimeout(() => { openPopup(); }, 350);
        return;
    }

    function triggerModal(reason) {
        if (triggered || isPopupDismissedRecently()) return;
        
        // Never interrupt user if they are currently typing or calculating
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

        triggered = true;
        window.removeEventListener('scroll', checkScrollIntent);
        document.removeEventListener('mouseleave', checkExitIntent);
        if (timerFallback) clearTimeout(timerFallback);

        setTimeout(() => {
            if (!isPopupDismissedRecently()) {
                openPopup();
            }
        }, 300);
    }

    // Trigger 1: Genuine Scroll Depth (>65% down page)
    function checkScrollIntent() {
        if (triggered || isPopupDismissedRecently()) return;

        const scrollDistance = window.scrollY || window.pageYOffset;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = totalHeight > 0 ? (scrollDistance / totalHeight) * 100 : 0;

        if (scrollPercent > 65) {
            triggerModal('scroll');
        }
    }

    // Trigger 2: Desktop Exit-Intent
    function checkExitIntent(e) {
        if (e.clientY <= 6 && !triggered && !isPopupDismissedRecently()) {
            triggerModal('exit_intent');
        }
    }

    // Trigger 3: Thoughtful Reading Fallback (45 seconds)
    const timerFallback = setTimeout(() => {
        if (!triggered && !isPopupDismissedRecently()) {
            triggerModal('timer');
        }
    }, 45000);

    window.addEventListener('scroll', checkScrollIntent, { passive: true });
    document.addEventListener('mouseleave', checkExitIntent);
}

// Backward compatibility alias
const initScrollPopupTrigger = initMarketingPopupEngine;

// Expose globally for testing / CTA buttons
window.openPopup = openPopup;
window.closePopup = closePopup;
window.resetPopupState = resetPopupState;
window.copyPhoneToWhatsApp = copyPhoneToWhatsApp;

// --- Mobile Navigation Drawer System ---
function toggleMenu() {
    const links = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const navCta = document.querySelector('.nav-cta');
    const isOpen = links ? links.classList.toggle('open') : false;
    
    if (navCta) {
        navCta.classList.toggle('open', isOpen);
    }
    if (hamburger) {
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    document.body.classList.toggle('menu-open', isOpen);
}

function closeMenu() {
    const links = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const navCta = document.querySelector('.nav-cta');
    if (links) links.classList.remove('open');
    if (navCta) navCta.classList.remove('open');
    if (hamburger) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('menu-open');
}

window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;

// Mobile dropdown toggle
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.has-dropdown > a').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 960) {
                e.preventDefault();
                this.parentElement.classList.toggle('open');
            }
        });
    });
});

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

// --- Simple AOS (Animate on Scroll) with Bidirectional Support ---
function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
            if (entry.isIntersecting) {
                el.aosTimer = setTimeout(() => {
                    el.classList.add('aos-animate');
                }, delay);
            } else {
                // Reset on leave so it animates when scrolling back!
                if (el.aosTimer) clearTimeout(el.aosTimer);
                el.classList.remove('aos-animate');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(el => observer.observe(el));
}

// --- Form Submit (Dual-Capture: Instant UI Feedback + WhatsApp Instant Lead Notification) ---
function submitForm(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalContent = btn.innerHTML;

    // Collect lead details
    const formData = new FormData(form);
    const firstName = formData.get('firstName') || '';
    const lastName = formData.get('lastName') || '';
    const phone = formData.get('phone') || '';
    const whatsapp = formData.get('whatsapp') || phone;
    const email = formData.get('email') || '';
    const interest = formData.get('interest') || 'Abroad Education Loan';
    const message = formData.get('message') || '';

    // Show visual confirmation
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Connecting to Counselor...';
    btn.style.background = '#10b981';

    // Construct formatted WhatsApp message
    const leadMsg = encodeURIComponent(
        `*New Education Loan Inquiry - Visionary Path Services*\n\n` +
        `👤 *Name:* ${firstName} ${lastName}\n` +
        `📞 *Phone:* +91 ${phone}\n` +
        `💬 *WhatsApp:* +91 ${whatsapp}\n` +
        `✉️ *Email:* ${email}\n` +
        `🎯 *Interested In:* ${interest}\n` +
        (message ? `📝 *Notes:* ${message}\n` : '') +
        `\n_Sent via visionarypathservices.com_`
    );

    const waUrl = `https://wa.me/918150949070?text=${leadMsg}`;

    setTimeout(() => {
        closePopup();
        btn.innerHTML = originalContent || 'Submit Enquiry <i class="fas fa-arrow-right"></i>';
        btn.style.background = '';
        form.reset();
        // Seamlessly open WhatsApp lead thread in new tab so counselor receives immediate ping
        window.open(waUrl, '_blank');
    }, 1200);
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
    initScrollPopupTrigger();

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
    if (navLinks && navLinks.classList.contains('open') && !navLinks.contains(e.target) && (!hamburger || !hamburger.contains(e.target))) {
        closeMenu();
    }
});

// ESC key to close modal and mobile drawer
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const popup = document.getElementById('popupOverlay');
        if (popup && popup.classList.contains('active')) {
            closePopup();
        }
        closeMenu();
    }
});

// --- Partner Form Submit ---
function submitPartnerForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Application Received! Our Partnership Team Will Contact You.';
    btn.style.background = '#15803d';
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        e.target.reset();
    }, 3500);
}

// --- Education Loan EMI Calculator ---
function formatINR(val) {
    return '₹' + Math.round(val).toLocaleString('en-IN');
}

function calculateEMI() {
    const amountInput = document.getElementById('emiAmount');
    const rateInput = document.getElementById('emiRate');
    const tenureInput = document.getElementById('emiTenure');

    if (!amountInput || !rateInput || !tenureInput) return;

    const P = parseFloat(amountInput.value) || 0;
    const annualRate = parseFloat(rateInput.value) || 0;
    const years = parseFloat(tenureInput.value) || 0;

    const n = years * 12;
    const r = (annualRate / 12) / 100;

    let emi = 0;
    let totalPayable = 0;
    let totalInterest = 0;

    if (P > 0 && r > 0 && n > 0) {
        emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        totalPayable = emi * n;
        totalInterest = totalPayable - P;
    }

    const emiResultEl = document.getElementById('emiResult');
    const totalInterestEl = document.getElementById('totalInterest');
    const totalPayableEl = document.getElementById('totalPayable');
    const principalDisplay = document.getElementById('emiAmountDisplay');
    const rateDisplay = document.getElementById('emiRateDisplay');
    const tenureDisplay = document.getElementById('emiTenureDisplay');
    const principalBar = document.getElementById('emiPrincipalBar');
    const interestBar = document.getElementById('emiInterestBar');

    if (emiResultEl) emiResultEl.textContent = formatINR(emi);
    if (totalInterestEl) totalInterestEl.textContent = formatINR(totalInterest);
    if (totalPayableEl) totalPayableEl.textContent = formatINR(totalPayable);
    if (principalDisplay) principalDisplay.textContent = formatINR(P);
    const principalSummary = document.getElementById('emiAmountSummary');
    if (principalSummary) principalSummary.textContent = formatINR(P);
    if (rateDisplay) rateDisplay.textContent = annualRate.toFixed(1) + '%';
    if (tenureDisplay) tenureDisplay.textContent = years + ' Years (' + n + ' Months)';

    if (principalBar && interestBar && totalPayable > 0) {
        const principalPct = Math.round((P / totalPayable) * 100);
        const interestPct = 100 - principalPct;
        principalBar.style.width = principalPct + '%';
        interestBar.style.width = interestPct + '%';
    }
}

// Sync range and number inputs if present
function syncEMI(sourceId, targetId) {
    const src = document.getElementById(sourceId);
    const target = document.getElementById(targetId);
    if (src && target) {
        target.value = src.value;
        calculateEMI();
    }
}

function setLoanAmount(val) {
    const amountInput = document.getElementById('emiAmount');
    const rangeInput = document.getElementById('emiAmountRange');
    if (amountInput) amountInput.value = val;
    if (rangeInput) rangeInput.value = val;
    calculateEMI();
}

// FAQ accordion toggle
function toggleFaq(headerEl) {
    const item = headerEl.closest('.faq-item');
    if (!item) return;
    const isCurrentlyActive = item.classList.contains('active');
    
    // Close other FAQ items in same list if desired
    const list = item.closest('.faq-list');
    if (list) {
        list.querySelectorAll('.faq-item.active').forEach(openItem => {
            if (openItem !== item) openItem.classList.remove('active');
        });
    }

    item.classList.toggle('active', !isCurrentlyActive);
}

// Auto-run calculator if inputs exist
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('emiAmount') || document.getElementById('emiAmountRange')) {
        calculateEMI();
    }
    initLenderFilters();
});

// --- Interactive Partner Lenders Filter Engine ---
function initLenderFilters() {
    const wrapper = document.getElementById('lenderFiltersWrapper');
    if (!wrapper) return;

    const searchInput = document.getElementById('lenderSearchInput');
    const countBadge = document.getElementById('lenderCountBadge');
    const clearBtn = document.getElementById('btnClearFilters');
    const emptyState = document.getElementById('lendersEmptyState');
    const filterBtns = wrapper.querySelectorAll('.lender-filter-btn');
    const cards = document.querySelectorAll('.lender-info-card');
    const categories = document.querySelectorAll('.lender-category');

    let currentFilters = {
        type: 'all',
        security: 'all',
        dest: 'all',
        search: ''
    };

    // Pre-annotate cards
    cards.forEach(card => {
        const categoryTag = card.closest('.lender-category')?.querySelector('.category-tag')?.textContent.trim().toLowerCase() || '';
        let type = 'other';
        if (categoryTag.includes('nbfc')) type = 'nbfc';
        else if (categoryTag.includes('private')) type = 'pvt';
        else if (categoryTag.includes('public')) type = 'psu';
        else if (categoryTag.includes('international')) type = 'intl';

        card.dataset.type = type;

        const text = card.textContent.toLowerCase();
        let security = 'both';
        if (text.includes('collateral & no-collateral') || text.includes('both')) security = 'both';
        else if (text.includes('no-collateral') || text.includes('unsecured')) security = 'unsecured';
        else if (text.includes('collateral')) security = 'secured';
        card.dataset.security = security;

        let dest = 'both';
        if (type === 'intl') dest = 'abroad';
        card.dataset.dest = dest;
    });

    function applyFilters() {
        let visibleCount = 0;

        cards.forEach(card => {
            const name = card.querySelector('.lic-name')?.textContent.toLowerCase() || '';
            const tagline = card.querySelector('.lic-tagline')?.textContent.toLowerCase() || '';
            const cardText = card.textContent.toLowerCase();

            // Search filter
            const matchesSearch = !currentFilters.search || name.includes(currentFilters.search) || tagline.includes(currentFilters.search) || cardText.includes(currentFilters.search);

            // Type filter
            const matchesType = currentFilters.type === 'all' || card.dataset.type === currentFilters.type;

            // Security filter
            let matchesSecurity = true;
            if (currentFilters.security !== 'all') {
                if (currentFilters.security === 'unsecured') {
                    matchesSecurity = card.dataset.security === 'unsecured' || card.dataset.security === 'both';
                } else if (currentFilters.security === 'secured') {
                    matchesSecurity = card.dataset.security === 'secured' || card.dataset.security === 'both';
                }
            }

            // Destination filter
            let matchesDest = true;
            if (currentFilters.dest !== 'all') {
                if (currentFilters.dest === 'abroad') {
                    matchesDest = true; // All lenders on VPS fund abroad
                } else if (currentFilters.dest === 'domestic') {
                    matchesDest = card.dataset.dest !== 'abroad'; // Global USD lenders only fund abroad
                }
            }

            if (matchesSearch && matchesType && matchesSecurity && matchesDest) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Hide empty category containers
        categories.forEach(cat => {
            const visibleInCat = cat.querySelectorAll('.lender-info-card:not([style*="display: none"])');
            cat.style.display = visibleInCat.length > 0 ? '' : 'none';
        });

        // Update count badge & empty state
        if (countBadge) {
            countBadge.textContent = `Showing ${visibleCount} of ${cards.length} Lenders`;
        }
        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // Show/hide clear button
        const isFiltered = currentFilters.type !== 'all' || currentFilters.security !== 'all' || currentFilters.dest !== 'all' || currentFilters.search !== '';
        if (clearBtn) {
            clearBtn.style.display = isFiltered ? 'inline-block' : 'none';
        }
    }

    // Button click listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const group = this.dataset.filterGroup;
            const val = this.dataset.filterVal;

            wrapper.querySelectorAll(`.lender-filter-btn[data-filter-group="${group}"]`).forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentFilters[group] = val;
            applyFilters();
        });
    });

    // Search input listener
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentFilters.search = this.value.trim().toLowerCase();
            applyFilters();
        });
    }

    // Clear filters
    function resetLenderFilters() {
        currentFilters = { type: 'all', security: 'all', dest: 'all', search: '' };
        if (searchInput) searchInput.value = '';
        wrapper.querySelectorAll('.lender-filter-btn').forEach(btn => {
            if (btn.dataset.filterVal === 'all') btn.classList.add('active');
            else btn.classList.remove('active');
        });
        applyFilters();
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', resetLenderFilters);
    }

    window.resetLenderFilters = resetLenderFilters;
}


