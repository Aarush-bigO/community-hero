#!/usr/bin/env python3
"""
Model-Based Reflex Agents - 10-Slide Highly Advanced Presentation Builder
Topic: "10. Model-Based Reflex Agents" (AI-ML Coursework, IIIT Bhopal)
Presenter: Aarush Bharti (Scholar No: 24U020010) - Solo Presentation
Course Professor: Dr. Meenakshi Choudhary (Dept. of CSE, IIIT Bhopal)
Matches 100% of the editorial aesthetic, layout fidelity, typography, and card design
from the user's favorite Community Hero slide deck:
- 16:9 widescreen layout (16in x 9in)
- Deep plum containers (#2D0C1E), warm eggshell background (#FBF9F5), terracotta golden accents (#D97706)
- Balanced, full-height card grids with ZERO empty blank dead space
- Mathematical formulations, flowcharts, comparative matrices, failure modes, and modern neural world models
- Generates HTML, compiles to PDF via headless Chrome, verifies color/text, renders PNG slides, and saves to Desktop.
"""

import os
import base64
import subprocess
import shutil

ASSETS_DIR = "/Users/aarush/Desktop/Community Hero/docs/presentation_assets"
OUTPUT_HTML = "/Users/aarush/Desktop/Community Hero/docs/Model_Based_Reflex_Agents_10_Slide_Presentation.html"
OUTPUT_PDF = "/Users/aarush/Desktop/Community Hero/docs/Model_Based_Reflex_Agents_10_Slide_Presentation.pdf"
DESKTOP_PDF = "/Users/aarush/Desktop/Model_Based_Reflex_Agents_10_Slide_Presentation.pdf"
SLIDES_DIR = "/Users/aarush/.gemini/antigravity/brain/99e96aae-42f8-4184-bd34-3dc86e443d67/ai_ml_slides"

os.makedirs(SLIDES_DIR, exist_ok=True)

def get_base64_image(filename):
    path = os.path.join(ASSETS_DIR, filename)
    if not os.path.exists(path):
        return ""
    mime = "image/png" if filename.endswith(".png") else "image/jpeg"
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    return f"data:{mime};base64,{data}"

b64_iiit_logo = get_base64_image("iiit_logo.png")

# Common SVG vector icons
SVG_BRAIN = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/></svg>'''
SVG_CPU = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>'''
SVG_EYE = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>'''
SVG_EYE_OFF = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>'''
SVG_CLOCK = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'''
SVG_REFRESH = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>'''
SVG_ALERT = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'''
SVG_CHECK = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'''
SVG_DATABASE = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>'''
SVG_FLOW = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'''
SVG_CAR = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>'''
SVG_TARGET = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'''
SVG_BOOK = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'''
SVG_LIGHTBULB = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>'''
SVG_SHIELD = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'''
SVG_NETWORK = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'''

