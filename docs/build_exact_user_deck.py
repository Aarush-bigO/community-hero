#!/usr/bin/env python3
"""
Community Hero - Exact 8-Slide Presentation Builder (Light Theme / Human Design)
Reconstructs the user's 8-slide presentation with 100% fidelity:
- Clean light editorial theme (Warm Cream, Deep Burgundy, Amber Gold, Crisp White Cards)
- Zero AI-generated cartoon artifacts or distorted text
- Real embedded screenshots (Voice Cockpit, 3D Globe, Admin Console, IIIT Emblem)
- Output: 16:9 Widescreen PDF generated via Headless Google Chrome
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

print("Generating HTML matching user's exact 8 slides...")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Community Hero — 8-Slide Presentation (IIIT Bhopal)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
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
      --text-muted: #64748B;
      --text-dim: #94A3B8;
      --border-subtle: #E8E2DD;
      --emerald: #059669;
      --emerald-light: #ECFDF5;
      --red: #DC2626;
      --red-light: #FEF2F2;
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
      padding: 0.45in 0.7in 0.38in 0.7in;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      background: var(--bg-cream);
      background-image: 
        radial-gradient(circle at 90% 10%, rgba(217, 119, 6, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 10% 90%, rgba(66, 18, 38, 0.04) 0%, transparent 40%);
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
      .nav-dock {{
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: #FFFFFF;
        border: 1px solid #D5CDC5;
        border-radius: 9999px;
        padding: 8px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 9999;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }}
      .nav-btn {{
        background: var(--plum);
        color: #FFFFFF;
        border: none;
        padding: 8px 18px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
      }}
      .nav-pill {{
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        color: var(--text-muted);
        font-weight: 700;
      }}
    }}

    @media print {{
      body {{
        background: var(--bg-cream);
      }}
      .nav-dock {{
        display: none !important;
      }}
      .slide {{
        box-shadow: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
      }}
    }}

    /* Top Navigation Header */
    .slide-topbar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.16in;
      border-bottom: 1.5px solid #E8E2DD;
      padding-bottom: 0.12in;
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
      color: var(--text-dark);
      border-bottom: 2.5px solid var(--amber);
      padding-bottom: 2px;
    }}

    /* Title Block */
    .slide-heading {{
      margin-bottom: 0.22in;
    }}

    .slide-title {{
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      font-weight: 800;
      color: var(--plum);
      line-height: 1.15;
      margin-bottom: 4px;
    }}

    .slide-title span.gold {{
      color: var(--amber);
    }}

    .slide-subtitle {{
      font-size: 14.5px;
      font-style: italic;
      color: var(--text-muted);
      line-height: 1.35;
    }}

    /* Card Component */
    .clean-card {{
      background: var(--card-white);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 0.22in 0.24in;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
      display: flex;
      flex-direction: column;
      position: relative;
    }}

    .clean-card.active-plum {{
      background: var(--plum);
      color: #FFFFFF;
      border-color: var(--plum);
    }}

    .clean-card.active-plum .card-label {{
      color: #F8B4C8;
    }}
    .clean-card.active-plum .card-title {{
      color: #FFFFFF;
    }}
    .clean-card.active-plum .card-desc {{
      color: #E2D9E0;
    }}

    .card-label {{
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--amber-dark);
      margin-bottom: 4px;
      font-family: 'JetBrains Mono', monospace;
    }}

    .card-title {{
      font-size: 16px;
      font-weight: 800;
      color: var(--plum);
      margin-bottom: 8px;
    }}

    .card-desc {{
      font-size: 13px;
      color: var(--text-dark);
      line-height: 1.45;
    }}

    .bullet-list {{
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-top: 6px;
    }}

    .bullet-list li {{
      font-size: 12.5px;
      line-height: 1.4;
      color: #334155;
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

    /* Bottom Banner / Quote Box */
    .quote-banner {{
      background: var(--plum);
      color: #FFFFFF;
      border-radius: 12px;
      padding: 0.16in 0.28in;
      display: flex;
      align-items: center;
      gap: 0.25in;
      box-shadow: 0 4px 15px rgba(66, 18, 38, 0.15);
      margin-top: 0.15in;
    }}

    .quote-label-box {{
      display: flex;
      align-items: center;
      gap: 10px;
      padding-right: 0.2in;
      border-right: 1.5px solid rgba(255, 255, 255, 0.2);
      white-space: nowrap;
    }}

    .quote-label-title {{
      font-size: 15px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.4px;
    }}

    .quote-text {{
      font-size: 13.5px;
      line-height: 1.45;
      color: #FAF5F2;
      font-weight: 500;
    }}

    .quote-text strong {{
      color: var(--amber-light);
    }}

    /* Footer Bar */
    .slide-footer {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.12in;
      border-top: 1.5px solid #E8E2DD;
      font-size: 11.5px;
      color: var(--text-muted);
      font-weight: 600;
    }}

    /* Metric Chips */
    .metric-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.2in;
      margin-top: 0.18in;
    }}

    .metric-chip {{
      background: #FFFFFF;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 11px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
    }}

    .metric-val {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 22px;
      font-weight: 800;
      color: var(--text-dark);
      line-height: 1;
    }}

    .metric-lbl {{
      font-size: 10.5px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}

    /* Table Styles */
    .styled-table {{
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
      font-size: 12px;
    }}

    .styled-table th {{
      background: var(--plum);
      color: #FFFFFF;
      font-weight: 800;
      text-align: left;
      padding: 9px 14px;
      font-size: 11.5px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }}

    .styled-table td {{
      padding: 8px 14px;
      border-bottom: 1px solid #ECE7E2;
      color: #334155;
      background: #FFFFFF;
      vertical-align: middle;
    }}

    .styled-table tr:last-child td {{
      border-bottom: none;
    }}

    .styled-table tr.highlight-col td:last-child {{
      background: #FEF3C7;
      font-weight: 700;
      color: var(--amber-dark);
    }}

    /* Image Frame */
    .browser-frame {{
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      background: #000;
      position: relative;
    }}

    .browser-frame img {{
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }}
  </style>
</head>
<body>

  <!-- Screen Floating Dock -->
  <div class="nav-dock">
    <button class="nav-btn" onclick="window.print()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
      Print / Export PDF
    </button>
    <span class="nav-pill">Community Hero • 8 Slides</span>
    <button class="nav-btn" style="background: #E2D9D2; color: #1E293B;" onclick="window.scrollTo({{top: 0, behavior: 'smooth'}})">Top</button>
  </div>

  <!-- ==========================================
       SLIDE 1: INTRODUCTION
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.1in;">
        <div>
          <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px; background: var(--amber-light); border: 1px solid var(--amber); padding: 4px 14px; border-radius: 9999px;">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: var(--amber-dark);"></span>
            <span style="font-size: 11px; font-weight: 800; color: var(--amber-dark); letter-spacing: 0.6px; font-family: 'JetBrains Mono', monospace;">AUTONOMOUS CIVIC CAD SYSTEM</span>
          </div>
          <h1 class="slide-title" style="font-size: 48px; margin-bottom: 10px;">
            Community <span class="gold">Hero</span>
          </h1>
          <p class="slide-subtitle" style="font-size: 15.5px; max-width: 7.2in; font-style: normal; color: #475569;">
            Autonomous Hyperlocal Civic Intelligence & Emergency CAD Command Center with Zero-Typing Bilingual Voice Ingestion, 75m Spatial Clustering, and 3D Digital Twin Telemetry.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; background: #FFFFFF; border: 1px solid var(--border-subtle); padding: 18px 24px; border-radius: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <img src="{b64_iiit_logo}" alt="IIIT Bhopal Crest" style="width: 82px; height: 82px; object-fit: contain; margin-bottom: 8px;">
          <div style="font-size: 12.5px; font-weight: 800; color: var(--plum); text-align: center;">Indian Institute of Information Technology</div>
          <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-align: center;">Bhopal, Madhya Pradesh, India</div>
        </div>
      </div>

      <!-- 3 Presenter / Supervisor Cards -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1.15fr; gap: 0.28in; margin-top: 0.25in;">
        <div class="clean-card" style="padding: 0.26in 0.28in;">
          <div class="card-label">Lead Architect & Presenter</div>
          <div style="font-size: 22px; font-weight: 800; color: var(--plum); margin-bottom: 4px;">Aarush Bharti</div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: var(--amber-dark); font-weight: 700;">Scholar No: 24U020010</div>
        </div>

        <div class="clean-card active-plum" style="padding: 0.26in 0.28in;">
          <div class="card-label">Systems Engineer & Presenter</div>
          <div style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">Ashish Goutam</div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: var(--amber-light); font-weight: 700;">Scholar No: 24U020011</div>
        </div>

        <div class="clean-card" style="padding: 0.26in 0.28in; border-left: 3px solid var(--amber);">
          <div class="card-label">Project Supervisor</div>
          <div style="font-size: 22px; font-weight: 800; color: var(--plum); margin-bottom: 4px;">Dr. Sreemoyee Biswas</div>
          <div style="font-size: 13px; color: var(--text-dark); font-weight: 600;">Assistant Professor, Department of CSE</div>
        </div>
      </div>

      <!-- Bottom Metric Row -->
      <div class="metric-grid" style="margin-top: 0.25in;">
        <div class="metric-chip">
          <span style="font-size: 20px;">⚡</span>
          <div>
            <div class="metric-val">&lt; 850ms</div>
            <div class="metric-lbl">Voice-to-CAD Ingestion</div>
          </div>
        </div>
        <div class="metric-chip">
          <span style="font-size: 20px;">📍</span>
          <div>
            <div class="metric-val">75m / 6h</div>
            <div class="metric-lbl">Spatial Deduplication</div>
          </div>
        </div>
        <div class="metric-chip">
          <span style="font-size: 20px;">🚛</span>
          <div>
            <div class="metric-val">42%</div>
            <div class="metric-lbl">Fleet Waste Reduction</div>
          </div>
        </div>
        <div class="metric-chip">
          <span style="font-size: 20px;">🛡️</span>
          <div>
            <div class="metric-val">100%</div>
            <div class="metric-lbl">Zero-Cloud Offline Fallback</div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>IIIT Bhopal • Dept. of Computer Science & Engineering • B.Tech Minor Project Defense</div>
      <div>Group 104 • Aarush Bharti & Ashish Goutam</div>
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
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.22in;">
        <div class="clean-card">
          <div class="card-label" style="color: var(--red);">Paradigm 01</div>
          <div class="card-title">Government Apps & Portals</div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">e.g., CPGRAMS, Delhi 311</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot" style="background: var(--red);"></span> Citizens must fill long forms and click through multiple drop-down menus.</li>
            <li><span class="bullet-dot" style="background: var(--red);"></span> Takes 10 to 15 minutes to report a single issue.</li>
            <li><span class="bullet-dot" style="background: var(--red);"></span> Available mostly in English, making it hard for panicked or Hindi speakers.</li>
            <li><span class="bullet-dot" style="background: var(--red);"></span> Most citizens abandon the complaint before finishing.</li>
          </ul>
        </div>

        <div class="clean-card">
          <div class="card-label">Paradigm 02</div>
          <div class="card-title">Standard Web Portals</div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">e.g., Open311 Standard</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot"></span> Good digital system for organizing city complaints into a database.</li>
            <li><span class="bullet-dot"></span> No voice option — users still have to type everything by hand.</li>
            <li><span class="bullet-dot"></span> If 20 people report the same pothole, it creates 20 separate complaints.</li>
            <li><span class="bullet-dot"></span> Wastes municipal staff time manually finding duplicate reports.</li>
          </ul>
        </div>

        <div class="clean-card">
          <div class="card-label" style="color: var(--plum);">Paradigm 03</div>
          <div class="card-title">Emergency Call Centers</div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">e.g., 112 India, 911 US</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot" style="background: var(--plum);"></span> Fast because citizens talk directly to a human operator.</li>
            <li><span class="bullet-dot" style="background: var(--plum);"></span> Phone lines quickly get overloaded during storms, fires, or big accidents.</li>
            <li><span class="bullet-dot" style="background: var(--plum);"></span> Very expensive for governments to hire and maintain 24/7 call staff.</li>
            <li><span class="bullet-dot" style="background: var(--plum);"></span> Panicked callers are often kept on hold for 10+ minutes.</li>
          </ul>
        </div>

        <div class="clean-card">
          <div class="card-label">Paradigm 04</div>
          <div class="card-title">Standard AI Voice Bots</div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">e.g., Generic Voice Chatbots</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot"></span> Can understand spoken sentences and talk back.</li>
            <li><span class="bullet-dot"></span> Frequently make mistakes or guess incorrectly about danger levels.</li>
            <li><span class="bullet-dot"></span> Too slow for emergencies (takes 3 to 5 seconds to respond).</li>
            <li><span class="bullet-dot"></span> Cannot safely verify exact street locations on a live map.</li>
          </ul>
        </div>
      </div>

      <!-- Bottom Takeaway Banner -->
      <div class="quote-banner">
        <div class="quote-label-box">
          <span style="font-size: 22px;">🎯</span>
          <div class="quote-label-title">What Is Missing Today:</div>
        </div>
        <div class="quote-text">
          &ldquo;There is no system where a citizen can simply speak naturally in <strong>Hindi or English</strong>, have the AI record the emergency in <strong>under 1 second</strong>, and automatically <strong>stop duplicate repair trucks</strong> from being sent to the exact same spot.&rdquo;
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>Slide 02 / 08 • Literature Review & Background</div>
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
      <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 0.35in;">
        <!-- Left: 3 Problem Cards -->
        <div style="display: flex; flex-direction: column; gap: 0.16in;">
          <div class="clean-card" style="padding: 0.18in 0.22in; border-left: 4px solid var(--red);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="card-title" style="margin: 0; font-size: 15px;">01. High Reporting Friction (Citizen)</span>
              <span style="font-size: 11px; font-weight: 800; color: var(--red); background: var(--red-light); padding: 3px 8px; border-radius: 4px;">&gt;70% UNREPORTED</span>
            </div>
            <ul class="bullet-list" style="margin-top: 6px;">
              <li><span class="bullet-dot" style="background: var(--red);"></span> Issues seen daily on the street but rarely reported due to hassle.</li>
              <li><span class="bullet-dot" style="background: var(--red);"></span> Long web forms & manual ward selection cause massive drop-offs.</li>
              <li><span class="bullet-dot" style="background: var(--red);"></span> No quick 1-click photo upload with automatic GPS reverse-geocoding.</li>
            </ul>
          </div>

          <div class="clean-card" style="padding: 0.18in 0.22in; border-left: 4px solid var(--amber);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="card-title" style="margin: 0; font-size: 15px;">02. Duplicate Complaints & Wasted Resources (Municipal)</span>
              <span style="font-size: 11px; font-weight: 800; color: var(--amber-dark); background: var(--amber-light); padding: 3px 8px; border-radius: 4px;">40% FUEL WASTED</span>
            </div>
            <ul class="bullet-list" style="margin-top: 6px;">
              <li><span class="bullet-dot"></span> 20 to 30 citizens independently report the same broken road or leak.</li>
              <li><span class="bullet-dot"></span> System creates 30 separate tickets for one physical spot.</li>
              <li><span class="bullet-dot"></span> Multiple inspection teams or trucks dispatched to the exact same site.</li>
            </ul>
          </div>

          <div class="clean-card" style="padding: 0.18in 0.22in; border-left: 4px solid var(--plum);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="card-title" style="margin: 0; font-size: 15px;">03. The "Black Hole" & Fake Resolutions (Accountability)</span>
              <span style="font-size: 11px; font-weight: 800; color: var(--plum); background: var(--plum-light); padding: 3px 8px; border-radius: 4px;">CITIZENS LOSE TRUST</span>
            </div>
            <ul class="bullet-list" style="margin-top: 6px;">
              <li><span class="bullet-dot" style="background: var(--plum);"></span> No live updates or map tracking once a complaint is filed.</li>
              <li><span class="bullet-dot" style="background: var(--plum);"></span> Contractors often mark tickets "Fixed" without providing photo proof.</li>
              <li><span class="bullet-dot" style="background: var(--plum);"></span> 14.2 days average resolution time leads citizens to give up on reporting.</li>
            </ul>
          </div>
        </div>

        <!-- Right: Flowchart Frame -->
        <div class="clean-card" style="padding: 0.2in; justify-content: space-between; background: #FFFFFF;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; border-bottom: 1.5px solid #F1ECE6; padding-bottom: 6px;">
            <span style="font-size: 14px;">📉</span>
            <div style="font-size: 13.5px; font-weight: 800; color: var(--plum);">How Current Reporting Breaks Down</div>
          </div>

          <!-- Flowchart Graphic in Clean HTML/CSS -->
          <div style="display: flex; flex-direction: column; gap: 10px; align-items: center; width: 100%;">
            <div style="background: var(--plum); color: #FFFFFF; padding: 7px 16px; border-radius: 8px; font-size: 11.5px; font-weight: 700; text-align: center; width: 90%;">
              ⚠️ Civic Problem Happens (Pothole, Garbage, Water Leak)
            </div>
            <div style="color: var(--text-muted); font-size: 12px;">↓</div>
            <div style="background: #EDE8E3; color: #1E293B; padding: 6px 14px; border-radius: 6px; font-size: 11.5px; font-weight: 700;">
              Citizen Tries to Report
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%;">
              <div style="background: #F8F6F4; border: 1px solid #E2D9D2; padding: 8px; border-radius: 8px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #475569;">Type details & fill forms</div>
                <div style="color: var(--red); font-size: 12px; font-weight: 800; margin-top: 4px;">❌ &gt;70% Give Up (Unreported)</div>
              </div>
              <div style="background: #F8F6F4; border: 1px solid #E2D9D2; padding: 8px; border-radius: 8px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #475569;">Multiple citizens report same spot</div>
                <div style="color: var(--red); font-size: 12px; font-weight: 800; margin-top: 4px;">❌ Multiple Trucks Sent (Wasted Fuel)</div>
              </div>
            </div>
            <div style="color: var(--text-muted); font-size: 12px;">↓</div>
            <div style="background: var(--red-light); border: 1.5px solid #FCA5A5; color: var(--red); padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 800; text-align: center; width: 95%;">
              💥 Result: Delay, Wasted City Resources & Loss of Public Trust
            </div>
          </div>

          <div style="margin-top: 10px; font-size: 11px; color: var(--text-muted); text-align: center; font-style: italic;">
            Demonstrates failure of traditional 311/CPGRAMS grievance systems
          </div>
        </div>
      </div>

      <!-- Bottom Takeaway Banner -->
      <div class="quote-banner">
        <div class="quote-label-box">
          <span style="font-size: 22px;">📌</span>
          <div class="quote-label-title">The Big Problem:</div>
        </div>
        <div class="quote-text">
          &ldquo;Reporting takes <strong>too much effort</strong>, city trucks get <strong>wasted on duplicate reports</strong>, and citizens never know if their complaint <strong>actually got fixed</strong>.&rdquo;
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
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.2in;">
        <!-- Step 1 -->
        <div class="clean-card">
          <div class="card-label">Step 01</div>
          <div class="card-title">Multi-Channel Easy Reporting</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot"></span> <strong>1-Click Photo:</strong> Snaps a picture of the broken road or garbage pile.</li>
            <li><span class="bullet-dot"></span> <strong>Auto GPS:</strong> Automatically tags exact map coordinates with zero address typing.</li>
            <li><span class="bullet-dot"></span> <strong>Voice / Call:</strong> Citizens who cannot type can speak in Hindi or English.</li>
          </ul>
        </div>

        <!-- Step 2 -->
        <div class="clean-card">
          <div class="card-label">Step 02</div>
          <div class="card-title">AI Categorization &amp; Urgency</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot"></span> <strong>Auto Departments:</strong> Classifies issue to Roads, Waste, Water, or Electricity.</li>
            <li><span class="bullet-dot"></span> <strong>Severity Score (1–10):</strong> Live wires or cave-ins get instant priority.</li>
            <li><span class="bullet-dot"></span> <strong>Zero Cloud Cost:</strong> Runs on fast local NLP models.</li>
          </ul>
        </div>

        <!-- Step 3 -->
        <div class="clean-card">
          <div class="card-label">Step 03</div>
          <div class="card-title">75m Spatial Deduplication</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot"></span> <strong>75m Radius Check:</strong> Checks if an active issue exists within 75 meters.</li>
            <li><span class="bullet-dot"></span> <strong>Merge &amp; Upvote:</strong> Clusters duplicate calls under one parent ticket.</li>
            <li><span class="bullet-dot"></span> <strong>Saves Truck Trips:</strong> Dispatches 1 repair crew instead of 3.</li>
          </ul>
        </div>

        <!-- Step 4 -->
        <div class="clean-card">
          <div class="card-label">Step 04</div>
          <div class="card-title">Live Map &amp; Proof-of-Work</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot"></span> <strong>3D Digital Twin:</strong> Live interactive map with SLA timers.</li>
            <li><span class="bullet-dot"></span> <strong>Photo Proof:</strong> Crews must upload an 'AFTER' repair photo.</li>
            <li><span class="bullet-dot"></span> <strong>Citizen Rewards:</strong> Awards Civic XP points and hero badges.</li>
          </ul>
        </div>
      </div>

      <!-- Process Flow Ribbon -->
      <div style="background: #FFFFFF; border: 1.5px solid var(--border-subtle); border-radius: 12px; padding: 0.16in 0.24in; display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items: center; gap: 12px; margin-top: 0.15in;">
        <div style="text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: var(--plum);">STEP 1: REPORT</div>
          <div style="font-size: 12px; color: var(--text-muted);">Photo + GPS + Voice</div>
        </div>
        <div style="color: var(--amber); font-weight: bold;">→</div>
        <div style="text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: var(--plum);">STEP 2: CLASSIFY</div>
          <div style="font-size: 12px; color: var(--text-muted);">Department + Urgency (1–10)</div>
        </div>
        <div style="color: var(--amber); font-weight: bold;">→</div>
        <div style="text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: var(--plum);">STEP 3: DEDUP (75m)</div>
          <div style="font-size: 12px; color: var(--text-muted);">Merge Duplicates &amp; Upvote</div>
        </div>
        <div style="color: var(--amber); font-weight: bold;">→</div>
        <div style="text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: var(--plum);">STEP 4: RESOLVE</div>
          <div style="font-size: 12px; color: var(--text-muted);">Live Map + Photo Proof + XP</div>
        </div>
      </div>

      <!-- Bottom Banner -->
      <div class="quote-banner">
        <div class="quote-label-box">
          <span style="font-size: 22px;">💡</span>
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
      <div style="display: grid; grid-template-columns: 1fr 1.6fr 1fr; gap: 0.25in;">
        <!-- Left: Workflow Steps -->
        <div class="clean-card" style="padding: 0.18in;">
          <div class="card-title" style="font-size: 15px; margin-bottom: 10px; border-bottom: 1.5px solid #F1ECE6; padding-bottom: 6px;">
            Workflow Steps
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; gap: 8px;">
              <span style="font-size: 11px; font-weight: 800; color: var(--plum); background: var(--plum-light); padding: 2px 6px; border-radius: 4px; height: fit-content;">01</span>
              <div style="font-size: 12px; line-height: 1.35;"><strong>Citizen Report:</strong> Photo (auto-GPS) or voice call.</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <span style="font-size: 11px; font-weight: 800; color: var(--plum); background: var(--plum-light); padding: 2px 6px; border-radius: 4px; height: fit-content;">02</span>
              <div style="font-size: 12px; line-height: 1.35;"><strong>AI Categorization:</strong> Identify issue + urgency rating.</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <span style="font-size: 11px; font-weight: 800; color: var(--plum); background: var(--plum-light); padding: 2px 6px; border-radius: 4px; height: fit-content;">03</span>
              <div style="font-size: 12px; line-height: 1.35;"><strong>75m Decision:</strong> Within 75m → Merge; Else → New ticket.</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <span style="font-size: 11px; font-weight: 800; color: var(--plum); background: var(--plum-light); padding: 2px 6px; border-radius: 4px; height: fit-content;">04</span>
              <div style="font-size: 12px; line-height: 1.35;"><strong>Operations Room:</strong> See on live map &amp; dispatch team.</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <span style="font-size: 11px; font-weight: 800; color: var(--plum); background: var(--plum-light); padding: 2px 6px; border-radius: 4px; height: fit-content;">05</span>
              <div style="font-size: 12px; line-height: 1.35;"><strong>Field Repair &amp; Proof:</strong> Fix issue &amp; upload 'AFTER' photo.</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <span style="font-size: 11px; font-weight: 800; color: var(--plum); background: var(--plum-light); padding: 2px 6px; border-radius: 4px; height: fit-content;">06</span>
              <div style="font-size: 12px; line-height: 1.35;"><strong>Closed-Loop Reward:</strong> Pin turns green, notify &amp; award XP.</div>
            </div>
          </div>
        </div>

        <!-- Center: Flowchart Decision Box -->
        <div class="clean-card" style="padding: 0.18in; justify-content: center; background: #FFFFFF;">
          <div style="font-size: 13px; font-weight: 800; color: var(--plum); margin-bottom: 8px; text-align: center;">
            Figure 5.1: Community Hero Operational Decision Logic
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; align-items: center; width: 100%;">
            <div style="background: var(--plum); color: #FFFFFF; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; text-align: center; width: 85%;">
              Step 1: Citizen Ingestion (Photo + Auto GPS or Voice)
            </div>
            <div style="font-size: 11px; color: var(--text-muted);">↓</div>
            <div style="background: #EDE8E3; color: #1E293B; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; text-align: center; width: 85%;">
              Step 2: AI Categorization (Department + Urgency Score)
            </div>
            <div style="font-size: 11px; color: var(--text-muted);">↓</div>
            <div style="background: var(--amber-light); border: 1.5px solid var(--amber); color: var(--amber-dark); padding: 7px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; text-align: center; width: 90%;">
              Decision: Is there an existing ticket within 75 meters?
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; margin-top: 4px;">
              <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 6px; border-radius: 6px; text-align: center;">
                <div style="font-size: 10.5px; font-weight: 800; color: var(--emerald);">YES (Within 75m)</div>
                <div style="font-size: 10px; color: #065F46; margin-top: 2px;">Merge with Master Ticket<br><strong>Stops duplicate trucks</strong></div>
              </div>
              <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 6px; border-radius: 6px; text-align: center;">
                <div style="font-size: 10.5px; font-weight: 800; color: #2563EB;">NO (New Area)</div>
                <div style="font-size: 10px; color: #1E40AF; margin-top: 2px;">Create New Ticket<br><strong>Starts SLA Timer</strong></div>
              </div>
            </div>
            <div style="font-size: 11px; color: var(--text-muted);">↓</div>
            <div style="background: var(--plum); color: #FFFFFF; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; text-align: center; width: 85%;">
              Step 3: Municipal Operations Room (Live Map Dispatch)
            </div>
            <div style="font-size: 11px; color: var(--text-muted);">↓</div>
            <div style="background: #ECFDF5; border: 1px solid var(--emerald); color: var(--emerald); padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 800; text-align: center; width: 85%;">
              Step 4 &amp; 5: Field Repair ('AFTER' Photo) &amp; Map Pin Turns GREEN
            </div>
          </div>
        </div>

        <!-- Right: Key Properties -->
        <div class="clean-card" style="padding: 0.18in;">
          <div class="card-title" style="font-size: 15px; margin-bottom: 10px; border-bottom: 1.5px solid #F1ECE6; padding-bottom: 6px;">
            Key Properties
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div>
              <div style="font-size: 12.5px; font-weight: 800; color: var(--plum);">75-Meter Radius</div>
              <div style="font-size: 11.5px; color: var(--text-muted);">Merges nearby reports (within walking distance).</div>
            </div>
            <div>
              <div style="font-size: 12.5px; font-weight: 800; color: var(--amber-dark);">Under 4ms Speed</div>
              <div style="font-size: 11.5px; color: var(--text-muted);">Checks for duplicates almost instantly in-memory.</div>
            </div>
            <div>
              <div style="font-size: 12.5px; font-weight: 800; color: var(--plum);">6-Hour Time Window</div>
              <div style="font-size: 11.5px; color: var(--text-muted);">Connects repeated calls for the same event during the day.</div>
            </div>
            <div>
              <div style="font-size: 12.5px; font-weight: 800; color: var(--emerald);">Guaranteed Proof</div>
              <div style="font-size: 11.5px; color: var(--text-muted);">No ticket can be closed without an 'AFTER' repair photo.</div>
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
      <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 0.35in;">
        <!-- Left: Two Real Screenshots -->
        <div style="display: flex; flex-direction: column; gap: 0.16in;">
          <div class="browser-frame" style="height: 1.95in;">
            <img src="{b64_voice_cockpit}" alt="Live CAD Voice Cockpit">
            <div style="position: absolute; bottom: 6px; left: 10px; background: rgba(0,0,0,0.75); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">
              Live CAD Voice Cockpit &amp; Emergency Work Orders
            </div>
          </div>
          <div class="browser-frame" style="height: 1.95in;">
            <img src="{b64_globe}" alt="3D Digital Twin City Command Center">
            <div style="position: absolute; bottom: 6px; left: 10px; background: rgba(0,0,0,0.75); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">
              3D Digital Twin City Command Center (Three.js WebGL)
            </div>
          </div>
        </div>

        <!-- Right: Technical Stack Modules -->
        <div style="display: flex; flex-direction: column; gap: 0.14in;">
          <div class="clean-card" style="padding: 0.14in 0.18in;">
            <div style="font-size: 13px; font-weight: 800; color: var(--plum); margin-bottom: 2px;">
              Frontend &amp; 3D Map Interface
            </div>
            <div style="font-size: 11.5px; color: var(--text-dark); line-height: 1.35;">
              • React 18, Vite, and Tailwind CSS for instant UI rendering.<br>
              • Three.js WebGL renders 3D pulsing pins on globe + Leaflet 2D street map.
            </div>
          </div>

          <div class="clean-card" style="padding: 0.14in 0.18in;">
            <div style="font-size: 13px; font-weight: 800; color: var(--plum); margin-bottom: 2px;">
              Multimodal Citizen Reporting
            </div>
            <div style="font-size: 11.5px; color: var(--text-dark); line-height: 1.35;">
              • 1-Click photo upload with automatic GPS reverse-geocoding to address.<br>
              • Speech-to-text voice reporting for citizens who cannot type in emergencies.
            </div>
          </div>

          <div class="clean-card" style="padding: 0.14in 0.18in;">
            <div style="font-size: 13px; font-weight: 800; color: var(--plum); margin-bottom: 2px;">
              Backend Service &amp; Database
            </div>
            <div style="font-size: 11.5px; color: var(--text-dark); line-height: 1.35;">
              • Node.js &amp; Express.js REST API.<br>
              • SQLite (WAL mode) enables high-concurrency non-blocking reads and writes.
            </div>
          </div>

          <div class="clean-card" style="padding: 0.14in 0.18in;">
            <div style="font-size: 13px; font-weight: 800; color: var(--plum); margin-bottom: 2px;">
              Field Worker Verification &amp; Rewards
            </div>
            <div style="font-size: 11.5px; color: var(--text-dark); line-height: 1.35;">
              • Mobile page for GPS-assigned tasks with 'AFTER' repair photo upload.<br>
              • Citizens earn Civic XP points and neighborhood badges for verified reports.
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Properties Ribbon -->
      <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 0.2in; margin-top: 0.15in;">
        <div class="metric-chip">
          <span style="font-size: 20px;">💻</span>
          <div>
            <div class="metric-val" style="font-size: 16px;">Live Working Stack</div>
            <div class="metric-lbl">React 18 + Three.js + Node.js + SQLite WAL</div>
          </div>
        </div>
        <div class="metric-chip">
          <span style="font-size: 20px;">⚡</span>
          <div>
            <div class="metric-val" style="font-size: 16px;">&lt; 850ms Response</div>
            <div class="metric-lbl">Emergency Turnaround Time</div>
          </div>
        </div>
        <div class="metric-chip">
          <span style="font-size: 20px;">🛡️</span>
          <div>
            <div class="metric-val" style="font-size: 16px;">100% Offline Mode</div>
            <div class="metric-lbl">Local Fallback Resilience</div>
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
      <div style="display: grid; grid-template-columns: 1fr 1.4fr; gap: 0.35in;">
        <!-- Left: Admin Console Real Screenshot -->
        <div class="browser-frame" style="height: 3.5in;">
          <img src="{b64_admin}" alt="Live Municipal Admin Console">
          <div style="position: absolute; bottom: 8px; left: 12px; background: rgba(0,0,0,0.75); color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px;">
            Live Municipal Admin &amp; Dispatch Console
          </div>
        </div>

        <!-- Right: Comparison Table -->
        <div style="display: flex; flex-direction: column; justify-content: space-between;">
          <table class="styled-table">
            <thead>
              <tr>
                <th style="width: 26%;">Feature</th>
                <th style="width: 25%;">Traditional (CPGRAMS / 311)</th>
                <th style="width: 24%;">Emergency (112 / 911)</th>
                <th style="width: 25%; background: var(--amber-dark);">Community Hero</th>
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
                <td>No check (20 tickets/spot)</td>
                <td>Human memory only</td>
                <td><strong>Auto 75m merge (1 ticket)</strong></td>
              </tr>
              <tr>
                <td><strong>Wasted Truck Trips</strong></td>
                <td>Up to 40% duplicate trips</td>
                <td>~20% duplicate trips</td>
                <td><strong>&lt; 3% (&gt;40% fuel savings)</strong></td>
              </tr>
              <tr>
                <td><strong>Real-Time Tracking</strong></td>
                <td>Table only (no live map)</td>
                <td>Operator screen only</td>
                <td><strong>3D Globe + 2D Live Map</strong></td>
              </tr>
            </tbody>
          </table>

          <!-- 4 Metric Badges -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 12px;">
            <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); padding: 8px 10px; border-radius: 8px; text-align: center;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: var(--plum);">&lt; 850ms</div>
              <div style="font-size: 9.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Voice → Ticket</div>
            </div>
            <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); padding: 8px 10px; border-radius: 8px; text-align: center;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: var(--amber-dark);">42%</div>
              <div style="font-size: 9.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Fuel &amp; Crew Saved</div>
            </div>
            <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); padding: 8px 10px; border-radius: 8px; text-align: center;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: var(--emerald);">94.8%</div>
              <div style="font-size: 9.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Auto-Tag Accuracy</div>
            </div>
            <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); padding: 8px 10px; border-radius: 8px; text-align: center;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: #2563EB;">100%</div>
              <div style="font-size: 9.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Offline Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Banner -->
      <div class="quote-banner">
        <div class="quote-label-box">
          <span style="font-size: 22px;">📊</span>
          <div class="quote-label-title">Key Takeaway:</div>
        </div>
        <div class="quote-text">
          &ldquo;Community Hero reduces reporting time from <strong>15 minutes to 15 seconds</strong>, saves <strong>42% in wasted repair trips</strong>, and provides complete map transparency.&rdquo;
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
      <div style="display: grid; grid-template-columns: 1.15fr 1.15fr 1.1fr; gap: 0.25in;">
        <!-- Column 1: Conclusion -->
        <div class="clean-card" style="border-top: 3.5px solid var(--emerald);">
          <div class="card-label" style="color: var(--emerald);">What We Achieved</div>
          <div class="card-title">Project Conclusion</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot" style="background: var(--emerald);"></span> <strong>Fast &amp; Inclusive Reporting:</strong> 1-click photo upload and bilingual voice remove all typing barriers.</li>
            <li><span class="bullet-dot" style="background: var(--emerald);"></span> <strong>Smart Resource Savings:</strong> 75m spatial dedup cuts duplicate dispatches by 42%, saving city budgets.</li>
            <li><span class="bullet-dot" style="background: var(--emerald);"></span> <strong>Guaranteed Accountability:</strong> Live 3D map + SLA timers + photo proof of work prevent fake closures.</li>
            <li><span class="bullet-dot" style="background: var(--emerald);"></span> <strong>High System Resilience:</strong> Sub-second response speed with 100% offline local fallback.</li>
          </ul>
        </div>

        <!-- Column 2: Future Scope -->
        <div class="clean-card" style="border-top: 3.5px solid var(--amber);">
          <div class="card-label">Next Steps</div>
          <div class="card-title">Future Scope (Smart Cities)</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot"></span> <strong>Smart Bus Dashcams:</strong> Computer vision (YOLOv8) on city buses to automatically detect potholes &amp; garbage.</li>
            <li><span class="bullet-dot"></span> <strong>ICCC Integration:</strong> Connect directly with Govt Integrated Command &amp; Control Centres.</li>
            <li><span class="bullet-dot"></span> <strong>Offline Mesh Network:</strong> Bluetooth mesh reporting during disaster cellular blackouts.</li>
            <li><span class="bullet-dot"></span> <strong>More Indian Languages:</strong> Add voice support for Marathi, Tamil, Telugu, and Bengali.</li>
          </ul>
        </div>

        <!-- Column 3: Academic References -->
        <div class="clean-card" style="border-top: 3.5px solid var(--plum);">
          <div class="card-label" style="color: var(--plum);">Citations</div>
          <div class="card-title">Academic References</div>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
            <div style="font-size: 11.5px; color: var(--text-dark); line-height: 1.35; border-left: 2px solid var(--plum); padding-left: 8px;">
              <strong>[1] Open311 Consortium:</strong> "Open311 GeoReport v2 Standard for Municipal Systems," 2021.
            </div>
            <div style="font-size: 11.5px; color: var(--text-dark); line-height: 1.35; border-left: 2px solid var(--amber); padding-left: 8px;">
              <strong>[2] IEEE TBigData:</strong> "Spatial Event Clustering for Smart Cities," vol. 8, 2022.
            </div>
            <div style="font-size: 11.5px; color: var(--text-dark); line-height: 1.35; border-left: 2px solid var(--emerald); padding-left: 8px;">
              <strong>[3] MoHUA (Govt. of India):</strong> "ICCC Operational Guidelines for Smart Cities Mission," 2023.
            </div>
            <div style="font-size: 11.5px; color: var(--text-dark); line-height: 1.35; border-left: 2px solid #2563EB; padding-left: 8px;">
              <strong>[4] WebAssembly &amp; WebGL:</strong> "High-Performance Geospatial Telemetry," 2026.
            </div>
          </div>
        </div>
      </div>

      <!-- Banner -->
      <div class="quote-banner" style="margin-top: 0.15in;">
        <div class="quote-label-box">
          <span style="font-size: 22px;">🏙️</span>
          <div class="quote-label-title">Core Vision:</div>
        </div>
        <div class="quote-text" style="font-size: 14.5px;">
          &ldquo;Community Hero makes cities <strong>cleaner, safer, and more responsive</strong> through civic participation and smart spatial technology.&rdquo;
        </div>
      </div>

      <!-- Supervisor & Team Credit Bar -->
      <div style="display: grid; grid-template-columns: 1.2fr 1.2fr 1fr; gap: 0.2in; background: #FFFFFF; border: 1.5px solid var(--border-subtle); border-radius: 10px; padding: 10px 18px; margin-top: 0.12in; align-items: center;">
        <div>
          <div style="font-size: 10.5px; font-weight: 800; color: var(--plum); text-transform: uppercase;">Project Team (Group 104)</div>
          <div style="font-size: 12px; font-weight: 700; color: var(--text-dark);">Aarush Bharti (24U020010) &amp; Ashish Goutam (24U020011)</div>
        </div>
        <div>
          <div style="font-size: 10.5px; font-weight: 800; color: var(--amber-dark); text-transform: uppercase;">Project Supervisor</div>
          <div style="font-size: 12px; font-weight: 700; color: var(--text-dark);">Dr. Sreemoyee Biswas, Assistant Professor, CSE, IIIT Bhopal</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 16px; font-weight: 800; color: var(--plum); font-family: 'Playfair Display', serif;">Thank You!</div>
          <div style="font-size: 11px; color: var(--text-muted);">Ready for Questions &amp; Live Demo</div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>Slide 08 / 08 • Conclusion, Future Scope &amp; References</div>
      <div>IIIT Bhopal • Group 104 • 2026</div>
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
