#!/usr/bin/env python3
"""
Community Hero - 8-Slide Exact Presentation Builder (Phase III Minor Project Defense)
Matches 100% of the user's approved slide content, wording, metrics, and figures
while maintaining the fire editorial light theme:
- Warm cream background (#FAF7F4)
- Deep academic plum (#421226)
- Warm amber gold (#D97706)
- Crisp white cards (#FFFFFF)
- Authentic embedded screenshots & IIIT Bhopal Crest
- Clean vector micro-icons and architectural diagrams
"""

import os
import base64
import subprocess
import shutil

ASSETS_DIR = "/Users/aarush/Desktop/Community Hero/docs/presentation_assets"
OUTPUT_HTML = "/Users/aarush/Desktop/Community Hero/docs/Community_Hero_8_Slide_Presentation_Light.html"
OUTPUT_PDF = "/Users/aarush/Desktop/Community Hero/docs/Community_Hero_8_Slide_Presentation.pdf"
DESKTOP_PDF = "/Users/aarush/Desktop/Community_Hero_8_Slide_Presentation.pdf"

def get_base64_image(filename):
    path = os.path.join(ASSETS_DIR, filename)
    if not os.path.exists(path):
        print(f"Warning: Asset {filename} not found at {path}")
        return ""
    mime = "image/png" if filename.endswith(".png") else "image/jpeg"
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    return f"data:{mime};base64,{data}"

print("Loading presentation assets as Base64...")
b64_iiit_logo = get_base64_image("iiit_logo.png")
b64_voice_cockpit = get_base64_image("web_voice_cockpit.png")
b64_globe = get_base64_image("web_globe_map.png")
b64_admin = get_base64_image("web_admin_console.png")
b64_citizen = get_base64_image("web_citizen_report.png")
b64_repair = get_base64_image("slide_repair_work.jpg")

