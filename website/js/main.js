// ==========================================
// VISIONARY PATH SERVICES - Main JavaScript
// ==========================================

// --- Lead Vault & Headless Google Form Configuration ---
// Form 1: Student Loan Leads (General)
window.VPS_GOOGLE_FORM_CONFIG = {
    formId: '1FAIpQLSfQjdvAG5JwF8iwmmxh0WujoLmcUSqn5YTeY0pYay4Mt9wQCA',
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

// Form 2: Partner With Us Form
window.VPS_PARTNER_FORM_CONFIG = {
    formId: '1FAIpQLSeDbbs5yIifQLn4rsF6qM59C9wsfaYfPwAzPFzQPqU_qcxe3Q',
    entries: {
        companyName:       'entry.companyName',
        partnerType:       'entry.partnerType',
        contactPerson:     'entry.contactPerson',
        designation:       'entry.designation',
        email:             'entry.email',
        phone:             'entry.phone',
        city:              'entry.city',
        expectedReferrals: 'entry.expectedReferrals',
        message:           'entry.message',
        pageUrl:           'entry.pageUrl'
    }
};

// --- Lead Vault & Multi-Destination Dispatcher ---
function dispatchLeadCapture(leadRecord) {
    // 1. Dual-Capture Resilience: Persist lead locally in browser localStorage
    try {
        const storedLeads = JSON.parse(localStorage.getItem('vps_lead_vault') || '[]');
        storedLeads.unshift(leadRecord);
        localStorage.setItem('vps_lead_vault', JSON.stringify(storedLeads.slice(0, 100)));
        console.log('✅ VPS Lead Vault: Lead stored successfully (' + leadRecord.source + '):', leadRecord);
    } catch (_) {}

    // 2. Forward to Webhook if configured (CRM / Zapier / Make / Slack)
    if (window.VPS_LEAD_WEBHOOK_URL) {
        try {
            fetch(window.VPS_LEAD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadRecord),
                mode: 'no-cors'
            }).catch(() => {});
        } catch (_) {}
    }

    // 3. Headless Google Form Integration (Live Google Sheet Auto-Sync)
    const isPartner = leadRecord.source === 'Partner Registration';
    const targetGcfg = isPartner ? window.VPS_PARTNER_FORM_CONFIG : window.VPS_GOOGLE_FORM_CONFIG;

    if (targetGcfg && targetGcfg.formId) {
        try {
            const gUrl = `https://docs.google.com/forms/d/e/${targetGcfg.formId}/formResponse`;
            const gData = new URLSearchParams();
            
            if (targetGcfg.entries) {
                for (const [key, entryId] of Object.entries(targetGcfg.entries)) {
                    if (entryId && entryId.startsWith('entry.') && leadRecord[key] !== undefined) {
                        gData.append(entryId, String(leadRecord[key]));
                    }
                }
            }

            // Fallback parameters if specific keys aren't mapped
            if (leadRecord.phone && targetGcfg.entries?.phone?.startsWith('entry.')) {
                gData.set(targetGcfg.entries.phone, leadRecord.phone);
            }

            fetch(gUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: gData.toString()
            }).catch(() => {});
        } catch (_) {}
    }
}

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

// --- VPS Lead Thank You Confirmation Screen (5-Second Auto-Dismiss) ---
let _vpsThankYouTimer = null;
let _vpsCountdownInterval = null;
let _vpsActiveRestoreFn = null;

function vpsDismissThankYou(triggerClose) {
    if (_vpsThankYouTimer) {
        clearTimeout(_vpsThankYouTimer);
        _vpsThankYouTimer = null;
    }
    if (_vpsCountdownInterval) {
        clearInterval(_vpsCountdownInterval);
        _vpsCountdownInterval = null;
    }
    if (typeof _vpsActiveRestoreFn === 'function') {
        const restore = _vpsActiveRestoreFn;
        _vpsActiveRestoreFn = null;
        restore();
    }
    if (triggerClose) {
        const overlay = document.getElementById('popupOverlay');
        if (overlay && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            const floatBtn = document.getElementById('floatingEligibilityBtn');
            if (floatBtn) floatBtn.classList.remove('hide');
        }
    }
}
window.vpsDismissThankYou = vpsDismissThankYou;

