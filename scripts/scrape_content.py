#!/usr/bin/env python3
"""
Visionary Path Services - Complete Website Content Extractor
Extracts all pure content, copy, data, tables, FAQs, statistics,
and partner logos into clean Markdown with zero design/code noise.
"""

import os
import re
from html.parser import HTMLParser

WEBSITE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../website'))
OUTPUT_MD_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../WEBSITE_CONTENT.md'))

PARTNER_LOGOS = [
    {"name": "State Bank of India (SBI)", "type": "Public Sector Scheduled Commercial Bank", "file": "images/logos/sbi.webp", "format": "WebP / SVG"},
    {"name": "HDFC Credila", "type": "Specialist Education NBFC (HDFC Group)", "file": "images/logos/credila.webp", "format": "WebP / SVG"},
    {"name": "ICICI Bank", "type": "Premier Private Sector Bank", "file": "images/logos/icici-bank.webp", "format": "WebP / SVG"},
    {"name": "Avanse Financial Services", "type": "Specialist Education NBFC (Warburg Pincus)", "file": "images/logos/avanse.webp", "format": "WebP / SVG"},
    {"name": "Axis Bank", "type": "Premier Private Sector Bank", "file": "images/logos/axis-bank.webp", "format": "WebP / SVG"},
    {"name": "Bank of Baroda (BoB)", "type": "Public Sector Scheduled Commercial Bank", "file": "images/logos/bank-of-baroda.png", "format": "PNG / SVG"},
    {"name": "Auxilo Finserve", "type": "Specialist Education NBFC (Balrampur Chini Group)", "file": "images/logos/auxilo.webp", "format": "WebP / SVG"},
    {"name": "IDFC FIRST Bank", "type": "Private Sector Bank", "file": "images/logos/idfc-first-bank.webp", "format": "WebP / SVG"},
    {"name": "Tata Capital", "type": "Premier Financial Services NBFC (Tata Sons)", "file": "images/logos/tata-capital.webp", "format": "WebP / SVG"},
    {"name": "Punjab National Bank (PNB)", "type": "Public Sector Scheduled Commercial Bank", "file": "images/logos/pnb.webp", "format": "WebP / SVG"},
    {"name": "InCred Financial Services", "type": "Specialist Technology-Driven NBFC", "file": "images/logos/incred.webp", "format": "WebP / SVG"},
    {"name": "Canara Bank", "type": "Public Sector Scheduled Commercial Bank", "file": "images/logos/canara-bank.svg", "format": "SVG"},
    {"name": "Union Bank of India", "type": "Public Sector Scheduled Commercial Bank", "file": "images/logos/union-bank.webp", "format": "WebP / SVG"},
    {"name": "Poonawalla Fincorp", "type": "Retail & Education Lending NBFC (Cyrus Poonawalla Group)", "file": "images/logos/poonawalla.webp", "format": "WebP / SVG"},
    {"name": "YES BANK", "type": "Private Sector Commercial Bank", "file": "images/logos/yes-bank.png", "format": "PNG / SVG"},
    {"name": "Prodigy Finance", "type": "International USD/GBP/EUR Fintech (No Cosigner / No Collateral)", "file": "images/logos/prodigy-finance.webp", "format": "WebP / SVG"},
    {"name": "MPOWER Financing", "type": "US & Canada International Student Lender (No Cosigner / Public Benefit)", "file": "images/logos/mpower-financing.png", "format": "PNG / SVG"},
    {"name": "Sallie Mae", "type": "US Higher Education Banking Institution", "file": "images/logos/sallie-mae.svg", "format": "SVG"},
    {"name": "Kuhoo Student Loans", "type": "Technology-Driven Student Loan Platform", "file": "images/logos/kuhoo.png", "format": "PNG"},
    {"name": "Earnest", "type": "International Education & Refinancing Institution", "file": "images/logos/earnest.svg", "format": "SVG"},
]

class CleanMatterParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_script = False
        self.in_style = False
        self.in_heading = False
        self.current_heading_level = 0
        self.in_p = False
        self.in_li = False
        self.in_table_cell = False
        self.is_header_cell = False
        self.current_row = []
        self.table_rows = []
        self.in_table = False
        
        self.content_blocks = []
        self.page_images = []
        self.current_text = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        
        if tag in ('script', 'style', 'noscript', 'svg'):
            if tag == 'script': self.in_script = True
            elif tag == 'style': self.in_style = True
            return

        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            self._flush_text()
            self.in_heading = True
            self.current_heading_level = int(tag[1])
            self.current_text = []
            return

        if tag == 'p':
            self._flush_text()
            self.in_p = True
            self.current_text = []
            return

        if tag == 'li':
            self._flush_text()
            self.in_li = True
            self.current_text = []
            return

        if tag == 'table':
            self._flush_text()
            self.in_table = True
            self.table_rows = []
            return

        if tag == 'tr':
            self.current_row = []
            return

        if tag in ('th', 'td'):
            self.in_table_cell = True
            self.is_header_cell = (tag == 'th')
            self.current_text = []
            return

        if tag == 'img':
            src = attr_dict.get('src', '')
            alt = attr_dict.get('alt', '')
            if alt or 'logo' in src.lower():
                self.page_images.append({
                    'alt': alt.strip(),
                    'src': src.strip()
                })
            return

    def handle_endtag(self, tag):
        if tag == 'script':
            self.in_script = False
            return
        if tag == 'style':
            self.in_style = False
            return
        if self.in_script or self.in_style:
            return

        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            self.in_heading = False
            text = " ".join(self.current_text).strip()
            if text:
                self.content_blocks.append({
                    'type': 'heading',
                    'level': self.current_heading_level,
                    'text': text
                })
            self.current_text = []
            return

        if tag == 'p':
            self.in_p = False
            text = " ".join(self.current_text).strip()
            if text:
                self.content_blocks.append({
                    'type': 'paragraph',
                    'text': text
                })
            self.current_text = []
            return

        if tag == 'li':
            self.in_li = False
            text = " ".join(self.current_text).strip()
            if text:
                self.content_blocks.append({
                    'type': 'list_item',
                    'text': text
                })
            self.current_text = []
            return

        if tag in ('th', 'td'):
            self.in_table_cell = False
            cell_text = " ".join(self.current_text).strip()
            self.current_row.append(cell_text)
            self.current_text = []
            return

        if tag == 'tr':
            if self.current_row:
                self.table_rows.append(self.current_row)
                self.current_row = []
            return

        if tag == 'table':
            self.in_table = False
            if self.table_rows:
                self.content_blocks.append({
                    'type': 'table',
                    'rows': self.table_rows
                })
            self.table_rows = []
            return

    def handle_data(self, data):
        if self.in_script or self.in_style:
            return
        clean = re.sub(r'\s+', ' ', data).strip()
        if clean:
            self.current_text.append(clean)

    def _flush_text(self):
        text = " ".join(self.current_text).strip()
        if text:
            if not (self.in_heading or self.in_p or self.in_li or self.in_table_cell):
                if len(text) > 3 and not text.startswith(('/* ', '{', '}', '-->', 'function', '<')):
                    self.content_blocks.append({
                        'type': 'text',
                        'text': text
                    })
        self.current_text = []