html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Model-Based Reflex Agents — AI & ML Academic Presentation</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}

  @page {{
    size: 16in 9in;
    margin: 0;
  }}

  html, body {{
    background-color: #EDE8E1;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #1A1A1A;
    -webkit-font-smoothing: antialiased;
  }}

  @media screen {{
    body {{
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 0;
      gap: 40px;
    }}
    .slide {{
      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.12), 0 2px 10px rgba(0, 0, 0, 0.06);
      border-radius: 6px;
    }}
  }}

  @media print {{
    body {{
      display: block !important;
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
    }}
    .slide {{
      display: block !important;
      margin: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      page-break-after: always !important;
      page-break-inside: avoid !important;
    }}
  }}

  .slide {{
    width: 16in;
    height: 9in;
    position: relative;
    background-color: #FBF9F5;
    overflow: hidden;
    padding: 0.45in 0.65in 0.4in;
    display: flex;
    flex-direction: column;
  }}

  /* HEADER */
  .slide-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.22in;
    flex-shrink: 0;
  }}

  .header-left-cluster {{
    display: flex;
    align-items: center;
    gap: 0.14in;
  }}

  .inst-badge {{
    background: #EFEAE3;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 30px;
    padding: 0.05in 0.16in;
    font-size: 0.12in;
    font-weight: 700;
    color: #4A3E39;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }}

  .course-badge {{
    background: #2D0C1E;
    color: #FFFFFF;
    border-radius: 30px;
    padding: 0.05in 0.18in;
    font-size: 0.12in;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }}

  .group-badge {{
    background: #EFEAE3;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 30px;
    padding: 0.05in 0.16in;
    font-size: 0.12in;
    font-weight: 700;
    color: #4A3E39;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }}

  .slide-counter {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.16in;
    font-weight: 700;
    color: #1A1A1A;
    letter-spacing: 0.08em;
    position: relative;
    padding-bottom: 0.04in;
  }}
  .slide-counter::after {{
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: #D97706;
    border-radius: 2px;
  }}

  /* TITLE ZONE */
  .slide-title-zone {{
    margin-bottom: 0.22in;
    flex-shrink: 0;
  }}

  .slide-title {{
    font-family: 'Playfair Display', serif;
    font-size: 0.42in;
    line-height: 1.15;
    font-weight: 700;
    color: #1F1614;
    letter-spacing: -0.01em;
  }}
  .slide-title span.accent {{
    color: #D97706;
    font-style: italic;
  }}

  .slide-subtitle {{
    font-size: 0.165in;
    color: #635752;
    margin-top: 0.05in;
    font-weight: 400;
    font-style: italic;
  }}

  /* CONTENT AREA */
  .slide-content {{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 0;
  }}

  /* FOOTER */
  .slide-footer {{
    margin-top: auto;
    padding-top: 0.12in;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #EFEAE3;
    font-size: 0.125in;
    color: #7A6F68;
    flex-shrink: 0;
  }}

  /* REUSABLE CARD SYSTEMS */
  .card {{
    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.07);
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(45, 12, 30, 0.03);
    position: relative;
  }}

  .plum-tag {{
    background: #2D0C1E;
    color: #FFFFFF;
    border-radius: 10px;
    padding: 0.06in 0.14in;
    font-size: 0.12in;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 0.08in;
  }}

  .amber-pill {{
    background: #FEF3C7;
    color: #92400E;
    border: 1px solid #FDE68A;
    border-radius: 8px;
    padding: 0.04in 0.12in;
    font-size: 0.12in;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.06in;
  }}

  .green-pill {{
    background: #DEF7EC;
    color: #03543F;
    border: 1px solid #BCF0DA;
    border-radius: 8px;
    padding: 0.04in 0.12in;
    font-size: 0.12in;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.06in;
  }}

  .blue-pill {{
    background: #E1EFFE;
    color: #1E429F;
    border: 1px solid #C3DDFD;
    border-radius: 8px;
    padding: 0.04in 0.12in;
    font-size: 0.12in;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.06in;
  }}

  .purple-pill {{
    background: #F3E8FF;
    color: #6B21A8;
    border: 1px solid #E9D5FF;
    border-radius: 8px;
    padding: 0.04in 0.12in;
    font-size: 0.12in;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.06in;
  }}

  /* QUOTE BANNER */
  .quote-banner {{
    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 14px;
    padding: 0.13in 0.22in;
    display: flex;
    align-items: center;
    gap: 0.2in;
    box-shadow: 0 4px 16px rgba(0,0,0,0.02);
    margin-top: 0.18in;
    flex-shrink: 0;
  }}

  .quote-label-badge {{
    background: #2D0C1E;
    color: #FFFFFF;
    border-radius: 20px;
    padding: 0.07in 0.18in;
    font-size: 0.125in;
    font-weight: 700;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 0.08in;
    flex-shrink: 0;
  }}

  .quote-text {{
    font-size: 0.145in;
    color: #382F2D;
    font-weight: 500;
    line-height: 1.45;
  }}
  .quote-text strong {{
    color: #D97706;
    font-weight: 700;
  }}
</style>
</head>
<body>
'''

# -------------------------------------------------------------
# SLIDE 1: Title & Hero Lockup (Solo Presenter & Dr. Meenakshi Choudhary)
# -------------------------------------------------------------
html_content += f'''
<!-- SLIDE 1 -->
<div class="slide" id="slide1">
  <div class="slide-header">
    <div class="header-left-cluster">
      <span class="inst-badge">IIIT BHOPAL</span>
      <span class="course-badge">AI & MACHINE LEARNING</span>
    </div>
    <div class="slide-counter">01 / 10</div>
  </div>

  <div class="slide-content" style="justify-content: space-between; padding: 0.1in 0 0.05in;">
    <!-- Top Hero Section -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25in;">
      <div style="max-width: 9.8in;">
        <div style="display: inline-flex; align-items: center; gap: 0.08in; background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 20px; padding: 0.04in 0.16in; margin-bottom: 0.14in;">
          <span style="color: #D97706; font-size: 0.13in;">●</span>
          <span style="font-size: 0.12in; font-weight: 800; color: #92400E; letter-spacing: 0.08em; text-transform: uppercase;">INTELLIGENT AGENT ARCHITECTURES • RUSSELL & NORVIG</span>
        </div>
        <h1 style="font-family: 'Playfair Display', serif; font-size: 0.65in; font-weight: 700; color: #1F1614; line-height: 1.08; letter-spacing: -0.015em; margin-bottom: 0.12in;">
          Model-Based <span style="color: #D97706; font-style: italic;">Reflex Agents</span>
        </h1>
        <p style="font-size: 0.185in; color: #574B46; font-style: italic; font-weight: 400; line-height: 1.45; max-width: 9.2in;">
          Handling Partially Observable Environments via Internal State Representations, World Transition Dynamics, and Condition-Action Rules.
        </p>
      </div>

      <!-- University Seal Card -->
      <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06); border-radius: 18px; padding: 0.2in 0.28in; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 4.2in; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
        <img src="{b64_iiit_logo}" alt="IIIT Bhopal" style="height: 1.1in; width: auto; object-fit: contain; margin-bottom: 0.1in;">
        <div style="font-size: 0.14in; font-weight: 700; color: #1F1614; text-align: center;">Indian Institute of Information Technology</div>
        <div style="font-size: 0.12in; color: #786C66; text-align: center; margin-top: 0.02in;">Bhopal, Madhya Pradesh, India</div>
      </div>
    </div>

    <!-- Middle Presenter & Professor Cards (Clean 2-Column Symmetrical Layout) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3in; margin-bottom: 0.24in;">
      <!-- Presenter Card (Aarush Bharti Solo) -->
      <div class="card" style="padding: 0.28in 0.32in; border-left: 6px solid #2D0C1E; height: 2.35in; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.08in;">
            <span style="font-size: 0.125in; font-weight: 800; color: #D97706; letter-spacing: 0.08em; text-transform: uppercase;">STUDENT PRESENTER</span>
            <div style="width: 0.36in; height: 0.36in; border-radius: 50%; background: #F7F5F0; display: flex; align-items: center; justify-content: center; color: #D97706;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
          <div style="font-size: 0.32in; font-weight: 800; color: #1F1614; margin-bottom: 0.04in;">Aarush Bharti</div>
          <div style="font-size: 0.165in; font-weight: 700; color: #92400E; font-family: 'JetBrains Mono', monospace;">Scholar No: 24U020010</div>
        </div>
        <div style="font-size: 0.135in; color: #665A54; border-top: 1px solid #F0EAE1; padding-top: 0.1in;">
          Department of Computer Science & Engineering<br>Indian Institute of Information Technology, Bhopal
        </div>
      </div>

      <!-- Course Professor Card (Dr. Meenakshi Choudhary) -->
      <div class="card" style="padding: 0.28in 0.32in; border-left: 6px solid #D97706; height: 2.35in; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.08in;">
            <span style="font-size: 0.125in; font-weight: 800; color: #D97706; letter-spacing: 0.08em; text-transform: uppercase;">COURSE FACULTY & GUIDE</span>
            <div style="width: 0.36in; height: 0.36in; border-radius: 50%; background: #FEF3C7; display: flex; align-items: center; justify-content: center; color: #D97706;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
          </div>
          <div style="font-size: 0.32in; font-weight: 800; color: #1F1614; margin-bottom: 0.04in;">Dr. Meenakshi Choudhary</div>
          <div style="font-size: 0.16in; font-weight: 600; color: #574B46;">Assistant Professor, Department of CSE</div>
        </div>
        <div style="font-size: 0.135in; color: #665A54; border-top: 1px solid #F0EAE1; padding-top: 0.1in;">
          Artificial Intelligence & Machine Learning Course<br>Indian Institute of Information Technology, Bhopal
        </div>
      </div>
    </div>

    <!-- Bottom Telemetry Metric Chips -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.22in;">
      <div class="card" style="padding: 0.18in 0.22in; display: flex; align-items: center; gap: 0.16in;">
        <div style="width: 0.48in; height: 0.48in; border-radius: 12px; background: #FEF3C7; display: flex; align-items: center; justify-content: center; color: #D97706;">
          {SVG_EYE_OFF}
        </div>
        <div>
          <div style="font-size: 0.24in; font-weight: 800; color: #1F1614; line-height: 1;">POMDP Ready</div>
          <div style="font-size: 0.11in; font-weight: 700; color: #7A6F68; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 0.03in;">PARTIAL OBSERVABILITY</div>
        </div>
      </div>

      <div class="card" style="padding: 0.18in 0.22in; display: flex; align-items: center; gap: 0.16in;">
        <div style="width: 0.48in; height: 0.48in; border-radius: 12px; background: #DEF7EC; display: flex; align-items: center; justify-content: center; color: #03543F;">
          {SVG_REFRESH}
        </div>
        <div>
          <div style="font-size: 0.24in; font-weight: 800; color: #1F1614; line-height: 1;">T(s, a)</div>
          <div style="font-size: 0.11in; font-weight: 700; color: #7A6F68; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 0.03in;">TRANSITION DYNAMICS</div>
        </div>
      </div>

      <div class="card" style="padding: 0.18in 0.22in; display: flex; align-items: center; gap: 0.16in;">
        <div style="width: 0.48in; height: 0.48in; border-radius: 12px; background: #E1EFFE; display: flex; align-items: center; justify-content: center; color: #1E429F;">
          {SVG_DATABASE}
        </div>
        <div>
          <div style="font-size: 0.24in; font-weight: 800; color: #1F1614; line-height: 1;">P(e | s)</div>
          <div style="font-size: 0.11in; font-weight: 700; color: #7A6F68; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 0.03in;">SENSOR PERCEPT MODEL</div>
        </div>
      </div>

      <div class="card" style="padding: 0.18in 0.22in; display: flex; align-items: center; gap: 0.16in;">
        <div style="width: 0.48in; height: 0.48in; border-radius: 12px; background: #F3E8FF; display: flex; align-items: center; justify-content: center; color: #6B21A8;">
          {SVG_CLOCK}
        </div>
        <div>
          <div style="font-size: 0.24in; font-weight: 800; color: #1F1614; line-height: 1;">O(1) Speed</div>
          <div style="font-size: 0.11in; font-weight: 700; color: #7A6F68; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 0.03in;">CONSTANT-TIME LOOKUP</div>
        </div>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span>IIIT Bhopal • Dept. of Computer Science & Engineering • Artificial Intelligence Coursework</span>
    <span>Aarush Bharti (24U020010) • Model-Based Reflex Agents</span>
  </div>
</div>
'''

# -------------------------------------------------------------
# SLIDE 2: Background: Why Simple Reflex Agents Fail
# -------------------------------------------------------------
html_content += f'''
<!-- SLIDE 2 -->
<div class="slide" id="slide2">
  <div class="slide-header">
    <div class="header-left-cluster">
      <span class="inst-badge">IIIT BHOPAL</span>
      <span class="course-badge">AI & MACHINE LEARNING</span>
      <span class="group-badge">FOUNDATIONAL CONCEPTS</span>
    </div>
    <div class="slide-counter">02 / 10</div>
  </div>

  <div class="slide-title-zone">
    <h2 class="slide-title">The Core Challenge: <span class="accent">Why Simple Reflex Agents Fail</span></h2>
    <div class="slide-subtitle">A critical examination of stimulus-response mapping in partially observable environments.</div>
  </div>

  <div class="slide-content">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.22in; flex: 1;">
      <!-- Card 1: Complete Observability Fallacy -->
      <div class="card" style="padding: 0; display: flex; overflow: hidden;">
        <div style="width: 2.3in; background: #2D0C1E; color: #FFFFFF; padding: 0.25in 0.18in; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; flex-shrink: 0;">
          <div style="margin-bottom: 0.12in; color: #F59E0B;">{SVG_EYE}</div>
          <div style="font-size: 0.18in; font-weight: 800; line-height: 1.25; margin-bottom: 0.05in;">Full vs. Partial Observability</div>
          <div style="font-size: 0.115in; color: #D1D5DB; font-family: 'JetBrains Mono', monospace;">P_t ≠ S_t Reality</div>
        </div>
        <div style="padding: 0.22in 0.25in; display: flex; flex-direction: column; justify-content: center;">
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.1in; font-size: 0.14in; color: #374151; line-height: 1.45;">
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #D97706; font-size: 0.16in; line-height: 1;">•</span>
              <span><strong>Simple Reflex Assumption:</strong> Assumes current sensor percept <code>P_t</code> directly reflects total world state <code>S_t</code>.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #D97706; font-size: 0.16in; line-height: 1;">•</span>
              <span><strong>Real-World Occlusion:</strong> Physical sensors have blind spots, sensor noise, and horizon limitations.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #D97706; font-size: 0.16in; line-height: 1;">•</span>
              <span><strong>Information Loss:</strong> Past critical cues (e.g. car in adjacent lane 1 sec ago) vanish from raw sensory buffers.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Card 2: The Infinite Loop Trap -->
      <div class="card" style="padding: 0; display: flex; overflow: hidden;">
        <div style="width: 2.3in; background: #2D0C1E; color: #FFFFFF; padding: 0.25in 0.18in; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; flex-shrink: 0;">
          <div style="margin-bottom: 0.12in; color: #F59E0B;">{SVG_REFRESH}</div>
          <div style="font-size: 0.18in; font-weight: 800; line-height: 1.25; margin-bottom: 0.05in;">The Infinite Loop Trap</div>
          <div style="font-size: 0.115in; color: #D1D5DB; font-family: 'JetBrains Mono', monospace;">State Ambiguity</div>
        </div>
        <div style="padding: 0.22in 0.25in; display: flex; flex-direction: column; justify-content: center;">
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.1in; font-size: 0.14in; color: #374151; line-height: 1.45;">
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #D97706; font-size: 0.16in; line-height: 1;">•</span>
              <span><strong>Percept Ambiguity:</strong> Identical percepts require completely different actions depending on unobserved history.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #D97706; font-size: 0.16in; line-height: 1;">•</span>
              <span><strong>Deterministic Lock:</strong> A vacuum agent without location sensors oscillates between Room A and Room B endlessly.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #D97706; font-size: 0.16in; line-height: 1;">•</span>
              <span><strong>Randomization Patch:</strong> Random walks prevent infinite loops but produce grossly sub-optimal trajectories.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Card 3: The History Lookup Paradox -->
      <div class="card" style="padding: 0; display: flex; overflow: hidden;">
        <div style="width: 2.3in; background: #2D0C1E; color: #FFFFFF; padding: 0.25in 0.18in; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; flex-shrink: 0;">
          <div style="margin-bottom: 0.12in; color: #F59E0B;">{SVG_DATABASE}</div>
          <div style="font-size: 0.18in; font-weight: 800; line-height: 1.25; margin-bottom: 0.05in;">The History Table Fallacy</div>
          <div style="font-size: 0.115in; color: #D1D5DB; font-family: 'JetBrains Mono', monospace;">O(|P|^t) Explosion</div>
        </div>
        <div style="padding: 0.22in 0.25in; display: flex; flex-direction: column; justify-content: center;">
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.1in; font-size: 0.14in; color: #374151; line-height: 1.45;">
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #D97706; font-size: 0.16in; line-height: 1;">•</span>
              <span><strong>Unbounded Growth:</strong> Storing the complete sequence of past percepts <code>[P_1, P_2, ... P_t]</code> is impossible.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #D97706; font-size: 0.16in; line-height: 1;">•</span>
              <span><strong>Combinatorial Explosion:</strong> A simple camera with 1000 frames has more percept sequences than atoms in universe.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #D97706; font-size: 0.16in; line-height: 1;">•</span>
              <span><strong>Table Lookups Fail:</strong> Real AI requires compressing history into a fixed-size internal model.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Card 4: The Model-Based Solution -->
      <div class="card" style="padding: 0; display: flex; overflow: hidden;">
        <div style="width: 2.3in; background: #2D0C1E; color: #FFFFFF; padding: 0.25in 0.18in; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; flex-shrink: 0;">
          <div style="margin-bottom: 0.12in; color: #F59E0B;">{SVG_BRAIN}</div>
          <div style="font-size: 0.18in; font-weight: 800; line-height: 1.25; margin-bottom: 0.05in;">The Model-Based Paradigm</div>
          <div style="font-size: 0.115in; color: #D1D5DB; font-family: 'JetBrains Mono', monospace;">State Compression</div>
        </div>
        <div style="padding: 0.22in 0.25in; display: flex; flex-direction: column; justify-content: center;">
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.1in; font-size: 0.14in; color: #374151; line-height: 1.45;">
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #D97706; font-size: 0.16in; line-height: 1;">•</span>
              <span><strong>Internal State:</strong> Maintains a running summary of the unobserved world based on percept history.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #D97706; font-size: 0.16in; line-height: 1;">•</span>
              <span><strong>World Physics:</strong> Encodes knowledge of how external entities change independently over time.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #D97706; font-size: 0.16in; line-height: 1;">•</span>
              <span><strong>Action Causality:</strong> Tracks how the agent's own past physical actions impacted the environment.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Quote Banner -->
    <div class="quote-banner">
      <div class="quote-label-badge">
        {SVG_ALERT}
        <span>CORE AI INSIGHT</span>
      </div>
      <div class="quote-text">
        "A simple reflex agent is condemned to live in the eternal present. A <strong>model-based agent</strong> builds an internal mental representation of the world, unlocking rational action in <strong>partially observable environments</strong>."
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span>Slide 02 / 10 • Foundational Concepts & Reflex Failure Modes</span>
    <span>Aarush Bharti (24U020010) • IIIT Bhopal</span>
  </div>
</div>
'''

# -------------------------------------------------------------
# SLIDE 3: Anatomy & Internal Structure
# -------------------------------------------------------------
html_content += f'''
<!-- SLIDE 3 -->
<div class="slide" id="slide3">
  <div class="slide-header">
    <div class="header-left-cluster">
      <span class="inst-badge">IIIT BHOPAL</span>
      <span class="course-badge">AI & MACHINE LEARNING</span>
      <span class="group-badge">AGENT ARCHITECTURE</span>
    </div>
    <div class="slide-counter">03 / 10</div>
  </div>

  <div class="slide-title-zone">
    <h2 class="slide-title">Internal Anatomy: <span class="accent">The Three Core Knowledge Pillars</span></h2>
    <div class="slide-subtitle">How internal memory, physics models, and action causality combine to govern agent behavior.</div>
  </div>

  <div class="slide-content">
    <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 0.25in; flex: 1;">
      <!-- Left Column: 3 Structured Knowledge Cards -->
      <div style="display: flex; flex-direction: column; gap: 0.16in; justify-content: space-between;">
        <!-- Card 1: Internal State -->
        <div class="card" style="padding: 0.18in 0.22in; display: flex; gap: 0.18in; align-items: flex-start;">
          <div style="background: #2D0C1E; color: #FFFFFF; width: 0.55in; height: 0.55in; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;">
            <span style="font-size: 0.11in; font-weight: 800; color: #F59E0B;">01</span>
            {SVG_BRAIN}
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.04in;">
              <span style="font-size: 0.17in; font-weight: 800; color: #1F1614;">Internal State (Belief State)</span>
              <span class="amber-pill">Memory Buffer</span>
            </div>
            <p style="font-size: 0.13in; color: #4B5563; line-height: 1.45;">
              Represents current unperceived reality. Retains information about past obstacles, spatial coordinates, and dynamic objects that temporarily vanish from direct line-of-sight.
            </p>
          </div>
        </div>

        <!-- Card 2: Transition Model -->
        <div class="card" style="padding: 0.18in 0.22in; display: flex; gap: 0.18in; align-items: flex-start;">
          <div style="background: #2D0C1E; color: #FFFFFF; width: 0.55in; height: 0.55in; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;">
            <span style="font-size: 0.11in; font-weight: 800; color: #F59E0B;">02</span>
            {SVG_REFRESH}
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.04in;">
              <span style="font-size: 0.17in; font-weight: 800; color: #1F1614;">Transition Model: "How World Evolves"</span>
              <span class="blue-pill">Environment Physics</span>
            </div>
            <p style="font-size: 0.13in; color: #4B5563; line-height: 1.45;">
              Encodes external dynamics: an overtaking car moves forward at 60 km/h even when hidden; rain continues to make roads slippery; uncleaned garbage piles remain where last seen.
            </p>
          </div>
        </div>

        <!-- Card 3: Action Model -->
        <div class="card" style="padding: 0.18in 0.22in; display: flex; gap: 0.18in; align-items: flex-start;">
          <div style="background: #2D0C1E; color: #FFFFFF; width: 0.55in; height: 0.55in; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;">
            <span style="font-size: 0.11in; font-weight: 800; color: #F59E0B;">03</span>
            {SVG_TARGET}
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.04in;">
              <span style="font-size: 0.17in; font-weight: 800; color: #1F1614;">Sensor & Action Causality: "What Actions Do"</span>
              <span class="green-pill">Actuator Causal Model</span>
            </div>
            <p style="font-size: 0.13in; color: #4B5563; line-height: 1.45;">
              Predicts self-effects: Turning steering wheel 30° changes vehicle heading; executing <code>Suck</code> in Room A leaves it clean; moving forward shifts coordinates by vector <code>Δx, Δy</code>.
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Visual Architecture Flow Box -->
      <div class="card" style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.08); padding: 0.22in; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F0EAE1; padding-bottom: 0.08in;">
          <span style="font-size: 0.14in; font-weight: 800; color: #2D0C1E; text-transform: uppercase; letter-spacing: 0.06em;">RUSSELL & NORVIG ARCHITECTURAL LOOP</span>
          <span class="plum-tag" style="font-size: 0.11in; padding: 0.03in 0.1in;">FIGURE 2.11 MAPPING</span>
        </div>

        <!-- Step flow inside right box -->
        <div style="display: flex; flex-direction: column; gap: 0.14in; margin: 0.12in 0;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 0.12in 0.16in; display: flex; align-items: center; gap: 0.12in;">
            <span style="background: #E2E8F0; color: #1E293B; font-weight: 800; padding: 0.03in 0.08in; border-radius: 6px; font-size: 0.11in;">1. SENSE</span>
            <span style="font-size: 0.13in; color: #334155;"><strong>Sensors</strong> receive environmental percept stream <code>P_t</code></span>
          </div>

          <div style="text-align: center; color: #D97706; font-weight: 800; font-size: 0.15in;">↓</div>

          <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 10px; padding: 0.12in 0.16in; display: flex; align-items: center; gap: 0.12in;">
            <span style="background: #F59E0B; color: #FFFFFF; font-weight: 800; padding: 0.03in 0.08in; border-radius: 6px; font-size: 0.11in;">2. UPDATE</span>
            <span style="font-size: 0.13in; color: #78350F;">Synthesize <code>P_t</code> with <strong>World Physics</strong> & <strong>Action Model</strong> → <code>State S_t</code></span>
          </div>

          <div style="text-align: center; color: #D97706; font-weight: 800; font-size: 0.15in;">↓</div>

          <div style="background: #2D0C1E; color: #FFFFFF; border-radius: 10px; padding: 0.12in 0.16in; display: flex; align-items: center; gap: 0.12in;">
            <span style="background: #D97706; color: #FFFFFF; font-weight: 800; padding: 0.03in 0.08in; border-radius: 6px; font-size: 0.11in;">3. MATCH</span>
            <span style="font-size: 0.13in; color: #F1F5F9;">Evaluate <strong>Condition-Action Rules</strong> on <code>S_t</code> (NOT raw <code>P_t</code>)</span>
          </div>

          <div style="text-align: center; color: #D97706; font-weight: 800; font-size: 0.15in;">↓</div>

          <div style="background: #DEF7EC; border: 1px solid #BCF0DA; border-radius: 10px; padding: 0.12in 0.16in; display: flex; align-items: center; gap: 0.12in;">
            <span style="background: #057A55; color: #FFFFFF; font-weight: 800; padding: 0.03in 0.08in; border-radius: 6px; font-size: 0.11in;">4. ACTUATE</span>
            <span style="font-size: 0.13in; color: #064E3B;"><strong>Actuators</strong> execute motor command <code>A_t</code> upon environment</span>
          </div>
        </div>

        <div style="font-size: 0.115in; color: #64748B; background: #F8FAFC; border-radius: 8px; padding: 0.08in 0.12in; text-align: center;">
          ⚡ State Update Function: <code>State = UPDATE-STATE(State, Action, Percept, Model)</code>
        </div>
      </div>
    </div>

    <!-- Quote Banner -->
    <div class="quote-banner">
      <div class="quote-label-badge">
        {SVG_FLOW}
        <span>ARCHITECTURAL PRINCIPLE</span>
      </div>
      <div class="quote-text">
        "By decoupling sensory input from immediate action via an <strong>internal state representation</strong>, the model-based agent maintains <strong>continuity of perception</strong> across temporal occlusions."
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span>Slide 03 / 10 • Agent Architecture & Internal Anatomy</span>
    <span>Aarush Bharti (24U020010) • IIIT Bhopal</span>
  </div>
