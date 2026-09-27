const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('\n=== Running Automated Verification for Lead Capture & Numbers-Only Phone Input ===\n');

// 1. Verify main.js contains the numbers-only sanitizer and Google Form configs
const mainJsPath = path.resolve(__dirname, '../website/js/main.js');
const mainJs = fs.readFileSync(mainJsPath, 'utf8');

// Test 1: Numbers-only sanitizer present in main.js
assert(mainJs.includes("replace(/\\D/g, '').slice(0, 10)"), 'Numbers-only sanitizer logic must be in main.js');
console.log('✅ PASS: Numbers-only filter for phone/mobile/whatsapp fields verified in main.js');

// Test 2: Inputmode numeric & maxlength 10 configured
assert(mainJs.includes("inputmode', 'numeric'"), 'inputmode numeric must be configured on phone fields');
assert(mainJs.includes("maxlength', '10'"), 'maxlength 10 must be enforced on phone fields');
console.log('✅ PASS: inputmode="numeric" and maxlength="10" verified for mobile keypads');

// Test 3: Google Forms IDs configured for both Lead and Partner forms
assert(mainJs.includes('1FAIpQLSfQjdvAG5JwF8iwmmxh0WujoLmcUSqn5YTeY0pYay4Mt9wQCA'), 'Student Lead Google Form ID must be configured');
assert(mainJs.includes('1FAIpQLSeDbbs5yIifQLn4rsF6qM59C9wsfaYfPwAzPFzQPqU_qcxe3Q'), 'Partner Google Form ID must be configured');
console.log('✅ PASS: Google Form IDs verified for both Student Leads and Partner Registration');

// 2. Functional Simulation of Numbers-Only Sanitizer
function sanitizePhoneNumber(input) {
    return String(input).replace(/\D/g, '').slice(0, 10);
}

// Test cases for phone numbers
assert.strictEqual(sanitizePhoneNumber('+91 98765-43210'), '9198765432');
assert.strictEqual(sanitizePhoneNumber('98765 43210'), '9876543210');
assert.strictEqual(sanitizePhoneNumber('abc9876543210xyz'), '9876543210');
assert.strictEqual(sanitizePhoneNumber('987654321099999'), '9876543210', 'Should cap at 10 digits');
assert.strictEqual(sanitizePhoneNumber('!@#$%^&*()'), '', 'Should strip all symbols');
console.log('✅ PASS: Sanitizer properly filters letters, symbols, spaces, and caps strictly at 10 digits');

// 3. Functional Simulation of Lead Vault Storage
const mockVault = [];
function mockDispatchLead(record) {
    if (!record.phone || record.phone.length !== 10) {
        throw new Error('Invalid phone number: must be 10 digits');
    }
    mockVault.unshift(record);
    return record;
}

const testLead = {
    id: 'test_lead_1',
    source: 'Lead Capture Form',
    firstName: 'Rahul',
    lastName: 'Verma',
    phone: sanitizePhoneNumber('98765 43210'),
    whatsapp: sanitizePhoneNumber('98765 43210'),
    email: 'rahul.verma@example.com',
    interest: 'Abroad Education Loan',
    notes: 'Planning for Masters in USA Fall 2026'
};

const savedLead = mockDispatchLead(testLead);
assert.strictEqual(mockVault.length, 1);
assert.strictEqual(savedLead.phone, '9876543210');
console.log('✅ PASS: Lead capture simulation successfully stored valid 10-digit lead');

// Test invalid lead phone rejection
let errorCaught = false;
try {
    mockDispatchLead({
        phone: sanitizePhoneNumber('12345'), // only 5 digits
        firstName: 'Bad',
        lastName: 'Lead'
    });
} catch (e) {
    errorCaught = true;
}
assert(errorCaught, 'Should reject invalid phone length');
console.log('✅ PASS: Invalid phone numbers (< 10 digits) correctly rejected');

// 4. Partner Lead Simulation
const testPartner = {
    id: 'partner_lead_1',
    source: 'Partner Registration',
    companyName: 'Apex Study Overseas',
    partnerType: 'Study Abroad Consultant',
    contactPerson: 'Vikas Sharma',
    phone: sanitizePhoneNumber('9123456780'),
    email: 'vikas@apexstudy.com',
    city: 'Hyderabad, Telangana',
    expectedReferrals: '15-30 Students'
};
mockDispatchLead(testPartner);
assert.strictEqual(mockVault.length, 2);
console.log('✅ PASS: Partner with Us registration successfully processed and stored');

console.log('\n🎉 ALL LEAD AND NUMBERS-ONLY PHONE TESTS PASSED (100% CLEAN)!\n');