def extract_metadata(html):
    title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1).strip() if title_match else ""
    
    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
    if not desc_match:
        desc_match = re.search(r'<meta\s+property=["\']og:description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
    desc = desc_match.group(1).strip() if desc_match else ""

    return title, desc


def strip_boilerplate(html):
    """Strip repeated global header, navbar, footer, and popup modals so only pure page content remains."""
    cleaned = html

    # Strip navbar
    cleaned = re.sub(r'<!--\s*VPS_NAVBAR_START\s*-->[\s\S]*?<!--\s*VPS_NAVBAR_END\s*-->', '', cleaned)
    cleaned = re.sub(r'(?:<div class="top-bar">[\s\S]*?)?<header class="navbar"[\s\S]*?</header>', '', cleaned)

    # Strip footer
    cleaned = re.sub(r'<!--\s*VPS_FOOTER_START\s*-->[\s\S]*?<!--\s*VPS_FOOTER_END\s*-->', '', cleaned)
    cleaned = re.sub(r'<div class="site-disclaimer-strip">[\s\S]*?</footer>', '', cleaned)
    cleaned = re.sub(r'<footer class="footer"[\s\S]*?</footer>', '', cleaned)

    # Strip popup modal
    cleaned = re.sub(r'<div class="popup-overlay"[\s\S]*?</div>\s*</div>\s*</div>', '', cleaned)
    cleaned = re.sub(r'id="popupOverlay"[\s\S]*?id="floatingEligibilityBtn"', '', cleaned)

    # Strip floating buttons & skip link
    cleaned = re.sub(r'<a href="#mainContent" class="skip-link">.*?</a>', '', cleaned)
    cleaned = re.sub(r'<button id="floatingEligibilityBtn"[\s\S]*?</a>', '', cleaned)
    cleaned = re.sub(r'<a href="https://wa\.me/.*?" class="whatsapp-float">.*?</a>', '', cleaned)

    return cleaned


def format_table(rows):
    if not rows:
        return ""
    col_count = max(len(r) for r in rows)
    norm_rows = []
    for r in rows:
        norm_r = [c.replace('|', '/').strip() for c in r]
        while len(norm_r) < col_count:
            norm_r.append("")
        norm_rows.append(norm_r)
    
    header = norm_rows[0]
    md_lines = []
    md_lines.append("| " + " | ".join(header) + " |")
    md_lines.append("| " + " | ".join(["---"] * col_count) + " |")
    for r in norm_rows[1:]:
        md_lines.append("| " + " | ".join(r) + " |")
    return "\n".join(md_lines)


def process_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        raw_html = f.read()

    title, desc = extract_metadata(raw_html)
    body_html = strip_boilerplate(raw_html)

    parser = CleanMatterParser()
    parser.feed(body_html)

    # Filter out duplicate / empty elements
    filtered_blocks = []
    last_text = ""
    for b in parser.content_blocks:
        if b['type'] == 'table':
            filtered_blocks.append(b)
            continue
        text = b['text'].strip()
        if not text or text == last_text:
            continue
        # Skip leftover script remnants
        if text.startswith(('document.', 'window.', 'function(', 'const ', 'let ', 'var ')):
            continue
        last_text = text
        filtered_blocks.append(b)

    # Unique images/logos
    seen = set()
    unique_imgs = []
    for img in parser.page_images:
        key = (img['alt'], img['src'])
        if key not in seen:
            seen.add(key)
            unique_imgs.append(img)

    return {
        'file_path': file_path,
        'title': title,
        'meta_description': desc,
        'blocks': filtered_blocks,
        'images': unique_imgs
    }


def main():
    pages_order = [
        ("website/index.html", "Homepage", "Home"),
        ("website/pages/about.html", "About Us", "About Us"),
        ("website/pages/services.html", "Services Overview", "Services"),
        ("website/pages/abroad-loans.html", "Abroad Education Loans", "Loan Programs"),
        ("website/pages/domestic-loans.html", "Domestic Education Loans", "Loan Programs"),
        ("website/pages/mbbs-loans.html", "MBBS Education Loans", "Loan Programs"),
        ("website/pages/other-loans.html", "Other Loans & Forex Assistance", "Loan Programs"),
        ("website/pages/partner-lenders.html", "Partner Lenders & Banking Network", "Lenders"),
        ("website/pages/partner-with-us.html", "Partner With Us (Channel & B2B)", "Partnership"),
        ("website/pages/contact.html", "Contact Us", "Contact"),
        ("website/pages/blog.html", "Blog & Knowledge Hub", "Blog"),
        ("website/pages/blogs/collateral-vs-non-collateral-education-loan.html", "Blog: Collateral vs Non-Collateral Education Loans", "Articles"),
        ("website/pages/blogs/how-does-cibil-score-affect-your-education-loan.html", "Blog: How CIBIL Score Affects Your Education Loan", "Articles"),
        ("website/pages/blogs/education-loan-for-study-in-usa.html", "Blog: Education Loan for Study in USA Guide", "Articles"),
        ("website/pages/countries/usa.html", "Study Destination: United States (USA)", "Country Guides"),
        ("website/pages/countries/uk.html", "Study Destination: United Kingdom (UK)", "Country Guides"),
        ("website/pages/countries/canada.html", "Study Destination: Canada", "Country Guides"),
        ("website/pages/countries/germany.html", "Study Destination: Germany", "Country Guides"),
        ("website/pages/countries/australia.html", "Study Destination: Australia", "Country Guides"),
        ("website/pages/countries/ireland.html", "Study Destination: Ireland", "Country Guides"),
        ("website/pages/countries/france.html", "Study Destination: France", "Country Guides"),
        ("website/pages/countries/new-zealand.html", "Study Destination: New Zealand", "Country Guides"),
        ("website/pages/countries/dubai.html", "Study Destination: Dubai (UAE)", "Country Guides"),
        ("website/pages/countries/europe.html", "Study Destination: Continental Europe", "Country Guides"),
        ("website/pages/disclaimer.html", "Regulatory Disclaimer & Compliance", "Legal"),
        ("website/pages/privacy-policy.html", "Privacy Policy", "Legal"),
        ("website/pages/terms-and-conditions.html", "Terms and Conditions", "Legal"),
    ]

    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    out = []
    out.append("# Visionary Path Services — Complete Website Matter & Copy Archive")
    out.append("> Comprehensive plain-text matter, informational copy, data tables, lender logos, and guides extracted from all 27 pages of the website.\n")
    
    out.append("## Table of Contents")
    for file_rel, name, category in pages_order:
        anchor = file_rel.replace("website/", "").replace('/', '-').replace('.html', '')
        out.append(f"- **{category}**: [{name} (`{file_rel}`)](#{anchor})")
    out.append("\n---\n")

    # Global company contact & credentials
    out.append("## Global Organization Credentials & Contact Information")
    out.append("- **Company Name**: Visionary Path Services")
    out.append("- **Tagline**: Guiding Dreams, Financing Futures · Guiding Today for a Brighter Tomorrow")
    out.append("- **Primary Phone**: +91 9063703038")
    out.append("- **Official WhatsApp Advisory**: +91 8150949070")
    out.append("- **Official Contact Email**: Visionarypathservises@gmail.com")
    out.append("- **Official Website**: https://www.visionarypathservices.com")
    out.append("- **Operating Model**: Independent Education Loan Advisory & Consulting (Pan-India)")
    out.append("- **Service Charges**: 100% Free Consultation (Zero counseling or processing fee for students and parents)")
    out.append("- **Institutional Disclaimer**: Visionary Path Services operates as an independent education loan consulting and assistance entity. We do not act as a direct lender, banking institution, or Non-Banking Financial Company (NBFC). All loan sanctions and interest rate determinations remain at the sole discretion of partner RBI-regulated Scheduled Commercial Banks and NBFCs.\n")
    out.append("---\n")

    # Master Logos Directory
    out.append("## Master Partner Institutions & Logos Directory")
    out.append("Below is the complete roster of institutional partner banks, NBFCs, and global educational lenders with their active logo assets on the website:\n")
    out.append("| Institution Name | Institution Category | Logo File Path | Asset Format |")
    out.append("| :--- | :--- | :--- | :--- |")
    for l in PARTNER_LOGOS:
        out.append(f"| {l['name']} | {l['type']} | `{l['file']}` | {l['format']} |")
    out.append("\n---\n")

    # Process all pages
    for file_rel, display_name, category in pages_order:
        full_path = os.path.join(base_dir, file_rel)
        if not os.path.exists(full_path):
            continue
        
        anchor = file_rel.replace("website/", "").replace('/', '-').replace('.html', '')
        data = process_html_file(full_path)
        
        out.append(f"<a id=\"{anchor}\"></a>")
        out.append(f"# {display_name}")
        out.append(f"- **Page Title**: {data['title']}")
        out.append(f"- **File Location**: `{file_rel}`")
        out.append(f"- **Category**: {category}")
        if data['meta_description']:
            out.append(f"- **SEO Meta Description**: *{data['meta_description']}*")
        out.append("")

        if data['images']:
            out.append("#### Images & Brand Assets on this Page")
            for img in data['images']:
                alt_txt = img['alt'] or "Graphic / Emblem"
                out.append(f"- `{img['src']}` — *{alt_txt}*")
            out.append("")

        out.append("#### Page Copy, Data & Content Matter\n")
        
        in_list = False
        for b in data['blocks']:
            b_type = b['type']
            if b_type == 'heading':
                if in_list:
                    out.append("")
                    in_list = False
                prefix = "#" * max(2, min(b['level'] + 1, 5))
                out.append(f"\n{prefix} {b['text']}\n")
            elif b_type == 'paragraph':
                if in_list:
                    out.append("")
                    in_list = False
                out.append(f"{b['text']}\n")
            elif b_type == 'list_item':
                in_list = True
                out.append(f"- {b['text']}")
            elif b_type == 'table':
                if in_list:
                    out.append("")
                    in_list = False
                table_md = format_table(b['rows'])
                if table_md:
                    out.append(f"\n{table_md}\n")
            elif b_type == 'text':
                if in_list:
                    out.append("")
                    in_list = False
                out.append(f"{b['text']}\n")

        out.append("\n---\n")

    final_content = "\n".join(out)
    with open(OUTPUT_MD_PATH, 'w', encoding='utf-8') as f:
        f.write(final_content)

    print(f"Extraction complete! Scraped {len(pages_order)} pages.")
    print(f"Saved to: {OUTPUT_MD_PATH}")
    print(f"Total size: {len(final_content)} characters / {round(len(final_content)/1024, 1)} KB")


if __name__ == '__main__':
    main()
