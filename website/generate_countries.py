import os

countries = [
    {
        "id": "usa",
        "title": "Study in the USA",
        "h1": "Education Loan for <span style=\"color:#1a9c4e\">Study in the USA</span>",
        "subtitle": "Complete financing guidance for MS, MBA, STEM, and undergraduate degrees at top American universities with secured and unsecured loan options up to ₹2 Crores.",
        "flag": "🇺🇸",
        "currency": "USD ($)",
        "tuition": "$25,000 – $60,000 / year",
        "living": "$12,000 – $20,000 / year",
        "max_loan": "Up to ₹1.5 – 2+ Crores",
        "visa_req": "Form I-20 & SEVIS Proof",
        "intro": "The United States remains the premier global destination for higher education, hosting the world's most prestigious universities and cutting-edge research facilities. From Silicon Valley tech leadership to Wall Street finance, a US degree unlocks unparalleled global career pathways. However, funding a US education requires strategic financial planning. At Visionary Path Services, we help Indian students secure optimal education loans from leading public banks, private banks, NBFCs, and international lenders.",
        "stem_opt": "3-Year STEM OPT extension allowing up to 36 months of work authorization in the United States post-graduation.",
        "top_unis": ["MIT", "Stanford University", "Carnegie Mellon", "NYU", "UC Berkeley", "Arizona State University", "UT Austin", "Northeastern University"],
        "loan_highlights": [
            "Collateral-free loans up to ₹60 – 75 Lakhs from leading NBFCs for premier universities",
            "Secured loans up to ₹1.5 – 2 Crores with property or FD collateral at competitive interest rates",
            "Pre-visa sanction letters accepted by US universities for issuing Form I-20",
            "Moratorium period covering course duration plus 6–12 months grace period",
            "Dollar-denominated and international co-signer options available via global partners",
            "Income tax deduction on loan interest paid under Section 80E with no upper limit"
        ],
        "faqs": [
            {
                "q": "Can I get an education loan sanction before receiving my I-20?",
                "a": "Yes! Leading banks and NBFCs issue conditional or pre-admission loan sanction letters based on your GRE/TOEFL/IELTS scores and academic profile. This sanction letter serves as official proof of funds to university international student offices to release your Form I-20."
            },
            {
                "q": "Is collateral mandatory for an education loan for the USA?",
                "a": "No. Premier NBFCs and private banks offer non-collateral loans up to ₹60–75 Lakhs for recognized US universities, evaluated based on the student's GRE score, academic record, and financial co-applicant's income."
            },
            {
                "q": "Does the loan cover living expenses and health insurance in the USA?",
                "a": "Yes. Comprehensive education loans for the USA cover 100% of the cost of attendance listed on your I-20, including tuition fees, accommodation, food, compulsory university health insurance, books, laptop, and round-trip airfare."
            },
            {
                "q": "What is the typical interest rate for USA education loans?",
                "a": "Interest rates generally range from 8.5% to 10.5% for secured loans from public sector banks, and 10.0% to 12.5% for unsecured loans from private banks and NBFCs. Women applicants often receive an additional 0.5% interest concession."
            }
        ]
    },
    {
        "id": "uk",
        "title": "Study in the UK",
        "h1": "Education Loan for <span style=\"color:#1a9c4e\">Study in the UK</span>",
        "subtitle": "Secure education loan options for 1-year Master's, undergraduate, and MBA programs across Russell Group and top British universities.",
        "flag": "🇬🇧",
        "currency": "GBP (£)",
        "tuition": "£15,000 – £35,000 / year",
        "living": "£12,000 – £15,500 / year",
        "max_loan": "Up to ₹1.5 Crores",
        "visa_req": "CAS & 28-Day Fund Rule",
        "intro": "The United Kingdom offers globally recognized degrees, world-class teaching standards, and intensive 1-year Master's programs that significantly reduce overall tuition and living costs. Combined with the 2-Year Graduate Route post-study work visa, the UK delivers an extraordinary return on investment. Visionary Path Services specializes in guiding Indian students through UKVI financial requirements and securing swift loan approvals.",
        "stem_opt": "2-Year Graduate Route post-study work visa for Master's graduates and 3 years for doctoral graduates.",
        "top_unis": ["University of Oxford", "University of Cambridge", "Imperial College London", "UCL", "University of Manchester", "King's College London", "University of Edinburgh", "University of Warwick"],
        "loan_highlights": [
            "Quick 5–7 day sanction letters to fulfill UK university initial deposit requirements",
            "Assistance with UKVI 28-day fund maintenance rule and bank letter formatting",
            "Unsecured loans up to ₹50 – 60 Lakhs for top Russell Group universities",
            "Public bank secured loans with lower interest rates for cost-conscious students",
            "Coverage for tuition, London/Non-London maintenance funds, IHS surcharge, and visa fees",
            "100% free guidance with personalized lender matching for your UK university"
        ],
        "faqs": [
            {
                "q": "What is the UKVI 28-day fund rule and how does an education loan help?",
                "a": "For a UK Student Visa, applicants must demonstrate living expenses and remaining tuition fees maintained in an approved bank account for at least 28 consecutive days. A formal loan disbursement letter from a recognized bank or NBFC is accepted as immediate proof of funds without needing the 28-day aging period."
            },
            {
                "q": "Can I get an education loan for a 1-year Master's program in the UK?",
                "a": "Yes! 1-year Master's programs are among the most popular funded degrees. Lenders structure repayment terms with a course duration moratorium plus an additional grace period before EMIs commence."
            },
            {
                "q": "Does the loan cover the Immigration Health Surcharge (IHS)?",
                "a": "Yes. The loan can cover university tuition fees, living costs, visa application charges, and the mandatory NHS Immigration Health Surcharge."
            }
        ]
    },
    {
        "id": "canada",
        "title": "Study in Canada",
        "h1": "Education Loan for <span style=\"color:#1a9c4e\">Study in Canada</span>",
        "subtitle": "Complete financing solutions covering tuition fees, living expenses, and mandatory GIC account deposits for Canadian universities and colleges.",
        "flag": "🇨🇦",
        "currency": "CAD ($)",
        "tuition": "CAD 20,000 – 45,000 / year",
        "living": "CAD 20,635 / year (GIC)",
        "max_loan": "Up to ₹1 – 1.2 Crores",
        "visa_req": "GIC Certificate & PAL",
        "intro": "Canada is internationally renowned for academic excellence, safe multicultural cities, and progressive post-graduation work opportunities (PGWP). While Canadian education provides exceptional value, recent IRCC guidelines require higher living cost demonstration (CAD 20,635) via a Guaranteed Investment Certificate (GIC). Visionary Path Services helps you secure comprehensive loans that directly fund your first-year tuition and GIC account.",
        "stem_opt": "Post-Graduation Work Permit (PGWP) of up to 3 years depending on program length and qualification.",
        "top_unis": ["University of Toronto", "UBC", "McGill University", "University of Waterloo", "McMaster University", "University of Alberta", "Western University", "Simon Fraser University"],
        "loan_highlights": [
            "Loan disbursement directly into mandatory Canadian GIC accounts (Scotiabank, ICICI Canada, CIBC, RBC)",
            "Unsecured loan options up to ₹40 – 50 Lakhs for university degrees and designated DLI institutions",
            "Competitive interest rates with moratorium period throughout your study program",
            "Coverage for first-year tuition fee receipt required for SDS visa processing",
            "Provincial Attestation Letter (PAL) guidance and document coordination",
            "Transparent processing with zero advisory fees charged to students"
        ],
        "faqs": [
            {
                "q": "Can the education loan fund my Canadian GIC directly?",
                "a": "Yes! Partner banks and NBFCs can disburse the required living expenses directly into your designated Canadian GIC account (such as CIBC or Scotiabank) and provide official remittance documentation for your visa filing."
            },
            {
                "q": "Is an education loan mandatory for Canadian SDS visa category?",
                "a": "While not legally mandatory if personal funds exist, an official education loan sanction letter is considered one of the strongest proofs of genuine funds by Canadian visa officers, significantly enhancing approval rates."
            },
            {
                "q": "What collateral is accepted for high-value loans for Canada?",
                "a": "Tangible collateral such as residential flats, independent houses, non-agricultural land, commercial properties, or bank Fixed Deposits are widely accepted for loans exceeding ₹40–50 Lakhs."
            }
        ]
    },
    {
        "id": "germany",
        "title": "Study in Germany",
        "h1": "Education Loan for <span style=\"color:#1a9c4e\">Study in Germany</span>",
        "subtitle": "Finance your German Blocked Account (Sperrkonto) and living expenses for world-renowned TU9 and public universities.",
        "flag": "🇩🇪",
        "currency": "EUR (€)",
        "tuition": "€0 – €3,000 / year (Public)",
        "living": "€11,904 / year (Blocked Acc)",
        "max_loan": "Up to ₹40 – 60 Lakhs",
        "visa_req": "Blocked Account (€992/mo)",
        "intro": "Germany is the engineering and technological powerhouse of Europe. Public universities in Germany charge zero or negligible tuition fees, making it an exceptionally cost-effective higher education destination. However, every international student must demonstrate living funds through a mandatory German Blocked Account (Sperrkonto) of €11,904 per year. Visionary Path Services helps Indian students secure specialized loans specifically tailored for Blocked Account funding.",
        "stem_opt": "18-month post-study Jobseeker Residence Permit with pathway to EU Blue Card.",
        "top_unis": ["TU Munich (TUM)", "RWTH Aachen", "Heidelberg University", "KIT Karlsruhe", "LMU Munich", "TU Berlin", "University of Stuttgart", "TU Darmstadt"],
        "loan_highlights": [
            "Specialized loan schemes designed to finance German Blocked Accounts (Sperrkonto)",
            "Direct disbursement into verified providers: Expatrio, Coracle, Fintiba, or Kotak Mahindra",
            "Unsecured loans up to ₹25 – 40 Lakhs with minimal margin money requirements",
            "Low overall debt burden due to tuition-free education at premier public institutions",
            "Covers health insurance, semester administrative contributions, and flight tickets",
            "End-to-end guidance from APS certification stage to final visa disbursement"
        ],
        "faqs": [
            {
                "q": "Can I get an education loan if German public universities charge zero tuition fees?",
                "a": "Yes! Indian banks and NBFCs recognize that living expenses in Germany are mandatory and significant. They readily provide education loans to fund the required German Blocked Account (€11,904) plus health insurance and travel costs."
            },
            {
                "q": "How is money transferred to my German Blocked Account?",
                "a": "Once your loan is sanctioned, the lender executes an outward foreign remittance (via SWIFT) directly into your Blocked Account provider (Expatrio, Coracle, Fintiba). You receive a formal '06 Blocked Amount Confirmation' for your visa appointment."
            },
            {
                "q": "What is the APS certificate and when should I apply for my loan?",
                "a": "The APS certificate verifies your Indian academic credentials for German university admissions and visa. You should begin your loan pre-assessment simultaneously so your funds are ready as soon as admission arrives."
            }
        ]
    },
    {
        "id": "australia",
        "title": "Study in Australia",
        "h1": "Education Loan for <span style=\"color:#1a9c4e\">Study in Australia</span>",
        "subtitle": "Hassle-free education financing for top Group of Eight (Go8) and premier universities across Melbourne, Sydney, Brisbane, and Perth.",
        "flag": "🇦🇺",
        "currency": "AUD ($)",
        "tuition": "AUD 28,000 – 50,000 / year",
        "living": "AUD 29,710 / year",
        "max_loan": "Up to ₹1.2 – 1.5 Crores",
        "visa_req": "eCoE & Genuine Student (GS)",
        "intro": "Australia is renowned for high academic standards, multicultural vibrant cities, world-class research institutes, and favorable post-study work rights. Australian universities and the Department of Home Affairs require strict financial capacity verification under the Genuine Student (GS) framework. Visionary Path Services provides the exact financial structuring and rapid loan approvals needed to secure your electronic Confirmation of Enrolment (eCoE).",
        "stem_opt": "Subclass 485 Temporary Graduate Visa offering 2 to 4 years post-study work authorization.",
        "top_unis": ["University of Melbourne", "University of Sydney", "UNSW Sydney", "Australian National University (ANU)", "Monash University", "University of Queensland", "University of Western Australia", "University of Adelaide"],
        "loan_highlights": [
            "Fast pre-visa loan sanction letters accepted for Australian GS (Genuine Student) assessments",
            "Unsecured education loans up to ₹50 – 60 Lakhs for premier Group of Eight institutions",
            "Secured loan limits up to ₹1.5 Crores with attractive interest concessions",
            "Coverage for tuition fee deposits, living costs, OSHC (Overseas Student Health Cover), and airfare",
            "Support with bank documentation conforming to Australian High Commission standards",
            "Experienced advisory team managing lender follow-ups to meet university payment deadlines"
        ],
        "faqs": [
            {
                "q": "What is Genuine Student (GS) and how does my loan affect it?",
                "a": "The Genuine Student (GS) requirement assesses your intention and capability to study in Australia. Demonstrating a sanctioned education loan from an approved Indian bank proves credible financial backing without irregular money transfers, heavily strengthening your visa profile."
            },
            {
                "q": "Does the loan cover OSHC (Overseas Student Health Cover)?",
                "a": "Yes. Comprehensive education loans for Australia cover the full duration of mandatory OSHC, tuition fees, living costs, and travel allowances."
            },
            {
                "q": "Can I get a loan without collateral for Australian universities?",
                "a": "Yes. Several partner NBFCs and private banks offer collateral-free loans up to ₹45–55 Lakhs for recognized universities based on academic merit and co-applicant income."
            }
        ]
    },
    {
        "id": "ireland",
        "title": "Study in Ireland",
        "h1": "Education Loan for <span style=\"color:#1a9c4e\">Study in Ireland</span>",
        "subtitle": "Finance your higher education in Europe's premier technology and pharma hub with fast, student-friendly loan options.",
        "flag": "🇮🇪",
        "currency": "EUR (€)",
        "tuition": "€12,000 – €25,000 / year",
        "living": "€10,000 – €12,000 / year",
        "max_loan": "Up to ₹80 Lakhs – 1 Crore",
        "visa_req": "Full Fee Receipt & Funds Proof",
        "intro": "Ireland has rapidly emerged as a favored study abroad destination for Indian students, celebrated for its English-speaking environment, welcoming culture, and status as the European headquarters for tech giants like Google, Apple, Meta, and Microsoft. Its 1-year Master's programs and 2-year Third Level Graduate Scheme (Stamp 1G) provide an exceptional pathway to international careers. Visionary Path Services guides you to the most suitable financing for Ireland.",
        "stem_opt": "2-Year Third Level Graduate Scheme (Stamp 1G) post-study work visa for Master's graduates.",
        "top_unis": ["Trinity College Dublin (TCD)", "University College Dublin (UCD)", "University of Galway", "University College Cork (UCC)", "Dublin City University (DCU)", "University of Limerick"],
        "loan_highlights": [
            "Quick processing times designed to meet Irish university tuition payment deadlines",
            "Collateral-free loans up to ₹40 – 50 Lakhs for leading Irish universities",
            "Proof of funds letters fully compliant with Irish Immigration Service Delivery (ISD)",
            "Financing covers full tuition, living expenses, private health insurance, and relocation",
            "Moratorium benefit during course duration with convenient repayment tenures up to 15 years",
            "Dedicated guidance with zero service charges for students"
        ],
        "faqs": [
            {
                "q": "What proof of funds is required for an Irish student visa?",
                "a": "Irish immigration requires proof of payment of course fees (or evidence of sufficient funds to cover them) plus immediate access to at least €10,000 for living expenses per year of study. An approved education loan sanction satisfies these criteria."
            },
            {
                "q": "Are there good job opportunities in Ireland after graduation?",
                "a": "Yes. Dublin is known as the Silicon Valley of Europe with high demand for software engineers, data scientists, biopharma specialists, and financial analysts, supported by the 2-year Stamp 1G stay-back visa."
            }
        ]
    },
    {
        "id": "france",
        "title": "Study in France",
        "h1": "Education Loan for <span style=\"color:#1a9c4e\">Study in France</span>",
        "subtitle": "Education loan assistance for elite Grandes Écoles, MBA programs, and English-taught Master's degrees in France.",
        "flag": "🇫🇷",
        "currency": "EUR (€)",
        "tuition": "€8,000 – €25,000 / year",
        "living": "€9,000 – €12,000 / year",
        "max_loan": "Up to ₹80 Lakhs – 1 Crore",
        "visa_req": "Campus France & Financial Proof",
        "intro": "France offers world-leading business schools, prestigious engineering institutions, and a rich cultural heritage. Many top programs are taught entirely in English. Additionally, international students benefit from CAF housing subsidies that offset monthly living costs, alongside a 2-year post-study APS visa (and special 5-year Schengen visa opportunities for Indian alumni). Visionary Path Services helps you navigate Campus France and bank loan approvals seamlessly.",
        "stem_opt": "2-Year Post-study work permit (APS) for Indian Master's graduates with expanded Schengen travel privileges.",
        "top_unis": ["HEC Paris", "INSEAD", "ESSEC Business School", "EDHEC Business School", "Sorbonne University", "École Polytechnique", "emlyon business school", "Grenoble Ecole de Management"],
        "loan_highlights": [
            "Assistance for top triple-accredited European business schools and engineering institutions",
            "Non-collateral loans up to ₹40 – 45 Lakhs for recognized French programs",
            "Secured options at competitive interest rates for multi-year degrees",
            "Funds cover tuition, living expenses, health insurance, and administrative fees",
            "Assistance through Campus France financial documentation standards",
            "100% free counseling and loan structuring"
        ],
        "faqs": [
            {
                "q": "Can I study in France if I don't speak French?",
                "a": "Yes! Hundreds of Master's and MBA programs at top institutions are taught entirely in English. However, learning conversational French during your studies significantly enhances your post-study career prospects."
            },
            {
                "q": "What is the monthly living expense benchmark for a French student visa?",
                "a": "Campus France and French consulates generally require proof of at least €615 to €800 per month for living expenses, easily covered through an education loan."
            }
        ]
    },
    {
        "id": "new-zealand",
        "title": "Study in New Zealand",
        "h1": "Education Loan for <span style=\"color:#1a9c4e\">Study in New Zealand</span>",
        "subtitle": "Tailored education loan solutions covering tuition fees and the ANZ Bank Funds Transfer Scheme (FTS).",
        "flag": "🇳🇿",
        "currency": "NZD ($)",
        "tuition": "NZD 26,000 – 42,000 / year",
        "living": "NZD 20,000 / year (FTS)",
        "max_loan": "Up to ₹80 Lakhs – 1 Crore",
        "visa_req": "FTS & Approval in Principle",
        "intro": "New Zealand provides a globally recognized British-style education system, safe communities, stunning landscapes, and attractive post-study work rights of up to 3 years. Under Immigration New Zealand's Funds Transfer Scheme (FTS), students transfer their first-year living expenses (NZD 20,000) to an ANZ Bank account. Visionary Path Services facilitates loans structured specifically for New Zealand's FTS process and tuition requirements.",
        "stem_opt": "Post-study work visa up to 3 years depending on qualification level and study location.",
        "top_unis": ["University of Auckland", "University of Otago", "Victoria University of Wellington", "University of Canterbury", "Massey University", "University of Waikato", "Lincoln University", "Auckland University of Technology (AUT)"],
        "loan_highlights": [
            "Seamless loan disbursement aligned with ANZ Bank Funds Transfer Scheme (FTS)",
            "Approval in Principle (AIP) visa stage coordination with banks",
            "Collateral and non-collateral loan options from top Indian lenders",
            "Repayment tenures up to 15 years with flexible moratorium periods",
            "Covers tuition fees, living costs, student medical insurance, and travel",
            "Dedicated expert advisors to handle lender verification queries"
        ],
        "faqs": [
            {
                "q": "What is the Funds Transfer Scheme (FTS) in New Zealand?",
                "a": "FTS allows Indian students to transfer their living costs (NZD 20,000) to a secure ANZ Bank account in New Zealand. The funds are released in monthly installments after arrival to ensure smooth living expense management."
            },
            {
                "q": "Can my education loan disburse funds for the FTS account?",
                "a": "Yes. Once you receive your Approval in Principle (AIP) letter from Immigration New Zealand, your lender disburses the living fund portion directly into your ANZ FTS account."
            }
        ]
    },
    {
        "id": "dubai",
        "title": "Study in Dubai (UAE)",
        "h1": "Education Loan for <span style=\"color:#1a9c4e\">Study in Dubai & UAE</span>",
        "subtitle": "Education loan guidance for prestigious international branch campuses and universities in Dubai and Abu Dhabi.",
        "flag": "🇦🇪",
        "currency": "AED (د.إ)",
        "tuition": "AED 45,000 – 95,000 / year",
        "living": "AED 30,000 – 50,000 / year",
        "max_loan": "Up to ₹60 – 80 Lakhs",
        "visa_req": "University Student Visa Proof",
        "intro": "Dubai has become a premier education hub in the Middle East, hosting international branch campuses of top UK, Australian, and Indian institutions. With close geographic proximity to India, safe environment, rapid visa processing, and booming corporate sectors in tech, finance, and logistics, Dubai is an attractive alternative for global higher education. Visionary Path Services helps you secure reliable financing for Dubai programs.",
        "stem_opt": "UAE Golden Visa and Green Visa opportunities for outstanding graduates and professionals.",
        "top_unis": ["Heriot-Watt University Dubai", "University of Wollongong in Dubai (UOWD)", "BITS Pilani Dubai Campus", "SP Jain School of Global Management", "Middlesex University Dubai", "Rochester Institute of Technology Dubai", "Amity University Dubai", "Canadian University Dubai"],
        "loan_highlights": [
            "Financing available for globally accredited UK, Australian, and Indian branch campuses in Dubai",
            "Secured and unsecured loan options from leading Indian banks and NBFCs",
            "Fast sanction letters to support university admission and student residency visa sponsorship",
            "Moratorium benefit throughout course duration plus grace period",
            "Zero income tax environment post-graduation accelerating loan repayment",
            "100% free guidance from application to disbursement"
        ],
        "faqs": [
            {
                "q": "Do Indian banks provide education loans for universities in Dubai?",
                "a": "Yes! Indian banks and NBFCs fund recognized universities and international branch campuses in Dubai (such as Heriot-Watt, Wollongong, BITS Dubai, SP Jain) that grant accredited degrees."
            },
            {
                "q": "What expenses are covered in a Dubai education loan?",
                "a": "The loan covers tuition fees, university housing/hostel accommodation, living expenses, health insurance, and initial visa processing costs."
            }
        ]
    },
    {
        "id": "europe",
        "title": "Study in Europe",
        "h1": "Education Loan for <span style=\"color:#1a9c4e\">Study Across Europe</span>",
        "subtitle": "Comprehensive loan support for top universities across Sweden, Netherlands, Italy, Spain, Switzerland, and the Schengen Area.",
        "flag": "🇪🇺",
        "currency": "EUR (€) / Local",
        "tuition": "€6,000 – €22,000 / year",
        "living": "€8,000 – €14,000 / year",
        "max_loan": "Up to ₹80 Lakhs – 1.2 Crores",
        "visa_req": "Schengen Proof of Funds",
        "intro": "Continental Europe offers an incredible array of world-class universities, innovative research hubs, affordable tuition fees, and rich cultural diversity. Whether you are aiming for high-tech programs in the Netherlands and Sweden, design and architecture in Italy, or global business in Spain, an education loan provides the necessary financial backbone. Visionary Path Services coordinates with multiple lenders to finance your European study journey.",
        "stem_opt": "1 to 2-year post-study search year (Zoekjaar / Jobseeker) visas across Netherlands, Sweden, and EU member states.",
        "top_unis": ["TU Delft (Netherlands)", "Karolinska Institute (Sweden)", "Politecnico di Milano (Italy)", "University of Amsterdam (Netherlands)", "IE University (Spain)", "ETH Zurich (Switzerland)", "KTH Royal Institute of Technology (Sweden)", "Bocconi University (Italy)"],
        "loan_highlights": [
            "Multi-country coverage spanning Netherlands, Sweden, Italy, Spain, Switzerland, and Finland",
            "Support for country-specific financial requirements (such as Dutch IND and Swedish Migrationsverket)",
            "Unsecured loans up to ₹40 – 50 Lakhs for top-ranked European universities",
            "Secured loan options up to ₹1.2 Crores for extensive master's and doctoral degrees",
            "Complete coverage for tuition, living allowances, insurance, and travel",
            "Free end-to-end guidance from our senior education finance advisors"
        ],
        "faqs": [
            {
                "q": "How do visa financial requirements differ across European countries?",
                "a": "Each Schengen country sets its annual living cost benchmark (for example, Netherlands requires approx. €12,500/year to IND, while Sweden requires SEK 10,314/month). An education loan sanction letter is recognized across European embassies as proof of sufficient financial means."
            },
            {
                "q": "Can I work part-time in Europe while studying?",
                "a": "Yes. Most European countries permit international students to work 15 to 20 hours per week during academic semesters and full-time during holidays to help offset daily living expenses."
            }
        ]
    }
]