function showLeadThankYouScreen(opts) {
    const {
        form,
        firstName = '',
        lastName = '',
        phone = '',
        whatsapp = '',
        email = '',
        interest = '',
        durationMs = 5000,
        waUrl = ''
    } = opts;

    if (!form) return;

    // Dismiss any previously active screen cleanly
    vpsDismissThankYou(false);

    const modalEl = form.closest('.popup-modal');
    const isModal = Boolean(modalEl);
    const parentContainer = form.parentElement;

    const originalFormDisplay = form.style.display;
    form.style.display = 'none';

    let headerEl = null;
    let originalHeaderDisplay = '';
    if (parentContainer) {
        headerEl = parentContainer.querySelector('.popup-form-header');
        if (headerEl) {
            originalHeaderDisplay = headerEl.style.display;
            headerEl.style.display = 'none';
        }
    }

    if (modalEl) {
        modalEl.classList.add('has-thankyou');
    }

    const cleanPhone = String(phone).replace(/\D/g, '');
    const phoneDisplay = cleanPhone.length === 10
        ? `${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`
        : (cleanPhone || 'Registered Mobile');

    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

    let targetWaUrl = waUrl;
    if (!targetWaUrl) {
        const leadMsg = encodeURIComponent(
            `*New Education Loan Inquiry - Visionary Path Services*\n\n` +
            `👤 *Name:* ${fullName || 'Student'}\n` +
            `📞 *Phone:* +91 ${cleanPhone}\n` +
            (whatsapp ? `💬 *WhatsApp:* +91 ${whatsapp}\n` : '') +
            (email ? `✉️ *Email:* ${email}\n` : '') +
            `🎯 *Interested In:* ${interest || 'Education Loan'}\n\n` +
            `_Sent via visionarypathservices.com_`
        );
        targetWaUrl = `https://wa.me/918150949070?text=${leadMsg}`;
    }

    const screenEl = document.createElement('div');
    screenEl.className = 'vps-thankyou-screen';
    screenEl.setAttribute('role', 'status');
    screenEl.setAttribute('aria-live', 'polite');

    screenEl.innerHTML = `
        <div class="vps-thankyou-icon-wrap">
            <div class="vps-thankyou-icon-pulse"></div>
            <div class="vps-thankyou-icon">
                <svg viewBox="0 0 52 52" class="vps-checkmark-svg" aria-hidden="true">
                    <circle class="vps-checkmark-circle" cx="26" cy="26" r="24" fill="none"/>
                    <path class="vps-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
        </div>

        <div class="vps-thankyou-badge">
            <i class="fas fa-check-circle"></i> Application Received
        </div>

        <h3 class="vps-thankyou-title">Thank You for Submitting!</h3>
        <p class="vps-thankyou-subtitle">Our team will contact you shortly</p>

        <div class="vps-thankyou-card">
            <div class="vps-thankyou-info-row">
                <div class="vps-thankyou-info-icon"><i class="fas fa-phone-volume"></i></div>
                <div class="vps-thankyou-info-text">
                    <span class="vps-info-label">Advisory Call Scheduled</span>
                    <span class="vps-info-val">+91 ${phoneDisplay}</span>
                </div>
            </div>
            ${fullName ? `
            <div class="vps-thankyou-info-row">
                <div class="vps-thankyou-info-icon"><i class="fas fa-user-check"></i></div>
                <div class="vps-thankyou-info-text">
                    <span class="vps-info-label">Applicant Name</span>
                    <span class="vps-info-val">${fullName}</span>
                </div>
            </div>` : ''}
            <div class="vps-thankyou-info-row">
                <div class="vps-thankyou-info-icon"><i class="fas fa-clock"></i></div>
                <div class="vps-thankyou-info-text">
                    <span class="vps-info-label">Expected Response</span>
                    <span class="vps-info-val">Within 15–30 Minutes</span>
                </div>
            </div>
        </div>

        <div class="vps-thankyou-steps">
            <span class="vps-step-pill"><i class="fas fa-check"></i> Profile Check</span>
            <span class="vps-step-arrow"><i class="fas fa-arrow-right"></i></span>
            <span class="vps-step-pill"><i class="fas fa-building-columns"></i> 15+ Banks Comparison</span>
            <span class="vps-step-arrow"><i class="fas fa-arrow-right"></i></span>
            <span class="vps-step-pill"><i class="fas fa-percent"></i> Best Rate Sanction</span>
        </div>

        <div class="vps-thankyou-timer-box">
            <div class="vps-timer-bar-track">
                <div class="vps-timer-bar-fill"></div>
            </div>
            <div class="vps-timer-meta">
                <span class="vps-timer-caption">
                    <i class="fas fa-stopwatch"></i> Auto-closing in <strong class="vps-seconds-left">5</strong>s...
                </span>
                <button type="button" class="vps-timer-skip-btn" onclick="vpsDismissThankYou(true)">Close Now</button>
            </div>
        </div>

        <div class="vps-thankyou-fasttrack">
            <span>Need an immediate response?</span>
            <a href="${targetWaUrl}" target="_blank" rel="noopener" class="vps-thankyou-wa-link">
                <i class="fab fa-whatsapp"></i> Chat on WhatsApp
            </a>
        </div>
    `;

    parentContainer.appendChild(screenEl);

    if (window.VPSMotion && typeof window.VPSMotion.animateThankYouScreen === 'function') {
        window.VPSMotion.animateThankYouScreen(screenEl);
    }

    // Prepare restore function
    _vpsActiveRestoreFn = function() {
        if (screenEl.parentNode) {
            screenEl.parentNode.removeChild(screenEl);
        }
        if (modalEl) {
            modalEl.classList.remove('has-thankyou');
        }
        form.style.display = originalFormDisplay;
        if (headerEl) {
            headerEl.style.display = originalHeaderDisplay;
        }
        form.reset();
        form.dataset.submitting = 'false';
        const inputs = form.querySelectorAll('input, textarea, select');
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
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
            btn.removeAttribute('data-state');
            btn.disabled = false;
            btn.style.background = '';
        }
    };

    // 5-second countdown timer and visual progress bar
    const startTime = Date.now();
    const endTime = startTime + durationMs;
    const fillEl = screenEl.querySelector('.vps-timer-bar-fill');
    const secEl = screenEl.querySelector('.vps-seconds-left');

    _vpsCountdownInterval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const sec = Math.max(1, Math.ceil(remaining / 1000));
        const pct = Math.max(0, (remaining / durationMs) * 100);

        if (secEl) secEl.textContent = String(sec);
        if (fillEl) fillEl.style.width = pct.toFixed(1) + '%';

        if (remaining <= 0) {
            clearInterval(_vpsCountdownInterval);
            _vpsCountdownInterval = null;
        }
    }, 40);

    _vpsThankYouTimer = setTimeout(() => {
        _vpsThankYouTimer = null;
        vpsDismissThankYou(isModal);
    }, durationMs);
}
window.showLeadThankYouScreen = showLeadThankYouScreen;