</div>
'''

# -------------------------------------------------------------
# SLIDE 4: Mathematical Formulation & State Update
# -------------------------------------------------------------
html_content += f'''
<!-- SLIDE 4 -->
<div class="slide" id="slide4">
  <div class="slide-header">
    <div class="header-left-cluster">
      <span class="inst-badge">IIIT BHOPAL</span>
      <span class="course-badge">AI & MACHINE LEARNING</span>
      <span class="group-badge">MATHEMATICAL FORMULATION</span>
    </div>
    <div class="slide-counter">04 / 10</div>
  </div>

  <div class="slide-title-zone">
    <h2 class="slide-title">Mathematical Formulation: <span class="accent">The State Update Function</span></h2>
    <div class="slide-subtitle">Recursive belief state estimation and deterministic rule evaluation equations.</div>
  </div>

  <div class="slide-content">
    <!-- 4 Column Breakdown Cards -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.2in; flex: 1;">
      <!-- Col 1 -->
      <div class="card" style="display: flex; flex-direction: column; overflow: hidden;">
        <div style="background: #2D0C1E; color: #FFFFFF; padding: 0.16in 0.18in; font-size: 0.13in; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
          01 • Prior Belief State S_(t-1)
        </div>
        <div style="padding: 0.2in; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.16in; font-weight: 800; color: #D97706; margin-bottom: 0.1in;">S_(t-1) ∈ S</div>
            <p style="font-size: 0.13in; color: #4B5563; line-height: 1.5; margin-bottom: 0.12in;">
              The accumulated internal representation of the environment up to time <code>t-1</code>.
            </p>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.1in; font-size: 0.115in; color: #334155;">
            <strong>Properties:</strong> Compact, fixed-dimensional vector or discrete state assignment.
          </div>
        </div>
      </div>

      <!-- Col 2 -->
      <div class="card" style="display: flex; flex-direction: column; overflow: hidden;">
        <div style="background: #2D0C1E; color: #FFFFFF; padding: 0.16in 0.18in; font-size: 0.13in; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
          02 • Executed Action A_(t-1)
        </div>
        <div style="padding: 0.2in; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.16in; font-weight: 800; color: #D97706; margin-bottom: 0.1in;">A_(t-1) = Rule(S_(t-1))</div>
            <p style="font-size: 0.13in; color: #4B5563; line-height: 1.5; margin-bottom: 0.12in;">
              The motor action taken in the previous cycle, causing deterministic or probabilistic state changes.
            </p>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.1in; font-size: 0.115in; color: #334155;">
            <strong>Dynamics:</strong> <code>T(s, a, s') = P(s' | s, a)</code> forward transition probability.
          </div>
        </div>
      </div>

      <!-- Col 3 -->
      <div class="card" style="display: flex; flex-direction: column; overflow: hidden;">
        <div style="background: #2D0C1E; color: #FFFFFF; padding: 0.16in 0.18in; font-size: 0.13in; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
          03 • Incoming Percept P_t
        </div>
        <div style="padding: 0.2in; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.16in; font-weight: 800; color: #D97706; margin-bottom: 0.1in;">P_t = Sensor(World_t)</div>
            <p style="font-size: 0.13in; color: #4B5563; line-height: 1.5; margin-bottom: 0.12in;">
              The current partial observation emitted by physical hardware (cameras, ultrasonic, LiDAR, API hooks).
            </p>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.1in; font-size: 0.115in; color: #334155;">
            <strong>Observation Model:</strong> <code>O(s, p) = P(p | s)</code> likelihood of observation given state.
          </div>
        </div>
      </div>

      <!-- Col 4 -->
      <div class="card" style="display: flex; flex-direction: column; overflow: hidden;">
        <div style="background: #2D0C1E; color: #FFFFFF; padding: 0.16in 0.18in; font-size: 0.13in; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
          04 • State Fusion S_t
        </div>
        <div style="padding: 0.2in; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.16in; font-weight: 800; color: #D97706; margin-bottom: 0.1in;">S_t = f(S_(t-1), A_(t-1), P_t)</div>
            <p style="font-size: 0.13in; color: #4B5563; line-height: 1.5; margin-bottom: 0.12in;">
              The recursive estimator synthesizing historical predictions with real-time sensory measurements.
            </p>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 0.1in; font-size: 0.115in; color: #92400E;">
            <strong>Rule Trigger:</strong> <code>Action_t = Condition_Action_Rules(S_t)</code>
          </div>
        </div>
      </div>
    </div>

    <!-- Step Sequence Ribbon -->
    <div style="margin-top: 0.2in; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.18in;">
      <div style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 10px; padding: 0.12in 0.16in; text-align: center;">
        <div style="font-size: 0.12in; font-weight: 800; color: #1F1614;">Step 1: Predict (Prior)</div>
        <div style="font-size: 0.11in; color: #6B7280; margin-top: 0.02in;">Forward State Propagation</div>
      </div>
      <div style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 10px; padding: 0.12in 0.16in; text-align: center;">
        <div style="font-size: 0.12in; font-weight: 800; color: #1F1614;">Step 2: Measure (Percept)</div>
        <div style="font-size: 0.11in; color: #6B7280; margin-top: 0.02in;">Partial Sensor Ingestion</div>
      </div>
      <div style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 10px; padding: 0.12in 0.16in; text-align: center;">
        <div style="font-size: 0.12in; font-weight: 800; color: #1F1614;">Step 3: Update State</div>
        <div style="font-size: 0.11in; color: #6B7280; margin-top: 0.02in;">Belief State Reconciliation</div>
      </div>
      <div style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 10px; padding: 0.12in 0.16in; text-align: center;">
        <div style="font-size: 0.12in; font-weight: 800; color: #1F1614;">Step 4: Execute Action</div>
        <div style="font-size: 0.11in; color: #6B7280; margin-top: 0.02in;">O(1) Rule Table Trigger</div>
      </div>
    </div>

    <!-- Quote Banner -->
    <div class="quote-banner">
      <div class="quote-label-badge">
        {SVG_CPU}
        <span>MATHEMATICAL RIGOR</span>
      </div>
      <div class="quote-text">
        "The state update function <strong>S_t = f(S_t-1, A_t-1, P_t)</strong> acts as a recursive filter: it guarantees <strong>bounded O(1) memory complexity</strong> while tracking an unobservable world across infinite horizons."
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span>Slide 04 / 10 • Mathematical Formulation & State Update Mechanics</span>
    <span>Aarush Bharti (24U020010) • IIIT Bhopal</span>
  </div>