template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} – Education Loan Guidance | Visionary Path Services</title>
    <meta name="description" content="{subtitle}">
    <link rel="canonical" href="https://www.visionarypathservices.com/pages/countries/{id}.html">

    <!-- Open Graph -->
    <meta property="og:title" content="{title} – Education Loan Guidance | Visionary Path Services">
    <meta property="og:description" content="{subtitle}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.visionarypathservices.com/pages/countries/{id}.html">

    <!-- CSS & Fonts -->
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Education Loan Guidance for {title}",
      "provider": {{
        "@type": "FinancialService",
        "name": "Visionary Path Services",
        "url": "https://www.visionarypathservices.com",
        "telephone": "+919063703038",
        "email": "Visionarypathservises@gmail.com"
      }},
      "description": "{subtitle}",
      "areaServed": "India",
      "serviceType": "Education Loan Advisory"
    }}
    </script>
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.visionarypathservices.com/"
        }},
        {{
          "@type": "ListItem",
          "position": 2,
          "name": "Abroad Loans",
          "item": "https://www.visionarypathservices.com/pages/abroad-loans.html"
        }},
        {{
          "@type": "ListItem",
          "position": 3,
          "name": "{title}",
          "item": "https://www.visionarypathservices.com/pages/countries/{id}.html"
        }}
      ]
    }}
    </script>
    <style>
        .country-stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }}
        .country-stat-box {{
            background: #ffffff;
            border: 1.5px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px 20px;
            text-align: center;
            box-shadow: 0 4px 16px rgba(13,43,94,0.04);
            transition: transform 0.25s ease;
        }}
        .country-stat-box:hover {{
            transform: translateY(-4px);
            border-color: #93c5fd;
        }}
        .country-stat-val {{
            font-size: 1.35rem;
            font-weight: 800;
            color: var(--navy);
            margin: 8px 0 4px;
        }}
        .country-stat-lbl {{
            font-size: 0.85rem;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }}
        .uni-tags-wrap {{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
        }}
        .uni-tag {{
            background: #eef5ff;
            color: var(--blue);
            font-weight: 600;
            font-size: 13.5px;
            padding: 7px 16px;
            border-radius: 20px;
            border: 1px solid #cfe2fe;
        }}
        .check-bullet-list {{
            list-style: none;
            padding: 0;
            margin: 20px 0;
        }}
        .check-bullet-list li {{
            display: flex;
            align-items: flex-start;
            gap: 12px;
            font-size: 15px;
            color: #334155;
            margin-bottom: 14px;
            line-height: 1.6;
        }}
        .check-bullet-list li i {{
            color: var(--green);
            font-size: 17px;
            margin-top: 3px;
            flex-shrink: 0;
        }}
        .docs-card {{
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-radius: 18px;
            padding: 30px;
            margin: 30px 0;
        }}
    </style>
