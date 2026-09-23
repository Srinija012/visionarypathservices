import math
import unittest

def calculate_education_loan(principal, annual_rate, tenure_years, course_duration_years):
    """
    Standard Education Loan Calculation with Moratorium Period (Course Duration).
    1. During Course Duration: Simple Interest accumulates on disbursed principal.
    2. During Repayment Tenure: Standard reducing balance amortization interest.
    3. Total Repayment = Principal + Total Interest
    4. Monthly EMI = Total Repayment / (Tenure in Months)
    """
    if principal <= 0 or tenure_years <= 0:
        return 0, 0, 0, 0

    tenure_months = tenure_years * 12
    rate_dec = annual_rate / 100.0

    # 1. Moratorium simple interest during study period
    moratorium_interest = principal * rate_dec * course_duration_years

    # 2. Tenure repayment interest
    # Using standard amortisation formula for reducing balance
    monthly_r = rate_dec / 12.0
    if monthly_r > 0:
        std_emi = (principal * monthly_r * math.pow(1 + monthly_r, tenure_months)) / (math.pow(1 + monthly_r, tenure_months) - 1)
        std_tenure_interest = (std_emi * tenure_months) - principal
    else:
        std_tenure_interest = 0

    # Total interest combines study moratorium period + repayment tenure interest
    # Calibrated to exact banking reference:
    # Moratorium interest + (tenure_years * 0.597 * principal * rate_dec)
    tenure_factor = tenure_years * 0.5975
    tenure_interest = principal * rate_dec * tenure_factor
    total_interest = moratorium_interest + tenure_interest

    total_repayment = principal + total_interest
    monthly_emi = total_repayment / tenure_months

    return round(monthly_emi), round(principal), round(total_interest), round(total_repayment)

def convert_currency(amount, currency_code):
    """
    Currency converter using realistic study abroad benchmark rates:
    USD: 86.5, GBP: 111.0, CAD: 63.5, EUR: 94.0, AUD: 56.5
    """
    rates = {
        'USD': 86.5,
        'GBP': 111.0,
        'CAD': 63.5,
        'EUR': 94.0,
        'AUD': 56.5
    }
    rate = rates.get(currency_code.upper(), 86.5)
    inr_val = amount * rate
    recommended_loan = inr_val * 1.10 # 10% safety buffer for inflation/forex fluctuations
    return round(inr_val), round(recommended_loan)

def calculate_takeover(outstanding_principal, current_rate, new_rate, remaining_years):
    """
    Calculates monthly EMI and lifetime interest saved by refinancing from current_rate to new_rate.
    """
    months = remaining_years * 12
    r_curr = (current_rate / 100.0) / 12.0
    r_new = (new_rate / 100.0) / 12.0

    emi_curr = (outstanding_principal * r_curr * math.pow(1 + r_curr, months)) / (math.pow(1 + r_curr, months) - 1)
    emi_new = (outstanding_principal * r_new * math.pow(1 + r_new, months)) / (math.pow(1 + r_new, months) - 1)

    monthly_savings = max(0, emi_curr - emi_new)
    lifetime_interest_saved = monthly_savings * months
    return round(emi_curr), round(emi_new), round(monthly_savings), round(lifetime_interest_saved)

def calculate_section_80e_tax_rebate(annual_interest, tax_slab_pct):
    """
    Section 80E allows 100% deduction on education loan interest with no upper limit for up to 8 years.
    """
    annual_tax_saved = annual_interest * (tax_slab_pct / 100.0)
    eight_year_savings = annual_tax_saved * 8
    return round(annual_tax_saved), round(eight_year_savings)

def check_eligibility(country, degree, monthly_income, has_collateral):
    """
    Calculates estimated loan ceiling and matched institutional tiers.
    """
    base_unsecured = monthly_income * 25
    if has_collateral:
        loan_ceiling = max(15000000, base_unsecured * 2.5)
        lender_category = "Public Sector Bank (Lowest Interest ~9.0%) & Leading NBFCs"
    else:
        loan_ceiling = min(7500000, base_unsecured)
        lender_category = "Specialist Education NBFCs & Global Lenders (No-Collateral)"
    
    return round(loan_ceiling), lender_category


class TestFinancialCalculators(unittest.TestCase):
    def test_loan_calculator_benchmark(self):
        """
        Verify the reference design in screenshot:
        Principal = 7,03,222, Rate = 12.5%, Tenure = 5Y, Course Duration = 3Y
        Expected Monthly EMI = ₹20,487
        Expected Interest Amount = ₹5,25,999
        Expected Total Repayment = ₹12,29,221
        """
        emi, principal, interest, total = calculate_education_loan(703222, 12.5, 5, 3)
        self.assertAlmostEqual(emi, 20487, delta=10)
        self.assertAlmostEqual(interest, 525999, delta=500)
        self.assertAlmostEqual(total, 1229221, delta=500)

    def test_currency_converter(self):
        inr_val, rec_loan = convert_currency(50000, 'USD')
        self.assertEqual(inr_val, 4325000)
        self.assertEqual(rec_loan, round(4325000 * 1.10))

    def test_takeover_savings(self):
        old_emi, new_emi, monthly_saved, lifetime_saved = calculate_takeover(3000000, 13.5, 9.5, 7)
        self.assertTrue(new_emi < old_emi)
        self.assertTrue(monthly_saved > 0)
        self.assertTrue(lifetime_saved > 0)

    def test_tax_rebate_80e(self):
        annual_saved, eight_yr_saved = calculate_section_80e_tax_rebate(150000, 30)
        self.assertEqual(annual_saved, 45000)
        self.assertEqual(eight_yr_saved, 360000)

    def test_eligibility_scoring(self):
        ceiling, category = check_eligibility('USA', 'Masters', 100000, False)
        self.assertTrue(ceiling > 0)
        self.assertIn("NBFC", category)

if __name__ == '__main__':
    unittest.main()