</div>
'''

# -------------------------------------------------------------
# SLIDE 5: Architectural Flowchart & Operational Pipeline
# -------------------------------------------------------------
html_content += f'''
<!-- SLIDE 5 -->
<div class="slide" id="slide5">
  <div class="slide-header">
    <div class="header-left-cluster">
      <span class="inst-badge">IIIT BHOPAL</span>
      <span class="course-badge">AI & MACHINE LEARNING</span>
      <span class="group-badge">OPERATIONAL DYNAMICS</span>
    </div>
    <div class="slide-counter">05 / 10</div>
  </div>

  <div class="slide-title-zone">
    <h2 class="slide-title">System Diagram & <span class="accent">Operational Flowchart</span></h2>
    <div class="slide-subtitle">The complete execution cycle from raw percept arrival to actuator excitation.</div>
  </div>

  <div class="slide-content">
    <!-- 3-Column Layout Matching Community Hero Slide 5 -->
    <div style="display: grid; grid-template-columns: 3.4in 1fr 3.4in; gap: 0.22in; flex: 1;">
      <!-- Left Column: Workflow Steps 01 to 06 -->
      <div style="display: flex; flex-direction: column; gap: 0.1in;">
        <div style="background: #2D0C1E; color: #FFFFFF; border-radius: 12px; padding: 0.1in 0.16in; font-size: 0.13in; font-weight: 700; display: flex; align-items: center; gap: 0.08in;">
          {SVG_FLOW}
          <span>Execution Pipeline</span>
        </div>

        <div class="card" style="padding: 0.1in 0.14in; display: flex; align-items: center; gap: 0.12in; flex: 1;">
          <div style="width: 0.36in; height: 0.36in; border-radius: 50%; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.12in;">01</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Percept Arrival</div>
            <div style="font-size: 0.11in; color: #64748B;">Sensors ingest partial data</div>
          </div>
        </div>

        <div class="card" style="padding: 0.1in 0.14in; display: flex; align-items: center; gap: 0.12in; flex: 1;">
          <div style="width: 0.36in; height: 0.36in; border-radius: 50%; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.12in;">02</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Model Projection</div>
            <div style="font-size: 0.11in; color: #64748B;">Predict S_t from S_t-1 & A_t-1</div>
          </div>
        </div>

        <div class="card" style="padding: 0.1in 0.14in; display: flex; align-items: center; gap: 0.12in; flex: 1;">
          <div style="width: 0.36in; height: 0.36in; border-radius: 50%; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.12in;">03</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Sensor Fusion</div>
            <div style="font-size: 0.11in; color: #64748B;">Reconcile prediction with P_t</div>
          </div>
        </div>

        <div class="card" style="padding: 0.1in 0.14in; display: flex; align-items: center; gap: 0.12in; flex: 1;">
          <div style="width: 0.36in; height: 0.36in; border-radius: 50%; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.12in;">04</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Internal State Update</div>
            <div style="font-size: 0.11in; color: #64748B;">Write S_t into memory register</div>
          </div>
        </div>

        <div class="card" style="padding: 0.1in 0.14in; display: flex; align-items: center; gap: 0.12in; flex: 1;">
          <div style="width: 0.36in; height: 0.36in; border-radius: 50%; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.12in;">05</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Rule Evaluation</div>
            <div style="font-size: 0.11in; color: #64748B;">IF (Condition(S_t)) THEN Action</div>
          </div>
        </div>

        <div class="card" style="padding: 0.1in 0.14in; display: flex; align-items: center; gap: 0.12in; flex: 1;">
          <div style="width: 0.36in; height: 0.36in; border-radius: 50%; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.12in;">06</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Actuation & Loopback</div>
            <div style="font-size: 0.11in; color: #64748B;">Send pulse to physical motors</div>
          </div>
        </div>
      </div>

      <!-- Center: Dark Command Flowchart Terminal -->
      <div style="background: #11141E; border-radius: 16px; border: 1px solid #1E293B; padding: 0.22in; color: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 0.08in;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.12in; color: #38BDF8;">// AGENT_KERNEL_CORE::EXECUTE_LOOP()</span>
          <span style="background: #0284C7; color: #FFFFFF; font-size: 0.1in; font-weight: 700; padding: 0.02in 0.08in; border-radius: 4px;">ACTIVE CYCLE</span>
        </div>

        <!-- Box 1: Ingestion -->
        <div style="background: #1E293B; border-radius: 8px; padding: 0.1in 0.14in; text-align: center;">
          <div style="font-size: 0.13in; font-weight: 700; color: #F8FAFC;">Step 1: Ingest Partial Percept P_t</div>
          <div style="font-size: 0.11in; color: #94A3B8;">Sensory stream captured from environment</div>
        </div>

        <div style="text-align: center; color: #38BDF8; font-size: 0.14in; font-weight: 800;">↓</div>

        <!-- Box 2: State Update -->
        <div style="background: #1E293B; border-radius: 8px; padding: 0.1in 0.14in; text-align: center;">
          <div style="font-size: 0.13in; font-weight: 700; color: #F59E0B;">Step 2: Update Internal State</div>
          <div style="font-size: 0.11in; color: #CBD5E1; font-family: 'JetBrains Mono', monospace;">S_t = UPDATE-STATE(S_(t-1), A_(t-1), P_t, World_Model)</div>
        </div>

        <div style="text-align: center; color: #38BDF8; font-size: 0.14in; font-weight: 800;">↓</div>

        <!-- Decision Diamond Box -->
        <div style="background: #312E81; border: 1.5px solid #6366F1; border-radius: 10px; padding: 0.12in 0.14in; text-align: center;">
          <div style="font-size: 0.13in; font-weight: 800; color: #FCD34D;">DECISION: Does S_t trigger a Rule Condition?</div>
          <div style="font-size: 0.11in; color: #C7D2FE;">Match against active Condition-Action rule dictionary</div>
        </div>

        <!-- Two Branch Outcomes -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.12in; margin-top: 0.04in;">
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; border-radius: 8px; padding: 0.1in; text-align: center;">
            <div style="font-size: 0.12in; font-weight: 800; color: #34D399;">YES (Trigger Matched)</div>
            <div style="font-size: 0.11in; color: #E2E8F0; margin-top: 0.04in;">Execute Specific Action A_t<br><code>A_t = RULE[Condition(S_t)]</code></div>
          </div>
          <div style="background: rgba(59, 130, 246, 0.15); border: 1px solid #3B82F6; border-radius: 8px; padding: 0.1in; text-align: center;">
            <div style="font-size: 0.12in; font-weight: 800; color: #60A5FA;">NO (Default State)</div>
            <div style="font-size: 0.11in; color: #E2E8F0; margin-top: 0.04in;">Maintain Safe Trajectory<br><code>A_t = SAFE_CRUISE_DEFAULT</code></div>
          </div>
        </div>

        <div style="text-align: center; color: #38BDF8; font-size: 0.14in; font-weight: 800;">↓</div>

        <!-- Box 3: Actuate -->
        <div style="background: #0F172A; border: 1px solid #334155; border-radius: 8px; padding: 0.1in; text-align: center;">
          <div style="font-size: 0.125in; font-weight: 700; color: #38BDF8;">Actuator Command Dispatched</div>
          <div style="font-size: 0.11in; color: #94A3B8;">Cycle latency: &lt; 2.4 microseconds | Ready for t+1</div>
        </div>

        <div style="text-align: center; font-size: 0.105in; color: #64748B; font-family: 'JetBrains Mono', monospace;">
          Figure 5.1: Closed-Loop Model-Based Reflex State Machine
        </div>
      </div>

      <!-- Right Column: 4 Key Properties -->
      <div style="display: flex; flex-direction: column; gap: 0.12in;">
        <div style="background: #2D0C1E; color: #FFFFFF; border-radius: 12px; padding: 0.1in 0.16in; font-size: 0.13in; font-weight: 700; display: flex; align-items: center; gap: 0.08in;">
          {SVG_TARGET}
          <span>Core Properties</span>
        </div>

        <div class="card" style="padding: 0.14in 0.16in; flex: 1; display: flex; flex-direction: column; justify-content: center;">
          <div style="font-size: 0.15in; font-weight: 800; color: #1F1614; margin-bottom: 0.04in;">Markovian Efficiency</div>
          <p style="font-size: 0.12in; color: #64748B; line-height: 1.4;">
            Internal state S_t summarizes all relevant history. Future states depend solely on current state and action.
          </p>
        </div>

        <div class="card" style="padding: 0.14in 0.16in; flex: 1; display: flex; flex-direction: column; justify-content: center;">
          <div style="font-size: 0.15in; font-weight: 800; color: #1F1614; margin-bottom: 0.04in;">Microsecond Speed</div>
          <p style="font-size: 0.12in; color: #64748B; line-height: 1.4;">
            Condition-action evaluation runs in O(1) time without expensive multi-step search tree rollouts.
          </p>
        </div>

        <div class="card" style="padding: 0.14in 0.16in; flex: 1; display: flex; flex-direction: column; justify-content: center;">
          <div style="font-size: 0.15in; font-weight: 800; color: #1F1614; margin-bottom: 0.04in;">Temporal Persistence</div>
          <p style="font-size: 0.12in; color: #64748B; line-height: 1.4;">
            Obstacles behind pillars or trucks in blind spots remain active in memory until explicitly disproven.
          </p>
        </div>

        <div class="card" style="padding: 0.14in 0.16in; flex: 1; display: flex; flex-direction: column; justify-content: center;">
          <div style="font-size: 0.15in; font-weight: 800; color: #1F1614; margin-bottom: 0.04in;">Zero Cloud Lock-in</div>
          <p style="font-size: 0.12in; color: #64748B; line-height: 1.4;">
            Entire state machine executes on edge microcontrollers without requiring external network connectivity.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span>Slide 05 / 10 • Operational Flowchart & Decision Pipeline</span>
    <span>Aarush Bharti (24U020010) • IIIT Bhopal</span>
  </div>