function openPopup() {
    closeMenu();
    vpsDismissThankYou(false);
    const overlay = document.getElementById('popupOverlay');
    if (overlay) {
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'popupTitle');
        document.body.classList.add('modal-open');

        if (window.VPSMotion && typeof window.VPSMotion.animateModalOpen === 'function') {
            window.VPSMotion.animateModalOpen(overlay);
        }

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
    vpsDismissThankYou(false);
    const overlay = document.getElementById('popupOverlay');
    const completeClose = () => {
        if (overlay) {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
        }
        document.body.classList.remove('modal-open');
    };

    if (overlay && window.VPSMotion && typeof window.VPSMotion.animateModalClose === 'function') {
        window.VPSMotion.animateModalClose(overlay, completeClose);
    } else {
        completeClose();
    }
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
    const threshold = window.innerWidth <= 768 ? 160 : 380;
    if (window.scrollY <= threshold) {
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

// --- Mobile Navigation Drawer System (Hallmark Modern Responsive Standard) ---
function updateNavHeight() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const height = Math.round(navbar.getBoundingClientRect().height);
        if (height > 0) {
            document.documentElement.style.setProperty('--nav-height', height + 'px');
            return height;
        }
    }
    return 56;
}

function toggleMenu() {
    const links = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const navCta = document.querySelector('.nav-cta');
    const navbar = document.getElementById('navbar');
    const backdrop = document.getElementById('navBackdrop');
    const willOpen = links ? !links.classList.contains('open') : false;

    if (willOpen) {
        document.body.classList.add('menu-open');
        const navHeight = updateNavHeight();
        if (links) {
            links.style.top = navHeight + 'px';
            links.classList.add('open');
        }
        if (navCta) navCta.classList.add('open');
        if (hamburger) {
            hamburger.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
        }
        if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
    } else {
        closeMenu();
    }
}

