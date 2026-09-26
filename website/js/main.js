// ==========================================
// VISIONARY PATH SERVICES - Main JavaScript
// ==========================================

// --- Lead Vault & Headless Google Form Configuration ---
// Paste your Google Form ID and entry IDs here to automatically capture all leads in a live Google Sheet:
window.VPS_GOOGLE_FORM_CONFIG = {
    formId: '1FAIpQLSfPUsa4zwi2nROpDZfbkxnMAy7NPgvYjunz23kTtMuHJ0GfDw',
    entries: {
        firstName: 'entry.1341360117',
        lastName:  'entry.239502923',
        phone:     'entry.685320406',
        whatsapp:  'entry.1700795760',
        email:     'entry.1971328408',
        interest:  'entry.469251043',
        notes:     'entry.1995462380',
        pageUrl:   'entry.226006361'
    }
};

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
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'popupTitle');
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

// --- Hallmark Accessible Form Validation Engine ---
function getOrCreateErrorElement(input) {
    const parent = input.closest('.form-group') || input.parentElement;
    let errEl = parent ? parent.querySelector('.field-error-msg') : null;
    if (!errEl && parent) {
        errEl = document.createElement('div');
        errEl.className = 'field-error-msg';
        errEl.id = (input.id || input.name || 'field') + '-error';
        errEl.setAttribute('role', 'alert');
        errEl.setAttribute('aria-live', 'polite');
        parent.appendChild(errEl);
    }
    if (errEl) {
        input.setAttribute('aria-describedby', errEl.id);
    }
    return errEl;
}

function validateField(input) {
    if (!input || input.type === 'hidden' || input.type === 'submit' || input.type === 'radio' || input.type === 'checkbox') return true;

    const val = (input.value || '').trim();
    const name = (input.name || '').toLowerCase();
    const id = (input.id || '').toLowerCase();
    const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();
    const isRequired = input.required || input.getAttribute('aria-required') === 'true';

    let errorMsg = '';

    if (isRequired && !val) {
        if (name.includes('first') || id.includes('first')) {
            errorMsg = 'First name is required. Please enter your given name.';
        } else if (name.includes('last') || id.includes('last')) {
            errorMsg = 'Last name is required. Please enter your family name.';
        } else if (name.includes('phone') || id.includes('phone') || input.type === 'tel') {
            errorMsg = 'Mobile number is required for your loan counselor consultation.';
        } else if (name.includes('whatsapp') || id.includes('whatsapp')) {
            errorMsg = 'WhatsApp number is required for instant pre-assessment updates.';
        } else if (name.includes('email') || input.type === 'email') {
            errorMsg = 'Email address is required for official lender comparison files.';
        } else if (name.includes('company') || id.includes('firm')) {
            errorMsg = 'Company or agency name is required.';
        } else if (name.includes('city')) {
            errorMsg = 'City and state are required.';
        } else {
            errorMsg = 'This field is required. Please provide your information.';
        }
    } else if (val) {
        if (name.includes('first') || name.includes('last') || placeholder.includes('name')) {
            if (val.length < 2) {
                errorMsg = 'Name must be at least 2 characters.';
            }
        } else if (name.includes('phone') || id.includes('phone') || (input.type === 'tel' && !name.includes('whatsapp') && !id.includes('whatsapp'))) {
            const digits = val.replace(/\D/g, '');
            if (digits.length !== 10) {
                errorMsg = 'Please enter a valid 10-digit mobile number.';
            }
        } else if (name.includes('whatsapp') || id.includes('whatsapp')) {
            const digits = val.replace(/\D/g, '');
            if (digits.length !== 10) {
                errorMsg = 'Please enter a valid 10-digit WhatsApp number.';
            }
        } else if (name.includes('email') || input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                errorMsg = 'Please enter a valid email format (e.g. aarav.sharma@gmail.com).';
            }
        }
    }

    const errEl = getOrCreateErrorElement(input);
    const wrap = input.closest('.input-icon-wrap') || input;
    const group = input.closest('.form-group');

    if (errorMsg) {
        input.classList.add('is-error');
        input.classList.remove('is-success');
        input.setAttribute('aria-invalid', 'true');
        if (wrap) wrap.classList.add('has-error');
        if (group) group.classList.add('has-error');
        if (errEl) {
            errEl.textContent = errorMsg;
            errEl.classList.add('visible');
        }
        return false;
    } else {
        input.classList.remove('is-error');
        if (val) {
            input.classList.add('is-success');
            input.classList.add('touched');
        } else {
            input.classList.remove('is-success');
        }
        input.setAttribute('aria-invalid', 'false');
        if (wrap) wrap.classList.remove('has-error');
        if (group) group.classList.remove('has-error');
        if (errEl) {
            errEl.textContent = '';
            errEl.classList.remove('visible');
        }
        return true;
    }
}