</div>
'''

# -------------------------------------------------------------
# SLIDE 6: Concrete Working Case Studies
# -------------------------------------------------------------
html_content += f'''
<!-- SLIDE 6 -->
<div class="slide" id="slide6">
  <div class="slide-header">
    <div class="header-left-cluster">
      <span class="inst-badge">IIIT BHOPAL</span>
      <span class="course-badge">AI & MACHINE LEARNING</span>
      <span class="group-badge">PRACTICAL IMPLEMENTATIONS</span>
    </div>
    <div class="slide-counter">06 / 10</div>
  </div>

  <div class="slide-title-zone">
    <h2 class="slide-title">Concrete Case Studies: <span class="accent">Autonomous Vehicles & Robotics</span></h2>
    <div class="slide-subtitle">Examining model-based reflex agents in high-stakes physical deployments.</div>
  </div>

  <div class="slide-content">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.25in; flex: 1;">
      <!-- Left Case Study: Autonomous Driving Blind Spot -->
      <div class="card" style="padding: 0.22in; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.12in;">
            <span class="plum-tag">{SVG_CAR} CASE STUDY 1: ADAS VEHICLE</span>
            <span class="amber-pill">Blind Spot Occlusion</span>
          </div>
          <div style="font-size: 0.2in; font-weight: 800; color: #1F1614; margin-bottom: 0.08in;">
            Highway Lane-Change Under Blind-Spot Occlusion
          </div>
          <p style="font-size: 0.135in; color: #4B5563; line-height: 1.5; margin-bottom: 0.14in;">
            An overtaking sports car accelerates into the vehicle's rear blind zone. Cameras lose direct visual percept.
          </p>

          <div style="background: #11141E; border-radius: 10px; padding: 0.14in; color: #F8FAFC; font-family: 'JetBrains Mono', monospace; font-size: 0.12in; line-height: 1.6; margin-bottom: 0.12in;">
            <span style="color: #64748B;">// INTERNAL TRANSITION MODEL UPDATE</span><br>
            <span style="color: #38BDF8;">State.blindspot_vehicle</span> = <span style="color: #FCD34D;">true</span>;<br>
            <span style="color: #38BDF8;">State.vehicle_speed</span> += <span style="color: #FCD34D;">1.2 m/s²</span>;<br><br>
            <span style="color: #64748B;">// CONDITION-ACTION RULE</span><br>
            <span style="color: #F43F5E;">IF</span> (<span style="color: #38BDF8;">Driver_Requests_Lane_Change</span> && <span style="color: #38BDF8;">State.blindspot_vehicle</span>)<br>
            &nbsp;&nbsp;<span style="color: #10B981;">THEN</span> <span style="color: #FCD34D;">SUPPRESS_STEERING()</span> & <span style="color: #FCD34D;">TRIGGER_AUDIO_WARNING()</span>;
          </div>
        </div>

        <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 0.1in 0.14in; font-size: 0.12in; color: #166534;">
          <strong>Why Simple Reflex Fails:</strong> Simple reflex sees empty camera feed, triggers lane change, and causes fatal side collision.
        </div>
      </div>

      <!-- Right Case Study: Two-State Partially Observable Vacuum -->
      <div class="card" style="padding: 0.22in; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.12in;">
            <span class="plum-tag">{SVG_REFRESH} CASE STUDY 2: VACUUM WORLD</span>
            <span class="blue-pill">Russell & Norvig Benchmark</span>
          </div>
          <div style="font-size: 0.2in; font-weight: 800; color: #1F1614; margin-bottom: 0.08in;">
            Partially Observable Two-Room Cleaning Agent
          </div>
          <p style="font-size: 0.135in; color: #4B5563; line-height: 1.5; margin-bottom: 0.14in;">
            Agent has dirt sensors but NO location sensor (cannot see whether it is in Room A or Room B).
          </p>

          <div style="background: #11141E; border-radius: 10px; padding: 0.14in; color: #F8FAFC; font-family: 'JetBrains Mono', monospace; font-size: 0.12in; line-height: 1.6; margin-bottom: 0.12in;">
            <span style="color: #64748B;">// 1-BIT INTERNAL STATE REGISTER</span><br>
            <span style="color: #38BDF8;">State.last_action_moved</span> = <span style="color: #FCD34D;">'RIGHT'</span>;<br>
            <span style="color: #38BDF8;">State.estimated_room</span> = <span style="color: #FCD34D;">'ROOM_B'</span>;<br><br>
            <span style="color: #64748B;">// CONDITION-ACTION RULE</span><br>
            <span style="color: #F43F5E;">IF</span> (<span style="color: #38BDF8;">Percept.status</span> == <span style="color: #FCD34D;">'DIRTY'</span>) <span style="color: #10B981;">THEN</span> <span style="color: #FCD34D;">SUCK()</span>;<br>
            <span style="color: #F43F5E;">ELSE IF</span> (<span style="color: #38BDF8;">State.estimated_room</span> == <span style="color: #FCD34D;">'ROOM_B'</span>) <span style="color: #10B981;">THEN</span> <span style="color: #FCD34D;">MOVE_LEFT()</span>;
          </div>
        </div>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 0.1in 0.14in; font-size: 0.12in; color: #1E40AF;">
          <strong>Why Simple Reflex Fails:</strong> Simple reflex has no memory; upon cleaning Room B, it repeats identical action and loops forever.
        </div>
      </div>
    </div>

    <!-- Bottom Stack Chips -->
    <div style="margin-top: 0.2in; display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 0.2in;">
      <div class="card" style="padding: 0.14in 0.18in; display: flex; align-items: center; gap: 0.14in;">
        <div style="color: #D97706;">{SVG_CPU}</div>
        <div>
          <div style="font-size: 0.11in; font-weight: 800; color: #7A6F68; text-transform: uppercase;">STATE ESTIMATION</div>
          <div style="font-size: 0.14in; font-weight: 700; color: #1F1614;">Extended Kalman Filter / Belief Vector</div>
        </div>
      </div>

      <div class="card" style="padding: 0.14in 0.18in; display: flex; align-items: center; gap: 0.14in;">
        <div style="color: #03543F;">{SVG_FLOW}</div>
        <div>
          <div style="font-size: 0.11in; font-weight: 800; color: #7A6F68; text-transform: uppercase;">DECISION ENGINE</div>
          <div style="font-size: 0.14in; font-weight: 700; color: #1F1614;">Production Rule Set (Rete Algorithm)</div>
        </div>
      </div>

      <div class="card" style="padding: 0.14in 0.18in; display: flex; align-items: center; gap: 0.14in;">
        <div style="color: #1E429F;">{SVG_SHIELD}</div>
        <div>
          <div style="font-size: 0.11in; font-weight: 800; color: #7A6F68; text-transform: uppercase;">FAILSAFE GUARANTEE</div>
          <div style="font-size: 0.14in; font-weight: 700; color: #1F1614;">100% Deterministic Edge Response</div>
        </div>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span>Slide 06 / 10 • Concrete Real-World Implementations</span>
    <span>Aarush Bharti (24U020010) • IIIT Bhopal</span>
  </div>