function closeMenu() {
    const links = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const navCta = document.querySelector('.nav-cta');
    const backdrop = document.getElementById('navBackdrop');

    if (links) {
        links.classList.remove('open');
        links.style.top = '';
    }
    if (navCta) navCta.classList.remove('open');
    if (hamburger) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
}

window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;
window.updateNavHeight = updateNavHeight;

window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
        closeMenu();
    } else if (document.body.classList.contains('menu-open')) {
        const links = document.getElementById('navLinks');
        const navHeight = updateNavHeight();
        if (links) links.style.top = navHeight + 'px';
    }
}, { passive: true });

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (document.body.classList.contains('menu-open')) {
            const links = document.getElementById('navLinks');
            const navHeight = updateNavHeight();
            if (links) links.style.top = navHeight + 'px';
        }
    }, 100);
}, { passive: true });

// Keyboard accessibility: Escape key to dismiss mobile drawer
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        closeMenu();
        const hamburger = document.getElementById('hamburger');
        if (hamburger) hamburger.focus();
    }
});

// Click outside drawer to close
document.addEventListener('click', (e) => {
    if (document.body.classList.contains('menu-open')) {
        const navbar = document.getElementById('navbar');
        const links = document.getElementById('navLinks');
        const hamburger = document.getElementById('hamburger');
        const navCta = document.querySelector('.nav-cta');
        if (
            links && !links.contains(e.target) &&
            hamburger && !hamburger.contains(e.target) &&
            (!navCta || !navCta.contains(e.target)) &&
            (!navbar || !navbar.contains(e.target))
        ) {
            closeMenu();
        }
    }
});