// Helper to quickly copy Phone to WhatsApp input with tactile confirmation & validation
function copyPhoneToWhatsApp() {
    const phone = document.getElementById('popupPhone') || document.querySelector('input[name="phone"]');
    const wa = document.getElementById('popupWhatsApp') || document.querySelector('input[name="whatsapp"]');
    const copyBtns = document.querySelectorAll('.btn-copy-phone');
    if (phone && wa) {
        wa.value = phone.value;
        wa.focus();
        wa.dataset.touched = 'true';
        validateField(wa);
        copyBtns.forEach(btn => {
            const originalHTML = btn.innerHTML;
            btn.classList.add('copied');
            btn.innerHTML = '<i class="fas fa-check"></i> Copied';
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = originalHTML;
            }, 1800);
        });
    }
}

function syncWhatsApp(inputEl) {
    // Optional live sync
}

// Ensures floating quick-access CTA button exists on the page
function ensureFloatingButton() {
    let btn = document.getElementById('floatingEligibilityBtn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'floatingEligibilityBtn';
        btn.className = 'floating-eligibility-btn';
        btn.setAttribute('onclick', 'openPopup()');
        btn.setAttribute('aria-label', 'Check Loan Eligibility Free');
        btn.innerHTML = '<span class="floating-btn-pulse"></span><i class="fas fa-bolt"></i><span>Check Eligibility <strong class="badge-free">FREE</strong></span>';
        document.body.appendChild(btn);
    }
    if (window.scrollY <= 400) {
        btn.classList.add('hide');
        btn.classList.remove('is-active-scrolled');
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
    const navbar = document.getElementById('navbar');
    const isOpen = links ? links.classList.toggle('open') : false;
    
    if (isOpen && navbar && links) {
        const rect = navbar.getBoundingClientRect();
        links.style.top = Math.max(0, Math.round(rect.bottom)) + 'px';
    } else if (links) {
        links.style.top = '';
    }

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
    if (links) {
        links.classList.remove('open');
        links.style.top = '';
    }
    if (navCta) navCta.classList.remove('open');
    if (hamburger) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('menu-open');
}

window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;

window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
        closeMenu();
    }
}, { passive: true });

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