</div>
'''

# -------------------------------------------------------------
# SLIDE 7: Comparative Taxonomy Across Agent Types
# -------------------------------------------------------------
html_content += f'''
<!-- SLIDE 7 -->
<div class="slide" id="slide7">
  <div class="slide-header">
    <div class="header-left-cluster">
      <span class="inst-badge">IIIT BHOPAL</span>
      <span class="course-badge">AI & MACHINE LEARNING</span>
      <span class="group-badge">COMPARATIVE TAXONOMY</span>
    </div>
    <div class="slide-counter">07 / 10</div>
  </div>

  <div class="slide-title-zone">
    <h2 class="slide-title">Comparative Analysis: <span class="accent">Agent Architectures Across AI Spectrum</span></h2>
    <div class="slide-subtitle">Benchmarking reflex, model-based, goal-driven, and utility-optimizing agents.</div>
  </div>

  <div class="slide-content">
    <div style="display: grid; grid-template-columns: 3.2in 1fr; gap: 0.25in; flex: 1;">
      <!-- Left Column: Metrics & Highlights -->
      <div style="display: flex; flex-direction: column; gap: 0.15in;">
        <div class="card" style="padding: 0.2in; background: #2D0C1E; color: #FFFFFF;">
          <div style="font-size: 0.12in; font-weight: 700; color: #F59E0B; text-transform: uppercase; margin-bottom: 0.05in;">CORE BENCHMARK</div>
          <div style="font-size: 0.26in; font-weight: 800; line-height: 1.1; margin-bottom: 0.08in;">The Reflex Sweet Spot</div>
          <p style="font-size: 0.125in; color: #D1D5DB; line-height: 1.45;">
            Model-based reflex agents provide memory without the exponential computation cost of forward tree search.
          </p>
        </div>

        <div class="card" style="padding: 0.16in 0.2in;">
          <div style="font-size: 0.22in; font-weight: 800; color: #057A55;">100% Loop Free</div>
          <div style="font-size: 0.115in; color: #64748B; margin-top: 0.03in;">Eliminates infinite state ambiguity cycles</div>
        </div>

        <div class="card" style="padding: 0.16in 0.2in;">
          <div style="font-size: 0.22in; font-weight: 800; color: #1E429F;">O(1) Decision Speed</div>
          <div style="font-size: 0.115in; color: #64748B; margin-top: 0.03in;">Constant-time direct rule triggering</div>
        </div>

        <div class="card" style="padding: 0.16in 0.2in;">
          <div style="font-size: 0.22in; font-weight: 800; color: #D97706;">Bounded Memory</div>
          <div style="font-size: 0.115in; color: #64748B; margin-top: 0.03in;">Requires no unbounded percept storage</div>
        </div>
      </div>

      <!-- Right Column: Full Matrix Table -->
      <div class="card" style="padding: 0.2in; display: flex; flex-direction: column; justify-content: space-between;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.125in; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid #E5E7EB; color: #1F1614;">
              <th style="padding: 0.1in 0.12in; font-weight: 800; text-transform: uppercase; font-size: 0.11in;">AGENT TYPE</th>
              <th style="padding: 0.1in 0.12in; font-weight: 800; text-transform: uppercase; font-size: 0.11in;">INTERNAL MEMORY</th>
              <th style="padding: 0.1in 0.12in; font-weight: 800; text-transform: uppercase; font-size: 0.11in;">OBSERVABILITY</th>
              <th style="padding: 0.1in 0.12in; font-weight: 800; text-transform: uppercase; font-size: 0.11in;">DECISION BASIS</th>
              <th style="padding: 0.1in 0.12in; font-weight: 800; text-transform: uppercase; font-size: 0.11in;">COMPUTATION</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 0.11in 0.12in; font-weight: 700; color: #4B5563;">Simple Reflex</td>
              <td style="padding: 0.11in 0.12in; color: #DC2626;">None (Stateless)</td>
              <td style="padding: 0.11in 0.12in; color: #DC2626;">Fully Observable Only</td>
              <td style="padding: 0.11in 0.12in;">Condition-Action (P_t)</td>
              <td style="padding: 0.11in 0.12in; font-weight: 700; color: #057A55;">O(1) Instant</td>
            </tr>

            <tr style="background: #FEF3C7; border-bottom: 2px solid #F59E0B; border-top: 2px solid #F59E0B;">
              <td style="padding: 0.12in 0.12in; font-weight: 800; color: #92400E;">★ Model-Based Reflex</td>
              <td style="padding: 0.12in 0.12in; font-weight: 700; color: #92400E;">Internal State S_t</td>
              <td style="padding: 0.12in 0.12in; font-weight: 700; color: #057A55;">Partially Observable</td>
              <td style="padding: 0.12in 0.12in; font-weight: 700; color: #92400E;">Condition-Action (S_t)</td>
              <td style="padding: 0.12in 0.12in; font-weight: 800; color: #057A55;">O(1) Constant</td>
            </tr>

            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 0.11in 0.12in; font-weight: 700; color: #4B5563;">Goal-Based Agent</td>
              <td style="padding: 0.11in 0.12in; color: #057A55;">Internal State + Goals</td>
              <td style="padding: 0.11in 0.12in; color: #057A55;">Partially Observable</td>
              <td style="padding: 0.11in 0.12in;">Planning / Search (Tree)</td>
              <td style="padding: 0.11in 0.12in; color: #D97706;">O(b^d) Search Tree</td>
            </tr>

            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 0.11in 0.12in; font-weight: 700; color: #4B5563;">Utility-Based Agent</td>
              <td style="padding: 0.11in 0.12in; color: #057A55;">State + Utility Fn U(s)</td>
              <td style="padding: 0.11in 0.12in; color: #057A55;">Partially Observable</td>
              <td style="padding: 0.11in 0.12in;">Expected Utility Max</td>
              <td style="padding: 0.11in 0.12in; color: #DC2626;">O(b^d) Optimization</td>
            </tr>

            <tr>
              <td style="padding: 0.11in 0.12in; font-weight: 700; color: #4B5563;">Learning Agent</td>
              <td style="padding: 0.11in 0.12in; color: #057A55;">Critic + Learning Goals</td>
              <td style="padding: 0.11in 0.12in; color: #057A55;">Unknown Environment</td>
              <td style="padding: 0.11in 0.12in;">Exploration vs Exploitation</td>
              <td style="padding: 0.11in 0.12in; color: #7C3AED;">Iterative Training</td>
            </tr>
          </tbody>
        </table>

        <div style="background: #F8FAFC; border-radius: 8px; padding: 0.1in 0.14in; font-size: 0.12in; color: #475569; display: flex; justify-content: space-between; align-items: center;">
          <span>💡 <strong>Architectural Hierarchy:</strong> Model-based reflex agents serve as the foundation for both Goal-Based and Utility-Based planning engines.</span>
        </div>
      </div>
    </div>

    <!-- Quote Banner -->
    <div class="quote-banner">
      <div class="quote-label-badge">
        {SVG_CHECK}
        <span>COMPARATIVE TAKEAWAY</span>
      </div>
      <div class="quote-text">
        "Model-Based Reflex agents are the <strong>fastest possible intelligent agents</strong> capable of surviving in partially observable environments without paying the computational penalty of multi-step tree search."
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span>Slide 07 / 10 • Comparative Taxonomy Across AI Architectures</span>
    <span>Aarush Bharti (24U020010) • IIIT Bhopal</span>
  </div>