// Mobile dropdown toggle & drawer destination link auto-close
document.addEventListener('DOMContentLoaded', () => {
    updateNavHeight();

    // Dropdown toggles inside mobile drawer
    document.querySelectorAll('.has-dropdown > a').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 960) {
                e.preventDefault();
                const parent = this.parentElement;
                const wasOpen = parent.classList.contains('open');
                parent.classList.toggle('open');
                this.setAttribute('aria-expanded', !wasOpen ? 'true' : 'false');
            }
        });

        // Space key accessibility for dropdown toggles
        item.addEventListener('keydown', function(e) {
            if (window.innerWidth <= 960 && (e.key === ' ' || e.key === 'Spacebar')) {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Auto-close mobile drawer when tapping any navigation destination link
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.addEventListener('click', function(e) {
            const anchor = e.target.closest('a');
            if (anchor && !anchor.closest('.has-dropdown > a')) {
                closeMenu();
            }
        });
    }
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
        const disclaimer = document.querySelector('.site-disclaimer-wrap') || document.querySelector('.footer');
        let isNearBottom = false;
        if (disclaimer) {
            const rect = disclaimer.getBoundingClientRect();
            if (rect.top <= window.innerHeight - 20) {
                isNearBottom = true;
            }
        }
        const threshold = window.innerWidth <= 768 ? 160 : 380;
        if (window.scrollY > threshold && !isNearBottom) {
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
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
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

    // Show Thank You Screen for exactly 5 seconds
    showLeadThankYouScreen({
        form,
        firstName,
        lastName,
        phone,
        whatsapp,
        email,
        interest,
        durationMs: 5000,
        waUrl
    });
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

    const companyName = (form.querySelector('input[name="companyName"]')?.value || '').toString().trim();
    const partnerType = (form.querySelector('select[name="partnerType"]')?.value || '').toString().trim();
    const contactPerson = (form.querySelector('input[name="contactPerson"]')?.value || '').toString().trim();
    const designation = (form.querySelector('input[name="designation"]')?.value || '').toString().trim();
    const email = (form.querySelector('input[name="email"]')?.value || '').toString().trim();
    const phone = (form.querySelector('input[name="phone"]')?.value || '').toString().replace(/[^0-9]/g, '');
    const city = (form.querySelector('input[name="city"]')?.value || '').toString().trim();
    const annualReferrals = (form.querySelector('select[name="annualReferrals"]')?.value || '').toString().trim();
    const message = (form.querySelector('textarea[name="message"]')?.value || '').toString().trim();

    const nameParts = contactPerson.split(' ');
    const firstName = nameParts[0] || contactPerson;
    const lastName = nameParts.slice(1).join(' ') || companyName;

    const leadRecord = {
        id: 'vps_' + Date.now(),
        submittedAt: new Date().toISOString(),
        source: 'Partner Registration',
        firstName,
        lastName,
        phone,
        whatsapp: phone,
        email,
        interest: `Partner: ${partnerType || 'General'} (${companyName})`,
        notes: `Designation: ${designation} | City: ${city} | Expected Volume: ${annualReferrals} | Notes: ${message}`,
        pageUrl: window.location.href
    };
    dispatchLeadCapture(leadRecord);

    showLeadThankYouScreen({
        form,
        firstName: contactPerson,
        lastName: companyName,
        phone,
        whatsapp: phone,
        email,
        interest: `Partner: ${partnerType || 'General'} (${companyName})`,
        durationMs: 5000
    });
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
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    }

    const leadRecord = {
        id: 'vps_' + Date.now(),
        submittedAt: new Date().toISOString(),
        source: 'Contact Page Form',
        firstName,
        lastName,
        phone,
        whatsapp,
        email,
        interest: 'Contact Page Inquiry',
        notes: message,
        pageUrl: window.location.href
    };
    dispatchLeadCapture(leadRecord);

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

    showLeadThankYouScreen({
        form,
        firstName,
        lastName,
        phone,
        whatsapp,
        email,
        interest: 'Contact Page Inquiry',
        durationMs: 5000,
        waUrl
    });
}

window.submitContactForm = submitContactForm;
window.submitPartnerForm = submitPartnerForm;

// --- Initialize Hallmark Form Validation & Numbers-Only Enforcer on All Forms ---
function initHallmarkFormEngine() {
    document.querySelectorAll('form').forEach(form => {
        form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="radio"]):not([type="checkbox"]), textarea, select').forEach(field => {
            getOrCreateErrorElement(field);

            // Strict Numbers-Only Enforcement for Mobile / Phone / WhatsApp fields
            const fieldName = (field.name || '').toLowerCase();
            const fieldId = (field.id || '').toLowerCase();
            const isNumericPhone = field.type === 'tel' ||
                fieldName.includes('phone') || fieldName.includes('whatsapp') || fieldName.includes('mobile') ||
                fieldId.includes('phone') || fieldId.includes('whatsapp') || fieldId.includes('mobile') ||
                field.hasAttribute('data-numeric-only');

            if (isNumericPhone && field.tagName === 'INPUT') {
                field.setAttribute('inputmode', 'numeric');
                field.setAttribute('pattern', '[0-9]*');
                field.setAttribute('maxlength', '10');

                // Block any key that is not a numeric digit (0-9) while allowing control keys
                field.addEventListener('keydown', (e) => {
                    const allowedNavKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                    if (allowedNavKeys.includes(e.key)) return;
                    if (e.ctrlKey || e.metaKey) return; // Allow Copy/Paste/Cut shortcuts
                    if (!/^\d$/.test(e.key)) {
                        e.preventDefault();
                    }
                });

                // Real-time sanitizer on input or paste: strip non-digits and cap at 10 digits
                field.addEventListener('input', () => {
                    const cleaned = field.value.replace(/\D/g, '').slice(0, 10);
                    if (field.value !== cleaned) {
                        field.value = cleaned;
                    }
                });
            }

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

// Test Helper: Available in browser console or test runners to verify lead submission
window.testLeadCapture = function(typeOrData) {
    if (typeOrData === 'both') {
        const student = window.testLeadCapture('student');
        const partner = window.testLeadCapture('partner');
        return {
            status: 'success',
            leads: [student.lead, partner.lead],
            vault: JSON.parse(localStorage.getItem('vps_lead_vault') || '[]')
        };
    }

    if (typeOrData === 'partner') {
        const testPartnerLead = {
            id: 'test_partner_' + Date.now(),
            submittedAt: new Date().toISOString(),
            source: 'Partner Registration',
            companyName: 'Apex Global Overseas Consultancy',
            partnerType: 'Study Abroad Consultant',
            contactPerson: 'Rajesh Kumar',
            firstName: 'Rajesh',
            lastName: 'Kumar',
            designation: 'Managing Director',
            email: 'partner.test@example.com',
            phone: '9876543210',
            whatsapp: '9876543210',
            city: 'Hyderabad, Telangana',
            expectedReferrals: '20-50 Students / Year',
            interest: 'Partner: Study Abroad Consultant (Apex Global Overseas Consultancy)',
            notes: 'Designation: Managing Director | City: Hyderabad, Telangana | Expected Volume: 20-50 Students / Year | Notes: Automated test lead',
            pageUrl: window.location.href
        };
        dispatchLeadCapture(testPartnerLead);
        return {
            status: 'success',
            lead: testPartnerLead,
            vault: JSON.parse(localStorage.getItem('vps_lead_vault') || '[]')
        };
    }

    const testLead = Object.assign({
        id: 'test_student_' + Date.now(),
        submittedAt: new Date().toISOString(),
        source: 'Lead Capture Form',
        firstName: 'Test',
        lastName: 'Student',
        phone: '9876543210',
        whatsapp: '9876543210',
        email: 'test.student@example.com',
        interest: 'Abroad Education Loan',
        notes: 'Verification test lead submission',
        pageUrl: window.location.href
    }, typeof typeOrData === 'object' ? typeOrData : {});
    
    dispatchLeadCapture(testLead);
    return {
        status: 'success',
        lead: testLead,
        vault: JSON.parse(localStorage.getItem('vps_lead_vault') || '[]')
    };
};

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

        let security = card.dataset.security || '';
        if (!security) {
            const text = card.textContent.toLowerCase();
            if (text.includes('collateral & no-collateral') || text.includes('both') || text.includes('secured & unsecured')) {
                security = 'both';
            } else if (text.includes('no-collateral') || text.includes('unsecured') || text.includes('non-collateral')) {
                security = 'unsecured';
            } else if (text.includes('collateral') || text.includes('secured')) {
                security = 'secured';
            } else {
                security = 'both';
            }
            card.dataset.security = security;
        }

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

// ==========================================
// WHATSAPP CTA PROFESSIONAL PRE-TYPED MESSAGE ENGINE
// ==========================================
(function() {
    const VPS_WA_PHONE = '918150949070';

    const CONTEXT_MESSAGES = {
        'usa': 'Hello Visionary Path Services, I am planning to study in the USA and would like expert guidance on education loan options (secured / unsecured) and eligibility. Please assist me.',
        'uk': 'Hello Visionary Path Services, I am planning to study in the UK and would like expert guidance on education loan options and eligibility. Please assist me.',
        'canada': 'Hello Visionary Path Services, I am planning to study in Canada and would like expert guidance on education loan options and GIC / living cost financing. Please assist me.',
        'germany': 'Hello Visionary Path Services, I am planning to study in Germany and would like expert guidance on education loans and blocked account financing. Please assist me.',
        'australia': 'Hello Visionary Path Services, I am planning to study in Australia and would like expert guidance on education loan options and eligibility. Please assist me.',
        'ireland': 'Hello Visionary Path Services, I am planning to study in Ireland and would like expert guidance on education loan options and visa financial requirements. Please assist me.',
        'france': 'Hello Visionary Path Services, I am planning to study in France and would like expert guidance on education loan options and eligibility. Please assist me.',
        'new-zealand': 'Hello Visionary Path Services, I am planning to study in New Zealand and would like expert guidance on education loan options and FTS financing. Please assist me.',
        'dubai': 'Hello Visionary Path Services, I am planning to study in Dubai (UAE) and would like expert guidance on education loan options and eligibility. Please assist me.',
        'europe': 'Hello Visionary Path Services, I am planning to study in Europe and would like expert guidance on education loan options and eligibility. Please assist me.',
        'abroad-loans': 'Hello Visionary Path Services, I am looking for an education loan for my study abroad plans (secured & unsecured options). Could you please help me check my eligibility and interest rates?',
        'domestic-loans': 'Hello Visionary Path Services, I am looking for an education loan for higher studies in India. Could you please guide me on bank options, interest rates, and eligibility?',
        'mbbs-loans': 'Hello Visionary Path Services, I am seeking guidance on an education loan for MBBS studies (India / Abroad). Could you please share the eligible lenders and financing details?',
        'calculators': 'Hello Visionary Path Services, I used the education loan calculators on your website and would like a personalized eligibility assessment and lender comparison. Please guide me.',
        'partner-lenders': 'Hello Visionary Path Services, I would like to know which partner bank or NBFC is best suited for my education loan profile. Could you please advise me?',
        'partner-with-us': 'Hello Visionary Path Services, I am interested in partnering with Visionary Path Services as an education consultant / institutional partner. Could we connect?',
        'other-loans': 'Hello Visionary Path Services, I am looking for assistance with education loan services and forex/ancillary support. Could you please guide me?',
        'contact': 'Hello Visionary Path Services, I visited your website and would like to speak directly with an education loan counselor. Please assist me.',
        'about': 'Hello Visionary Path Services, I would like to consult with an education loan advisor regarding higher education financing options and eligibility. Please assist me.',
        'blog-cibil': 'Hello Visionary Path Services, I read your article on CIBIL scores and would like an expert assessment of my loan eligibility.',
        'blog-collateral': 'Hello Visionary Path Services, I want to compare secured vs unsecured education loan options for my higher studies.',
        'blog-usa': 'Hello Visionary Path Services, I was reading your USA education loan guide and would like to check my loan eligibility for US universities.',
        'blog': 'Hello Visionary Path Services, I was browsing your education loan blog and would like to consult with an advisor regarding my loan requirements.',
        'default': 'Hello Visionary Path Services, I would like to get expert guidance regarding education loan options and eligibility for higher studies. Please assist me.'
    };

    function resolveContextualMessage(el) {
        if (el && el.dataset && el.dataset.waMessage) {
            return el.dataset.waMessage;
        }

        const pathname = window.location.pathname.toLowerCase();

        if (pathname.includes('/usa') || pathname.endsWith('usa.html')) {
            if (pathname.includes('/blogs/')) return CONTEXT_MESSAGES['blog-usa'];
            return CONTEXT_MESSAGES['usa'];
        }
        if (pathname.includes('/cibil')) return CONTEXT_MESSAGES['blog-cibil'];
        if (pathname.includes('/collateral')) return CONTEXT_MESSAGES['blog-collateral'];
        if (pathname.includes('/uk') || pathname.endsWith('uk.html')) return CONTEXT_MESSAGES['uk'];
        if (pathname.includes('/canada') || pathname.endsWith('canada.html')) return CONTEXT_MESSAGES['canada'];
        if (pathname.includes('/germany') || pathname.endsWith('germany.html')) return CONTEXT_MESSAGES['germany'];
        if (pathname.includes('/australia') || pathname.endsWith('australia.html')) return CONTEXT_MESSAGES['australia'];
        if (pathname.includes('/ireland') || pathname.endsWith('ireland.html')) return CONTEXT_MESSAGES['ireland'];
        if (pathname.includes('/france') || pathname.endsWith('france.html')) return CONTEXT_MESSAGES['france'];
        if (pathname.includes('/new-zealand') || pathname.endsWith('new-zealand.html')) return CONTEXT_MESSAGES['new-zealand'];
        if (pathname.includes('/dubai') || pathname.endsWith('dubai.html')) return CONTEXT_MESSAGES['dubai'];
        if (pathname.includes('/europe') || pathname.endsWith('europe.html')) return CONTEXT_MESSAGES['europe'];

        if (pathname.includes('abroad-loans')) return CONTEXT_MESSAGES['abroad-loans'];
        if (pathname.includes('domestic-loans')) return CONTEXT_MESSAGES['domestic-loans'];
        if (pathname.includes('mbbs-loans')) return CONTEXT_MESSAGES['mbbs-loans'];
        if (pathname.includes('calculators')) return CONTEXT_MESSAGES['calculators'];
        if (pathname.includes('partner-lenders')) return CONTEXT_MESSAGES['partner-lenders'];
        if (pathname.includes('partner-with-us')) return CONTEXT_MESSAGES['partner-with-us'];
        if (pathname.includes('other-loans')) return CONTEXT_MESSAGES['other-loans'];
        if (pathname.includes('contact')) return CONTEXT_MESSAGES['contact'];
        if (pathname.includes('about')) return CONTEXT_MESSAGES['about'];
        if (pathname.includes('blog')) return CONTEXT_MESSAGES['blog'];

        return CONTEXT_MESSAGES['default'];
    }

    function buildWhatsAppUrl(message) {
        return `https://wa.me/${VPS_WA_PHONE}?text=${encodeURIComponent(message)}`;
    }

    function initWhatsAppCTAs() {
        const waLinks = document.querySelectorAll('a[href*="wa.me"]');
        waLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            let hasMessage = false;
            try {
                const url = new URL(href, window.location.origin);
                const text = url.searchParams.get('text');
                if (text && text.trim().length > 0) {
                    hasMessage = true;
                }
            } catch (_) {
                hasMessage = href.includes('text=');
            }

            if (!hasMessage) {
                const msg = resolveContextualMessage(link);
                link.setAttribute('href', buildWhatsAppUrl(msg));
            }

            if (!link.getAttribute('target')) link.setAttribute('target', '_blank');
            if (!link.getAttribute('rel')) link.setAttribute('rel', 'noopener');
        });
    }

    // Delegated click handler to intercept any dynamically created or un-hydrated WhatsApp CTA
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="wa.me"]');
        if (!link) return;

        const href = link.getAttribute('href') || '';
        let hasMessage = false;
        try {
            const url = new URL(href, window.location.origin);
            const text = url.searchParams.get('text');
            if (text && text.trim().length > 0) {
                hasMessage = true;
            }
        } catch (_) {
            hasMessage = href.includes('text=');
        }

        if (!hasMessage) {
            const msg = resolveContextualMessage(link);
            link.setAttribute('href', buildWhatsAppUrl(msg));
        }
    }, true);

    // Global utility for triggering WhatsApp consultation from anywhere
    window.openWhatsAppChat = function(customMessage) {
        const msg = customMessage || resolveContextualMessage();
        window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhatsAppCTAs);
    } else {
        initWhatsAppCTAs();
    }
})();

// --- Mobile Footer Collapsible Accordions (Hallmark Compact Architecture) ---
(function initMobileFooterAccordions() {
    function setupFooter() {
        const accordions = document.querySelectorAll('.footer-col-accordion');
        if (!accordions.length) return;

        function updateState() {
            const isMobile = window.innerWidth <= 768;
            accordions.forEach(acc => {
                if (isMobile) {
                    if (!acc.dataset.userToggled) {
                        acc.removeAttribute('open');
                    }
                } else {
                    acc.setAttribute('open', '');
                }
            });
        }

        accordions.forEach(acc => {
            acc.addEventListener('toggle', () => {
                if (window.innerWidth <= 768) {
                    acc.dataset.userToggled = 'true';
                }
            });
        });

        updateState();
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateState, 150);
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupFooter);
    } else {
        setupFooter();
    }
})();