// --- Navbar & Floating CTA scroll effect ---
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 60) {
            navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.12)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        }
    }
    const floatBtn = document.getElementById('floatingEligibilityBtn');
    if (floatBtn && !document.getElementById('popupOverlay')?.classList.contains('active')) {
        if (window.scrollY > 400) {
            floatBtn.classList.add('is-active-scrolled');
            floatBtn.classList.remove('hide');
        } else {
            floatBtn.classList.remove('is-active-scrolled');
            floatBtn.classList.add('hide');
        }
    }
}, { passive: true });

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
    if (form.dataset.submitting === 'true') return;

    // Validate all interactive fields
    const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
    let hasError = false;
    let firstErrorField = null;

    inputs.forEach(input => {
        input.dataset.touched = 'true';
        const isValid = validateField(input);
        if (!isValid) {
            hasError = true;
            if (!firstErrorField) firstErrorField = input;
        }
    });

    if (hasError) {
        if (firstErrorField) {
            firstErrorField.focus();
        }
        return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalContent = btn ? btn.innerHTML : '';

    // Collect lead details
    const formData = new FormData(form);
    const firstName = (formData.get('firstName') || '').toString().trim();
    const lastName = (formData.get('lastName') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().replace(/[^0-9]/g, '');
    const whatsapp = (formData.get('whatsapp') || phone).toString().replace(/[^0-9]/g, '');
    const email = (formData.get('email') || '').toString().trim();
    const interest = formData.get('interest') || 'Abroad Education Loan';
    const message = (formData.get('message') || '').toString().trim();

    form.dataset.submitting = 'true';
    if (btn) {
        btn.disabled = true;
        btn.setAttribute('data-state', 'loading');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting to Counselor...';
    }

    // Dual-Capture Resilience: Persist lead locally + optional CRM webhook forwarding + Google Forms
    const leadRecord = {
        id: 'vps_' + Date.now(),
        submittedAt: new Date().toISOString(),
        source: 'Popup / Lead Form',
        firstName,
        lastName,
        phone,
        whatsapp,
        email,
        interest,
        notes: message,
        pageUrl: window.location.href
    };
    dispatchLeadCapture(leadRecord);

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
        if (btn) {
            btn.innerHTML = originalContent || 'Submit Enquiry <i class="fas fa-arrow-right"></i>';
            btn.removeAttribute('data-state');
            btn.style.background = '';
            btn.disabled = false;
        }
        form.dataset.submitting = 'false';
        form.reset();
        inputs.forEach(input => {
            input.classList.remove('is-success', 'is-error', 'touched');
            input.removeAttribute('aria-invalid');
            delete input.dataset.touched;
            const err = input.closest('.form-group')?.querySelector('.field-error-msg');
            if (err) {
                err.textContent = '';
                err.classList.remove('visible');
            }
        });
        // Seamlessly open WhatsApp lead thread in new tab so counselor receives immediate ping
        try {
            const win = window.open(waUrl, '_blank');
            if (!win) window.location.href = waUrl;
        } catch (_) {}
    }, 1000);
}
            delete input.dataset.touched;
            const err = input.closest('.form-group')?.querySelector('.field-error-msg');
            if (err) {
                err.textContent = '';
                err.classList.remove('visible');
            }
        });
        // Seamlessly open WhatsApp lead thread in new tab so counselor receives immediate ping
        window.open(waUrl, '_blank');
    }, 1000);
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
    const form = e.target;
    if (form.dataset.submitting === 'true') return;

    // Validate all interactive fields
    const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
    let hasError = false;
    let firstErrorField = null;

    inputs.forEach(input => {
        input.dataset.touched = 'true';
        const isValid = validateField(input);
        if (!isValid) {
            hasError = true;
            if (!firstErrorField) firstErrorField = input;
        }
    });

    if (hasError) {
        if (firstErrorField) {
            firstErrorField.focus();
        }
        return;
    }

    form.dataset.submitting = 'true';

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.setAttribute('data-state', 'loading');
        btn.innerHTML = '<i class="fas fa-check"></i> Application Received! Our Partnership Team Will Contact You.';
        btn.style.background = '#15803d';
    }
    setTimeout(() => {
        if (btn) {
            btn.innerHTML = originalText;
            btn.removeAttribute('data-state');
            btn.style.background = '';
            btn.disabled = false;
        }
        form.dataset.submitting = 'false';
        form.reset();
        inputs.forEach(input => {
            input.classList.remove('is-success', 'is-error', 'touched');
            input.removeAttribute('aria-invalid');
            delete input.dataset.touched;
            const err = input.closest('.form-group')?.querySelector('.field-error-msg');
            if (err) {
                err.textContent = '';
                err.classList.remove('visible');
            }
        });
    }, 3500);
}

