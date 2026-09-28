const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.resolve(__dirname, '../website');

const PAGE_MESSAGES = {
    'index.html': {
        inPage: 'Hello Visionary Path Services, I visited your website and would like expert guidance on education loan options and eligibility for higher studies. Please assist me.',
        floating: 'Hello Visionary Path Services, I would like to get expert guidance regarding education loan options and eligibility for higher studies. Please assist me.'
    },
    '404.html': {
        inPage: 'Hello Visionary Path Services, I was browsing your website and would like to speak with an education loan advisor.',
        floating: 'Hello Visionary Path Services, I would like to get expert guidance regarding education loan options and eligibility for higher studies. Please assist me.'
    },
    'pages/abroad-loans.html': {
        inPage: 'Hello Visionary Path Services, I am looking for an education loan for my study abroad plans (secured & unsecured options). Could you please help me check my eligibility and interest rates?',
        floating: 'Hello Visionary Path Services, I am looking for an education loan for my study abroad plans. Please assist me.'
    },
    'pages/domestic-loans.html': {
        inPage: 'Hello Visionary Path Services, I am looking for an education loan for higher studies in India. Could you please guide me on bank options, interest rates, and eligibility?',
        floating: 'Hello Visionary Path Services, I am looking for an education loan for higher studies in India. Please guide me.'
    },
    'pages/mbbs-loans.html': {
        inPage: 'Hello Visionary Path Services, I am seeking guidance on an education loan for MBBS studies (India / Abroad). Could you please share the eligible lenders and financing details?',
        floating: 'Hello Visionary Path Services, I am seeking guidance on an education loan for MBBS studies. Please assist me.'
    },
    'pages/other-loans.html': {
        inPage: 'Hello Visionary Path Services, I am looking for assistance with education loan services and forex/ancillary support. Could you please guide me?',
        floating: 'Hello Visionary Path Services, I am looking for assistance with education loan services and forex support. Please guide me.'
    },
    'pages/calculators.html': {
        inPage: 'Hello Visionary Path Services, I used the education loan calculators on your website and would like a personalized eligibility assessment and lender comparison. Please guide me.',
        floating: 'Hello Visionary Path Services, I used the education loan calculators on your website and would like loan guidance. Please assist me.'
    },
    'pages/partner-lenders.html': {
        inPage: 'Hello Visionary Path Services, I would like to know which partner bank or NBFC is best suited for my education loan profile. Could you please advise me?',
        floating: 'Hello Visionary Path Services, I would like guidance on selecting the best partner lender for my education loan. Please assist me.'
    },
    'pages/partner-with-us.html': {
        inPage: 'Hello Visionary Path Services, I am interested in partnering with Visionary Path Services as an education consultant / institutional partner. Could we connect?',
        floating: 'Hello Visionary Path Services, I am interested in partnering with Visionary Path Services. Could we connect?'
    },
    'pages/services.html': {
        inPage: 'Hello Visionary Path Services, I would like expert guidance regarding your education loan services and lender options. Please assist me.',
        floating: 'Hello Visionary Path Services, I would like expert guidance regarding your education loan services. Please assist me.'
    },
    'pages/contact.html': {
        inPage: 'Hello Visionary Path Services, I visited your website and would like to speak directly with an education loan counselor. Please assist me.',
        floating: 'Hello Visionary Path Services, I visited your website and would like to speak directly with an education loan counselor. Please assist me.'
    },
    'pages/about.html': {
        inPage: 'Hello Visionary Path Services, I would like to consult with an education loan advisor regarding higher education financing options and eligibility. Please assist me.',
        floating: 'Hello Visionary Path Services, I would like to consult with an education loan advisor regarding higher education financing options and eligibility. Please assist me.'
    },
    'pages/blog.html': {
        inPage: 'Hello Visionary Path Services, I was browsing your education loan blog and would like to consult with an advisor regarding my loan requirements.',
        floating: 'Hello Visionary Path Services, I was browsing your education loan blog and would like to consult with an advisor regarding my loan requirements.'
    },
    'pages/blogs/education-loan-for-study-in-usa.html': {
        inPage: 'Hello Visionary Path Services, I was reading your USA education loan guide and would like to check my loan eligibility for US universities.',
        floating: 'Hello Visionary Path Services, I was reading your USA education loan guide and would like to check my loan eligibility for US universities.'
    },
    'pages/blogs/how-does-cibil-score-affect-your-education-loan.html': {
        inPage: 'Hello Visionary Path Services, I read your article on CIBIL scores and would like an expert assessment of my loan eligibility.',
        floating: 'Hello Visionary Path Services, I read your article on CIBIL scores and would like an expert assessment of my loan eligibility.'
    },
    'pages/blogs/collateral-vs-non-collateral-education-loan.html': {
        inPage: 'Hello Visionary Path Services, I want to compare secured vs unsecured education loan options for my higher studies.',
        floating: 'Hello Visionary Path Services, I want to compare secured vs unsecured education loan options for my higher studies.'
    },
    'pages/privacy-policy.html': {
        inPage: 'Hello Visionary Path Services, I would like to get expert guidance regarding education loan options and eligibility for higher studies. Please assist me.',
        floating: 'Hello Visionary Path Services, I would like to get expert guidance regarding education loan options and eligibility for higher studies. Please assist me.'
    },
    'pages/terms-and-conditions.html': {
        inPage: 'Hello Visionary Path Services, I would like to get expert guidance regarding education loan options and eligibility for higher studies. Please assist me.',
        floating: 'Hello Visionary Path Services, I would like to get expert guidance regarding education loan options and eligibility for higher studies. Please assist me.'
    },
    'pages/disclaimer.html': {
        inPage: 'Hello Visionary Path Services, I would like to get expert guidance regarding education loan options and eligibility for higher studies. Please assist me.',
        floating: 'Hello Visionary Path Services, I would like to get expert guidance regarding education loan options and eligibility for higher studies. Please assist me.'
    }
};