</div>
'''

# -------------------------------------------------------------
# SLIDE 8: Limitations, Failure Modes & Edge Cases
# -------------------------------------------------------------
html_content += f'''
<!-- SLIDE 8 -->
<div class="slide" id="slide8">
  <div class="slide-header">
    <div class="header-left-cluster">
      <span class="inst-badge">IIIT BHOPAL</span>
      <span class="course-badge">AI & MACHINE LEARNING</span>
      <span class="group-badge">ROBUSTNESS & FAILURE MODES</span>
    </div>
    <div class="slide-counter">08 / 10</div>
  </div>

  <div class="slide-title-zone">
    <h2 class="slide-title">Critical Limitations: <span class="accent">When Internal Models Break Down</span></h2>
    <div class="slide-subtitle">Analyzing model drift, error accumulation, and high-dimensional state space explosion.</div>
  </div>

  <div class="slide-content">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.22in; flex: 1;">
      <!-- Card 1: Model Drift -->
      <div class="card" style="padding: 0; display: flex; overflow: hidden;">
        <div style="width: 2.3in; background: #2D0C1E; color: #FFFFFF; padding: 0.25in 0.18in; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; flex-shrink: 0;">
          <div style="margin-bottom: 0.12in; color: #EF4444;">{SVG_ALERT}</div>
          <div style="font-size: 0.17in; font-weight: 800; line-height: 1.25; margin-bottom: 0.05in;">Model Drift & Divergence</div>
          <div style="font-size: 0.115in; color: #D1D5DB; font-family: 'JetBrains Mono', monospace;">The Reality Gap</div>
        </div>
        <div style="padding: 0.22in 0.25in; display: flex; flex-direction: column; justify-content: center;">
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.1in; font-size: 0.135in; color: #374151; line-height: 1.45;">
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #DC2626; font-size: 0.16in; line-height: 1;">✕</span>
              <span><strong>Imperfect Physics:</strong> Transition model assumes static wheel friction, but ice reduces traction by 80%.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #DC2626; font-size: 0.16in; line-height: 1;">✕</span>
              <span><strong>Cascading Hallucination:</strong> An erroneous state estimate leads to wrong actions, driving the model further from reality.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #057A55; font-size: 0.16in; line-height: 1;">✓</span>
              <span><strong>Mitigation:</strong> Sensor re-calibration loops and Kalman innovation residual checks.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Card 2: State Space Explosion -->
      <div class="card" style="padding: 0; display: flex; overflow: hidden;">
        <div style="width: 2.3in; background: #2D0C1E; color: #FFFFFF; padding: 0.25in 0.18in; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; flex-shrink: 0;">
          <div style="margin-bottom: 0.12in; color: #EF4444;">{SVG_DATABASE}</div>
          <div style="font-size: 0.17in; font-weight: 800; line-height: 1.25; margin-bottom: 0.05in;">State Space Explosion</div>
          <div style="font-size: 0.115in; color: #D1D5DB; font-family: 'JetBrains Mono', monospace;">Curse of Dimensionality</div>
        </div>
        <div style="padding: 0.22in 0.25in; display: flex; flex-direction: column; justify-content: center;">
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.1in; font-size: 0.135in; color: #374151; line-height: 1.45;">
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #DC2626; font-size: 0.16in; line-height: 1;">✕</span>
              <span><strong>Continuous Variables:</strong> Representing 3D geometry, weather, and road conditions exceeds discrete lookup bounds.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #DC2626; font-size: 0.16in; line-height: 1;">✕</span>
              <span><strong>Rule Proliferation:</strong> Hand-crafting condition-action rules for 10,000 edge states becomes humanly impossible.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #057A55; font-size: 0.16in; line-height: 1;">✓</span>
              <span><strong>Mitigation:</strong> Feature discretization and learned neural state representations (Autoencoders).</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Card 3: Non-Stationary Multi-Agent Worlds -->
      <div class="card" style="padding: 0; display: flex; overflow: hidden;">
        <div style="width: 2.3in; background: #2D0C1E; color: #FFFFFF; padding: 0.25in 0.18in; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; flex-shrink: 0;">
          <div style="margin-bottom: 0.12in; color: #EF4444;">{SVG_NETWORK}</div>
          <div style="font-size: 0.17in; font-weight: 800; line-height: 1.25; margin-bottom: 0.05in;">Dynamic Multi-Agent Worlds</div>
          <div style="font-size: 0.115in; color: #D1D5DB; font-family: 'JetBrains Mono', monospace;">Unpredictable Actors</div>
        </div>
        <div style="padding: 0.22in 0.25in; display: flex; flex-direction: column; justify-content: center;">
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.1in; font-size: 0.135in; color: #374151; line-height: 1.45;">
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #DC2626; font-size: 0.16in; line-height: 1;">✕</span>
              <span><strong>External Agency:</strong> Other cars, pedestrians, or adversarial actors change their behavior unpredictably.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #DC2626; font-size: 0.16in; line-height: 1;">✕</span>
              <span><strong>Static Transition Violation:</strong> Physics alone cannot predict human panic or erratic steering maneuvers.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #057A55; font-size: 0.16in; line-height: 1;">✓</span>
              <span><strong>Mitigation:</strong> Game-theoretic intention prediction and probabilistic state distributions.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Card 4: Myopic Horizon -->
      <div class="card" style="padding: 0; display: flex; overflow: hidden;">
        <div style="width: 2.3in; background: #2D0C1E; color: #FFFFFF; padding: 0.25in 0.18in; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; flex-shrink: 0;">
          <div style="margin-bottom: 0.12in; color: #EF4444;">{SVG_TARGET}</div>
          <div style="font-size: 0.17in; font-weight: 800; line-height: 1.25; margin-bottom: 0.05in;">The Myopic Horizon Trap</div>
          <div style="font-size: 0.115in; color: #D1D5DB; font-family: 'JetBrains Mono', monospace;">Lack of Deliberation</div>
        </div>
        <div style="padding: 0.22in 0.25in; display: flex; flex-direction: column; justify-content: center;">
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.1in; font-size: 0.135in; color: #374151; line-height: 1.45;">
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #DC2626; font-size: 0.16in; line-height: 1;">✕</span>
              <span><strong>Instant Reflex Only:</strong> Fires immediate action based on current state without projecting 5 steps ahead.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #DC2626; font-size: 0.16in; line-height: 1;">✕</span>
              <span><strong>Dead-End Traps:</strong> Agent avoids immediate obstacle but drives directly into an inescapable cul-de-sac.</span>
            </li>
            <li style="display: flex; gap: 0.08in;">
              <span style="color: #057A55; font-size: 0.16in; line-height: 1;">✓</span>
              <span><strong>Mitigation:</strong> Upgrading from Reflex to <strong>Goal-Based / Utility-Based Planning Engines</strong>.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Quote Banner -->
    <div class="quote-banner">
      <div class="quote-label-badge">
        {SVG_ALERT}
        <span>CRITICAL LIMITATION</span>
      </div>
      <div class="quote-text">
        "A model-based reflex agent knows <strong>what the world is like</strong>, but still lacks knowledge of <strong>what it wants to achieve</strong>. To plan multiple steps ahead, it must be upgraded with goals and utility functions."
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span>Slide 08 / 10 • Robustness, Failure Modes & Edge Cases</span>
    <span>Aarush Bharti (24U020010) • IIIT Bhopal</span>
  </div>
</div>
'''

# -------------------------------------------------------------
# SLIDE 9: Modern Evolution: Deep RL & World Models
# -------------------------------------------------------------
html_content += f'''
<!-- SLIDE 9 -->
<div class="slide" id="slide9">
  <div class="slide-header">
    <div class="header-left-cluster">
      <span class="inst-badge">IIIT BHOPAL</span>
      <span class="course-badge">AI & MACHINE LEARNING</span>
      <span class="group-badge">FRONTIER AI EXTENSIONS</span>
    </div>
    <div class="slide-counter">09 / 10</div>
  </div>

  <div class="slide-title-zone">
    <h2 class="slide-title">Modern AI Evolution: <span class="accent">Neural World Models & Recurrent Agents</span></h2>
    <div class="slide-subtitle">Bridging classical Russell & Norvig theory to state-of-the-art Deep Reinforcement Learning (2018–2026).</div>
  </div>

  <div class="slide-content">
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.2in; flex: 1;">
      <!-- Card 1 -->
      <div class="card" style="padding: 0.22in; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.12in;">
            <span class="amber-pill">NeurIPS Landmark</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.11in; color: #64748B;">2018</span>
          </div>
          <div style="font-size: 0.18in; font-weight: 800; color: #1F1614; margin-bottom: 0.08in;">
            Ha & Schmidhuber: World Models
          </div>
          <p style="font-size: 0.13in; color: #4B5563; line-height: 1.45; margin-bottom: 0.12in;">
            Combines a VAE (Vision Model V) to compress pixel frames into latent vector z, and an MDN-RNN (Memory Model M) to predict future latent states.
          </p>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.1in; font-size: 0.115in; color: #334155;">
          <strong>Breakthrough:</strong> The Controller C learns to act entirely inside the agent's simulated "dream" world model.
        </div>
      </div>

      <!-- Card 2 -->
      <div class="card" style="padding: 0.22in; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.12in;">
            <span class="blue-pill">Deep POMDP</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.11in; color: #64748B;">Recurrent Q</span>
          </div>
          <div style="font-size: 0.18in; font-weight: 800; color: #1F1614; margin-bottom: 0.08in;">
            Deep Recurrent Q-Networks (DRQN)
          </div>
          <p style="font-size: 0.13in; color: #4B5563; line-height: 1.45; margin-bottom: 0.12in;">
            Replaces feed-forward layers in DQN with an LSTM recurrent cell. The LSTM hidden state h_t serves as the mathematical internal belief state.
          </p>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.1in; font-size: 0.115in; color: #334155;">
          <strong>Breakthrough:</strong> Solves partially observable Atari games (e.g. flickering screens) without handcrafted transition equations.
        </div>
      </div>

      <!-- Card 3 -->
      <div class="card" style="padding: 0.22in; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.12in;">
            <span class="green-pill">SOTA Model-Based</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.11in; color: #64748B;">Nature 2023</span>
          </div>
          <div style="font-size: 0.18in; font-weight: 800; color: #1F1614; margin-bottom: 0.08in;">
            Hafner et al.: DreamerV3
          </div>
          <p style="font-size: 0.13in; color: #4B5563; line-height: 1.45; margin-bottom: 0.12in;">
            A general world model algorithm that learns master-level behavior in 150+ diverse domains (Minecraft, Atari, robotic arm manipulation) with fixed hyperparameters.
          </p>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.1in; font-size: 0.115in; color: #334155;">
          <strong>Breakthrough:</strong> Proves that latent model-based reflex imagination outperforms pure model-free trial-and-error.
        </div>
      </div>

      <!-- Card 4 -->
      <div class="card" style="padding: 0.22in; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.12in;">
            <span class="purple-pill">Embodied Robotics</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.11in; color: #64748B;">2026 Production</span>
          </div>
          <div style="font-size: 0.18in; font-weight: 800; color: #1F1614; margin-bottom: 0.08in;">
            Tesla FSD & Boston Dynamics
          </div>
          <p style="font-size: 0.13in; color: #4B5563; line-height: 1.45; margin-bottom: 0.12in;">
            Spatial Occupancy Networks: Autonomous vehicles construct a persistent 4D voxel grid representation over time, remembering occluded cars behind trucks.
          </p>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.1in; font-size: 0.115in; color: #334155;">
          <strong>Breakthrough:</strong> 3D temporal persistence maps enable safe navigation through complex urban roundabouts.
        </div>
      </div>
    </div>

    <!-- Quote Banner -->
    <div class="quote-banner">
      <div class="quote-label-badge">
        {SVG_BRAIN}
        <span>MODERN SYNTHESIS</span>
      </div>
      <div class="quote-text">
        "Classical AI designed model-based agents using <strong>handcrafted transition tables</strong>. Modern Deep RL trains <strong>self-supervised Neural World Models</strong> that learn physics, occlusion, and causal dynamics directly from raw sensory video."
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span>Slide 09 / 10 • Frontier AI Extensions & Neural World Models</span>
    <span>Aarush Bharti (24U020010) • IIIT Bhopal</span>
  </div>