</head>
<body>

    <!-- TOPBAR -->
    <div class="topbar">
        <div class="container topbar-inner">
            <div class="topbar-left">
                <span><i class="fas fa-clock"></i> Mon–Sat: 9:30 AM – 7:00 PM</span>
                <span><i class="fas fa-map-marker-alt"></i> Pan-India Education Loan Guidance</span>
            </div>
            <div class="topbar-right">
                <a href="tel:9063703038"><i class="fas fa-phone"></i> +91 9063703038</a>
                <a href="mailto:Visionarypathservises@gmail.com"><i class="fas fa-envelope"></i> Visionarypathservises@gmail.com</a>
            </div>
        </div>
    </div>

    <!-- NAVBAR -->
    <nav class="navbar" id="navbar">
        <div class="container nav-inner">
            <a href="../../index.html" class="logo">
                <div class="logo-text">
                    <span class="logo-name">VISIONARY PATH SERVICES</span>
                    <span class="logo-tagline">Guiding Dreams, Financing Futures</span>
                </div>
            </a>
            <ul class="nav-links" id="navLinks">
                <li><a href="../../index.html">Home</a></li>
                <li><a href="../about.html">About Us</a></li>
                <li class="has-dropdown services-dropdown">
                    <a href="../services.html">Services <i class="fas fa-chevron-down"></i></a>
                    <div class="dropdown mega-dropdown">
                        <div class="mega-body">
                            <!-- Left: Loan Programs -->
                            <div class="mega-col mega-col-loans">
                                <div class="mega-header">
                                    <span class="mega-header-title"><i class="fas fa-graduation-cap"></i> Loan Programs</span>
                                    <span class="mega-header-pill">4 Options</span>
                                </div>
                                <div class="mega-loan-items">
                                    <a href="../abroad-loans.html" class="mega-loan-card">
                                        <div class="mega-icon-badge bg-blue"><i class="fas fa-plane-departure"></i></div>
                                        <div class="mega-loan-info">
                                            <div class="mega-loan-title">Abroad Education Loans</div>
                                            <div class="mega-loan-desc">Up to ₹2 Cr • Collateral &amp; Non-collateral</div>
                                        </div>
                                    </a>
                                    <a href="../domestic-loans.html" class="mega-loan-card">
                                        <div class="mega-icon-badge bg-green"><i class="fas fa-landmark"></i></div>
                                        <div class="mega-loan-info">
                                            <div class="mega-loan-title">Domestic Education Loans</div>
                                            <div class="mega-loan-desc">For premier Indian colleges, IITs &amp; IIMs</div>
                                        </div>
                                    </a>
                                    <a href="../mbbs-loans.html" class="mega-loan-card">
                                        <div class="mega-icon-badge bg-teal"><i class="fas fa-stethoscope"></i></div>
                                        <div class="mega-loan-info">
                                            <div class="mega-loan-title">MBBS Loans</div>
                                            <div class="mega-loan-desc">Medical studies in India and overseas</div>
                                        </div>
                                    </a>
                                    <a href="../other-loans.html" class="mega-loan-card">
                                        <div class="mega-icon-badge bg-amber"><i class="fas fa-briefcase"></i></div>
                                        <div class="mega-loan-info">
                                            <div class="mega-loan-title">Other Loans &amp; Forex</div>
                                            <div class="mega-loan-desc">Personal, Home, Business &amp; Forex</div>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <!-- Right: Destinations -->
                            <div class="mega-col mega-col-countries">
                                <div class="mega-header">
                                    <span class="mega-header-title"><i class="fas fa-globe-americas"></i> Study Destinations</span>
                                    <span class="mega-header-pill">10 Countries</span>
                                </div>
                                <div class="mega-countries-grid">
                                    <a href="usa.html" class="mega-country-link">
                                        <span class="country-flag">🇺🇸</span>
                                        <span class="country-name">Study in USA</span>
                                    </a>
                                    <a href="uk.html" class="mega-country-link">
                                        <span class="country-flag">🇬🇧</span>
                                        <span class="country-name">Study in UK</span>
                                    </a>
                                    <a href="canada.html" class="mega-country-link">
                                        <span class="country-flag">🇨🇦</span>
                                        <span class="country-name">Study in Canada</span>
                                    </a>
                                    <a href="germany.html" class="mega-country-link">
                                        <span class="country-flag">🇩🇪</span>
                                        <span class="country-name">Study in Germany</span>
                                    </a>
                                    <a href="australia.html" class="mega-country-link">
                                        <span class="country-flag">🇦🇺</span>
                                        <span class="country-name">Study in Australia</span>
                                    </a>
                                    <a href="ireland.html" class="mega-country-link">
                                        <span class="country-flag">🇮🇪</span>
                                        <span class="country-name">Study in Ireland</span>
                                    </a>
                                    <a href="france.html" class="mega-country-link">
                                        <span class="country-flag">🇫🇷</span>
                                        <span class="country-name">Study in France</span>
                                    </a>
                                    <a href="new-zealand.html" class="mega-country-link">
                                        <span class="country-flag">🇳🇿</span>
                                        <span class="country-name">Study in New Zealand</span>
                                    </a>
                                    <a href="dubai.html" class="mega-country-link">
                                        <span class="country-flag">🇦🇪</span>
                                        <span class="country-name">Study in Dubai</span>
                                    </a>
                                    <a href="europe.html" class="mega-country-link">
                                        <span class="country-flag">🇪🇺</span>
                                        <span class="country-name">Study in Europe</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Mega Footer -->
                        <div class="mega-footer">
                            <div class="mega-footer-left">
                                <span class="mega-footer-tag">100% FREE ADVISORY</span>
                                <span class="mega-footer-note">Compare offers across 15+ partner lenders</span>
                            </div>
                            <a href="../services.html" class="mega-footer-cta">
                                View All Services <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </li>
                <li><a href="../partner-lenders.html">Partner Lenders</a></li>
                <li><a href="../partner-with-us.html">Partner With Us</a></li>
                <li><a href="../contact.html">Contact Us</a></li>
            </ul>
            <div class="nav-cta">
                <button class="btn btn-primary" onclick="openPopup()"><i class="fas fa-clipboard-list"></i> Check Eligibility</button>
                <a href="https://wa.me/919063703038" target="_blank" class="btn btn-whatsapp"><i class="fab fa-whatsapp"></i> Talk to Expert</a>
            </div>
            <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="Toggle navigation"><span></span><span></span><span></span></button>
        </div>
    </nav>

    <!-- PAGE HERO -->
    <header class="page-hero">
        <div class="container page-hero-inner">
            <div class="breadcrumb">
                <a href="../../index.html">Home</a> / <a href="../abroad-loans.html">Study Abroad</a> / <span>{title}</span>
            </div>
            <p class="page-hero-eyebrow" data-aos="fade-up">{flag} GLOBAL HIGHER EDUCATION</p>
            <h1 data-aos="fade-up" data-aos-delay="100">{h1}</h1>
            <p data-aos="fade-up" data-aos-delay="200">{subtitle}</p>
            <div class="hero-btns" data-aos="fade-up" data-aos-delay="300">
                <button class="btn btn-primary btn-lg" onclick="openPopup()">Check Eligibility – Free <i class="fas fa-arrow-right"></i></button>
                <a href="https://wa.me/919063703038" target="_blank" class="btn btn-whatsapp btn-lg"><i class="fab fa-whatsapp"></i> WhatsApp Advisor</a>
            </div>
        </div>
    </header>

    <!-- KEY STATS -->
    <section class="section" style="padding:50px 0; background:#f8fbfe;">
        <div class="container">
            <div class="country-stats-grid" data-aos="fade-up">
                <div class="country-stat-box">
                    <div style="font-size:24px; color:var(--blue);"><i class="fas fa-graduation-cap"></i></div>
                    <div class="country-stat-val">{tuition}</div>
                    <div class="country-stat-lbl">Average Tuition / Year</div>
                </div>
                <div class="country-stat-box">
                    <div style="font-size:24px; color:var(--green);"><i class="fas fa-wallet"></i></div>
                    <div class="country-stat-val">{living}</div>
                    <div class="country-stat-lbl">Estimated Living Cost</div>
                </div>
                <div class="country-stat-box">
                    <div style="font-size:24px; color:var(--navy);"><i class="fas fa-hand-holding-dollar"></i></div>
                    <div class="country-stat-val">{max_loan}</div>
                    <div class="country-stat-lbl">Available Loan Limit</div>
                </div>
                <div class="country-stat-box">
                    <div style="font-size:24px; color:#f59e0b;"><i class="fas fa-file-invoice"></i></div>
                    <div class="country-stat-val">{visa_req}</div>
                    <div class="country-stat-lbl">Key Visa Requirement</div>
                </div>
            </div>
        </div>
    </section>

    <!-- COUNTRY OVERVIEW -->
    <section class="section" style="padding:80px 0;">
        <div class="container">
            <div class="two-col" style="align-items:center;">
                <div data-aos="fade-right">
                    <p class="section-label">{flag} DESTINATION INSIGHTS</p>
                    <h2 class="section-title">Funding Your Education in <span style="color:#1a9c4e">{title}</span></h2>
                    <p style="font-size:16px; color:#475569; line-height:1.75; margin-bottom:20px;">{intro}</p>
                    
                    <div style="background:#f0fdf4; border-left:4px solid var(--green); padding:16px 20px; border-radius:8px; margin:24px 0;">
                        <strong style="color:var(--navy); font-size:15px;"><i class="fas fa-briefcase" style="color:var(--green); margin-right:6px;"></i> Post-Study Career Opportunity:</strong>
                        <p style="font-size:14px; color:#334155; margin-top:4px;">{stem_opt}</p>
                    </div>

                    <h3 style="font-size:18px; color:var(--navy); margin-top:24px;">Popular Universities We Support:</h3>
                    <div class="uni-tags-wrap">
                        {uni_tags}
                    </div>
                </div>
                <div data-aos="fade-left">
                    <div class="docs-card">
                        <h3 style="font-size:20px; color:var(--navy); margin-bottom:16px;"><i class="fas fa-shield-alt" style="color:var(--blue); margin-right:8px;"></i> What Lenders Offer For {title}</h3>
                        <ul class="check-bullet-list">
                            {loan_bullets}
                        </ul>
                        <button class="btn btn-primary" style="width:100%; margin-top:16px;" onclick="openPopup()">Get Personalized Loan Options <i class="fas fa-arrow-right"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- DOCUMENTATION CHECKLIST -->
    <section class="section" style="background:#f8fafc; padding:80px 0;">
        <div class="container">
            <div style="text-align:center; max-width:700px; margin:0 auto 50px;">
                <p class="section-label">DOCUMENTATION CHECKLIST</p>
                <h2 class="section-title">Required Documents for <span style="color:#1a9c4e">{title} Loans</span></h2>
                <p class="section-sub">We assist you in organizing all paperwork to ensure swift lender approval with zero hassle.</p>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px;" data-aos="fade-up">
                <div class="core-card">
                    <div class="core-card-icon" style="background:#e0ecfb; color:var(--blue);"><i class="fas fa-user-graduate"></i></div>
                    <h3>Student Documents</h3>
                    <p>• Valid Passport copy<br>• 10th, 12th &amp; Degree Marksheets<br>• Entrance Test Scores (GRE/GMAT/IELTS/TOEFL)<br>• Admission Offer Letter / I-20 / CAS<br>• Statement of Estimated Expenses</p>
                </div>
                <div class="core-card">
                    <div class="core-card-icon" style="background:#dcfce7; color:var(--green);"><i class="fas fa-user-tie"></i></div>
                    <h3>Co-Applicant Financials</h3>
                    <p>• PAN &amp; Aadhaar Card<br>• Last 3 months Salary Slips (Salaried) / 2 yrs ITR (Self-Employed)<br>• Form 16 / Computation of Income<br>• Last 6 months bank statement showing salary/business credits</p>
                </div>
                <div class="core-card">
                    <div class="core-card-icon" style="background:#fef3c7; color:#d97706;"><i class="fas fa-building-circle-check"></i></div>
                    <h3>Collateral (If Applicable)</h3>
                    <p>• Registered Title Deed / Sale Deed<br>• Approved Building Plan &amp; NOC<br>• Up-to-date Property Tax receipts<br>• Encumbrance Certificate (13–30 yrs)<br>• Or Fixed Deposit receipts with bank</p>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQs -->
    <section class="faq-section" id="faqs">
        <div class="container">
            <div style="text-align:center; margin-bottom:40px;">
                <p class="section-label">FREQUENTLY ASKED QUESTIONS</p>
                <h2 class="section-title">{title} Education Loan <span style="color:#1a9c4e">FAQs</span></h2>
                <p class="section-sub">Clear answers regarding financial guidelines, lender eligibility, and visa procedures.</p>
            </div>
            <div class="faq-list" data-aos="fade-up">
                {faq_items}
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
        <div class="container">
            <h2 data-aos="fade-up">Ready to Begin Your Studies in {title}?</h2>
            <p data-aos="fade-up" data-aos-delay="80">Get free expert guidance on secured &amp; unsecured education loans suited to your profile.</p>
            <div class="cta-btns" data-aos="fade-up" data-aos-delay="160">
                <button class="btn btn-primary btn-lg" onclick="openPopup()">Check Loan Eligibility Free <i class="fas fa-arrow-right"></i></button>
                <a href="https://wa.me/919063703038" target="_blank" class="btn btn-whatsapp btn-lg"><i class="fab fa-whatsapp"></i> Chat on WhatsApp</a>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <div class="container footer-inner">
            <div class="footer-col">
                <div class="footer-logo">
                    <div>
                        <span class="footer-logo-name">VISIONARY PATH SERVICES</span>
                        <span class="footer-logo-tagline">Guiding Dreams, Financing Futures</span>
                    </div>
                </div>
                <p style="color:#94a3b8; font-size:14px; margin-top:16px; line-height:1.65;">
                    Empowering students across India with transparent, unbiased, and 100% free education loan advisory for domestic and overseas studies.
                </p>
            </div>
            <div class="footer-col">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="../../index.html">Home</a></li>
                    <li><a href="../about.html">About Us</a></li>
                    <li><a href="../services.html">Services</a></li>
                    <li><a href="../partner-lenders.html">Partner Lenders</a></li>
                    <li><a href="../partner-with-us.html">Partner With Us</a></li>
                    <li><a href="../contact.html">Contact Us</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Country Guides</h4>
                <ul>
                    <li><a href="usa.html">Study in USA</a></li>
                    <li><a href="uk.html">Study in UK</a></li>
                    <li><a href="canada.html">Study in Canada</a></li>
                    <li><a href="germany.html">Study in Germany</a></li>
                    <li><a href="australia.html">Study in Australia</a></li>
                    <li><a href="ireland.html">Study in Ireland</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Contact Us</h4>
                <ul class="contact-list">
                    <li><i class="fas fa-phone"></i> <a href="tel:9063703038">9063703038</a></li>
                    <li><i class="fas fa-envelope"></i> <a href="mailto:Visionarypathservises@gmail.com">Visionarypathservises@gmail.com</a></li>
                    <li><i class="fas fa-globe"></i> <a href="#">www.visionarypathservices.com</a></li>
                </ul>
                <div class="footer-socials" style="margin-top:16px;">
                    <a href="#"><i class="fab fa-linkedin"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-youtube"></i></a>
                    <a href="#"><i class="fab fa-facebook"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container footer-bottom-inner">
                <span>© 2025 Visionary Path Services. All Rights Reserved.</span>
                <div class="footer-bottom-links">
                    <a href="#">Privacy Policy</a> | <a href="#">Terms &amp; Conditions</a> | <a href="#">Disclaimer</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- POPUP INQUIRY FORM (Industry-Grade Edition) -->
    <div class="popup-overlay" id="popupOverlay" onclick="closePopupOutside(event)">
        <div class="popup-modal">
            <button class="popup-close" onclick="closePopup()" aria-label="Close Popup">✕</button>
            <div class="popup-left">
                <div class="popup-left-content">
                    <div class="popup-badge">
                        <span class="badge-dot"></span>
                        <span>100% FREE CONSULTATION</span>
                    </div>
                    <h3 class="popup-title">Check Your<br>Eligibility For<br><span class="green-highlight">{title}!</span></h3>
                    <p class="popup-left-desc">Compare pre-approved loan options for {title} from 15+ top banks &amp; NBFCs with zero service fees.</p>
                    <div class="popup-features-list">
                        <div class="popup-feature-item">
                            <div class="feature-icon-box"><i class="fas fa-user-check"></i></div>
                            <div class="feature-text-wrap">
                                <strong>Expert Guidance</strong>
                                <span>Dedicated Personal Loan Officer</span>
                            </div>
                        </div>
                        <div class="popup-feature-item">
                            <div class="feature-icon-box"><i class="fas fa-shield-halved"></i></div>
                            <div class="feature-text-wrap">
                                <strong>Secure &amp; Confidential</strong>
                                <span>Bank-grade 256-bit data protection</span>
                            </div>
                        </div>
                        <div class="popup-feature-item">
                            <div class="feature-icon-box"><i class="fas fa-bolt"></i></div>
                            <div class="feature-text-wrap">
                                <strong>Quick Turnaround</strong>
                                <span>Fast assessment &amp; sanction updates</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="popup-left-footer">
                    <div class="lenders-badge">
                        <i class="fas fa-building-columns"></i>
                        <span>15+ Partner Banks &amp; NBFCs</span>
                    </div>
                </div>
            </div>
            <div class="popup-right">
                <div class="popup-form-header">
                    <h4>Get Free Loan Assessment</h4>
                    <p>Connect with a senior counselor specializing in {title}</p>
                </div>
                <form class="popup-form" onsubmit="submitForm(event)">
                    <div class="form-row name-row">
                        <div class="form-group">
                            <label>First Name <span class="req">*</span></label>
                            <div class="input-icon-wrap"><i class="fas fa-user"></i><input type="text" name="firstName" placeholder="e.g. Aarav" required></div>
                        </div>
                        <div class="form-group">
                            <label>Last Name <span class="req">*</span></label>
                            <div class="input-icon-wrap"><i class="fas fa-user"></i><input type="text" name="lastName" placeholder="e.g. Sharma" required></div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Phone Number <span class="req">*</span></label>
                            <div class="input-icon-wrap phone-wrap">
                                <span class="country-prefix"><i class="fas fa-phone-alt"></i> +91</span>
                                <input type="tel" name="phone" id="popupPhone" placeholder="Enter phone number" pattern="[0-9]{{10}}" maxlength="10" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="label-with-action">
                                <label>WhatsApp Number <span class="req">*</span></label>
                                <button type="button" class="btn-copy-phone" onclick="copyPhoneToWhatsApp()">Same as phone</button>
                            </div>
                            <div class="input-icon-wrap whatsapp-inp">
                                <i class="fab fa-whatsapp"></i>
                                <input type="tel" name="whatsapp" id="popupWhatsApp" placeholder="WhatsApp number" pattern="[0-9]{{10}}" maxlength="10" required>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Email Address <span class="req">*</span></label>
                        <div class="input-icon-wrap"><i class="fas fa-envelope"></i><input type="email" name="email" placeholder="e.g. aarav.sharma@gmail.com" required></div>
                    </div>
                    <div class="form-group mb-tight">
                        <label class="form-label-regular">Target Country / Destination</label>
                        <div class="input-icon-wrap"><i class="fas fa-globe-americas"></i><input type="text" name="country" value="{title}" readonly style="background:#f8fafc; font-weight:600; color:#0b2545;"></div>
                    </div>
                    <div class="form-group mb-tight">
                        <label class="form-label-regular">Degree, Course &amp; Loan Amount</label>
                        <div class="input-icon-wrap textarea-wrap"><i class="fas fa-graduation-cap"></i><textarea name="message" placeholder="e.g. MS in CS, target budget ₹50 Lakhs..." rows="2"></textarea></div>
                    </div>
                    <button type="submit" class="btn btn-submit-enquiry">
                        <span>Check My Eligibility Free</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <div class="popup-safe">
                        <i class="fas fa-shield-halved"></i>
                        <span>100% Confidential • Zero Spam Guarantee • Free Consultation</span>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- FLOATING ELIGIBILITY QUICK CTA (Marketing CRO) -->
    <button id="floatingEligibilityBtn" class="floating-eligibility-btn" onclick="openPopup()" aria-label="Check Loan Eligibility Free">
        <span class="floating-btn-pulse"></span>
        <i class="fas fa-bolt"></i>
        <span>Check Eligibility <strong class="badge-free">FREE</strong></span>
    </button>

    <!-- JS -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="../../js/apple-icons.js"></script>
    <script src="../../js/main.js"></script>
    <script>
        AOS.init({{ duration: 700, once: false }});
    </script>