let filesUpdated = 0;

for (const [relPath, msgs] of Object.entries(PAGE_MESSAGES)) {
    const filePath = path.join(WEBSITE_DIR, relPath);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    const inPageEnc = encodeURIComponent(msgs.inPage);
    const floatEnc = encodeURIComponent(msgs.floating);

    // 1. Update floating WhatsApp buttons
    // Look for <a href="https://wa.me/918150949070" ... class="whatsapp-float" or similar
    const floatRegex = /<a\s+href="https:\/\/wa\.me\/918150949070(?:\?[^"]*)?"([^>]*class="[^"]*whatsapp-float[^"]*"[^>]*)>/gi;
    if (floatRegex.test(content)) {
        content = content.replace(floatRegex, (match, rest) => {
            return `<a href="https://wa.me/918150949070?text=${floatEnc}"${rest}>`;
        });
        modified = true;
    }

    // Also floating button where class is before href:
    const floatRegex2 = /<a\s+([^>]*class="[^"]*whatsapp-float[^"]*"[^>]*)href="https:\/\/wa\.me\/918150949070(?:\?[^"]*)?"([^>]*)>/gi;
    if (floatRegex2.test(content)) {
        content = content.replace(floatRegex2, (match, pre, post) => {
            return `<a ${pre}href="https://wa.me/918150949070?text=${floatEnc}"${post}>`;
        });
        modified = true;
    }

    // Update bottom CTA bar WhatsApp button
    const ctaBarWaRegex = /<a\s+href="https:\/\/wa\.me\/918150949070(?:\?[^"]*)?"([^>]*class="[^"]*cta-btn-whatsapp[^"]*"[^>]*)>/gi;
    if (ctaBarWaRegex.test(content)) {
        content = content.replace(ctaBarWaRegex, (match, rest) => {
            return `<a href="https://wa.me/918150949070?text=${floatEnc}"${rest}>`;
        });
        modified = true;
    }

    // 2. Also check if blog sidebar wa link with 9063703038 exists
    const blogSidebarRegex = /<a\s+href="https:\/\/wa\.me\/919063703038(?:\?[^"]*)?"([^>]*class="[^"]*sidebar-wa-btn[^"]*"[^>]*)>/gi;
    if (blogSidebarRegex.test(content)) {
        content = content.replace(blogSidebarRegex, (match, rest) => {
            return `<a href="https://wa.me/918150949070?text=${inPageEnc}"${rest}>`;
        });
        modified = true;
    }

    // 3. Update any other in-page bare wa.me links that do not have ?text=
    // Match href="https://wa.me/918150949070"
    if (content.includes('href="https://wa.me/918150949070"')) {
        content = content.replace(/href="https:\/\/wa\.me\/918150949070"/g, `href="https://wa.me/918150949070?text=${inPageEnc}"`);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`[UPDATED] ${relPath}`);
        filesUpdated++;
    }
}

console.log(`\nUpdated WhatsApp CTA links in ${filesUpdated} files.`);
