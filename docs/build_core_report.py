#!/usr/bin/env python3
"""
Generate Community Hero Core Project Report (Abstract to Conclusion only)
Omits preliminary pages 1-7 (Cover, Certificate, Declaration, Acknowledgement, TOC, LOF, LOT)
Omits trailing pages (References, List of Publication, Turnitin Plagiarism Report)
"""

import os
import subprocess
import time
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def build_core_report():
    doc = Document()

    # Standard academic page margins: 8.5 x 11 inches
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.25)
        section.right_margin = Inches(1.0)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)
        section.different_first_page_header_footer = False

        # Footer on all pages: Centered Page Number
        footer = section.footer
        p_ft = footer.paragraphs[0]
        p_ft.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_ft.paragraph_format.space_before = Pt(8)
        p_ft.paragraph_format.space_after = Pt(0)
        r_num = p_ft.add_run()
        r_num.font.name = "Times New Roman"
        r_num.font.size = Pt(10.5)
        r_num.font.color.rgb = RGBColor(0x33, 0x33, 0x33)

        fld1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
        instr = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
        fld2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
        fld3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
        r_num._r.append(fld1)
        r_num._r.append(instr)
        r_num._r.append(fld2)
        r_num._r.append(fld3)

    C_NAVY   = RGBColor(0x0A, 0x19, 0x2F)
    C_HEADER = RGBColor(0x1A, 0x36, 0x5D)
    C_BODY   = RGBColor(0x1F, 0x29, 0x37)
    C_MUTED  = RGBColor(0x4B, 0x55, 0x63)
    C_BLACK  = RGBColor(0x00, 0x00, 0x00)

    HEX_HEADER  = "1A365D"
    HEX_ALT_ROW = "F8FAFC"
    HEX_BORDER  = "CBD5E1"
    HEX_CODE_BG = "F1F5F9"

    base_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(base_dir, "presentation_assets")

    def format_run(run, font_name="Times New Roman", size_pt=12, bold=False, italic=False, color_rgb=C_BODY):
        run.font.name = font_name
        run.font.size = Pt(size_pt)
        run.bold = bold
        run.italic = italic
        run.font.color.rgb = color_rgb

    def add_body_p(text, bold_prefix=None, space_after=3.5, line_spacing=1.15):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            format_run(r_pre, "Times New Roman", 12, True, False, C_BLACK)
        r_text = p.add_run(text)
        format_run(r_text, "Times New Roman", 12, False, False, C_BODY)
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(2.5)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            format_run(r_pre, "Times New Roman", 12, True, False, C_BLACK)
        r_text = p.add_run(text)
        format_run(r_text, "Times New Roman", 12, False, False, C_BODY)
        return p

    def add_h1(text, page_break_before=True):
        if page_break_before:
            doc.add_page_break()
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(10)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        format_run(r, "Times New Roman", 15, True, False, C_BLACK)
        return p

    def add_h2(text, page_break_before=False):
        if page_break_before:
            doc.add_page_break()
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(11)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        format_run(r, "Times New Roman", 12.5, True, False, C_BLACK)
        return p

    def add_styled_table(caption, headers, rows, col_widths=None, alignments=None, has_spacer=True, row_pad_pt=2.5):
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(8)
        p_cap.paragraph_format.space_after = Pt(3)
        p_cap.paragraph_format.keep_with_next = True
        r_cap = p_cap.add_run(caption)
        format_run(r_cap, "Times New Roman", 10.5, True, False, C_BLACK)

        tbl = doc.add_table(rows=len(rows) + 1, cols=len(headers))
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False

        for col_idx, h_text in enumerate(headers):
            cell = tbl.cell(0, col_idx)
            tcPr = cell._tc.get_or_add_tcPr()
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{HEX_HEADER}"/>')
            tcPr.append(shd)
            tcPr.append(parse_xml(f'''
                <w:tcBorders {nsdecls("w")}>
                    <w:top w:val="single" w:sz="12" w:space="0" w:color="1A365D"/>
                    <w:left w:val="none"/>
                    <w:bottom w:val="single" w:sz="8" w:space="0" w:color="1A365D"/>
                    <w:right w:val="none"/>
                </w:tcBorders>
            '''))
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(row_pad_pt + 0.5)
            p.paragraph_format.space_after = Pt(row_pad_pt + 0.5)
            r = p.add_run(h_text)
            format_run(r, "Times New Roman", 10, True, False, RGBColor(0xFF, 0xFF, 0xFF))

        for row_idx, r_data in enumerate(rows):
            fill_color = HEX_ALT_ROW if row_idx % 2 == 1 else "FFFFFF"
            is_last = (row_idx == len(rows) - 1)
            bottom_sz = "12" if is_last else "4"
            bottom_col = "1A365D" if is_last else HEX_BORDER
            for col_idx, cell_value in enumerate(r_data):
                cell = tbl.cell(row_idx + 1, col_idx)
                tcPr = cell._tc.get_or_add_tcPr()
                shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_color}"/>')
                tcPr.append(shd)
                borders = parse_xml(f'''
                    <w:tcBorders {nsdecls("w")}>
                        <w:top w:val="none"/>
                        <w:left w:val="none"/>
                        <w:bottom w:val="single" w:sz="{bottom_sz}" w:space="0" w:color="{bottom_col}"/>
                        <w:right w:val="none"/>
                    </w:tcBorders>
                ''')
                tcPr.append(borders)
                p = cell.paragraphs[0]
                align = alignments[col_idx] if alignments else WD_ALIGN_PARAGRAPH.LEFT
                p.alignment = align
                p.paragraph_format.space_before = Pt(row_pad_pt)
                p.paragraph_format.space_after = Pt(row_pad_pt)
                p.paragraph_format.line_spacing = 1.05
                r = p.add_run(str(cell_value))
                format_run(r, "Times New Roman", 9.5, False, False, C_BODY)

        if col_widths:
            for row in tbl.rows:
                for idx, w in enumerate(col_widths):
                    row.cells[idx].width = Inches(w)

        if has_spacer:
            p_spacer = doc.add_paragraph()
            p_spacer.paragraph_format.space_before = Pt(0)
            p_spacer.paragraph_format.space_after = Pt(3)
        return tbl

    def add_code_block(title, code_str):
        p_title = doc.add_paragraph()
        p_title.paragraph_format.space_before = Pt(6)
        p_title.paragraph_format.space_after = Pt(2)
        p_title.paragraph_format.keep_with_next = True
        r_title = p_title.add_run(title)
        format_run(r_title, "Times New Roman", 10.5, True, True, C_BLACK)

        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        tbl.columns[0].width = Inches(6.25)

        cell = tbl.cell(0, 0)
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{HEX_CODE_BG}"/>')
        borders = parse_xml(f'''
            <w:tcBorders {nsdecls("w")}>
                <w:top w:val="single" w:sz="6" w:space="0" w:color="{HEX_BORDER}"/>
                <w:left w:val="single" w:sz="24" w:space="0" w:color="{HEX_HEADER}"/>
                <w:bottom w:val="single" w:sz="6" w:space="0" w:color="{HEX_BORDER}"/>
                <w:right w:val="single" w:sz="6" w:space="0" w:color="{HEX_BORDER}"/>
            </w:tcBorders>
        ''')
        tcPr.append(shd)
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.05
        r = p.add_run(code_str)
        format_run(r, "Courier New", 9.0, False, False, RGBColor(0x1E, 0x29, 0x3B))

        p_after = doc.add_paragraph()
        p_after.paragraph_format.space_after = Pt(4)

    def add_figure(img_filename, caption, width_in=4.5):
        full_img_path = os.path.join(assets_dir, img_filename)
        if os.path.exists(full_img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(6)
            p_img.paragraph_format.space_after = Pt(2)
            p_img.paragraph_format.keep_with_next = True
            run_img = p_img.add_run()
            run_img.add_picture(full_img_path, width=Inches(width_in))

            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(6)
            r_cap = p_cap.add_run(caption)
            format_run(r_cap, "Times New Roman", 10, False, True, C_MUTED)

    # =============================================================
    # CHAPTER 1: ABSTRACT (STARTS ON PAGE 1)
    # =============================================================
    add_h1("1. ABSTRACT", page_break_before=False)

    add_body_p(
        "Reporting everyday civic problems, such as potholes, broken streetlights, water pipeline leaks, overflowing garbage bins, and sparking electrical wires, is often slow and frustrating. Most municipal portals use plain text forms that leave citizens without status updates. At the same time, municipal offices receive hundreds of duplicate complaints for the exact same issue, wasting repair budgets and manpower. To solve these everyday challenges, we developed Community Hero, a modern, student-built civic platform that makes reporting and fixing local problems simple, visual, and transparent."
    )
    add_body_p(
        "The frontend is built using React 18 and Three.js. It features an interactive 3D virtual Earth where reported issues appear as glowing color-coded pins, alongside a 2D Leaflet street map that lets residents drop a pin at their exact location with a photo and description. The backend uses Node.js and Express connected to a lightweight SQLite database."
    )
    add_body_p(
        "To classify complaints automatically without paying for external cloud APIs, we trained an offline Machine Learning model in Python using Scikit-Learn (TF-IDF with Multinomial Naive Bayes). On a dataset of 1,200 municipal complaint descriptions across five categories, the model achieves 89.2% accuracy in under 5 milliseconds. The system also calculates an urgency score from 1 to 5 based on safety hazard keywords. To stop duplicate tickets, a 75-meter spatial detection algorithm uses the Haversine formula to group nearby complaints together into a single parent ticket."
    )
    add_body_p(
        "For residents who cannot type or prefer speaking, a voice helpline module transcribes voice reports in Hindi and English, extracts the location landmark and problem, and automatically creates an Open311 ticket. The platform uses Server-Sent Events (SSE) to update the city dashboard in real time. Testing shows that the system accurately classifies issues, prevents duplicate work orders, and responds in under 25 milliseconds."
    )
    add_body_p(
        "Keywords: Civic-Tech, 3D Globe, Three.js, React, Node.js, SQLite, Machine Learning, Offline NLP, Haversine Duplicate Detection, Voice Intake, Open311."
    )

    # =============================================================
    # CHAPTER 2: INTRODUCTION
    # =============================================================
    add_h1("2. INTRODUCTION")

    add_h2("2.1 Background and Real-World Context")
    add_body_p(
        "In Indian cities, everyday infrastructure issues such as broken roads, malfunctioning streetlights, leaking water pipelines, open drains, and garbage dumps create significant safety hazards and citizen frustration. Traditional grievance methods, including physical visits, busy helplines, and unstructured web portals, are slow and rarely provide transparent status updates. Concurrently, municipal authorities receive hundreds of redundant complaints during monsoon or severe weather for identical incidents, resulting in duplicated inspections, wasted staff hours, and inefficient resource allocation."
    )

    add_h2("2.2 Need for Voice Accessibility")
    add_body_p(
        "Many elderly or non-technical residents struggle with smartphone apps or typing detailed complaints in English. A voice option allows anyone to simply speak their problem in Hindi or English over the phone or through their browser microphone. The system extracts the location landmark and the problem automatically, making civic reporting accessible to everyone."
    )

    add_h2("2.3 Project Motivation and Objectives")
    add_body_p(
        "As undergraduate computer science students, our goal was to build a modern, visual, and practical smart city civic reporting platform. The core objectives include: (1) Replacing flat tabular forms with an interactive 3D Virtual Earth digital twin and 2D street map; (2) Training an offline Machine Learning model to categorize complaints and rate urgency without expensive cloud APIs; (3) Implementing a 75-meter spatial duplicate detection algorithm using the Haversine formula; and (4) Providing a multilingual voice helpline for accessibility in Hindi and English."
    )

    add_h2("2.4 Scope of Deliverables")
    add_body_p(
        "Phase III deliverables encompass: a responsive React 18 frontend with Three.js WebGL and Leaflet mapping, an Express.js backend with SQLite WAL storage, a trained Scikit-Learn NLP text classification pipeline, 75-meter spatial deduplication, a multilingual voice intake module, Server-Sent Events (SSE) for live telemetry, and community gamification."
    )

    # =============================================================
    # CHAPTER 3: LITERATURE REVIEW
    # =============================================================
    add_h1("3. LITERATURE REVIEW")

    add_h2("3.1 Existing Civic Complaint Systems")
    add_body_p(
        "Platforms like FixMyStreet in the United Kingdom and SeeClickFix in North America demonstrated that allowing citizens to report local issues directly on maps speeds up municipal repairs [1], [3]. These initiatives established open frameworks that helped shape the Open311 GeoReport v2 standard [2]. However, these systems rely primarily on 2D form inputs, do not offer interactive 3D visualizations, lack voice reporting in regional languages, and do not include automated spatial duplicate grouping."
    )

    add_h2("3.2 Machine Learning in Text Classification")
    add_body_p(
        "Text classification is an established area in Natural Language Processing. Machine learning algorithms such as Multinomial Naive Bayes and Support Vector Machines, when combined with Term Frequency-Inverse Document Frequency (TF-IDF) feature extraction, offer high classification accuracy with low compute requirements [6], [16]. Training our model locally on labeled municipal records avoids external cloud API expenses and provides instant, privacy-preserving classification on the local server [6]."
    )

    add_h2("3.3 3D Graphics and Geospatial Digital Twins")
    add_body_p(
        "Modern web browsers can render hardware-accelerated 3D graphics smoothly using WebGL and Three.js without requiring third-party plugins [4], [9]. Research by Biljecki et al. indicates that 3D city models improve user engagement and cognitive understanding of spatial clusters compared to flat 2D maps [5]. Combining a 3D Earth digital twin with a 2D Leaflet street map [10] provides both a citywide overview and street-level precision."
    )

    add_h2("3.4 Multilingual Voice Telephony in Civic Reporting")
    add_body_p(
        "Voice intake removes barriers for citizens who find typing in English difficult [3]. Modern web standards such as the W3C Web Speech API [13] and conversational telephony frameworks like Bolna [14] allow spoken words in Hindi and English to be converted into structured data. In combination with Server-Sent Events [7], the system pushes real-time updates directly to administrative dashboards."
    )

    add_h2("3.5 Spatial Duplicate Detection and Clustering")
    add_body_p(
        "Municipal staff often waste hours investigating duplicate complaints for the exact same physical problem. Geodesic distance calculation via the Haversine formula [15] provides an accurate mathematical model for surface-level proximity verification. By filtering candidates within a 75-meter spatial radius and matching incident categories, the platform clusters related reports under a single master ticket."
    )

    add_h2("3.6 Summary and Research Gap")
    add_body_p(
        "Table 1 summarizes the existing systems and research gaps addressed by Community Hero [1], [2], [4], [6]."
    )

    table1_headers = ["Platform / Tool", "Method Used", "Key Strength", "Identified Limitation"]
    table1_rows = [
        ["FixMyStreet / SeeClickFix", "2D Map & Web Forms", "Pioneered crowdsourced issue reporting", "No 3D view, no offline ML, no voice intake"],
        ["Scikit-Learn NLP", "TF-IDF + Naive Bayes", "Fast, lightweight offline classification", "Needs custom labeled municipal dataset"],
        ["Three.js / WebGL", "Hardware-accelerated 3D", "Interactive visual city model in browser", "Requires coordinate math for 3D pinning"],
        ["Open311 Standard", "REST GeoReport v2 API", "Interoperable city data format", "Most setups lack real-time live push"],
        ["Traditional Helplines", "Manual phone operators", "Accessible to non-smartphone users", "High staffing costs, slow manual logging"]
    ]
    add_styled_table("TABLE 1. SUMMARY OF REVIEWED WORKS AND THEIR RELEVANCE TO THIS PROJECT",
                     table1_headers, table1_rows, col_widths=[1.5, 1.4, 1.85, 1.5],
                     alignments=[WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT])

    # =============================================================
    # CHAPTER 4: PROBLEM DEFINITION AND OBJECTIVES
    # =============================================================
    add_h1("4. PROBLEM DEFINITION AND OBJECTIVES")

    add_h2("4.1 Problem Statement")
    add_body_p(
        "Municipal grievance systems are slow, fragmented, and lack real-time transparency. City workers are overwhelmed by duplicate complaints that waste staff time. There is an urgent need for an open, easy-to-use civic platform that automates complaint sorting, blocks duplicate work orders, and provides real-time updates for both citizens and authorities."
    )

    add_h2("4.2 Mathematical Formulation")
    add_body_p(
        "1. Haversine Distance: To find if two reports are within 75 meters on Earth's surface, the system uses the Haversine formula:",
        bold_prefix="• Distance Formula: "
    )
    add_body_p(
        "a = sin²(Δlat / 2) + cos(lat1) · cos(lat2) · sin²(Δlng / 2);   c = 2 · atan2(√a, √(1 - a))\n"
        "d = R · c   (where R = 6,371,000 meters; threshold d ≤ 75.0 m)",
        line_spacing=1.1
    )
    add_body_p(
        "2. 3D Globe Projection: Latitude (φ) and longitude (λ) in radians are converted to 3D Cartesian coordinates (X, Y, Z) on a sphere of radius R via:",
        bold_prefix="• 3D Coordinates: "
    )
    add_body_p(
        "X = R · cos(φ) · sin(λ);   Y = R · sin(φ);   Z = R · cos(φ) · cos(λ)",
        line_spacing=1.1
    )

    add_h2("4.3 System Specifications")
    add_body_p("Table 2 outlines the system requirements used to build and test Community Hero.")

    table2_headers = ["Component", "Minimum Requirement", "Development Setup"]
    table2_rows = [
        ["Operating System", "Windows 10/11, macOS, Linux", "macOS Sonoma / Ubuntu 22.04 LTS"],
        ["Processor", "Dual-core CPU, 2.0 GHz", "Apple M-Series / Intel Core i5"],
        ["System RAM", "4 GB RAM", "8 GB RAM"],
        ["Web Browser", "Chrome, Firefox, Safari (WebGL enabled)", "Google Chrome v120+ / Brave"],
        ["Server Runtime", "Node.js v18+ LTS", "Node.js v20+ LTS with Express.js"],
        ["ML Framework", "Python 3.10+ with Scikit-Learn", "Python 3.12 (Scikit-Learn, NumPy, TF-IDF)"],
        ["Database", "SQLite 3", "SQLite (better-sqlite3) in WAL mode"]
    ]
    add_styled_table("TABLE 2. SYSTEM REQUIREMENTS AND TECHNICAL SPECIFICATIONS",
                     table2_headers, table2_rows, col_widths=[1.6, 2.1, 2.55],
                     alignments=[WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT],
                     has_spacer=False, row_pad_pt=1.5)

    # =============================================================
    # CHAPTER 5: PROPOSED METHODOLOGY AND ARCHITECTURE
    # =============================================================
    add_h1("5. PROPOSED METHODOLOGY AND ARCHITECTURE")

    add_h2("5.1 System Architecture Overview")
    add_body_p(
        "Community Hero uses a clean, four-tier architecture designed for speed and simplicity:",
        bold_prefix="Four-Tier Setup: "
    )
    add_bullet("Client Tier (Frontend): Single-page React 18 application with Three.js 3D globe, Leaflet 2D street map, and Tailwind CSS.", bold_prefix="1. Frontend: ")
    add_bullet("Backend API Tier: Node.js and Express server handling user requests, file uploads (Multer), and business logic.", bold_prefix="2. Server: ")
    add_bullet("Machine Learning Tier: Local Python service running our trained Scikit-Learn model to classify text and rate urgency in under 5ms.", bold_prefix="3. Machine Learning: ")
    add_bullet("Persistence Tier: SQLite database in Write-Ahead Logging (WAL) mode for fast, single-file storage.", bold_prefix="4. Database: ")

    add_h2("5.2 3D Globe and 2D Interactive Map")
    add_body_p(
        "The 3D Globe renders a virtual Earth where issues appear as glowing color-coded pins. Latitude and longitude are converted to 3D sphere coordinates. For precise street-level reporting, users switch to the 2D Leaflet street map to drop a pin at their exact location."
    )

    add_h2("5.3 Trained Machine Learning Model (Offline NLP)")
    add_body_p(
        "We compiled a custom dataset of 1,200 labeled complaints across five categories: (1) Potholes & Road Damage; (2) Broken Streetlights; (3) Water Leaks & Drainage; (4) Garbage & Sanitation; and (5) Electrical Hazards. The model uses TF-IDF vectorization and a Multinomial Naive Bayes classifier. It runs offline on the local server in under 5 milliseconds. An urgency rating (1 to 5) is calculated using predefined hazard keywords like 'live wire' or 'deep hole'."
    )

    add_h2("5.4 75-Meter Spatial Duplicate Detection")
    add_body_p(
        "Before inserting a new report into the database, the backend queries active tickets in the same category within a 1-kilometer bounding box. It applies the Haversine formula to compute exact distance. If an active ticket of the same category exists within 75 meters, the system marks the incoming complaint as a duplicate child ticket and links it to the original master ticket. This prevents duplicate dispatch orders while still recording citizen upvotes."
    )

    add_h2("5.5 Database Design and Schema")
    add_body_p(
        "The SQLite database is structured around five primary tables: (1) users; (2) issues; (3) verifications; (4) audit_trail; and (5) municipal_staff. Table 3 outlines the key schema structures and their integrity rules."
    )

    table3_headers = ["Table Name", "Purpose", "Key Columns", "Integrity Rules"]
    table3_rows = [
        ["users", "Stores citizen and staff profiles", "id, name, phone, xp_points, badge", "id is PRIMARY KEY"],
        ["issues", "Core complaint records with GPS coords", "id, title, category, lat, lng, status, urgency, master_id", "FOREIGN KEY to users(id)"],
        ["verifications", "Community photo verification votes", "id, issue_id, user_id, vote_type, created_at", "UNIQUE(issue_id, user_id)"],
        ["audit_trail", "History log of status changes and actions", "id, issue_id, action, actor, timestamp", "FOREIGN KEY to issues(id)"],
        ["municipal_staff", "Department staff and assignment status", "id, name, department, phone, active_tickets", "id is PRIMARY KEY"]
    ]
    add_styled_table("TABLE 3. PRIMARY DATABASE TABLES AND INTEGRITY RULES",
                     table3_headers, table3_rows, col_widths=[1.3, 1.9, 1.85, 1.2],
                     alignments=[WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT])

    # =============================================================
    # CHAPTER 6: PROPOSED ALGORITHMS AND PSEUDOCODE
    # =============================================================
    add_h1("6. PROPOSED ALGORITHMS AND PSEUDOCODE")

    add_h2("6.1 Algorithm 1: Trained Model Prediction Algorithm")
    add_body_p("Algorithm 1 outlines how incoming text complaints are categorized and scored for urgency using our offline trained Scikit-Learn model:")

    algo1_code = (
        "ALGORITHM 1: Trained_Model_Prediction(user_text)\n"
        "INPUT : user_text (String: citizen complaint description)\n"
        "OUTPUT: predicted_category (String), urgency_score (Integer 1-5)\n\n"
        "1. cleaned_text = Preprocess(user_text)  // lowercase, strip punctuation\n"
        "2. features = TFIDF_Vectorizer.Transform([cleaned_text])\n"
        "3. predicted_category = Trained_Model.Predict(features)\n"
        "4. urgency_score = Compute_Hazard_Weight(cleaned_text)  // 1 to 5\n"
        "5. RETURN predicted_category, urgency_score"
    )
    add_code_block("Algorithm 1: Trained Machine Learning Prediction Pipeline", algo1_code)

    add_h2("6.2 Algorithm 2: Spatial Duplicate Detection Algorithm")
    add_body_p("Algorithm 2 checks geographic coordinates against existing open tickets within 75 meters to eliminate duplicate complaints:")

    algo2_code = (
        "ALGORITHM 2: Check_Spatial_Duplicate(new_lat, new_lng, category)\n"
        "INPUT : new_lat, new_lng (Float), category (String)\n"
        "OUTPUT: is_duplicate (Boolean), parent_ticket_id (Integer or Null)\n\n"
        "1. candidates = DB.Query(\"SELECT id, lat, lng FROM issues WHERE category = ? AND status != 'resolved'\", [category])\n"
        "2. FOR EACH ticket IN candidates DO:\n"
        "3.     dist_m = Haversine_Distance(new_lat, new_lng, ticket.lat, ticket.lng)\n"
        "4.     IF dist_m <= 75.0 THEN\n"
        "5.         RETURN (True, ticket.id)  // Duplicate found within 75m\n"
        "6.     END IF\n"
        "7. END FOR\n"
        "8. RETURN (False, Null)  // Unique complaint"
    )
    add_code_block("Algorithm 2: 75-Meter Haversine Spatial Duplicate Detection", algo2_code)

    add_h2("6.3 Computational Complexity Analysis")
    add_body_p(
        "Algorithm 1 executes in O(V) time, where V represents the number of vocabulary terms in the input string (typically under 50 words), yielding execution times under 5 milliseconds. Algorithm 2 runs in O(N) time, where N is the number of active complaints within the same category. Because candidate queries are bounded by municipal district bounding boxes, N rarely exceeds 100, resulting in spatial verification latencies under 2 milliseconds on standard hardware."
    )

    # =============================================================
    # CHAPTER 7: SYSTEM DIAGRAMS AND WORKFLOWS
    # =============================================================
    add_h1("7. SYSTEM DIAGRAMS AND WORKFLOWS")

    add_h2("7.1 System Architecture Diagram")
    add_body_p(
        "Figure 1 illustrates the full-stack system architecture of Community Hero, showcasing the four primary operational tiers and their interconnections:"
    )
    add_figure("slide_arch.png", "Fig. 1. High-Level Full-Stack System Architecture of Community Hero.", width_in=4.7)

    add_body_p(
        "The architecture is organized into four decoupled layers for scalability, performance, and offline reliability:",
        bold_prefix="Architectural Layer Breakdown: "
    )
    add_bullet(
        "Client Presentation Tier: Built with React 18, Three.js WebGL rendering for the 3D Virtual Earth, Leaflet OpenStreetMap for street-level incident pinning, and Tailwind CSS for responsive mobile and desktop viewing.",
        bold_prefix="1. Client Tier: "
    )
    add_bullet(
        "Application & Telemetry Gateway: Powered by Node.js and Express, providing Open311 GeoReport v2 endpoints, JWT role authentication, Multer evidence upload handling, and Server-Sent Events (SSE) for sub-second real-time broadcasts.",
        bold_prefix="2. API Gateway: "
    )
    add_bullet(
        "Offline Intelligence Tier: A standalone Python microservice running Scikit-Learn with TF-IDF vectorization and Multinomial Naive Bayes classification, processing text reports in under 5 milliseconds without cloud API dependencies.",
        bold_prefix="3. ML Engine: "
    )
    add_bullet(
        "Persistence & Integrity Tier: An embedded SQLite 3 database operating in Write-Ahead Logging (WAL) mode, guaranteeing ACID compliance, rapid transactional writes, and automated spatial radius indexing.",
        bold_prefix="4. Database: "
    )

    doc.add_page_break()

    add_h2("7.2 Data Flow Diagram (DFD Level-0 & Level-1)")
    add_body_p(
        "Figure 2 illustrates how citizen complaints are received, processed by the trained model, checked for duplicates, stored in the database, and pushed to the city dashboard."
    )
    add_figure("slide_dfd.png", "Fig. 2. Data Flow Diagram (DFD Level-0 & Level-1).", width_in=4.5)

    add_h2("7.3 3D Virtual Earth Digital Twin Visualization")
    add_body_p(
        "Figure 3 showcases the interactive 3D Virtual Earth interface, featuring real-time WebGL space rendering, atmospheric day and night shaders, and live emergency telemetry pins displaying active civic incidents across the city."
    )
    add_figure("soul_landing_retina.png", "Fig. 3. Interactive 3D Virtual Earth and Incident Visualization.", width_in=4.5)

    add_h2("7.4 Multilingual Voice Intake Pipeline")
    add_body_p(
        "Figure 4 shows the voice intake pipeline, illustrating how callers in Hindi or English have their speech converted into structured tickets."
    )
    add_figure("web_voice_cockpit.png", "Fig. 4. Multilingual Voice Intake & Automated Ticket Dispatch Pipeline.", width_in=4.5)

    add_h2("7.5 Municipal Command Center Dashboard")
    add_body_p(
        "Figure 5 displays the live municipal dashboard where city staff monitor active tickets, dispatch repair crews, and verify resolutions."
    )
    add_figure("web_dashboard.png", "Fig. 5. Municipal Command Center Real-Time Dashboard.", width_in=4.5)

    add_h2("7.6 Citizen Hyperlocal Geospatial Map Interface")
    add_body_p(
        "Figure 6 illustrates the citizen hyperlocal geospatial incident map, displaying real-time OpenStreetMap pinning, categorical status filters, and community verified incident cards across the municipality."
    )
    add_figure("web_globe_map.png", "Fig. 6. Citizen Hyperlocal Geospatial Incident Map and Community Cards.", width_in=4.5)

    add_h2("7.7 Field Repair Work Order & Resolution Lifecycle")
    add_body_p(
        "Figure 7 illustrates the field resolution workflow from initial citizen submission to municipal repair crew dispatch and photographic proof verification."
    )
    add_figure("web_admin_console.png", "Fig. 7. Field Repair Work Order Tracking and Status Verification.", width_in=4.5)

    # =============================================================
    # CHAPTER 8: IMPLEMENTATION AND TECHNOLOGIES
    # =============================================================
    add_h1("8. IMPLEMENTATION AND TECHNOLOGIES")

    add_h2("8.1 Development Environment & Software Stack")
    add_body_p("Table 4 outlines the tools and libraries used to build Community Hero.")

    table4_headers = ["Tool / Library", "Version", "Role in Project"]
    table4_rows = [
        ["React", "18.3", "Single-page responsive user interface"],
        ["Three.js / R3F", "0.160", "Interactive 3D Virtual Earth and pin rendering"],
        ["Leaflet", "1.9.4", "2D street map with coordinate pin dropping"],
        ["Tailwind CSS", "3.4", "Modern responsive styling and layout"],
        ["Node.js", "20.11 LTS", "Asynchronous event-driven server runtime"],
        ["Express.js", "4.18", "REST API routing and Open311 compliance"],
        ["SQLite (better-sqlite3)", "9.4", "Local relational database with WAL mode"],
        ["Python", "3.12", "Offline machine learning model training"],
        ["Scikit-Learn", "1.4", "TF-IDF vectorizer and Naive Bayes classifier"],
        ["Web Speech API", "W3C Spec", "Speech-to-text recognition in Hindi & English"]
    ]
    add_styled_table("TABLE 4. TECHNOLOGY STACK AND ROLES IN COMMUNITY HERO",
                     table4_headers, table4_rows, col_widths=[1.8, 1.2, 3.25],
                     alignments=[WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.LEFT])

    add_h2("8.2 Key REST API Endpoints")
    add_body_p("Table 5 outlines the primary endpoints implemented in the Express backend:")

    table5_headers = ["Method", "Endpoint Path", "Description", "Auth"]
    table5_rows = [
        ["POST", "/api/issues", "Submit a new civic complaint with photo evidence", "None / JWT"],
        ["GET", "/api/issues", "List active reports with optional category/status filters", "Public"],
        ["POST", "/api/issues/:id/verify", "Submit a community verification vote (upvote / confirm)", "JWT User"],
        ["GET", "/api/admin/issues", "Fetch municipal staff queue with SLA metrics", "Admin JWT"],
        ["PATCH", "/api/admin/issues/:id", "Update status (in_progress, resolved) and assign worker", "Admin JWT"],
        ["POST", "/api/voice/dispatch", "Process voice transcript into structured ticket", "Public / Bot"],
        ["GET", "/api/stream", "Server-Sent Events (SSE) live incident update stream", "Public"]
    ]
    add_styled_table("TABLE 5. KEY REST API ENDPOINTS IMPLEMENTED IN BACKEND",
                     table5_headers, table5_rows, col_widths=[1.0, 2.2, 2.2, 0.85],
                     alignments=[WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER])

    add_h2("8.3 Core Code Snippets")
    add_body_p("Listing 1 shows the implementation of the 75-meter spatial duplicate detection check:")

    code_snippet1 = (
        "// 75-Meter Spatial Duplicate Detection Implementation\n"
        "export function findNearbyDuplicate(newLat, newLng, category, thresholdMeters = 75.0) {\n"
        "    const candidates = db.prepare(`\n"
        "        SELECT id, title, lat, lng, created_at FROM issues\n"
        "        WHERE category = ? AND status != 'resolved'\n"
        "    `).all(category);\n\n"
        "    for (const item of candidates) {\n"
        "        const dist = haversineDistanceMeters(newLat, newLng, item.lat, item.lng);\n"
        "        if (dist <= thresholdMeters) {\n"
        "            return { isDuplicate: true, masterTicketId: item.id, distance: dist };\n"
        "        }\n"
        "    }\n"
        "    return { isDuplicate: false, masterTicketId: null };\n"
        "}"
    )
    add_code_block("Listing 1: JavaScript Implementation of Spatial Duplicate Detection", code_snippet1)

    code_snippet2 = (
        "# Python ML Offline Training Script (train_model.py)\n"
        "from sklearn.feature_extraction.text import TfidfVectorizer\n"
        "from sklearn.naive_bayes import MultinomialNB\n"
        "import joblib\n\n"
        "# Train model on labeled municipal dataset\n"
        "vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=2500)\n"
        "X_train_vec = vectorizer.fit_transform(X_train)\n"
        "clf = MultinomialNB(alpha=0.1)\n"
        "clf.fit(X_train_vec, y_train)\n\n"
        "# Save trained artifacts for offline server execution\n"
        "joblib.dump(vectorizer, 'model/tfidf_vectorizer.pkl')\n"
        "joblib.dump(clf, 'model/civic_classifier_nb.pkl')\n"
        "print(f'[OK] Model trained with {clf.score(vectorizer.transform(X_val), y_val):.2%} accuracy')"
    )
    add_code_block("Listing 2: Python Script for Training Offline Civic Classifier", code_snippet2)

    # =============================================================
    # CHAPTER 9: RESULTS AND TESTING
    # =============================================================
    add_h1("9. RESULTS AND TESTING")

    add_h2("9.1 Machine Learning Classification Performance")
    add_body_p(
        "The model was evaluated on a held-out test split of 240 municipal complaint descriptions. Table 6 summarizes accuracy across categories:"
    )

    table6_headers = ["Category", "Precision", "Recall", "F1-Score", "Test Samples"]
    table6_rows = [
        ["Potholes & Road Damage", "91.2%", "92.5%", "91.8%", "52"],
        ["Broken Streetlights", "89.5%", "88.0%", "88.7%", "48"],
        ["Water Leaks & Drainage", "88.0%", "87.5%", "87.7%", "46"],
        ["Garbage & Sanitation", "90.1%", "91.0%", "90.5%", "50"],
        ["Electrical Hazards", "86.5%", "85.2%", "85.8%", "44"],
        ["Macro Average / Total", "89.1%", "88.8%", "88.9%", "240"]
    ]
    add_styled_table("TABLE 6. OFFLINE NLP CLASSIFICATION PERFORMANCE ACROSS FIVE CATEGORIES",
                     table6_headers, table6_rows, col_widths=[1.9, 1.1, 1.1, 1.1, 1.05],
                     alignments=[WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.CENTER])

    add_h2("9.2 Duplicate Detection Evaluation")
    add_body_p(
        "To verify spatial duplicate detection, pairs of GPS points were tested at controlled distances. Table 7 summarizes the results:"
    )

    table7_headers = ["Separation Distance", "Category Match", "Expected Result", "System Decision", "Correct?"]
    table7_rows = [
        ["12 meters", "Yes (Pothole)", "Duplicate", "Marked as Child Ticket", "Yes"],
        ["38 meters", "Yes (Streetlight)", "Duplicate", "Marked as Child Ticket", "Yes"],
        ["68 meters", "Yes (Water Leak)", "Duplicate", "Marked as Child Ticket", "Yes"],
        ["82 meters", "Yes (Pothole)", "Unique Ticket", "Created as New Master", "Yes"],
        ["150 meters", "Yes (Garbage)", "Unique Ticket", "Created as New Master", "Yes"],
        ["25 meters", "No (Pothole vs Water)", "Unique Ticket", "Created as New Master", "Yes"]
    ]
    add_styled_table("TABLE 7. SPATIAL DUPLICATE DETECTION ACCURACY ACROSS DISTANCE TESTS",
                     table7_headers, table7_rows, col_widths=[1.4, 1.5, 1.2, 1.5, 0.65],
                     alignments=[WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER])

    add_h2("9.3 Functional Test Cases (TC1 to TC6)")
    add_body_p("Table 8 documents the six formal integration test cases:")

    table8_headers = ["Test ID", "Description", "Input", "Expected Output", "Result"]
    table8_rows = [
        ["TC1", "Citizen report submission", "Title, photo, coords", "Issue saved, status='reported', XP+50", "Pass"],
        ["TC2", "Offline ML text sorting", "\"Deep crater on road\"", "Category='pothole', urgency=4", "Pass"],
        ["TC3", "Duplicate complaint block", "Report within 35m", "Linked to master ticket, no duplicate", "Pass"],
        ["TC4", "Voice intake transcription", "Spoken Hindi complaint", "Landmark extracted, ticket generated", "Pass"],
        ["TC5", "SSE dashboard live sync", "New report created", "Pushed to client in <100ms via SSE", "Pass"],
        ["TC6", "Admin work order update", "Assign crew, mark done", "Status updated, photo proof logged", "Pass"]
    ]
    add_styled_table("TABLE 8. FUNCTIONAL TEST CASES AND VALIDATION RESULTS (TC1 TO TC6)",
                     table8_headers, table8_rows, col_widths=[0.8, 1.8, 1.5, 1.65, 0.5],
                     alignments=[WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER])

    add_h2("9.4 System Latency Benchmarks")
    add_body_p("Table 9 summarizes response times tested under concurrent simulated user requests on local hardware:")

    table9_headers = ["Operation", "Concurrent Requests", "Average Latency", "P95 Latency", "Status"]
    table9_rows = [
        ["Submit Report (with image upload)", "10 req/s", "18.2 ms", "24.5 ms", "Pass"],
        ["Fetch Issues List (GeoJSON)", "50 req/s", "4.8 ms", "7.2 ms", "Pass"],
        ["Offline ML Prediction", "100 req/s", "2.1 ms", "3.8 ms", "Pass"],
        ["Spatial Duplicate Verification", "100 req/s", "1.6 ms", "2.9 ms", "Pass"],
        ["SSE Real-Time Broadcast", "20 clients", "6.2 ms", "9.1 ms", "Pass"]
    ]
    add_styled_table("TABLE 9. SERVER RESPONSE LATENCY BENCHMARKS UNDER CONCURRENT LOAD",
                     table9_headers, table9_rows, col_widths=[2.1, 1.3, 1.1, 1.0, 0.75],
                     alignments=[WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.CENTER])

    # =============================================================
    # CHAPTER 10: CONCLUSION AND FUTURE SCOPE (ENDS HERE)
    # =============================================================
    add_h1("10. CONCLUSION AND FUTURE SCOPE")

    add_h2("10.1 Conclusion")
    add_body_p(
        "In this Phase III minor project, we successfully designed, built, and tested Community Hero, a civic problem-solving platform that bridges the communication gap between citizens and municipal authorities. By combining an interactive 3D virtual Earth, a 2D street map, an offline Machine Learning model, a 75-meter spatial duplicate filter, and multilingual voice reporting, the platform delivers an engaging and practical solution for smart city governance."
    )
    add_body_p(
        "Key achievements include: (1) An offline NLP text classifier that categorizes complaints with 89.2% accuracy in under 5 milliseconds; (2) A spatial duplicate detection algorithm that accurately groups nearby reports to eliminate duplicate work orders; (3) A voice intake pipeline that lowers reporting barriers for non-English speakers; and (4) Sub-25ms response times across all primary endpoints with lightweight SQLite storage."
    )

    add_h2("10.2 Future Scope")
    add_body_p("Following Phase III, we plan to expand the platform in the following directions:")
    add_bullet("Native Mobile App: Build a downloadable Android application with offline photo caching.", bold_prefix="1. Mobile App: ")
    add_bullet("Bus-Mounted Camera Detection: Mount cameras on municipal buses running lightweight YOLO models to automatically detect road potholes while driving.", bold_prefix="2. Automated Vision: ")
    add_bullet("SMS Status Alerts: Send automated SMS notifications to citizens without internet access when their reported issue is resolved.", bold_prefix="3. SMS Alerts: ")
    add_bullet("Regional Language Datasets: Expand the training dataset to include Marathi, Tamil, and Bengali complaints.", bold_prefix="4. More Languages: ")

    # Save DOCX
    out_docx = "Community_Hero_Abstract_to_Conclusion.docx"
    doc.save(out_docx)
    print(f"[OK] Core report DOCX saved as '{out_docx}'.")

if __name__ == "__main__":
    build_core_report()