// --- Contact Form Submit ---
function submitContactForm(e) {
    e.preventDefault();
    const form = e.target;
    if (form.dataset.submitting === 'true') return;

    // Validate all interactive fields
    const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
    let hasError = false;
    let firstErrorField = null;

    inputs.forEach(input => {
        input.dataset.touched = 'true';
        const isValid = validateField(input);
        if (!isValid) {
            hasError = true;
            if (!firstErrorField) firstErrorField = input;
        }
    });

    if (hasError) {
        if (firstErrorField) {
            firstErrorField.focus();
        }
        return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.innerHTML : '';

    const firstName = (form.querySelector('input[name="firstName"]')?.value || form.querySelector('input[placeholder*="First"]')?.value || '').toString().trim();
    const lastName = (form.querySelector('input[name="lastName"]')?.value || form.querySelector('input[placeholder*="Last"]')?.value || '').toString().trim();
    const phone = (form.querySelector('input[name="phone"]')?.value || form.querySelector('input[type="tel"]')?.value || '').toString().replace(/[^0-9]/g, '');
    const email = (form.querySelector('input[name="email"]')?.value || form.querySelector('input[type="email"]')?.value || '').toString().trim();
    const whatsapp = (form.querySelector('input[name="whatsapp"]')?.value || phone).toString().replace(/[^0-9]/g, '');
    const message = (form.querySelector('textarea[name="message"]')?.value || form.querySelector('textarea')?.value || '').toString().trim();

    form.dataset.submitting = 'true';
    if (btn) {
        btn.disabled = true;
        btn.setAttribute('data-state', 'loading');
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Enquiry Sent! Connecting to Advisor...';
        btn.style.background = '#15803d';
    }

    const leadMsg = encodeURIComponent(
        `*New Contact Message - Visionary Path Services*\n\n` +
        `👤 *Name:* ${firstName} ${lastName}\n` +
        `📞 *Phone:* +91 ${phone}\n` +
        `💬 *WhatsApp:* +91 ${whatsapp}\n` +
        `✉️ *Email:* ${email}\n` +
        (message ? `📝 *Message:* ${message}\n` : '') +
        `\n_Sent via visionarypathservices.com/pages/contact.html_`
    );

    const waUrl = `https://wa.me/918150949070?text=${leadMsg}`;

    setTimeout(() => {
        if (btn) {
            btn.innerHTML = originalText;
            btn.removeAttribute('data-state');
            btn.style.background = '';
            btn.disabled = false;
        }
        form.dataset.submitting = 'false';
        form.reset();
        inputs.forEach(input => {
            input.classList.remove('is-success', 'is-error', 'touched');
            input.removeAttribute('aria-invalid');
            delete input.dataset.touched;
            const err = input.closest('.form-group')?.querySelector('.field-error-msg');
            if (err) {
                err.textContent = '';
                err.classList.remove('visible');
            }
        });
        window.open(waUrl, '_blank');
    }, 1200);
}

window.submitContactForm = submitContactForm;
window.submitPartnerForm = submitPartnerForm;

// --- Initialize Hallmark Form Validation on All Forms ---
function initHallmarkFormEngine() {
    document.querySelectorAll('form').forEach(form => {
        form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="radio"]):not([type="checkbox"]), textarea, select').forEach(field => {
            getOrCreateErrorElement(field);

            field.addEventListener('blur', () => {
                field.dataset.touched = 'true';
                validateField(field);
            });

            field.addEventListener('input', () => {
                if (field.dataset.touched === 'true') {
                    validateField(field);
                }
            });

            field.addEventListener('change', () => {
                field.dataset.touched = 'true';
                validateField(field);
            });
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHallmarkFormEngine);
} else {
    initHallmarkFormEngine();
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

    // Button click listeners & accessibility
    filterBtns.forEach(btn => {
        btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
        btn.addEventListener('click', function() {
            const group = this.dataset.filterGroup;
            const val = this.dataset.filterVal;

            wrapper.querySelectorAll(`.lender-filter-btn[data-filter-group="${group}"]`).forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');

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
            const isAll = btn.dataset.filterVal === 'all';
            btn.classList.toggle('active', isAll);
            btn.setAttribute('aria-pressed', isAll ? 'true' : 'false');
        });
        applyFilters();
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', resetLenderFilters);
    }

    window.resetLenderFilters = resetLenderFilters;
}