</div>
'''

# -------------------------------------------------------------
# SLIDE 10: Conclusion, Future Scope & References
# -------------------------------------------------------------
html_content += f'''
<!-- SLIDE 10 -->
<div class="slide" id="slide10">
  <div class="slide-header">
    <div class="header-left-cluster">
      <span class="inst-badge">IIIT BHOPAL</span>
      <span class="course-badge">AI & MACHINE LEARNING</span>
      <span class="group-badge">SUMMARY & REFERENCES</span>
    </div>
    <div class="slide-counter">10 / 10</div>
  </div>

  <div class="slide-title-zone">
    <h2 class="slide-title">Conclusion, Future Scope & <span class="accent">Academic References</span></h2>
    <div class="slide-subtitle">Synthesizing foundational agent theory with future autonomous systems engineering.</div>
  </div>

  <div class="slide-content">
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.22in; flex: 1;">
      <!-- Col 1: What We Established -->
      <div style="display: flex; flex-direction: column; gap: 0.12in;">
        <div style="background: #2D0C1E; color: #FFFFFF; border-radius: 12px; padding: 0.1in 0.16in; font-size: 0.13in; font-weight: 700; display: flex; align-items: center; gap: 0.08in;">
          {SVG_CHECK}
          <span>Core Takeaways (Conclusion)</span>
        </div>

        <div class="card" style="padding: 0.12in 0.16in; flex: 1; display: flex; align-items: center; gap: 0.12in;">
          <div style="color: #D97706;">{SVG_EYE}</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Overcomes Partial Observability</div>
            <div style="font-size: 0.11in; color: #64748B;">Memory buffers bridge sensor occlusions.</div>
          </div>
        </div>

        <div class="card" style="padding: 0.12in 0.16in; flex: 1; display: flex; align-items: center; gap: 0.12in;">
          <div style="color: #03543F;">{SVG_REFRESH}</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Eliminates Infinite Loops</div>
            <div style="font-size: 0.11in; color: #64748B;">Breaks identical percept ambiguity.</div>
          </div>
        </div>

        <div class="card" style="padding: 0.12in 0.16in; flex: 1; display: flex; align-items: center; gap: 0.12in;">
          <div style="color: #1E429F;">{SVG_CLOCK}</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Constant-Time O(1) Speed</div>
            <div style="font-size: 0.11in; color: #64748B;">Direct rule evaluation on internal state.</div>
          </div>
        </div>

        <div class="card" style="padding: 0.12in 0.16in; flex: 1; display: flex; align-items: center; gap: 0.12in;">
          <div style="color: #6B21A8;">{SVG_BRAIN}</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Stepping Stone to Planning</div>
            <div style="font-size: 0.11in; color: #64748B;">Forms core of Goal & Utility agents.</div>
          </div>
        </div>
      </div>

      <!-- Col 2: Future Scope -->
      <div style="display: flex; flex-direction: column; gap: 0.12in;">
        <div style="background: #2D0C1E; color: #FFFFFF; border-radius: 12px; padding: 0.1in 0.16in; font-size: 0.13in; font-weight: 700; display: flex; align-items: center; gap: 0.08in;">
          {SVG_LIGHTBULB}
          <span>Future Scope (Next Steps)</span>
        </div>

        <div class="card" style="padding: 0.12in 0.16in; flex: 1; display: flex; align-items: center; gap: 0.12in;">
          <div style="color: #D97706;">{SVG_NETWORK}</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Neuro-Symbolic World Models</div>
            <div style="font-size: 0.11in; color: #64748B;">Hybrid neural nets with explicit logic rules.</div>
          </div>
        </div>

        <div class="card" style="padding: 0.12in 0.16in; flex: 1; display: flex; align-items: center; gap: 0.12in;">
          <div style="color: #03543F;">{SVG_CPU}</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Diffusion-Based Belief States</div>
            <div style="font-size: 0.11in; color: #64748B;">Generative world models for edge robotics.</div>
          </div>
        </div>

        <div class="card" style="padding: 0.12in 0.16in; flex: 1; display: flex; align-items: center; gap: 0.12in;">
          <div style="color: #1E429F;">{SVG_FLOW}</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Multi-Agent Game Models</div>
            <div style="font-size: 0.11in; color: #64748B;">Estimating beliefs of external intelligent actors.</div>
          </div>
        </div>

        <div class="card" style="padding: 0.12in 0.16in; flex: 1; display: flex; align-items: center; gap: 0.12in;">
          <div style="color: #6B21A8;">{SVG_SHIELD}</div>
          <div>
            <div style="font-size: 0.13in; font-weight: 800; color: #1F1614;">Zero-Shot Sim-to-Real</div>
            <div style="font-size: 0.11in; color: #64748B;">Self-calibrating physical models under drift.</div>
          </div>
        </div>
      </div>

      <!-- Col 3: Academic References -->
      <div style="display: flex; flex-direction: column; gap: 0.12in;">
        <div style="background: #2D0C1E; color: #FFFFFF; border-radius: 12px; padding: 0.1in 0.16in; font-size: 0.13in; font-weight: 700; display: flex; align-items: center; gap: 0.08in;">
          {SVG_BOOK}
          <span>Key Academic References</span>
        </div>

        <div class="card" style="padding: 0.12in 0.16in; flex: 1; display: flex; align-items: center; gap: 0.12in;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.14in; font-weight: 800; color: #D97706;">[1]</span>
          <div>
            <div style="font-size: 0.125in; font-weight: 800; color: #1F1614;">Russell & Norvig (2020)</div>
            <div style="font-size: 0.11in; color: #64748B;">AI: A Modern Approach (4th Ed.), Chapter 2.</div>
          </div>
        </div>

        <div class="card" style="padding: 0.12in 0.16in; flex: 1; display: flex; align-items: center; gap: 0.12in;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.14in; font-weight: 800; color: #D97706;">[2]</span>
          <div>
            <div style="font-size: 0.125in; font-weight: 800; color: #1F1614;">Ha & Schmidhuber (2018)</div>
            <div style="font-size: 0.11in; color: #64748B;">World Models, NeurIPS / arXiv:1803.10122.</div>
          </div>
        </div>

        <div class="card" style="padding: 0.12in 0.16in; flex: 1; display: flex; align-items: center; gap: 0.12in;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.14in; font-weight: 800; color: #D97706;">[3]</span>
          <div>
            <div style="font-size: 0.125in; font-weight: 800; color: #1F1614;">Hafner et al. (2023)</div>
            <div style="font-size: 0.11in; color: #64748B;">Mastering Domains with World Models (DreamerV3).</div>
          </div>
        </div>

        <div class="card" style="padding: 0.12in 0.16in; flex: 1; display: flex; align-items: center; gap: 0.12in;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.14in; font-weight: 800; color: #D97706;">[4]</span>
          <div>
            <div style="font-size: 0.125in; font-weight: 800; color: #1F1614;">Kaelbling et al. (1998)</div>
            <div style="font-size: 0.11in; color: #64748B;">Planning & Acting in POMDPs, AI Journal.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Final Takeaway Banner -->
    <div style="background: #2D0C1E; color: #FFFFFF; border-radius: 12px; padding: 0.12in 0.2in; display: flex; align-items: center; gap: 0.16in; margin: 0.14in 0 0.12in;">
      <div style="color: #F59E0B;">{SVG_BRAIN}</div>
      <div style="font-size: 0.135in; font-weight: 500;">
        "Model-Based Reflex Agents form the critical cognitive bridge between <strong>reactive sensory instinct</strong> and <strong>deliberative forward planning</strong> in artificial intelligence."
      </div>
    </div>

    <!-- Team & Acknowledgement Footer (Solo Presenter & Dr. Meenakshi Choudhary) -->
    <div style="display: grid; grid-template-columns: 1.3fr 1.3fr 0.8fr; gap: 0.2in;">
      <div class="card" style="padding: 0.1in 0.16in; display: flex; align-items: center; gap: 0.12in;">
        <div style="color: #D97706;">{SVG_CHECK}</div>
        <div>
          <div style="font-size: 0.105in; font-weight: 800; color: #7A6F68; text-transform: uppercase;">PRESENTED BY</div>
          <div style="font-size: 0.125in; font-weight: 800; color: #1F1614;">Aarush Bharti (Scholar No: 24U020010)</div>
        </div>
      </div>

      <div class="card" style="padding: 0.1in 0.16in; display: flex; align-items: center; gap: 0.12in;">
        <div style="color: #D97706;">{SVG_BOOK}</div>
        <div>
          <div style="font-size: 0.105in; font-weight: 800; color: #7A6F68; text-transform: uppercase;">ASSISTANT PROFESSOR & GUIDE</div>
          <div style="font-size: 0.125in; font-weight: 800; color: #1F1614;">Dr. Meenakshi Choudhary, Dept. of CSE, IIIT Bhopal</div>
        </div>
      </div>

      <div class="card" style="padding: 0.1in 0.16in; background: #FEF3C7; border: 1px solid #FDE68A; display: flex; align-items: center; justify-content: center; text-align: center;">
        <span style="font-size: 0.13in; font-weight: 800; color: #92400E;">Thank you! • Q&A</span>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span>Slide 10 / 10 • Conclusion, Future Scope & References</span>
    <span>Aarush Bharti (24U020010) • IIIT Bhopal</span>
  </div>
</div>

</body>
</html>
'''

print(f"Writing updated HTML presentation to {OUTPUT_HTML}...")
with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML presentation written ({len(html_content)} characters).")

# Compile to PDF using Headless Chrome
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if not os.path.exists(chrome_path):
    chrome_path = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"

print(f"Using browser at {chrome_path} to print PDF...")
file_uri = f"file://{OUTPUT_HTML}"

cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--print-to-pdf-no-header",
    f"--print-to-pdf={OUTPUT_PDF}",
    "--virtual-time-budget=5000",
    "--run-all-compositor-stages-before-draw",
    file_uri
]

res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

if os.path.exists(OUTPUT_PDF):
    size = os.path.getsize(OUTPUT_PDF)
    print(f"Generated PDF at {OUTPUT_PDF} (Size: {size} bytes).")
    
    # Copy to Desktop
    shutil.copyfile(OUTPUT_PDF, DESKTOP_PDF)
    print(f"Copied PDF to Desktop: {DESKTOP_PDF}")

    # Re-render PNGs using PyMuPDF via uv
    subprocess.run([
        "/Users/aarush/.local/bin/uv", "run", "--with", "pymupdf", "python3", "-c", f"""
import fitz, os
doc = fitz.open('{OUTPUT_PDF}')
for i in range(len(doc)):
    page = doc[i]
    pix = page.get_pixmap(dpi=150)
    png_path = '{SLIDES_DIR}/slide_' + str(i+1) + '.png'
    pix.save(png_path)
    print(f'Rendered Slide {{i+1}}: {{pix.width}}x{{pix.height}}, colors: {{pix.color_count()}}')
"""
    ])
else:
    print("Error: PDF generation failed!")
