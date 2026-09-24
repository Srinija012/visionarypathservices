/**
 * VISIONARY PATH SERVICES - Financial Tools & Calculators Suite
 * 1. Education Loan Calculator (with Moratorium & Amortisation)
 * 2. INR / USD Currency & Living Expense Planner
 * 3. Loan Takeover / Refinancing Savings Calculator
 * 4. Section 80E Tax Rebate Calculator
 * 5. Profile Loan Eligibility Feasibility Checker
 */

(function () {
    'use strict';

    // --- Formatters & Helpers ---
    function formatINR(number) {
        if (isNaN(number) || number === null) return '₹0';
        const num = Math.round(number);
        // Format with Indian Rupee grouping (e.g., 7,03,222)
        const parts = num.toString().split('.');
        let lastThree = parts[0].substring(parts[0].length - 3);
        const otherNumbers = parts[0].substring(0, parts[0].length - 3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
        return '₹' + formatted;
    }

    function parseNumeric(val) {
        if (!val) return 0;
        const cleaned = val.toString().replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
    }

    function updateSliderTrack(slider) {
        if (!slider) return;
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value) || 0;
        const pct = ((val - min) / (max - min)) * 100;
        // Using brand primary green (#059669) and light gray (#e2e8f0)
        slider.style.background = `linear-gradient(to right, #059669 0%, #059669 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;
    }

    // --- Tab Switching ---
    const tabButtons = document.querySelectorAll('.calc-tab-btn');
    const tabPanels = document.querySelectorAll('.calc-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.getAttribute('data-tab');
            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(p => {
                p.classList.remove('active');
                p.hidden = true;
            });

            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                targetPanel.hidden = false;
            }
        });
    });

    // ========================================================
    // 1. EDUCATION LOAN CALCULATOR
    // ========================================================
    const loanAmountSlider = document.getElementById('calcLoanAmountSlider');
    const loanAmountInput = document.getElementById('calcLoanAmountInput');
    const interestRateSlider = document.getElementById('calcInterestRateSlider');
    const interestRateInput = document.getElementById('calcInterestRateInput');
    const tenureSlider = document.getElementById('calcTenureSlider');
    const tenureInput = document.getElementById('calcTenureInput');
    const courseDurationSlider = document.getElementById('calcCourseDurationSlider');
    const courseDurationInput = document.getElementById('calcCourseDurationInput');

    const emiResultElem = document.getElementById('calcEmiResult');
    const principalResultElem = document.getElementById('calcPrincipalResult');
    const interestResultElem = document.getElementById('calcInterestResult');
    const totalRepayResultElem = document.getElementById('calcTotalRepayResult');

    function calculateLoan() {
        if (!loanAmountSlider) return;
        const principal = parseFloat(loanAmountSlider.value) || 703222;
        const annualRate = parseFloat(interestRateSlider.value) || 12.5;
        const tenureYears = parseFloat(tenureSlider.value) || 5;
        const courseYears = parseFloat(courseDurationSlider.value) || 3;

        const rateDec = annualRate / 100.0;
        const tenureMonths = tenureYears * 12;

        // 1. Moratorium simple interest during study period
        const moratoriumInterest = principal * rateDec * courseYears;
        // 2. Repayment tenure interest (reducing balance amortisation approximation factor)
        const tenureInterest = principal * rateDec * (tenureYears * 0.5975);
        const totalInterest = moratoriumInterest + tenureInterest;

        const totalRepayment = principal + totalInterest;
        const monthlyEmi = totalRepayment / tenureMonths;

        if (emiResultElem) emiResultElem.textContent = formatINR(monthlyEmi);
        if (principalResultElem) principalResultElem.textContent = formatINR(principal);
        if (interestResultElem) interestResultElem.textContent = formatINR(totalInterest);
        if (totalRepayResultElem) totalRepayResultElem.textContent = formatINR(totalRepayment);

        updateSliderTrack(loanAmountSlider);
        updateSliderTrack(interestRateSlider);
        updateSliderTrack(tenureSlider);
        updateSliderTrack(courseDurationSlider);
    }

    if (loanAmountSlider && loanAmountInput) {
        loanAmountSlider.addEventListener('input', function () {
            loanAmountInput.value = formatINR(this.value);
            calculateLoan();
        });
        loanAmountInput.addEventListener('change', function () {
            let val = parseNumeric(this.value);
            if (val < 100000) val = 100000;
            if (val > 10000000) val = 10000000;
            loanAmountSlider.value = val;
            this.value = formatINR(val);
            calculateLoan();
        });
    }

    if (interestRateSlider && interestRateInput) {
        interestRateSlider.addEventListener('input', function () {
            interestRateInput.value = this.value;
            calculateLoan();
        });
        interestRateInput.addEventListener('change', function () {
            let val = parseFloat(this.value) || 9.5;
            if (val < 8.5) val = 8.5;
            if (val > 16.0) val = 16.0;
            interestRateSlider.value = val;
            this.value = val;
            calculateLoan();
        });
    }

    if (tenureSlider && tenureInput) {
        tenureSlider.addEventListener('input', function () {
            tenureInput.value = this.value + 'Y';
            calculateLoan();
        });
        tenureInput.addEventListener('change', function () {
            let val = parseInt(this.value) || 5;
            if (val < 1) val = 1;
            if (val > 15) val = 15;
            tenureSlider.value = val;
            this.value = val + 'Y';
            calculateLoan();
        });
    }

    if (courseDurationSlider && courseDurationInput) {
        courseDurationSlider.addEventListener('input', function () {
            courseDurationInput.value = this.value + 'Y';
            calculateLoan();
        });
        courseDurationInput.addEventListener('change', function () {
            let val = parseInt(this.value) || 3;
            if (val < 1) val = 1;
            if (val > 5) val = 5;
            courseDurationSlider.value = val;
            this.value = val + 'Y';
            calculateLoan();
        });
    }

    // ========================================================
    // 2. INR / USD CURRENCY & BUDGET PLANNER
    // ========================================================
    const currSelect = document.getElementById('currSelect');
    const tuitionAmountInput = document.getElementById('currTuitionInput');
    const livingAmountInput = document.getElementById('currLivingInput');
    const currInrTotalElem = document.getElementById('currInrTotal');
    const currTuitionInrElem = document.getElementById('currTuitionInr');
    const currLivingInrElem = document.getElementById('currLivingInr');
    const currRecLoanElem = document.getElementById('currRecLoan');
    const currSymbolElem = document.getElementById('currSymbolDisplay');

    const rates = {
        USD: { rate: 86.50, symbol: '$' },
        GBP: { rate: 111.00, symbol: '£' },
        CAD: { rate: 63.50, symbol: 'C$' },
        EUR: { rate: 94.00, symbol: '€' },
        AUD: { rate: 56.50, symbol: 'A$' }
    };

    function calculateCurrency() {
        if (!currSelect) return;
        const cur = currSelect.value || 'USD';
        const curData = rates[cur] || rates.USD;
        if (currSymbolElem) currSymbolElem.textContent = curData.symbol;

        const tuitionForeign = parseFloat(tuitionAmountInput.value) || 0;
        const livingForeign = parseFloat(livingAmountInput.value) || 0;

        const tuitionInr = tuitionForeign * curData.rate;
        const livingInr = livingForeign * curData.rate;
        const totalInr = tuitionInr + livingInr;
        const recommendedLoan = totalInr * 1.10; // 10% safety buffer

        if (currTuitionInrElem) currTuitionInrElem.textContent = formatINR(tuitionInr);
        if (currLivingInrElem) currLivingInrElem.textContent = formatINR(livingInr);
        if (currInrTotalElem) currInrTotalElem.textContent = formatINR(totalInr);
        if (currRecLoanElem) currRecLoanElem.textContent = formatINR(recommendedLoan);
    }

    if (currSelect) currSelect.addEventListener('change', calculateCurrency);
    if (tuitionAmountInput) tuitionAmountInput.addEventListener('input', calculateCurrency);
    if (livingAmountInput) livingAmountInput.addEventListener('input', calculateCurrency);

    // ========================================================
    // 3. LOAN TAKEOVER / REFINANCING CALCULATOR
    // ========================================================
    const toPrincipalSlider = document.getElementById('toPrincipalSlider');
    const toPrincipalInput = document.getElementById('toPrincipalInput');
    const toCurrRateSlider = document.getElementById('toCurrRateSlider');
    const toCurrRateInput = document.getElementById('toCurrRateInput');
    const toNewRateSlider = document.getElementById('toNewRateSlider');
    const toNewRateInput = document.getElementById('toNewRateInput');
    const toTenureSlider = document.getElementById('toTenureSlider');
    const toTenureInput = document.getElementById('toTenureInput');

    const toMonthlySavedElem = document.getElementById('toMonthlySaved');
    const toLifetimeSavedElem = document.getElementById('toLifetimeSaved');
    const toOldEmiElem = document.getElementById('toOldEmi');
    const toNewEmiElem = document.getElementById('toNewEmi');

    function calculateTakeover() {
        if (!toPrincipalSlider) return;
        const principal = parseFloat(toPrincipalSlider.value) || 3000000;
        const currRate = parseFloat(toCurrRateSlider.value) || 13.5;
        const newRate = parseFloat(toNewRateSlider.value) || 9.5;
        const tenureYears = parseFloat(toTenureSlider.value) || 7;

        const months = tenureYears * 12;
        const rCurr = (currRate / 100.0) / 12.0;
        const rNew = (newRate / 100.0) / 12.0;

        const emiCurr = (principal * rCurr * Math.pow(1 + rCurr, months)) / (Math.pow(1 + rCurr, months) - 1);
        const emiNew = (principal * rNew * Math.pow(1 + rNew, months)) / (Math.pow(1 + rNew, months) - 1);

        const monthlySavings = Math.max(0, emiCurr - emiNew);
        const lifetimeSaved = monthlySavings * months;

        if (toMonthlySavedElem) toMonthlySavedElem.textContent = formatINR(monthlySavings);
        if (toLifetimeSavedElem) toLifetimeSavedElem.textContent = formatINR(lifetimeSaved);
        if (toOldEmiElem) toOldEmiElem.textContent = formatINR(emiCurr);
        if (toNewEmiElem) toNewEmiElem.textContent = formatINR(emiNew);

        updateSliderTrack(toPrincipalSlider);
        updateSliderTrack(toCurrRateSlider);
        updateSliderTrack(toNewRateSlider);
        updateSliderTrack(toTenureSlider);
    }

    if (toPrincipalSlider && toPrincipalInput) {
        toPrincipalSlider.addEventListener('input', function () {
            toPrincipalInput.value = formatINR(this.value);
            calculateTakeover();
        });
        toPrincipalInput.addEventListener('change', function () {
            let val = parseNumeric(this.value);
            if (val < 500000) val = 500000;
            if (val > 15000000) val = 15000000;
            toPrincipalSlider.value = val;
            this.value = formatINR(val);
            calculateTakeover();
        });
    }

    if (toCurrRateSlider && toCurrRateInput) {
        toCurrRateSlider.addEventListener('input', function () {
            toCurrRateInput.value = this.value + '%';
            calculateTakeover();
        });
    }

    if (toNewRateSlider && toNewRateInput) {
        toNewRateSlider.addEventListener('input', function () {
            toNewRateInput.value = this.value + '%';
            calculateTakeover();
        });
    }

    if (toTenureSlider && toTenureInput) {
        toTenureSlider.addEventListener('input', function () {
            toTenureInput.value = this.value + 'Y';
            calculateTakeover();
        });
    }

    // ========================================================
    // 4. SECTION 80E TAX REBATE CALCULATOR
    // ========================================================
    const taxInterestSlider = document.getElementById('taxInterestSlider');
    const taxInterestInput = document.getElementById('taxInterestInput');
    const taxSlabSelect = document.getElementById('taxSlabSelect');
    const taxAnnualSavedElem = document.getElementById('taxAnnualSaved');
    const taxEightYearSavedElem = document.getElementById('taxEightYearSaved');
    const taxNetRateElem = document.getElementById('taxNetRate');

    function calculateTax() {
        if (!taxInterestSlider) return;
        const annualInterest = parseFloat(taxInterestSlider.value) || 150000;
        const slabPct = parseFloat(taxSlabSelect.value) || 30;

        const annualTaxSaved = annualInterest * (slabPct / 100.0);
        const eightYearSavings = annualTaxSaved * 8;
        // Estimated effective interest rate drop
        const baseNominalRate = 11.5;
        const effectiveRate = baseNominalRate * (1 - (slabPct / 100.0));

        if (taxAnnualSavedElem) taxAnnualSavedElem.textContent = formatINR(annualTaxSaved);
        if (taxEightYearSavedElem) taxEightYearSavedElem.textContent = formatINR(eightYearSavings);
        if (taxNetRateElem) taxNetRateElem.textContent = effectiveRate.toFixed(2) + '%';

        updateSliderTrack(taxInterestSlider);
    }

    if (taxInterestSlider && taxInterestInput) {
        taxInterestSlider.addEventListener('input', function () {
            taxInterestInput.value = formatINR(this.value);
            calculateTax();
        });
        taxInterestInput.addEventListener('change', function () {
            let val = parseNumeric(this.value);
            if (val < 20000) val = 20000;
            if (val > 1000000) val = 1000000;
            taxInterestSlider.value = val;
            this.value = formatINR(val);
            calculateTax();
        });
    }

    if (taxSlabSelect) taxSlabSelect.addEventListener('change', calculateTax);

    // ========================================================
    // 5. LOAN ELIGIBILITY CHECKER
    // ========================================================
    const eligCountry = document.getElementById('eligCountry');
    const eligDegree = document.getElementById('eligDegree');
    const eligIncomeSlider = document.getElementById('eligIncomeSlider');
    const eligIncomeInput = document.getElementById('eligIncomeInput');
    const eligCollateral = document.getElementById('eligCollateral');
    const eligMaxLoanElem = document.getElementById('eligMaxLoan');
    const eligLenderTypeElem = document.getElementById('eligLenderType');

    function calculateEligibility() {
        if (!eligIncomeSlider) return;
        const monthlyIncome = parseFloat(eligIncomeSlider.value) || 80000;
        const hasCollateral = eligCollateral.value === 'yes';

        const baseCapacity = monthlyIncome * 25;
        let ceiling = 0;
        let lenderType = '';

        if (hasCollateral) {
            ceiling = Math.max(15000000, baseCapacity * 2.5);
            lenderType = 'Public Sector Bank (Lowest Interest ~9.0%) & Leading NBFCs';
        } else {
            ceiling = Math.min(7500000, baseCapacity);
            lenderType = 'Specialist Education NBFCs & Global Lenders (No-Collateral)';
        }

        if (eligMaxLoanElem) eligMaxLoanElem.textContent = formatINR(ceiling);
        if (eligLenderTypeElem) eligLenderTypeElem.textContent = lenderType;

        updateSliderTrack(eligIncomeSlider);
    }

    if (eligIncomeSlider && eligIncomeInput) {
        eligIncomeSlider.addEventListener('input', function () {
            eligIncomeInput.value = formatINR(this.value);
            calculateEligibility();
        });
        eligIncomeInput.addEventListener('change', function () {
            let val = parseNumeric(this.value);
            if (val < 25000) val = 25000;
            if (val > 1000000) val = 1000000;
            eligIncomeSlider.value = val;
            this.value = formatINR(val);
            calculateEligibility();
        });
    }

    if (eligCountry) eligCountry.addEventListener('change', calculateEligibility);
    if (eligDegree) eligDegree.addEventListener('change', calculateEligibility);
    if (eligCollateral) eligCollateral.addEventListener('change', calculateEligibility);

    // Initial triggers on DOM load
    document.addEventListener('DOMContentLoaded', function () {
        calculateLoan();
        calculateCurrency();
        calculateTakeover();
        calculateTax();
        calculateEligibility();
    });

    // Run immediately as well if script loads post-DOM
    calculateLoan();
    calculateCurrency();
    calculateTakeover();
    calculateTax();
    calculateEligibility();

})();
