/**
 * Visionary Path Services - Bespoke Unified Apple SF Icon Pack
 * Handcrafted exclusively for Visionary Path Services.
 * Standard 24x24 viewBox, uniform 1.8px optical stroke, rounded joins & caps.
 * Zero external libraries, zero CDN dependencies, zero style mixing.
 */

(function () {
    'use strict';

    // Core Handcrafted Bespoke Icon Pack (Standardized 24x24 Optical Grid)
    const VPS_ICONS = {
        // 1. Navigation, Actions & System
        'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
        'chevron-down': '<path d="m6 9 6 6 6-6"/>',
        'chevron-right': '<path d="m9 18 6-6-6-6"/>',
        'check': '<path d="M20 6 9 17l-5-5"/>',
        'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
        'rotate': '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
        'magnifying-glass': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',

        // 2. Hero & Core Pillars (Custom Tailored to VPS Mockups)
        'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        'file-invoice': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h5"/><path d="M14 2v4a2 2 0 0 0 2 2h4v4"/><path d="M8 9h5M8 13h3"/><circle cx="17.5" cy="17.5" r="4.5"/><path d="m15.5 17.5 1.5 1.5 3-3"/>',
        'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 12h8"/><path d="M8 16h6"/>',
        'file-signature': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h5"/><path d="M14 2v4a2 2 0 0 0 2 2h4v4"/><path d="M8 9h5M8 13h3"/><circle cx="17.5" cy="17.5" r="4.5"/><path d="m15.5 17.5 1.5 1.5 3-3"/>',
        'graduation-cap': '<polygon points="12 3 22 8 12 13 2 8 12 3"/><path d="M6 10.5v5.5c0 2.5 2.7 4.5 6 4.5s6-2 6-4.5v-5.5"/><path d="M20 9.5v7.5"/><circle cx="20" cy="18" r="1" fill="currentColor"/>',
        'handshake': '<path d="M2 13h4.5l2.8-2.8a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 0 2.8 0l.5-.5a2 2 0 0 1 2.8 0l3.7 3.7H22"/><path d="M6 13v3.5a2 2 0 0 0 2 2h2.2l2.3-2.3 2.3 2.3H17a2 2 0 0 0 2-2V13"/><line x1="2" y1="10" x2="2" y2="16"/><line x1="22" y1="10" x2="22" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>',
        'shield-alt': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',

        // 3. Banking, Loans & Finance
        'landmark': '<polygon points="12 2 21 7 3 7"/><line x1="2" y1="7" x2="22" y2="7"/><line x1="6" y1="11" x2="6" y2="18"/><line x1="10" y1="11" x2="10" y2="18"/><line x1="14" y1="11" x2="14" y2="18"/><line x1="18" y1="11" x2="18" y2="18"/><line x1="3" y1="18" x2="21" y2="18"/><line x1="2" y1="22" x2="22" y2="22"/>',
        'coins': '<ellipse cx="8" cy="8" rx="6" ry="3"/><path d="M2 8v4c0 1.66 2.69 3 6 3s6-1.34 6-3V8"/><path d="M2 12v4c0 1.66 2.69 3 6 3s6-1.34 6-3v-4"/><path d="M14 11.5c1.3.3 2.7.4 4 .4 3.3 0 6-1.34 6-3V6"/><path d="M22 9v4c0 1.66-2.69 3-6 3-.7 0-1.4-.05-2-.16"/>',
        'wallet': '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/><circle cx="17.5" cy="14" r="1" fill="currentColor"/>',
        'credit-card': '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><line x1="6" x2="9" y1="15" y2="15"/>',
        'money-bill-transfer': '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2.5"/><line x1="6" x2="6.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="12" y2="12"/>',
        'rupee': '<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4 4 0 0 0 0-8"/>',
        'percent': '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
        'hand-holding-dollar': '<path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8L15 13"/><circle cx="12" cy="6" r="4"/><path d="M12 4v4M10.5 5.5h3"/>',
        'hand-holding-heart': '<path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8L15 12"/><path d="M19.5 4.5a2.5 2.5 0 0 0-3.5 0L15 5.5l-1-1a2.5 2.5 0 0 0-3.5 3.5l4.5 4.5 4.5-4.5a2.5 2.5 0 0 0 0-3.5Z"/>',

        // 4. Communication & Advisory
        'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
        'envelope': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
        'headset': '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/><path d="M18 19v1a2 2 0 0 1-2 2h-4"/>',
        'comments': '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
        'paper-plane': '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
        'whatsapp': '<path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.08L2 22l5.12-1.34A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.46 14.12c-.23.64-1.15 1.22-1.6 1.28-.43.06-.98.08-1.58-.11-.36-.12-.83-.28-1.43-.54-2.52-1.09-4.16-3.64-4.29-3.81-.13-.17-1.02-1.36-1.02-2.6 0-1.24.65-1.85.88-2.1.23-.25.5-.31.67-.31.17 0 .34 0 .49.01.15.01.36-.06.56.42.21.49.71 1.73.77 1.86.06.13.1.28.02.45-.09.16-.13.26-.26.41-.13.15-.27.34-.39.46-.13.13-.26.27-.11.53.15.25.67 1.1 1.44 1.78.99.88 1.82 1.15 2.08 1.28.26.13.41.11.56-.06.15-.17.65-.76.82-1.02.17-.26.35-.22.58-.13.24.09 1.5.71 1.76.84.26.13.43.2.49.31.06.1.06.6-.17 1.24z"/>',

        // 5. User Profiles & Personas
        'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        'user-cog': '<path d="M15 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8" cy="7" r="4"/><circle cx="18.5" cy="14.5" r="1.5"/><path d="M18.5 11.5v1M18.5 16.5v1M15.5 14.5h1M20.5 14.5h1M16.4 12.4l.7.7M19.9 15.9l.7.7M16.4 16.6l.7-.7M19.9 13.1l.7-.7"/>',
        'id-badge': '<path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="10" r="3"/><path d="M9 18a3 3 0 0 1 6 0"/><line x1="10" x2="14" y1="5" y2="5"/>',

        // 6. Trust, Timing & Technology
        'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16.5" r="1.5" fill="currentColor"/>',
        'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        'calendar': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><circle cx="8" cy="14" r="1" fill="currentColor"/><circle cx="12" cy="14" r="1" fill="currentColor"/><circle cx="16" cy="14" r="1" fill="currentColor"/>',
        'laptop': '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 19h20a1 1 0 0 0 1-1v-.5a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v.5a1 1 0 0 0 1 1z"/>',
        'lightbulb': '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
        'bolt': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
        'bullseye': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
        'award': '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
        'chart-bar': '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/><line x1="2" x2="22" y1="20" y2="20"/>',
        'chart-line': '<path d="m3 3 7 7 4-4 7 7"/><path d="M14 3h7v7"/>',
        'plane-departure': '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.2c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
        'globe': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
        'map-marker-alt': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
        'hospital': '<rect width="16" height="18" x="4" y="3" rx="2"/><path d="M12 7v6M9 10h6"/><path d="M2 21h20"/>',
        'house-chimney': '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M19 6V3h-3v1.5"/>',
        'car': '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 10.9 2 11.2V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h10"/>',
        'stethoscope': '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
        'clipboard-check': '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
        'clipboard-list': '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><circle cx="8.5" cy="11" r=".5" fill="currentColor"/><circle cx="8.5" cy="16" r=".5" fill="currentColor"/>',
        'calculator': '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M16 14h.01M12 18h.01M8 18h.01M16 18h.01"/>',
        'building': '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
        'building-circle-check': '<rect width="12" height="16" x="3" y="4" rx="2"/><path d="M7 8h4"/><path d="M7 12h4"/><circle cx="17" cy="17" r="5"/><path d="m15 17 1.5 1.5 3-3"/>',
        'briefcase': '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',

        // 7. Social Brands (Refined Apple SF Aesthetic)
        'instagram': '<rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
        'facebook': '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
        'linkedin': '<rect width="4" height="12" x="3" y="9" rx="1"/><circle cx="5" cy="4" r="2"/><path d="M10 21V9h4v2a4 4 0 0 1 4-2 4 4 0 0 1 4 4v8h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4z"/>',
        'youtube': '<rect width="20" height="15" x="2" y="4.5" rx="4"/><polygon points="10 9 15 12 10 15 10 9" fill="currentColor"/>'
    };

    // Comprehensive semantic mapping for all classes present in Visionary Path Services
    const ALIASES = {
        'phone-alt': 'phone',
        'phone-volume': 'phone',
        'phone': 'phone',
        'envelope': 'envelope',
        'mail': 'envelope',
        'instagram': 'instagram',
        'whatsapp': 'whatsapp',
        'linkedin-in': 'linkedin',
        'linkedin': 'linkedin',
        'facebook-f': 'facebook',
        'facebook': 'facebook',
        'youtube': 'youtube',
        'shield': 'shield-alt',
        'shield-alt': 'shield-alt',
        'shield-halved': 'shield-alt',
        'graduation-cap': 'graduation-cap',
        'handshake': 'handshake',
        'users': 'users',
        'user': 'user',
        'user-check': 'user',
        'user-cog': 'user-cog',
        'user-graduate': 'graduation-cap',
        'user-md': 'stethoscope',
        'user-tie': 'user',
        'file-alt': 'file-invoice',
        'file-lines': 'file-text',
        'file-text': 'file-text',
        'file-invoice': 'file-invoice',
        'file-signature': 'file-signature',
        'building-columns': 'landmark',
        'university': 'landmark',
        'landmark': 'landmark',
        'building': 'building',
        'building-circle-check': 'building-circle-check',
        'coins': 'coins',
        'wallet': 'wallet',
        'hand-holding-dollar': 'hand-holding-dollar',
        'hand-holding-heart': 'hand-holding-heart',
        'money-bill-wave': 'money-bill-transfer',
        'money-bill-transfer': 'money-bill-transfer',
        'credit-card': 'credit-card',
        'arrow-right': 'arrow-right',
        'chevron-down': 'chevron-down',
        'chevron-right': 'chevron-right',
        'check': 'check',
        'check-circle': 'check-circle',
        'clipboard-check': 'clipboard-check',
        'clipboard-list': 'clipboard-list',
        'clock': 'clock',
        'award': 'award',
        'bolt': 'bolt',
        'briefcase': 'briefcase',
        'bullseye': 'bullseye',
        'target': 'bullseye',
        'calculator': 'calculator',
        'calendar': 'calendar',
        'calendar-alt': 'calendar',
        'car': 'car',
        'chart-bar': 'chart-bar',
        'chart-line': 'chart-line',
        'comments': 'comments',
        'globe': 'globe',
        'globe-americas': 'globe',
        'headset': 'headset',
        'hospital': 'hospital',
        'house-chimney': 'house-chimney',
        'home': 'house-chimney',
        'id-badge': 'id-badge',
        'laptop': 'laptop',
        'lightbulb': 'lightbulb',
        'lock': 'lock',
        'magnifying-glass': 'magnifying-glass',
        'search': 'magnifying-glass',
        'map-marker-alt': 'map-marker-alt',
        'map-pin': 'map-marker-alt',
        'paper-plane': 'paper-plane',
        'send': 'paper-plane',
        'percent': 'percent',
        'plane-departure': 'plane-departure',
        'rotate': 'rotate',
        'rupee-sign': 'rupee',
        'indian-rupee': 'rupee',
        'rupee': 'rupee',
        'stethoscope': 'stethoscope'
    };

    /**
     * Resolves the canonical icon name from element attributes or classes
     */
    function resolveIconName(el) {
        if (el.dataset.appleIcon) return el.dataset.appleIcon;
        if (el.dataset.lucide) return el.dataset.lucide;

        for (const cls of el.classList) {
            if (cls.startsWith('fa-')) {
                const raw = cls.substring(3);
                if (ALIASES[raw]) return ALIASES[raw];
                if (VPS_ICONS[raw]) return raw;
            }
            if (cls.startsWith('apple-icon-')) {
                const raw = cls.substring(11);
                if (VPS_ICONS[raw]) return raw;
            }
        }
        return null;
    }

    /**
     * Renders a bespoke vector SVG icon in place of a DOM element
     */
    function renderIcon(el) {
        if (el.tagName.toLowerCase() === 'svg' && el.classList.contains('apple-icon')) {
            return;
        }

        const iconName = resolveIconName(el);
        if (!iconName) return;

        const targetKey = ALIASES[iconName] || iconName;
        const innerContent = VPS_ICONS[targetKey];
        if (!innerContent) return;

        const isSolid = targetKey === 'whatsapp';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');

        if (isSolid) {
            svg.setAttribute('fill', 'currentColor');
            svg.setAttribute('stroke', 'none');
        } else {
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '1.8');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');
        }

        // Copy preserved classes and add apple-icon classes
        const preservedClasses = Array.from(el.classList).filter(
            c => !c.startsWith('fa') && !c.startsWith('fas') && !c.startsWith('fab') && !c.startsWith('far')
        );

        const classList = ['apple-icon', `apple-icon-${targetKey}`, ...preservedClasses];
        if (isSolid) classList.push('apple-icon-solid');

        svg.setAttribute('class', classList.join(' '));

        if (el.getAttribute('style')) {
            svg.setAttribute('style', el.getAttribute('style'));
        }
        if (el.id) svg.id = el.id;

        svg.innerHTML = innerContent;
        if (el.parentNode) {
            el.parentNode.replaceChild(svg, el);
        }
    }

    /**
     * Scans and renders all icon placeholders in container
     */
    function renderAll(root = document) {
        const selector = 'i[class*="fa-"], span[class*="fa-"], [data-apple-icon], [data-lucide]';
        const elements = root.querySelectorAll(selector);
        elements.forEach(renderIcon);
    }

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => renderAll());
    } else {
        renderAll();
    }

    // Dynamic content observer for popups, modals, calculators, and tab switches
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    renderAll(node);
                }
            }
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // Expose global namespace
    window.AppleIcons = {
        render: renderAll,
        icons: VPS_ICONS
    };

    // Lucide fallback compatibility
    window.lucide = {
        createIcons: renderAll
    };
})();