</body>
</html>
"""

output_dir = "/Users/nani/Downloads/visionary path/website/pages/countries"
os.makedirs(output_dir, exist_ok=True)

for c in countries:
    uni_tags_html = "\n".join([f'                        <span class="uni-tag"><i class="fas fa-building-columns" style="margin-right:4px;"></i> {u}</span>' for u in c["top_unis"]])
    loan_bullets_html = "\n".join([f'                            <li><i class="fas fa-check-circle"></i> {b}</li>' for b in c["loan_highlights"]])
    
    faqs_html = []
    for f in c["faqs"]:
        faqs_html.append(f"""                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>{f['q']}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        {f['a']}
                    </div>
                </div>""")
    faq_items_html = "\n".join(faqs_html)

    html_content = template.format(
        id=c["id"],
        title=c["title"],
        h1=c["h1"],
        subtitle=c["subtitle"],
        flag=c["flag"],
        currency=c["currency"],
        tuition=c["tuition"],
        living=c["living"],
        max_loan=c["max_loan"],
        visa_req=c["visa_req"],
        intro=c["intro"],
        stem_opt=c["stem_opt"],
        uni_tags=uni_tags_html,
        loan_bullets=loan_bullets_html,
        faq_items=faq_items_html
    )

    filepath = os.path.join(output_dir, f"{c['id']}.html")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Generated: {filepath}")

print("All 10 country pages generated successfully!")