# Vector SVG Micro-Icons
SVG_MIC = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>'''
SVG_LAYERS = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>'''
SVG_LEAF = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>'''
SVG_WIFI_OFF = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>'''
SVG_TARGET = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>'''
SVG_PIN = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'''
SVG_ALERT = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'''
SVG_FLOW = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>'''
SVG_CHART = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>'''
SVG_USER = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'''
SVG_GRAD = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>'''

print("Generating exact content 8-slide presentation HTML...")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Community Hero — CSE Minor Project Presentation (IIIT Bhopal)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {{
      --bg-cream: #FAF7F4;
      --card-white: #FFFFFF;
      --plum: #421226;
      --plum-light: #F4EBEF;
      --amber: #D97706;
      --amber-dark: #B45309;
      --amber-light: #FEF3C7;
      --text-dark: #1E293B;
      --text-body: #334155;
      --text-muted: #64748B;
      --border-subtle: #E8E2DD;
      --emerald: #059669;
      --emerald-light: #ECFDF5;
      --red: #DC2626;
      --red-light: #FEF2F2;
      --blue: #2563EB;
      --blue-light: #EFF6FF;
    }}

    @page {{
      size: 16in 9in;
      margin: 0;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }}

    body {{
      background: var(--bg-cream);
      color: var(--text-dark);
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }}

    .slide {{
      width: 16in;
      height: 9in;
      position: relative;
      overflow: hidden;
      padding: 0.38in 0.65in 0.32in 0.65in;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      background: var(--bg-cream);
      background-image: 
        radial-gradient(circle at 92% 8%, rgba(217, 119, 6, 0.04) 0%, transparent 40%),
        radial-gradient(circle at 8% 92%, rgba(66, 18, 38, 0.035) 0%, transparent 40%);
      border-bottom: 1px solid #E2D9D2;
    }}

    .slide:last-child {{
      page-break-after: avoid;
    }}

    @media screen {{
      body {{
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #D5CDC5;
        padding: 24px 0 60px 0;
        gap: 32px;
      }}
      .slide {{
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
      }}
    }}

    @media print {{
      body {{
        background: var(--bg-cream);
      }}
      .slide {{
        box-shadow: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
      }}
    }}

    /* Top Navigation Bar */
    .slide-topbar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.1in;
      border-bottom: 1.5px solid #E8E2DD;
      padding-bottom: 0.08in;
    }}

    .topbar-pills {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}

    .top-pill {{
      padding: 5px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.6px;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
    }}

    .top-pill.grey {{
      background: #EDE8E3;
      color: #475569;
    }}

    .top-pill.plum {{
      background: var(--plum);
      color: #FFFFFF;
    }}

    .slide-counter {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 800;
      color: var(--plum);
      border-bottom: 2.5px solid var(--amber);
      padding-bottom: 2px;
    }}

    /* Title Block */
    .slide-heading {{
      margin-bottom: 0.12in;
    }}

    .slide-title {{
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 30px;
      font-weight: 800;
      color: var(--plum);
      line-height: 1.15;
      margin-bottom: 4px;
    }}

    .slide-title span.gold {{
      color: var(--amber);
    }}

    .slide-subtitle {{
      font-size: 13.8px;
      color: var(--text-muted);
      line-height: 1.35;
      font-style: italic;
    }}

    /* Clean Card */
    .clean-card {{
      background: var(--card-white);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 0.18in 0.22in;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.025);
      display: flex;
      flex-direction: column;
      position: relative;
    }}

    .card-title {{
      font-size: 15px;
      font-weight: 800;
      color: var(--plum);
      margin-bottom: 4px;
      line-height: 1.25;
    }}

    .bullet-list {{
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6.5px;
      margin-top: 6px;
    }}

    .bullet-list li {{
      font-size: 12.2px;
      line-height: 1.4;
      color: var(--text-body);
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }}

    .bullet-dot {{
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--amber);
      margin-top: 6px;
      flex-shrink: 0;
    }}

    /* Bottom Quote Banner */
    .quote-banner {{
      background: var(--plum);
      color: #FFFFFF;
      border-radius: 12px;
      padding: 0.13in 0.22in;
      display: flex;
      align-items: center;
      gap: 0.2in;
      box-shadow: 0 4px 15px rgba(66, 18, 38, 0.12);
      margin-top: 0.12in;
    }}

    .quote-label-box {{
      display: flex;
      align-items: center;
      gap: 10px;
      padding-right: 0.18in;
      border-right: 1.5px solid rgba(255, 255, 255, 0.2);
      white-space: nowrap;
    }}

    .quote-label-title {{
      font-size: 14.5px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.4px;
    }}

    .quote-text {{
      font-size: 13.2px;
      line-height: 1.45;
      color: #FAF5F2;
      font-weight: 500;
    }}

    .quote-text strong {{
      color: var(--amber-light);
    }}

    /* Footer */
    .slide-footer {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.1in;
      border-top: 1.5px solid #E8E2DD;
      font-size: 11.2px;
      color: var(--text-muted);
      font-weight: 600;
    }}

    /* Metric Chips */
    .metric-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.18in;
      margin-top: 0.14in;
    }}

    .metric-chip {{
      background: #FFFFFF;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
    }}

    .metric-icon-wrap {{
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--amber-light);
      color: var(--amber-dark);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }}

    .metric-val {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 20px;
      font-weight: 800;
      color: var(--text-dark);
      line-height: 1;
    }}

    .metric-lbl {{
      font-size: 10px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }}

    /* Styled Comparison Table */
    .styled-table {{
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 10px;
      overflow: hidden;
      border: 1.5px solid var(--border-subtle);
      font-size: 11.8px;
    }}

    .styled-table th {{
      background: var(--plum);
      color: #FFFFFF;
      font-weight: 800;
      text-align: left;
      padding: 8px 12px;
      font-size: 11px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }}

    .styled-table td {{
      padding: 7.5px 12px;
      border-bottom: 1px solid #ECE7E2;
      color: var(--text-body);
      background: #FFFFFF;
      vertical-align: middle;
    }}

    .styled-table tr:nth-child(even) td {{
      background: #FAF8F5;
    }}

    .styled-table tr:last-child td {{
      border-bottom: none;
    }}

    .styled-table tr td:last-child {{
      background: #FEF3C7;
      font-weight: 700;
      color: var(--amber-dark);
    }}

    .tech-pill {{
      display: inline-flex;
      align-items: center;
      padding: 2px 7px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px;
      font-weight: 700;
      background: #F1ECE6;
      color: #475569;
      border: 1px solid #E2D9D2;
    }}
  </style>
</head>
<body>

  <!-- ==========================================
       SLIDE 1: TITLE / INTRO
       ========================================== -->
  <section class="slide" id="slide-1">
    <div class="slide-topbar">
      <div class="topbar-pills">
        <span class="top-pill grey">IIIT BHOPAL</span>
        <span class="top-pill plum">CSE MINOR PROJECT</span>
        <span class="top-pill grey">GROUP 104</span>
      </div>
      <span class="slide-counter">01 / 08</span>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
      
      <!-- Top Title + Crest Row -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.05in;">
        <div style="flex: 1; max-width: 9.8in;">
          <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 8px; background: var(--amber-light); border: 1.5px solid var(--amber); padding: 4px 14px; border-radius: 9999px;">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: var(--amber-dark);"></span>
            <span style="font-size: 11px; font-weight: 800; color: var(--amber-dark); letter-spacing: 0.6px; font-family: 'JetBrains Mono', monospace;">AUTONOMOUS CIVIC CAD SYSTEM</span>
          </div>
          
          <h1 class="slide-title" style="font-size: 48px; margin-bottom: 8px; letter-spacing: -0.5px;">
            Community <span class="gold">Hero</span>
          </h1>
          
          <p style="font-size: 15px; color: var(--text-body); line-height: 1.45; font-weight: 500; font-style: italic; max-width: 8.5in;">
            Autonomous Hyperlocal Civic Intelligence &amp; Emergency CAD Command Center with Zero-Typing Bilingual Voice Ingestion, 75m Spatial Clustering, and 3D Digital Twin Telemetry.
          </p>
        </div>

        <!-- IIIT Bhopal Crest Lockup -->
        <div style="display: flex; flex-direction: column; align-items: center; background: #FFFFFF; border: 1.5px solid var(--border-subtle); padding: 16px 22px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); min-width: 2.8in;">
          <img src="{b64_iiit_logo}" alt="IIIT Bhopal Crest" style="width: 82px; height: 82px; object-fit: contain; margin-bottom: 8px;">
          <div style="font-size: 12px; font-weight: 800; color: var(--plum); text-align: center; line-height: 1.25;">Indian Institute of Information Technology</div>
          <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-align: center; margin-top: 2px;">Bhopal, Madhya Pradesh, India</div>
        </div>
      </div>

      <!-- 3 Symmetrical Presenter & Supervisor Cards (Exact user wording, no extra tags) -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1.15fr; gap: 0.22in; margin-top: 0.15in;">
        <!-- Presenter 1: Aarush Bharti -->
        <div class="clean-card" style="padding: 0.22in; justify-content: center;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 24px; font-weight: 800; color: var(--plum);">Aarush Bharti</div>
            <div style="color: var(--text-muted);">{SVG_USER}</div>
          </div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: var(--amber-dark); font-weight: 700;">Scholar No: 24U020010</div>
        </div>

        <!-- Presenter 2: Ashish Goutam -->
        <div class="clean-card" style="padding: 0.22in; justify-content: center;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 24px; font-weight: 800; color: var(--plum);">Ashish Goutam</div>
            <div style="color: var(--text-muted);">{SVG_USER}</div>
          </div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: var(--amber-dark); font-weight: 700;">Scholar No: 24U020011</div>
        </div>

        <!-- Supervisor: Dr. Sreemoyee Biswas -->
        <div class="clean-card" style="padding: 0.22in; justify-content: center; border-left: 3.5px solid var(--amber);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <div style="font-size: 10.5px; font-weight: 800; color: var(--amber-dark); text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">PROJECT SUPERVISOR</div>
            <div style="color: var(--text-muted);">{SVG_GRAD}</div>
          </div>
          <div style="font-size: 24px; font-weight: 800; color: var(--plum); margin-bottom: 4px;">Dr. Sreemoyee Biswas</div>
          <div style="font-size: 12.5px; color: var(--text-body); font-weight: 600;">Designation: Assistant Professor, Department of CSE</div>
        </div>
      </div>

      <!-- Bottom 4 Metric Chips -->
      <div class="metric-grid">
        <div class="metric-chip">
          <div class="metric-icon-wrap">{SVG_MIC}</div>
          <div>
            <div class="metric-val">&lt; 850ms</div>
            <div class="metric-lbl">VOICE-TO-CAD INGESTION</div>
          </div>
        </div>
        <div class="metric-chip">
          <div class="metric-icon-wrap" style="background: var(--plum-light); color: var(--plum);">{SVG_LAYERS}</div>
          <div>
            <div class="metric-val">75m / 6h</div>
            <div class="metric-lbl">SPATIAL DEDUPLICATION</div>
          </div>
        </div>
        <div class="metric-chip">
          <div class="metric-icon-wrap" style="background: var(--emerald-light); color: var(--emerald);">{SVG_LEAF}</div>
          <div>
            <div class="metric-val">42%</div>
            <div class="metric-lbl">FLEET WASTE REDUCTION</div>
          </div>
        </div>
        <div class="metric-chip">
          <div class="metric-icon-wrap" style="background: var(--blue-light); color: var(--blue);">{SVG_WIFI_OFF}</div>
          <div>
            <div class="metric-val">100%</div>
            <div class="metric-lbl">ZERO-CLOUD OFFLINE FALLBACK</div>
          </div>
        </div>
      </div>

    </div>

    <div class="slide-footer">
      <div>IIIT Bhopal • Dept. of Computer Science &amp; Engineering • B.Tech Minor Project Defense</div>
      <div>Group 104 • Aarush Bharti &amp; Ashish Goutam</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 2: LITERATURE REVIEW / BACKGROUND
       ========================================== -->
  <section class="slide" id="slide-2">
    <div class="slide-topbar">
      <div class="topbar-pills">
        <span class="top-pill grey">IIIT BHOPAL</span>
        <span class="top-pill plum">CSE MINOR PROJECT</span>
        <span class="top-pill grey">GROUP 104</span>
      </div>
      <span class="slide-counter">02 / 08</span>
    </div>

    <div class="slide-heading">
      <h2 class="slide-title">Literature Review: <span class="gold">How Civic Problems Are Reported Today</span></h2>
      <p class="slide-subtitle">A comparison of existing complaint systems and why they fail during emergencies.</p>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
      
      <!-- 4 Cards matching user's exact content -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.18in;">
        <!-- Card 1 -->
        <div class="clean-card" style="border-top: 3.5px solid var(--red);">
          <div class="card-title">Government Apps &amp; Portals</div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">(e.g., CPGRAMS, Delhi 311)</div>
          
          <ul class="bullet-list">
            <li><span class="bullet-dot" style="background: var(--red);"></span> Citizens must fill long forms and click through multiple drop-down menus.</li>
            <li><span class="bullet-dot" style="background: var(--red);"></span> Takes 10 to 15 minutes to report a single issue.</li>
            <li><span class="bullet-dot" style="background: var(--red);"></span> Available mostly in English, making it hard for panicked or Hindi speakers.</li>
            <li><span class="bullet-dot" style="background: var(--red);"></span> Most citizens abandon the complaint before finishing.</li>
          </ul>
        </div>

        <!-- Card 2 -->
        <div class="clean-card" style="border-top: 3.5px solid var(--amber);">
          <div class="card-title">Standard Web Portals</div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">(e.g., Open311 Standard)</div>
          
          <ul class="bullet-list">
            <li><span class="bullet-dot"></span> Good digital system for organizing city complaints into a database.</li>
            <li><span class="bullet-dot"></span> No voice option — users still have to type everything by hand.</li>
            <li><span class="bullet-dot"></span> If 20 people report the same pothole, it creates 20 separate complaints.</li>
            <li><span class="bullet-dot"></span> Wastes municipal staff time manually finding duplicate reports.</li>
          </ul>
        </div>

        <!-- Card 3 -->
        <div class="clean-card" style="border-top: 3.5px solid var(--plum);">
          <div class="card-title">Emergency Call Centers</div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">(e.g., 112 India, 911 US)</div>
          
          <ul class="bullet-list">
            <li><span class="bullet-dot" style="background: var(--plum);"></span> Fast because citizens talk directly to a human operator.</li>
            <li><span class="bullet-dot" style="background: var(--plum);"></span> Phone lines quickly get overloaded during storms, fires, or big accidents.</li>
            <li><span class="bullet-dot" style="background: var(--plum);"></span> Very expensive for governments to hire and maintain 24/7 call staff.</li>
            <li><span class="bullet-dot" style="background: var(--plum);"></span> Panicked callers are often kept on hold for 10+ minutes.</li>
          </ul>
        </div>

        <!-- Card 4 -->
        <div class="clean-card" style="border-top: 3.5px solid var(--blue);">
          <div class="card-title">Standard AI Voice Bots</div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">(e.g., Generic Voice Chatbots)</div>
          
          <ul class="bullet-list">
            <li><span class="bullet-dot" style="background: var(--blue);"></span> Can understand spoken sentences and talk back.</li>
            <li><span class="bullet-dot" style="background: var(--blue);"></span> Frequently make mistakes or guess incorrectly about danger levels.</li>
            <li><span class="bullet-dot" style="background: var(--blue);"></span> Too slow for emergencies (takes 3 to 5 seconds to respond).</li>
            <li><span class="bullet-dot" style="background: var(--blue);"></span> Cannot safely verify exact street locations on a live map.</li>
          </ul>
        </div>
      </div>

      <!-- Bottom Banner (Exact user wording) -->
      <div class="quote-banner">
        <div class="quote-label-box">
          <div class="metric-icon-wrap" style="width: 32px; height: 32px; background: rgba(255,255,255,0.15); color: #FFFFFF;">{SVG_TARGET}</div>
          <div class="quote-label-title">What Is Missing Today:</div>
        </div>
        <div class="quote-text">
          &ldquo;There is no system where a citizen can simply speak naturally in <strong>Hindi or English</strong>, have the AI record the emergency in <strong>under 1 second</strong>, and automatically <strong>stop duplicate repair trucks</strong> from being sent to the exact same spot.&rdquo;
        </div>
      </div>

    </div>

    <div class="slide-footer">
      <div>Slide 02 / 08 • Literature Review &amp; Background</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 3: PROBLEM STATEMENT
       ========================================== -->
  <section class="slide" id="slide-3">
    <div class="slide-topbar">
      <div class="topbar-pills">
        <span class="top-pill grey">IIIT BHOPAL</span>
        <span class="top-pill plum">CSE MINOR PROJECT</span>
        <span class="top-pill grey">GROUP 104</span>
      </div>
      <span class="slide-counter">03 / 08</span>
    </div>

    <div class="slide-heading">
      <h2 class="slide-title">Problem Statement: <span class="gold">3 Core Breakdowns in City Problem Resolution</span></h2>
      <p class="slide-subtitle">Why current grievance systems fail citizens, workers, and city administrators.</p>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
      
      <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 0.28in; align-items: stretch;">
        
        <!-- Left: 3 Core Breakdown Cards (Exact user content) -->
        <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 0.12in;">
          <!-- 01 -->
          <div class="clean-card" style="padding: 0.16in 0.2in; border-left: 4.5px solid var(--red);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; font-weight: 800; color: var(--red); background: var(--red-light); padding: 2px 7px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">01</span>
                <span class="card-title" style="margin: 0; font-size: 15px;">High Reporting Friction (Citizen)</span>
              </div>
              <span style="font-size: 10.5px; font-weight: 800; color: var(--red); background: var(--red-light); padding: 3px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">Result: &gt;70% issues unreported</span>
            </div>
            <ul class="bullet-list" style="margin-top: 6px;">
              <li><span class="bullet-dot" style="background: var(--red);"></span> Issues seen daily but often not reported</li>
              <li><span class="bullet-dot" style="background: var(--red);"></span> Long forms &amp; manual ward selection</li>
              <li><span class="bullet-dot" style="background: var(--red);"></span> No quick photo + auto GPS</li>
            </ul>
          </div>

          <!-- 02 -->
          <div class="clean-card" style="padding: 0.16in 0.2in; border-left: 4.5px solid var(--amber);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; font-weight: 800; color: var(--amber-dark); background: var(--amber-light); padding: 2px 7px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">02</span>
                <span class="card-title" style="margin: 0; font-size: 15px;">Duplicate Complaints &amp; Wasted Resources (Municipal)</span>
              </div>
              <span style="font-size: 10.5px; font-weight: 800; color: var(--amber-dark); background: var(--amber-light); padding: 3px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">Result: Up to 40% fuel &amp; time wasted</span>
            </div>
            <ul class="bullet-list" style="margin-top: 6px;">
              <li><span class="bullet-dot"></span> 20–30 people report the same issue</li>
              <li><span class="bullet-dot"></span> 30 tickets for one spot</li>
              <li><span class="bullet-dot"></span> Multiple trucks sent to the same location</li>
            </ul>
          </div>

          <!-- 03 -->
          <div class="clean-card" style="padding: 0.16in 0.2in; border-left: 4.5px solid var(--plum);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; font-weight: 800; color: var(--plum); background: var(--plum-light); padding: 2px 7px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">03</span>
                <span class="card-title" style="margin: 0; font-size: 15px;">The "Black Hole" &amp; Fake Resolutions (Accountability)</span>
              </div>
              <span style="font-size: 10.5px; font-weight: 800; color: var(--plum); background: var(--plum-light); padding: 3px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">Result: Citizens lose trust</span>
            </div>
            <ul class="bullet-list" style="margin-top: 6px;">
              <li><span class="bullet-dot" style="background: var(--plum);"></span> No live updates or map tracking</li>
              <li><span class="bullet-dot" style="background: var(--plum);"></span> Tickets sit in long queues</li>
              <li><span class="bullet-dot" style="background: var(--plum);"></span> Often marked "Fixed" without proof</li>
            </ul>
          </div>
        </div>

        <!-- Right: Flowchart Frame matching user's exact diagram content -->
        <div class="clean-card" style="padding: 0.18in; justify-content: space-between; background: #FFFFFF;">
          <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1.5px solid #F1ECE6; padding-bottom: 6px;">
            <div style="color: var(--plum);">{SVG_ALERT}</div>
            <div style="font-size: 13.5px; font-weight: 800; color: var(--plum);">How Current Reporting Breaks Down</div>
          </div>

          <!-- Flowchart Graphic in SVG with exact wording -->
          <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 6px 0;">
            <svg width="100%" height="235" viewBox="0 0 440 235">
              <defs>
                <marker id="arr-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748B"/>
                </marker>
                <marker id="arr-dark" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#421226"/>
                </marker>
              </defs>

              <!-- Node 1: Civic Problem Happens -->
              <rect x="50" y="6" width="340" height="32" rx="6" fill="#421226"/>
              <text x="220" y="27" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="700" text-anchor="middle">Civic Problem Happens (Pothole, Garbage, or Water Leak)</text>

              <!-- Arrow 1 -->
              <line x1="220" y1="38" x2="220" y2="56" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-gray)"/>

              <!-- Node 2: Citizen Tries to Report -->
              <rect x="110" y="58" width="220" height="28" rx="6" fill="#EDE8E3" stroke="#D5CDC5" stroke-width="1"/>
              <text x="220" y="76" fill="#1E293B" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" text-anchor="middle">Citizen Tries to Report</text>

              <!-- Fork Lines -->
              <path d="M 170 86 L 170 102 L 105 102 L 105 114" fill="none" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-gray)"/>
              <path d="M 270 86 L 270 102 L 335 102 L 335 114" fill="none" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-gray)"/>

              <!-- Branch Left: Type details & fill forms -->
              <rect x="20" y="116" width="170" height="30" rx="6" fill="#FAF8F5" stroke="#E2D9D2" stroke-width="1"/>
              <text x="105" y="135" fill="#475569" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="700" text-anchor="middle">Type details &amp; fill forms</text>
              <line x1="105" y1="146" x2="105" y2="158" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-gray)"/>
              <rect x="20" y="160" width="170" height="28" rx="6" fill="#FEF2F2" stroke="#FCA5A5" stroke-width="1.2"/>
              <text x="105" y="178" fill="#DC2626" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="800" text-anchor="middle">❌ &gt;70% give up (Unreported)</text>

              <!-- Branch Right: Multiple people report same spot -->
              <rect x="250" y="116" width="170" height="30" rx="6" fill="#FAF8F5" stroke="#E2D9D2" stroke-width="1"/>
              <text x="335" y="135" fill="#475569" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="700" text-anchor="middle">Multiple people report same spot</text>
              <line x1="335" y1="146" x2="335" y2="158" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-gray)"/>
              <rect x="250" y="160" width="170" height="28" rx="6" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1.2"/>
              <text x="335" y="178" fill="#B45309" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="800" text-anchor="middle">❌ Multiple trucks sent (≈40% waste)</text>

              <!-- Merge Lines to Result -->
              <path d="M 105 188 L 105 198 L 220 198" fill="none" stroke="#421226" stroke-width="1.5"/>
              <path d="M 335 188 L 335 198 L 220 198" fill="none" stroke="#421226" stroke-width="1.5"/>
              <line x1="220" y1="198" x2="220" y2="204" stroke="#421226" stroke-width="1.8" marker-end="url(#arr-dark)"/>

              <!-- Bottom Outcome Node -->
              <rect x="50" y="206" width="340" height="26" rx="6" fill="#421226"/>
              <text x="220" y="223" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" text-anchor="middle">Result: Delay, waste &amp; loss of public trust</text>
            </svg>
          </div>
        </div>

      </div>

      <!-- Bottom Banner (Exact user wording) -->
      <div class="quote-banner">
        <div class="quote-label-box">
          <div class="metric-icon-wrap" style="width: 32px; height: 32px; background: rgba(255,255,255,0.15); color: #FFFFFF;">{SVG_ALERT}</div>
          <div class="quote-label-title">The Big Problem:</div>
        </div>
        <div class="quote-text">
          &ldquo;Reporting takes <strong>too much effort</strong>, trucks get <strong>wasted on duplicate reports</strong>, and citizens never know if it <strong>actually got fixed</strong>.&rdquo;
        </div>
      </div>

    </div>

    <div class="slide-footer">
      <div>Slide 03 / 08 • Problem Statement</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 4: PROPOSED METHODOLOGY
       ========================================== -->
  <section class="slide" id="slide-4">
    <div class="slide-topbar">
      <div class="topbar-pills">
        <span class="top-pill grey">IIIT BHOPAL</span>
        <span class="top-pill plum">CSE MINOR PROJECT</span>
        <span class="top-pill grey">GROUP 104</span>
      </div>
      <span class="slide-counter">04 / 08</span>
    </div>

    <div class="slide-heading">
      <h2 class="slide-title">Proposed Methodology: <span class="gold">The 4-Step Community Hero Solution</span></h2>
      <p class="slide-subtitle">A closed-loop system for easy reporting, smart grouping, and verified city repairs.</p>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
      
      <!-- 4 Cards matching user's exact content and graphic layout -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.16in;">
        
        <!-- Step 01 -->
        <div class="clean-card" style="border-top: 3.5px solid var(--plum); justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 800; color: #FFFFFF; background: var(--plum); padding: 2px 7px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">01</span>
              <div class="card-title" style="margin: 0; font-size: 14.5px;">Multi-Channel Easy Reporting</div>
            </div>
            
            <!-- Graphic thumbnail for phone photo -->
            <div style="height: 1.1in; border-radius: 8px; overflow: hidden; margin: 6px 0; border: 1px solid var(--border-subtle); background: #000;">
              <img src="{b64_citizen}" alt="Citizen Reporting Phone UI" style="width: 100%; height: 100%; object-fit: cover;">
            </div>

            <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 6px;">
              <div style="font-size: 11.5px; font-weight: 700; color: var(--text-dark);">📷 1-Click Photo</div>
              <div style="font-size: 11.5px; font-weight: 700; color: var(--amber-dark);">📍 Auto GPS</div>
              <div style="font-size: 11.5px; font-weight: 700; color: var(--plum);">🎙️ Voice / Call <span style="font-size: 10.5px; color: var(--text-muted); font-weight: 500;">(Hindi / English)</span></div>
            </div>
          </div>
        </div>

        <!-- Step 02 -->
        <div class="clean-card" style="border-top: 3.5px solid var(--amber); justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 800; color: #FFFFFF; background: var(--amber-dark); padding: 2px 7px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">02</span>
              <div class="card-title" style="margin: 0; font-size: 14.5px;">AI Categorization &amp; Severity</div>
            </div>

            <!-- Categories Graphic Box -->
            <div style="background: #FAF8F5; border: 1.5px solid var(--border-subtle); border-radius: 8px; padding: 10px; margin: 6px 0;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11.5px; font-weight: 700;">
                <div style="background: #FFFFFF; border: 1px solid #E2D9D2; padding: 4px 6px; border-radius: 4px;">🚗 Roads</div>
                <div style="background: #FFFFFF; border: 1px solid #E2D9D2; padding: 4px 6px; border-radius: 4px;">🗑️ Waste</div>
                <div style="background: #FFFFFF; border: 1px solid #E2D9D2; padding: 4px 6px; border-radius: 4px;">💧 Water</div>
                <div style="background: #FFFFFF; border: 1px solid #E2D9D2; padding: 4px 6px; border-radius: 4px;">⚡ Electricity</div>
              </div>
            </div>

            <!-- Severity Score Callout -->
            <div style="background: var(--amber-light); border: 1.5px solid var(--amber); padding: 8px; border-radius: 8px; text-align: center; margin-top: 6px;">
              <div style="font-size: 11.5px; font-weight: 800; color: var(--amber-dark);">⚠️ Severity Score: 1 – 10</div>
              <div style="font-size: 10.5px; color: #92400E; margin-top: 2px;">(High-risk &rarr; Instant Action)</div>
            </div>
          </div>
        </div>

        <!-- Step 03 -->
        <div class="clean-card" style="border-top: 3.5px solid var(--plum); justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 800; color: #FFFFFF; background: var(--plum); padding: 2px 7px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">03</span>
              <div class="card-title" style="margin: 0; font-size: 14.5px;">75-Meter Spatial Deduplication</div>
            </div>

            <!-- 75m Radius Graphic representation -->
            <div style="background: #FAF8F5; border: 1.5px solid var(--border-subtle); border-radius: 8px; padding: 12px; margin: 6px 0; text-align: center;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; border: 2px dashed var(--amber); background: var(--amber-light); color: var(--amber-dark); font-size: 16px; font-weight: 800; font-family: 'JetBrains Mono', monospace;">
                75m
              </div>
              <div style="font-size: 11px; font-weight: 700; color: var(--plum); margin-top: 4px;">Auto Deduplication Circle</div>
            </div>

            <div style="margin-top: 6px; font-size: 12px; font-weight: 700; color: var(--text-dark); text-align: center;">
              Merge duplicate reports within 75 meters
              <div style="font-size: 11px; color: var(--emerald); font-weight: 700; margin-top: 2px;">(Saves fuel, budget &amp; time)</div>
            </div>
          </div>
        </div>

        <!-- Step 04 -->
        <div class="clean-card" style="border-top: 3.5px solid var(--emerald); justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 800; color: #FFFFFF; background: var(--emerald); padding: 2px 7px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">04</span>
              <div class="card-title" style="margin: 0; font-size: 14.5px;">Live Map &amp; Proof-of-Work</div>
            </div>

            <!-- Before/After Repair Graphic -->
            <div style="height: 1.1in; border-radius: 8px; overflow: hidden; margin: 6px 0; border: 1px solid var(--border-subtle); background: #000;">
              <img src="{b64_repair}" alt="Before &amp; After Repair Proof" style="width: 100%; height: 100%; object-fit: cover;">
            </div>

            <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 6px;">
              <div style="font-size: 11.5px; font-weight: 700; color: var(--text-dark);">🗺️ Live map &amp; repair tracking</div>
              <div style="font-size: 11.5px; font-weight: 700; color: var(--emerald);">📸 Photo proof-of-work (After photo)</div>
              <div style="font-size: 11.5px; font-weight: 700; color: var(--amber-dark);">🏆 Citizen rewards (Civic XP &amp; badges)</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Step-by-Step Flow Ribbon (Exact user wording) -->
      <div style="display: flex; justify-content: space-between; align-items: center; background: #FFFFFF; border: 1.5px solid var(--border-subtle); border-radius: 10px; padding: 10px 20px; margin-top: 0.12in;">
        <div style="text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: var(--plum);">Step 1: Report</div>
          <div style="font-size: 11.5px; color: var(--text-muted);">(Photo + GPS + Voice)</div>
        </div>
        <div style="color: var(--amber); font-weight: bold; font-size: 16px;">&rarr;</div>
        <div style="text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: var(--plum);">Step 2: Classify &amp; Score</div>
          <div style="font-size: 11.5px; color: var(--text-muted);">(Department + 1–10)</div>
        </div>
        <div style="color: var(--amber); font-weight: bold; font-size: 16px;">&rarr;</div>
        <div style="text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: var(--plum);">Step 3: Dedup (75m)</div>
          <div style="font-size: 11.5px; color: var(--text-muted);">(Merge &amp; Upvote)</div>
        </div>
        <div style="color: var(--amber); font-weight: bold; font-size: 16px;">&rarr;</div>
        <div style="text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: var(--plum);">Step 4: Dispatch &amp; Verify</div>
          <div style="font-size: 11.5px; color: var(--text-muted);">(Live Map + Proof + Reward)</div>
        </div>
      </div>

      <!-- Bottom Banner (Exact user wording) -->
      <div class="quote-banner">
        <div class="quote-label-box">
          <div class="metric-icon-wrap" style="width: 32px; height: 32px; background: rgba(255,255,255,0.15); color: #FFFFFF;">{SVG_TARGET}</div>
          <div class="quote-label-title">Key Takeaway:</div>
        </div>
        <div class="quote-text">
          &ldquo;Community Hero makes reporting <strong>effortless</strong>, removes duplicate complaints <strong>within 75 meters</strong>, and ensures accountability with <strong>photo proof-of-work</strong>.&rdquo;
        </div>
      </div>

    </div>

    <div class="slide-footer">
      <div>Slide 04 / 08 • Proposed Methodology</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 5: SYSTEM DIAGRAM / FLOWCHART
       ========================================== -->
  <section class="slide" id="slide-5">
    <div class="slide-topbar">
      <div class="topbar-pills">
        <span class="top-pill grey">IIIT BHOPAL</span>
        <span class="top-pill plum">CSE MINOR PROJECT</span>
        <span class="top-pill grey">GROUP 104</span>
      </div>
      <span class="slide-counter">05 / 08</span>
    </div>

    <div class="slide-heading">
      <h2 class="slide-title">System Diagram &amp; <span class="gold">Operational Flowchart</span></h2>
      <p class="slide-subtitle">The step-by-step journey from citizen problem detection to city repair and verification.</p>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
      
      <div style="display: grid; grid-template-columns: 1fr 1.6fr 1fr; gap: 0.22in; align-items: stretch;">
        
        <!-- Left: Workflow Steps (Exact user wording) -->
        <div class="clean-card" style="padding: 0.18in; justify-content: space-between;">
          <div class="card-title" style="font-size: 15px; margin-bottom: 8px; border-bottom: 1.5px solid #F1ECE6; padding-bottom: 6px;">
            Workflow Steps
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <span style="font-size: 10px; font-weight: 800; color: #FFFFFF; background: var(--plum); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">01</span>
              <div style="font-size: 11.8px; line-height: 1.35;"><strong>Citizen Report:</strong> Photo (auto-GPS) or voice call.</div>
            </div>
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <span style="font-size: 10px; font-weight: 800; color: #FFFFFF; background: var(--plum); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">02</span>
              <div style="font-size: 11.8px; line-height: 1.35;"><strong>AI Categorization:</strong> Identify issue + urgency rating.</div>
            </div>
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <span style="font-size: 10px; font-weight: 800; color: #FFFFFF; background: var(--amber-dark); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">03</span>
              <div style="font-size: 11.8px; line-height: 1.35;"><strong>75-Meter Decision:</strong> Within 75 m &rarr; Merge &amp; upvote. Else &rarr; Create new ticket.</div>
            </div>
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <span style="font-size: 10px; font-weight: 800; color: #FFFFFF; background: var(--plum); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">04</span>
              <div style="font-size: 11.8px; line-height: 1.35;"><strong>Operations Room:</strong> See on live map &amp; dispatch team.</div>
            </div>
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <span style="font-size: 10px; font-weight: 800; color: #FFFFFF; background: var(--plum); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">05</span>
              <div style="font-size: 11.8px; line-height: 1.35;"><strong>Field Repair &amp; Proof:</strong> Fix issue and upload 'AFTER' photo.</div>
            </div>
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <span style="font-size: 10px; font-weight: 800; color: #FFFFFF; background: var(--emerald); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">06</span>
              <div style="font-size: 11.8px; line-height: 1.35;"><strong>Closed-Loop Reward:</strong> Pin turns green, notify citizen &amp; award Civic XP.</div>
            </div>
          </div>
        </div>

        <!-- Center: Vector Flowchart matching user's exact flowchart diagram -->
        <div class="clean-card" style="padding: 0.16in; justify-content: space-between; background: #FFFFFF;">
          <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
            <svg width="100%" height="280" viewBox="0 0 440 280">
              <defs>
                <marker id="arr-fc-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748B"/>
                </marker>
                <marker id="arr-fc-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669"/>
                </marker>
              </defs>

              <!-- Node 1: Step 1 Citizen Ingestion -->
              <rect x="50" y="4" width="340" height="30" rx="6" fill="#421226"/>
              <text x="220" y="17" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="700" text-anchor="middle">Step 1: Citizen Ingestion</text>
              <text x="220" y="28" fill="#F4EBEF" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" text-anchor="middle">• Photo Upload with Auto-GPS or Spoken Voice Report</text>

              <!-- Arrow 1 -->
              <line x1="220" y1="34" x2="220" y2="46" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-fc-gray)"/>

              <!-- Node 2: Step 2 AI Categorization -->
              <rect x="60" y="48" width="320" height="30" rx="6" fill="#EDE8E3" stroke="#D5CDC5" stroke-width="1"/>
              <text x="220" y="61" fill="#1E293B" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="700" text-anchor="middle">Step 2: AI Categorization</text>
              <text x="220" y="72" fill="#475569" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" text-anchor="middle">• Auto Category: Road, Waste, Water • Urgency Score: 1 to 10</text>

              <!-- Arrow 2 -->
              <line x1="220" y1="78" x2="220" y2="90" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-fc-gray)"/>

              <!-- Node 3: Decision Diamond / Box -->
              <polygon points="220,92 355,116 220,140 85,116" fill="#FEF3C7" stroke="#D97706" stroke-width="1.6"/>
              <text x="220" y="113" fill="#B45309" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="800" text-anchor="middle">Decision: Is there an existing</text>
              <text x="220" y="125" fill="#B45309" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" text-anchor="middle">report within 75 meters?</text>

              <!-- Branch YES (Left) -->
              <path d="M 85 116 L 45 116 L 45 154 L 85 154" fill="none" stroke="#059669" stroke-width="1.8" marker-end="url(#arr-fc-green)"/>
              <text x="60" y="110" fill="#059669" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="800">YES</text>

              <rect x="88" y="144" width="130" height="42" rx="6" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1.2"/>
              <text x="153" y="157" fill="#065F46" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="800" text-anchor="middle">Outcome A: Merge Master</text>
              <text x="153" y="169" fill="#059669" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" text-anchor="middle">• Add neighborhood upvote</text>
              <text x="153" y="180" fill="#065F46" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">• STOPS duplicate dispatches</text>

              <!-- Branch NO (Right) -->
              <path d="M 355 116 L 395 116 L 395 154 L 355 154" fill="none" stroke="#2563EB" stroke-width="1.8" marker-end="url(#arr-fc-gray)"/>
              <text x="365" y="110" fill="#2563EB" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="800">NO</text>

              <rect x="222" y="144" width="130" height="42" rx="6" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1.2"/>
              <text x="287" y="157" fill="#1E40AF" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="800" text-anchor="middle">Outcome B: Create New</text>
              <text x="287" y="169" fill="#2563EB" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" text-anchor="middle">• Assigns City Maint. ID</text>
              <text x="287" y="180" fill="#1E40AF" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">• Starts SLA Countdown</text>

              <!-- Reconverge to Step 3 -->
              <path d="M 153 186 L 153 196 L 220 196" fill="none" stroke="#64748B" stroke-width="1.5"/>
              <path d="M 287 186 L 287 196 L 220 196" fill="none" stroke="#64748B" stroke-width="1.5"/>
              <line x1="220" y1="196" x2="220" y2="204" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-fc-gray)"/>

              <!-- Step 3: Municipal Operations Room -->
              <rect x="60" y="206" width="320" height="26" rx="6" fill="#421226"/>
              <text x="220" y="218" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" text-anchor="middle">Step 3: Municipal Operations Room</text>
              <text x="220" y="228" fill="#F4EBEF" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" text-anchor="middle">• Shows on Live 3D/2D Map • Dispatches Nearest Field Crew</text>

              <!-- Arrow 3 -->
              <line x1="220" y1="232" x2="220" y2="240" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-fc-gray)"/>

              <!-- Step 4 & 5: Field Repair Proof -->
              <rect x="60" y="242" width="320" height="28" rx="6" fill="#ECFDF5" stroke="#059669" stroke-width="1.5"/>
              <text x="220" y="254" fill="#065F46" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="800" text-anchor="middle">Step 4 &amp; 5: Field Repair Proof &rarr; Map Pin Turns GREEN</text>
              <text x="220" y="264" fill="#059669" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" text-anchor="middle">• Crew uploads 'AFTER' photo • Citizen gets notification &amp; Civic XP</text>
            </svg>
          </div>
          
          <div style="font-size: 10px; color: var(--text-muted); text-align: center; font-style: italic; border-top: 1px solid var(--border-subtle); padding-top: 4px; margin-top: 2px;">
            Figure 5.1: Community Hero End-to-End Workflow &amp; Spatial Deduplication Logic
          </div>
        </div>

        <!-- Right: Key Properties (Exact user content) -->
        <div class="clean-card" style="padding: 0.18in; justify-content: space-between;">
          <div class="card-title" style="font-size: 15px; margin-bottom: 8px; border-bottom: 1.5px solid #F1ECE6; padding-bottom: 6px;">
            Key Properties
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div>
              <div style="font-size: 12.5px; font-weight: 800; color: var(--plum);">75-Meter Radius</div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">Merges nearby reports (within walking distance).</div>
            </div>

            <div>
              <div style="font-size: 12.5px; font-weight: 800; color: var(--amber-dark);">Under 4ms Speed</div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">Checks for duplicates almost instantly.</div>
            </div>

            <div>
              <div style="font-size: 12.5px; font-weight: 800; color: var(--plum);">6-Hour Time Window</div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">Connects repeated calls for the same event during the day.</div>
            </div>

            <div>
              <div style="font-size: 12.5px; font-weight: 800; color: var(--emerald);">Guaranteed Proof</div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">No ticket can be closed without an 'AFTER' repair photo.</div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <div class="slide-footer">
      <div>Slide 05 / 08 • System Diagram / Flowchart</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 6: IMPLEMENTATION
       ========================================== -->
  <section class="slide" id="slide-6">
    <div class="slide-topbar">
      <div class="topbar-pills">
        <span class="top-pill grey">IIIT BHOPAL</span>
        <span class="top-pill plum">CSE MINOR PROJECT</span>
        <span class="top-pill grey">GROUP 104</span>
      </div>
      <span class="slide-counter">06 / 08</span>
    </div>

    <div class="slide-heading">
      <h2 class="slide-title">System Implementation: <span class="gold">Working Platform &amp; Technology Stack</span></h2>
      <p class="slide-subtitle">A live demonstration of our working 3D geospatial engine, voice emergency cockpit, and municipal backend.</p>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
      
      <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 0.28in; align-items: stretch;">
        
        <!-- Left: Two Authentic Screenshots -->
        <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 0.12in;">
          <div style="border-radius: 10px; overflow: hidden; border: 1.5px solid var(--border-subtle); position: relative; height: 1.85in; background: #000;">
            <img src="{b64_voice_cockpit}" alt="Live CAD Voice Cockpit" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; bottom: 6px; left: 10px; background: rgba(0,0,0,0.8); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px;">
              Live CAD Voice Cockpit &amp; Emergency Work Orders
            </div>
          </div>

          <div style="border-radius: 10px; overflow: hidden; border: 1.5px solid var(--border-subtle); position: relative; height: 1.85in; background: #000;">
            <img src="{b64_globe}" alt="3D Digital Twin City Command Center" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; bottom: 6px; left: 10px; background: rgba(0,0,0,0.8); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px;">
              3D Digital Twin City Command Center
            </div>
          </div>
        </div>

        <!-- Right: System Modules & Technology (Exact user content) -->
        <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 0.1in;">
          
          <!-- Module 1 -->
          <div class="clean-card" style="padding: 0.12in 0.16in;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
              <div style="font-size: 13.5px; font-weight: 800; color: var(--plum);">Frontend &amp; 3D Map Interface</div>
              <div style="display: flex; gap: 4px;">
                <span class="tech-pill">React 18</span>
                <span class="tech-pill">Three.js</span>
              </div>
            </div>
            <ul class="bullet-list" style="margin-top: 3px; gap: 4px;">
              <li><span class="bullet-dot"></span> React 18, Vite, Tailwind (fast UI)</li>
              <li><span class="bullet-dot"></span> Three.js 3D map + Leaflet 2D map</li>
            </ul>
          </div>

          <!-- Module 2 -->
          <div class="clean-card" style="padding: 0.12in 0.16in;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
              <div style="font-size: 13.5px; font-weight: 800; color: var(--plum);">Multimodal Citizen Reporting</div>
              <div style="display: flex; gap: 4px;">
                <span class="tech-pill">Photo + GPS</span>
                <span class="tech-pill">Speech-to-Text</span>
              </div>
            </div>
            <ul class="bullet-list" style="margin-top: 3px; gap: 4px;">
              <li><span class="bullet-dot"></span> 1-Click photo + auto address (reverse-geocoding)</li>
              <li><span class="bullet-dot"></span> Speech-to-text voice reporting</li>
            </ul>
          </div>

          <!-- Module 3 -->
          <div class="clean-card" style="padding: 0.12in 0.16in;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
              <div style="font-size: 13.5px; font-weight: 800; color: var(--plum);">Backend Service &amp; Database</div>
              <div style="display: flex; gap: 4px;">
                <span class="tech-pill">Node.js</span>
                <span class="tech-pill">SQLite (WAL)</span>
              </div>
            </div>
            <ul class="bullet-list" style="margin-top: 3px; gap: 4px;">
              <li><span class="bullet-dot"></span> Node.js + Express.js REST API</li>
              <li><span class="bullet-dot"></span> SQLite (WAL) for fast, non-blocking access</li>
            </ul>
          </div>

          <!-- Module 4 -->
          <div class="clean-card" style="padding: 0.12in 0.16in;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
              <div style="font-size: 13.5px; font-weight: 800; color: var(--plum);">Field Worker Verification &amp; Rewards</div>
              <div style="display: flex; gap: 4px;">
                <span class="tech-pill">Proof (After)</span>
                <span class="tech-pill">Civic XP</span>
              </div>
            </div>
            <ul class="bullet-list" style="margin-top: 3px; gap: 4px;">
              <li><span class="bullet-dot"></span> Mobile page for GPS-assigned tasks</li>
              <li><span class="bullet-dot"></span> Upload 'AFTER' photo to close + Civic XP rewards</li>
            </ul>
          </div>

        </div>

      </div>

      <!-- Bottom Key Properties Ribbon (Exact user content) -->
      <div style="display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 0.18in; margin-top: 0.12in;">
        <div class="metric-chip">
          <div class="metric-icon-wrap" style="background: var(--plum-light); color: var(--plum);">{SVG_FLOW}</div>
          <div>
            <div class="metric-val" style="font-size: 15px;">Live Working Stack</div>
            <div class="metric-lbl">React 18 + Three.js + Node.js + SQLite WAL</div>
          </div>
        </div>
        <div class="metric-chip">
          <div class="metric-icon-wrap">{SVG_MIC}</div>
          <div>
            <div class="metric-val" style="font-size: 15px;">&lt; 850ms</div>
            <div class="metric-lbl">Emergency response</div>
          </div>
        </div>
        <div class="metric-chip">
          <div class="metric-icon-wrap" style="background: var(--blue-light); color: var(--blue);">{SVG_WIFI_OFF}</div>
          <div>
            <div class="metric-val" style="font-size: 15px;">100% Offline Fallback</div>
            <div class="metric-lbl">Works without external cloud</div>
          </div>
        </div>
      </div>

    </div>

    <div class="slide-footer">
      <div>Slide 06 / 08 • System Implementation</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 7: RESULTS & COMPARISON
       ========================================== -->
  <section class="slide" id="slide-7">
    <div class="slide-topbar">
      <div class="topbar-pills">
        <span class="top-pill grey">IIIT BHOPAL</span>
        <span class="top-pill plum">CSE MINOR PROJECT</span>
        <span class="top-pill grey">GROUP 104</span>
      </div>
      <span class="slide-counter">07 / 08</span>
    </div>

    <div class="slide-heading">
      <h2 class="slide-title">Results, Comparison &amp; <span class="gold">Performance Analysis</span></h2>
      <p class="slide-subtitle">How Community Hero performs compared to traditional city complaint portals and emergency systems.</p>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
      
      <div style="display: grid; grid-template-columns: 1fr 1.35fr; gap: 0.28in; align-items: stretch;">
        
        <!-- Left: Admin Console Screenshot -->
        <div style="display: flex; flex-direction: column; border-radius: 10px; overflow: hidden; border: 1.5px solid var(--border-subtle); position: relative; background: #000; height: 3.4in;">
          <img src="{b64_admin}" alt="Live Municipal Admin &amp; Dispatch Console" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; bottom: 8px; left: 12px; background: rgba(0,0,0,0.8); color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px;">
            Live Municipal Admin &amp; Dispatch Console
          </div>
        </div>

        <!-- Right: Comparison Table + Key Results (Exact user content) -->
        <div style="display: flex; flex-direction: column; justify-content: space-between;">
          <table class="styled-table">
            <thead>
              <tr>
                <th style="width: 25%;">Feature</th>
                <th style="width: 25%;">Traditional (CPGRAMS / 311)</th>
                <th style="width: 24%;">Emergency (112 / 911)</th>
                <th style="width: 26%; background: var(--amber-dark);">Community Hero (Our App)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Reporting Method</strong></td>
                <td>Long forms (5+ dropdowns)</td>
                <td>Phone call (human only)</td>
                <td><strong>1-Click Photo + GPS + Voice</strong></td>
              </tr>
              <tr>
                <td><strong>Reporting Time</strong></td>
                <td>8–15 min (70% give up)</td>
                <td>2–3 min (hold times)</td>
                <td><strong>&lt; 15 sec (&lt; 850ms voice)</strong></td>
              </tr>
              <tr>
                <td><strong>Duplicate Handling</strong></td>
                <td>No check (20 tickets/pothole)</td>
                <td>Human memory only</td>
                <td><strong>Auto 75 m merge (one ticket)</strong></td>
              </tr>
              <tr>
                <td><strong>Wasted Truck Trips</strong></td>
                <td>Up to 40% (duplicate trips)</td>
                <td>~20% (duplicate trips)</td>
                <td><strong style="color: var(--emerald);">&lt; 3% (&gt;40% savings)</strong></td>
              </tr>
              <tr>
                <td><strong>Real-Time Tracking</strong></td>
                <td>Table only (no live map)</td>
                <td>Operator screen only</td>
                <td><strong>3D Globe + 2D Map (live updates)</strong></td>
              </tr>
            </tbody>
          </table>

          <!-- 4 Key Results Badges (Exact user content) -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px;">
            <div style="background: #FFFFFF; border: 1.5px solid var(--border-subtle); padding: 8px 10px; border-radius: 8px; text-align: center;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 19px; font-weight: 800; color: var(--plum);">&lt; 850ms</div>
              <div style="font-size: 9.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Voice &rarr; Ticket</div>
            </div>
            <div style="background: #FFFFFF; border: 1.5px solid var(--border-subtle); padding: 8px 10px; border-radius: 8px; text-align: center;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 19px; font-weight: 800; color: var(--amber-dark);">42%</div>
              <div style="font-size: 9.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Fuel &amp; Crew Savings</div>
            </div>
            <div style="background: #FFFFFF; border: 1.5px solid var(--border-subtle); padding: 8px 10px; border-radius: 8px; text-align: center;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 19px; font-weight: 800; color: var(--emerald);">94.8%</div>
              <div style="font-size: 9.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Categorization Accuracy</div>
            </div>
            <div style="background: #FFFFFF; border: 1.5px solid var(--border-subtle); padding: 8px 10px; border-radius: 8px; text-align: center;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 19px; font-weight: 800; color: var(--blue);">100%</div>
              <div style="font-size: 9.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Offline Reliability</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Banner (Exact user wording) -->
      <div class="quote-banner">
        <div class="quote-label-box">
          <div class="metric-icon-wrap" style="width: 32px; height: 32px; background: rgba(255,255,255,0.15); color: #FFFFFF;">{SVG_CHART}</div>
          <div class="quote-label-title">Key Takeaway:</div>
        </div>
        <div class="quote-text">
          &ldquo;Community Hero reduces reporting time from <strong>15 minutes to 15 seconds</strong>, saves <strong>42% in wasted repair trips</strong>, and provides <strong>complete map transparency</strong>.&rdquo;
        </div>
      </div>

    </div>

    <div class="slide-footer">
      <div>Slide 07 / 08 • Results &amp; Comparison</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 8: CONCLUSION, FUTURE WORK & REFERENCES
       ========================================== -->
  <section class="slide" id="slide-8">
    <div class="slide-topbar">
      <div class="topbar-pills">
        <span class="top-pill grey">IIIT BHOPAL</span>
        <span class="top-pill plum">CSE MINOR PROJECT</span>
        <span class="top-pill grey">GROUP 104</span>
      </div>
      <span class="slide-counter">08 / 08</span>
    </div>

    <div class="slide-heading">
      <h2 class="slide-title">Conclusion, Future Scope &amp; <span class="gold">References</span></h2>
      <p class="slide-subtitle">Key results, next steps for smart cities, and academic references.</p>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
      
      <div style="display: grid; grid-template-columns: 1.15fr 1.15fr 1.1fr; gap: 0.22in; align-items: stretch;">
        
        <!-- Column 1: What We Achieved (Conclusion) (Exact user content) -->
        <div class="clean-card" style="border-top: 3.5px solid var(--emerald); justify-content: space-between;">
          <div>
            <div class="card-title" style="color: var(--emerald); font-size: 15px;">What We Achieved (Conclusion)</div>
            
            <div style="display: flex; flex-direction: column; gap: 9px; margin-top: 8px;">
              <div>
                <div style="font-size: 12.5px; font-weight: 800; color: var(--text-dark);">Fast &amp; Inclusive Reporting</div>
                <div style="font-size: 11.5px; color: var(--text-body);">1-click photo + bilingual voice.</div>
              </div>
              <div>
                <div style="font-size: 12.5px; font-weight: 800; color: var(--text-dark);">Smart Resource Savings</div>
                <div style="font-size: 11.5px; color: var(--text-body);">75 m dedup &rarr; 40% less dispatches.</div>
              </div>
              <div>
                <div style="font-size: 12.5px; font-weight: 800; color: var(--text-dark);">Guaranteed Accountability</div>
                <div style="font-size: 11.5px; color: var(--text-body);">Live 3D map + SLA + photo proof.</div>
              </div>
              <div>
                <div style="font-size: 12.5px; font-weight: 800; color: var(--text-dark);">High System Resilience</div>
                <div style="font-size: 11.5px; color: var(--text-body);">Sub-second speed + offline mode.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 2: Future Scope (Next Steps) (Exact user content) -->
        <div class="clean-card" style="border-top: 3.5px solid var(--amber); justify-content: space-between;">
          <div>
            <div class="card-title" style="color: var(--amber-dark); font-size: 15px;">Future Scope (Next Steps)</div>
            
            <div style="display: flex; flex-direction: column; gap: 9px; margin-top: 8px;">
              <div>
                <div style="font-size: 12.5px; font-weight: 800; color: var(--text-dark);">Smart Bus Dashcams</div>
                <div style="font-size: 11.5px; color: var(--text-body);">Auto-detect potholes &amp; garbage.</div>
              </div>
              <div>
                <div style="font-size: 12.5px; font-weight: 800; color: var(--text-dark);">City Command Integration</div>
                <div style="font-size: 11.5px; color: var(--text-body);">Connect with ICCC (Smart Cities).</div>
              </div>
              <div>
                <div style="font-size: 12.5px; font-weight: 800; color: var(--text-dark);">Offline Mesh Network</div>
                <div style="font-size: 11.5px; color: var(--text-body);">Report without internet (disasters).</div>
              </div>
              <div>
                <div style="font-size: 12.5px; font-weight: 800; color: var(--text-dark);">More Indian Languages</div>
                <div style="font-size: 11.5px; color: var(--text-body);">Add Marathi, Tamil, Telugu, Bengali.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 3: Key Academic References (Exact user content) -->
        <div class="clean-card" style="border-top: 3.5px solid var(--plum); justify-content: space-between;">
          <div>
            <div class="card-title" style="color: var(--plum); font-size: 15px;">Key Academic References</div>
            
            <div style="display: flex; flex-direction: column; gap: 9px; margin-top: 8px;">
              <div style="font-size: 11.5px; color: var(--text-dark); line-height: 1.35; border-left: 2.5px solid var(--plum); padding-left: 8px;">
                <strong>[1] Open311 Consortium &mdash;</strong> GeoReport v2, 2021.
              </div>
              <div style="font-size: 11.5px; color: var(--text-dark); line-height: 1.35; border-left: 2.5px solid var(--amber); padding-left: 8px;">
                <strong>[2] IEEE TBigData &mdash;</strong> Spatial clustering, 2022.
              </div>
              <div style="font-size: 11.5px; color: var(--text-dark); line-height: 1.35; border-left: 2.5px solid var(--emerald); padding-left: 8px;">
                <strong>[3] ACM SIGSPATIAL &mdash;</strong> Urban spatial data &amp; incident detection, 2021.
              </div>
              <div style="font-size: 11.5px; color: var(--text-dark); line-height: 1.35; border-left: 2.5px solid var(--blue); padding-left: 8px;">
                <strong>[4] WebAssembly &mdash;</strong> High-performance web apps, 2026.
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Core Vision Banner (Exact user wording) -->
      <div class="quote-banner" style="margin-top: 0.12in;">
        <div class="quote-label-box">
          <div class="metric-icon-wrap" style="width: 32px; height: 32px; background: rgba(255,255,255,0.15); color: #FFFFFF;">{SVG_TARGET}</div>
        </div>
        <div class="quote-text" style="font-size: 14px;">
          &ldquo;Community Hero makes cities <strong>cleaner, safer, and more responsive</strong>.&rdquo;
        </div>
      </div>

      <!-- Supervisor & Team Credit Bar (Exact user content) -->
      <div style="display: grid; grid-template-columns: 1.2fr 1.2fr 1fr; gap: 0.18in; background: #FFFFFF; border: 1.5px solid var(--border-subtle); border-radius: 10px; padding: 9px 16px; margin-top: 0.1in; align-items: center;">
        <div>
          <div style="font-size: 10px; font-weight: 800; color: var(--plum); text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">Project Team: Group 104</div>
          <div style="font-size: 11.8px; font-weight: 700; color: var(--text-dark);">Aarush Bharti (24U020010) &amp; Ashish Goutam (24U020011)</div>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: 800; color: var(--amber-dark); text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">Project Supervisor:</div>
          <div style="font-size: 11.8px; font-weight: 700; color: var(--text-dark);">Dr. Sreemoyee Biswas, Asst. Prof., CSE, IIIT Bhopal</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 15px; font-weight: 800; color: var(--plum); font-family: 'Playfair Display', serif;">Thank you!</div>
          <div style="font-size: 10.5px; color: var(--text-muted);">Thank you to our supervisors.</div>
        </div>
      </div>

    </div>

    <div class="slide-footer">
      <div>Slide 08 / 08 • Conclusion, Future Scope &amp; References</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </section>

</body>
</html>
"""

with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Clean HTML written to: {OUTPUT_HTML}")

# Compile to PDF using headless Chrome
print("Compiling pixel-perfect PDF via Google Chrome headless...")
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={OUTPUT_PDF}",
    OUTPUT_HTML
]

res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
if res.returncode == 0 and os.path.exists(OUTPUT_PDF):
    size_mb = os.path.getsize(OUTPUT_PDF) / (1024 * 1024)
    print(f"PDF successfully generated: {OUTPUT_PDF} ({size_mb:.2f} MB)")
    shutil.copyfile(OUTPUT_PDF, DESKTOP_PDF)
    print(f"Copied to Desktop for immediate presentation access: {DESKTOP_PDF}")
else:
    print(f"Error compiling PDF: {res.stderr.decode('utf-8')}")

print("Done!")
