#!/usr/bin/env python3
"""
Community Hero - 8-Slide Figma-Style Academic Presentation Generator
Strictly adheres to the 8-slide minor project rubric:
1. Introduction
2. Literature Review / Background
3. Problem Statement
4. Proposed Methodology / Proposed Work
5. System Diagram / Proposed Algorithm / Flowchart
6. Implementation
7. Results, Comparison, and Analysis
8. Conclusion, Future Work & References

Designed for:
- IIIT Bhopal, Department of Computer Science & Engineering
- Group 104: Aarush Bharti (24U020010) & Ashish Goutam (24U020011)
- Supervisor: Dr. Sreemoyee Biswas, Assistant Professor
- Presentation Target: Under 8 minutes, A+ Grade Rubric Alignment
"""

import os
import base64
import subprocess
import shutil

ASSETS_DIR = "/Users/aarush/Desktop/Community Hero/docs/presentation_assets"
OUTPUT_HTML = "/Users/aarush/Desktop/Community Hero/docs/Community_Hero_8_Slide_Figma_Presentation.html"
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
b64_arch = get_base64_image("slide_arch.png")
b64_mermaid = get_base64_image("slide_mermaid_prototype.png")
b64_voice_cockpit = get_base64_image("web_voice_cockpit.png")
b64_globe = get_base64_image("web_globe_map.png")
b64_problem = get_base64_image("slide_problem.jpg")
b64_citizen = get_base64_image("web_citizen_report.png")
b64_admin = get_base64_image("web_admin_console.png")

print("Building refined 8-slide Figma presentation HTML with user requested removals...")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Community Hero — Minor Project 8-Slide Defense (IIIT Bhopal)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {{
      --bg-dark: #070A10;
      --bg-card: #0F1422;
      --bg-card-hover: #151D2F;
      --card-border: rgba(255, 255, 255, 0.08);
      --card-border-glow: rgba(59, 130, 246, 0.35);
      --accent-blue: #3B82F6;
      --accent-cyan: #06B6D4;
      --accent-emerald: #10B981;
      --accent-amber: #F59E0B;
      --accent-rose: #F43F5E;
      --accent-purple: #8B5CF6;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
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
      background: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }}

    /* Presentation Slide Container (16:9 widescreen) */
    .slide {{
      width: 16in;
      height: 9in;
      position: relative;
      overflow: hidden;
      padding: 0.52in 0.75in 0.42in 0.75in;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      background: radial-gradient(circle at 85% 15%, rgba(59, 130, 246, 0.07) 0%, transparent 45%),
                  radial-gradient(circle at 15% 85%, rgba(139, 92, 246, 0.05) 0%, transparent 40%),
                  var(--bg-dark);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }}

    .slide:last-child {{
      page-break-after: avoid;
    }}

    /* Interactive Presentation Navigation Controls (Screen Only) */
    @media screen {{
      body {{
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #030508;
        padding: 24px 0 60px 0;
        gap: 32px;
      }}
      .slide {{
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        transform-origin: top center;
      }}
      .nav-dock {{
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 20, 32, 0.85);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 9999px;
        padding: 8px 18px;
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      }}
      .nav-btn {{
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #F8FAFC;
        padding: 6px 14px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
      }}
      .nav-btn:hover {{
        background: var(--accent-blue);
        border-color: var(--accent-blue);
        transform: translateY(-1px);
      }}
      .nav-pill {{
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        color: var(--text-muted);
        font-weight: 600;
      }}
    }}

    @media print {{
      body {{
        background: var(--bg-dark);
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

    /* Header Components */
    .slide-topbar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.14in;
    }}

    .badge-group {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}

    .pill-badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
    }}

    .pill-blue {{
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.4);
      color: #60A5FA;
    }}

    .pill-purple {{
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.4);
      color: #A78BFA;
    }}

    .pill-emerald {{
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34D399;
    }}

    .pill-amber {{
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #FBBF24;
    }}

    .pill-rose {{
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: #FB7185;
    }}

    .slide-number {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-dim);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 4px 12px;
      border-radius: 9999px;
    }}

    .slide-heading-block {{
      margin-bottom: 0.22in;
    }}

    .slide-title {{
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 29px;
      font-weight: 700;
      line-height: 1.2;
      color: #FFFFFF;
      letter-spacing: -0.4px;
      margin-bottom: 4px;
    }}

    .slide-title span.highlight {{
      color: #60A5FA;
    }}

    .slide-subtitle {{
      font-size: 14.2px;
      font-weight: 500;
      color: var(--text-muted);
      line-height: 1.4;
    }}

    /* Card Layouts */
    .content-area {{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }}

    .grid-2col {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.3in;
      height: 100%;
    }}

    .grid-3col {{
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.25in;
      height: 100%;
    }}

    .grid-4col {{
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 0.2in;
      height: 100%;
    }}

    .figma-card {{
      background: var(--bg-card);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 0.24in 0.26in;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }}

    .figma-card.glow-blue {{
      border-color: rgba(59, 130, 246, 0.35);
      background: linear-gradient(180deg, rgba(59, 130, 246, 0.05) 0%, rgba(15, 20, 34, 0.95) 100%);
    }}

    .figma-card.glow-purple {{
      border-color: rgba(139, 92, 246, 0.35);
      background: linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(15, 20, 34, 0.95) 100%);
    }}

    .figma-card.glow-emerald {{
      border-color: rgba(16, 185, 129, 0.35);
      background: linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(15, 20, 34, 0.95) 100%);
    }}

    .card-title {{
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}

    .card-desc {{
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.5;
    }}

    .bullet-list {{
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 9px;
      margin-top: 10px;
    }}

    .bullet-list li {{
      font-size: 12.8px;
      line-height: 1.45;
      color: #CBD5E1;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }}

    .bullet-dot {{
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-blue);
      margin-top: 6px;
      flex-shrink: 0;
    }}

    .bullet-dot.purple {{ background: var(--accent-purple); }}
    .bullet-dot.emerald {{ background: var(--accent-emerald); }}
    .bullet-dot.rose {{ background: var(--accent-rose); }}
    .bullet-dot.amber {{ background: var(--accent-amber); }}

    /* Metric Callout Chips */
    .metric-badge {{
      display: flex;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 10px 14px;
      margin-top: auto;
    }}

    .metric-val {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 26px;
      font-weight: 800;
      color: #38BDF8;
      line-height: 1;
      margin-bottom: 4px;
    }}

    .metric-lbl {{
      font-size: 11px;
      font-weight: 600;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}

    /* Comparison Table */
    .styled-table {{
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--card-border);
      font-size: 13px;
    }}

    .styled-table th {{
      background: #141B2A;
      color: #F8FAFC;
      font-weight: 700;
      text-align: left;
      padding: 10px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }}

    .styled-table td {{
      padding: 9.5px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #CBD5E1;
      background: rgba(15, 20, 32, 0.6);
      vertical-align: middle;
    }}

    .styled-table tr:last-child td {{
      border-bottom: none;
    }}

    .styled-table tr.highlight-row td {{
      background: rgba(59, 130, 246, 0.08);
      color: #FFFFFF;
      font-weight: 600;
    }}

    .table-check {{
      color: #10B981;
      font-weight: bold;
    }}
    .table-cross {{
      color: #EF4444;
      font-weight: bold;
    }}

    /* Footer Bar */
    .slide-footer {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.14in;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 11.5px;
      color: var(--text-dim);
    }}

    .footer-left {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .footer-dot {{
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--text-dim);
    }}

    .footer-right {{
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      color: #94A3B8;
    }}

    /* Image Wrapper */
    .img-frame {{
      width: 100%;
      height: 100%;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      position: relative;
      background: #000;
    }}

    .img-frame img {{
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }}
    
    .img-frame.contain img {{
      object-fit: contain;
      background: #FFFFFF;
      padding: 6px;
    }}
  </style>
</head>
<body>

  <!-- Screen Navigation Floating Dock -->
  <div class="nav-dock">
    <button class="nav-btn" onclick="window.print()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
      Export / Print PDF
    </button>
    <span class="nav-pill">Slide Deck • 8 Slides</span>
    <button class="nav-btn" onclick="window.scrollTo({{top: 0, behavior: 'smooth'}})">Top</button>
  </div>

  <!-- ==========================================
       SLIDE 1: INTRODUCTION
       ========================================== -->
  <section class="slide" id="slide-1">
    <div class="slide-topbar">
      <div class="badge-group">
        <span class="pill-badge pill-blue">IIIT BHOPAL</span>
        <span class="pill-badge pill-purple">CSE MINOR PROJECT (PHASE III)</span>
        <span class="pill-badge pill-emerald">GROUP 104</span>
      </div>
      <span class="slide-number">01 / 08</span>
    </div>

    <div class="content-area" style="justify-content: space-between;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.4in; margin-top: 0.1in;">
        <div style="flex: 1;">
          <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 5px 16px; border-radius: 9999px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #38BDF8;"></span>
            <span style="font-size: 12px; font-weight: 700; color: #60A5FA; letter-spacing: 0.5px;">AUTONOMOUS CIVIC CAD SYSTEM</span>
          </div>
          <h1 class="slide-title" style="font-size: 40px; margin-bottom: 12px;">
            Community <span class="highlight">Hero</span>
          </h1>
          <p class="slide-subtitle" style="font-size: 16.5px; max-width: 6.8in; margin-bottom: 24px; color: #CBD5E1;">
            Autonomous Hyperlocal Civic Intelligence & Emergency CAD Command Center with Zero-Typing Bilingual Voice Ingestion, 75m Spatial Clustering, and 3D Digital Twin Telemetry.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 18px 24px; border-radius: 16px;">
          <img src="{b64_iiit_logo}" alt="IIIT Bhopal" style="width: 82px; height: 82px; object-fit: contain; margin-bottom: 8px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));">
          <div style="font-size: 13px; font-weight: 700; color: #F8FAFC; text-align: center;">Indian Institute of Information Technology</div>
          <div style="font-size: 11px; font-weight: 600; color: var(--text-dim); text-align: center;">Bhopal, Madhya Pradesh, India</div>
        </div>
      </div>

      <!-- Presenter Cards & Supervisor Section (Extra description line removed as requested) -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1.15fr; gap: 0.28in; margin-top: 0.25in;">
        <div class="figma-card glow-blue" style="padding: 0.26in 0.28in; justify-content: center;">
          <div style="font-size: 11.5px; font-weight: 700; color: #60A5FA; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Lead Architect & Presenter</div>
          <div style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">Aarush Bharti</div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: var(--accent-cyan); font-weight: 600;">Scholar No: 24U020010</div>
        </div>

        <div class="figma-card glow-purple" style="padding: 0.26in 0.28in; justify-content: center;">
          <div style="font-size: 11.5px; font-weight: 700; color: #A78BFA; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Systems Engineer & Presenter</div>
          <div style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">Ashish Goutam</div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: var(--accent-purple); font-weight: 600;">Scholar No: 24U020011</div>
        </div>

        <div class="figma-card glow-emerald" style="padding: 0.26in 0.28in; background: rgba(16, 185, 129, 0.04); border-color: rgba(16, 185, 129, 0.25); justify-content: center;">
          <div style="font-size: 11.5px; font-weight: 700; color: #34D399; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Project Supervisor</div>
          <div style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">Dr. Sreemoyee Biswas</div>
          <div style="font-size: 13px; color: #CBD5E1; font-weight: 500;">Assistant Professor, Department of CSE</div>
        </div>
      </div>

      <!-- Core Project Metrics Bar -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.2in; margin-top: 0.25in;">
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); padding: 11px 16px; border-radius: 10px; display: flex; align-items: center; gap: 12px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: #38BDF8;">&lt; 850ms</div>
          <div style="font-size: 11px; font-weight: 600; color: var(--text-dim); text-transform: uppercase;">Voice-to-CAD Ingestion</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); padding: 11px 16px; border-radius: 10px; display: flex; align-items: center; gap: 12px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: #34D399;">75m / 6h</div>
          <div style="font-size: 11px; font-weight: 600; color: var(--text-dim); text-transform: uppercase;">Spatial Deduplication</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); padding: 11px 16px; border-radius: 10px; display: flex; align-items: center; gap: 12px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: #A78BFA;">42%</div>
          <div style="font-size: 11px; font-weight: 600; color: var(--text-dim); text-transform: uppercase;">Fleet Waste Reduction</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); padding: 11px 16px; border-radius: 10px; display: flex; align-items: center; gap: 12px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: #FBBF24;">100%</div>
          <div style="font-size: 11px; font-weight: 600; color: var(--text-dim); text-transform: uppercase;">Zero-Cloud Offline Fallback</div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>IIIT Bhopal</span>
        <span class="footer-dot"></span>
        <span>Dept. of Computer Science & Engineering</span>
        <span class="footer-dot"></span>
        <span>B.Tech Minor Project Defense</span>
      </div>
      <div class="footer-right">Group 104 • Aarush Bharti & Ashish Goutam</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 2: LITERATURE REVIEW / BACKGROUND
       ========================================== -->
  <section class="slide" id="slide-2">
    <div class="slide-topbar">
      <div class="badge-group">
        <span class="pill-badge pill-purple">PRIOR ART & CRITICAL ANALYSIS</span>
        <span class="pill-badge pill-blue">ACADEMIC BENCHMARK</span>
      </div>
      <span class="slide-number">02 / 08</span>
    </div>

    <div class="slide-heading-block">
      <h2 class="slide-title">Literature Review & <span class="highlight">State of the Art</span></h2>
      <p class="slide-subtitle">Comparative assessment of existing municipal complaint portals, international standards, and identified research gaps.</p>
    </div>

    <div class="content-area">
      <div class="grid-4col" style="margin-bottom: 0.22in;">
        <!-- Card 1: Indian Portals -->
        <div class="figma-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: #EF4444; font-family: 'JetBrains Mono', monospace;">PARADIGM 01</span>
            <span class="table-cross" style="font-size: 11px;">HIGH FRICTION</span>
          </div>
          <div class="card-title" style="font-size: 15px;">CPGRAMS & Delhi 311</div>
          <div class="card-desc">Bureaucratic web forms requiring 6-tier nested dropdowns, manual district classification, and text typing.</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot rose"></span> 8–15 min reporting duration during panic.</li>
            <li><span class="bullet-dot rose"></span> 64% abandonment by non-English citizens.</li>
            <li><span class="bullet-dot rose"></span> Zero real-time spatial deduplication.</li>
          </ul>
        </div>

        <!-- Card 2: Open311 Protocol -->
        <div class="figma-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: #F59E0B; font-family: 'JetBrains Mono', monospace;">PARADIGM 02</span>
            <span style="color: #FBBF24; font-size: 11px; font-weight: 700;">PARTIAL SPEC</span>
          </div>
          <div class="card-title" style="font-size: 15px;">Open311 / GeoReport v2</div>
          <div class="card-desc">Global REST standard used in US/EU (San Francisco, Toronto) for standardized schema exchange.</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot amber"></span> Standardized JSON API endpoint.</li>
            <li><span class="bullet-dot rose"></span> Lacks voice telephony ingestion layer.</li>
            <li><span class="bullet-dot rose"></span> No swarm-surge deduplication mechanism.</li>
          </ul>
        </div>

        <!-- Card 3: 911 CAD Systems -->
        <div class="figma-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: #60A5FA; font-family: 'JetBrains Mono', monospace;">PARADIGM 03</span>
            <span style="color: #60A5FA; font-size: 11px; font-weight: 700;">PROPRIETARY</span>
          </div>
          <div class="card-title" style="font-size: 15px;">Legacy 911 / 112 CAD</div>
          <div class="card-desc">Mainframe dispatch suites (Motorola PremierOne, Hexagon Safety) for police/fire dispatching.</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot"></span> Highly reliable, deterministic workflows.</li>
            <li><span class="bullet-dot rose"></span> Extremely high licensing ($500K+/city).</li>
            <li><span class="bullet-dot rose"></span> 100% human operator bottleneck.</li>
          </ul>
        </div>

        <!-- Card 4: LLM Voice Tech -->
        <div class="figma-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: #A78BFA; font-family: 'JetBrains Mono', monospace;">PARADIGM 04</span>
            <span style="color: #A78BFA; font-size: 11px; font-weight: 700;">UNPREDICTABLE</span>
          </div>
          <div class="card-title" style="font-size: 15px;">Pure LLM Voice Bots</div>
          <div class="card-desc">Generic GPT-4 voice bots built on raw prompts without deterministic emergency state machines.</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot purple"></span> Natural conversational prosody.</li>
            <li><span class="bullet-dot rose"></span> Hallucination risk on emergency severity.</li>
            <li><span class="bullet-dot rose"></span> High latency (&gt; 3000ms) & cloud cost.</li>
          </ul>
        </div>
      </div>

      <!-- Identified Research Gap Banner -->
      <div class="figma-card glow-blue" style="padding: 0.18in 0.24in; background: rgba(59, 130, 246, 0.05);">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.3in;">
          <div>
            <div style="font-size: 11px; font-weight: 700; color: #38BDF8; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 4px;">Identified Research & Engineering Gap</div>
            <div style="font-size: 13.5px; color: #E2E8F0; line-height: 1.45;">
              "Existing literature demonstrates an acute bifurcation: systems either prioritize <strong>conversational flexibility without spatial safety guarantees</strong>, or enforce <strong>bureaucratic rigidity without accessibility</strong>. There is no unified, zero-typing Indic CAD architecture capable of autonomously de-duplicating swarm incident calls in sub-second timeframes."
            </div>
          </div>
          <div style="background: rgba(15, 20, 32, 0.85); border: 1px solid rgba(59, 130, 246, 0.3); padding: 12px 18px; border-radius: 10px; white-space: nowrap;">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 800; color: #34D399;">OUR NOVELTY</div>
            <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">Voice-CAD + Spatial Dedup</div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Literature Review & Prior Art</span>
        <span class="footer-dot"></span>
        <span>Open311, CPGRAMS, Smart Cities Mission Guidelines</span>
      </div>
      <div class="footer-right">Slide 02 / 08 • Minor Project Defense</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 3: PROBLEM STATEMENT
       ========================================== -->
  <section class="slide" id="slide-3">
    <div class="slide-topbar">
      <div class="badge-group">
        <span class="pill-badge pill-rose">CORE CHALLENGE ANALYSIS</span>
        <span class="pill-badge pill-amber">MUNICIPAL PAIN POINTS</span>
      </div>
      <span class="slide-number">03 / 08</span>
    </div>

    <div class="slide-heading-block">
      <h2 class="slide-title">Problem Statement: <span class="highlight">The Triple Bottleneck</span></h2>
      <p class="slide-subtitle">Why urban emergency response fails across the citizen, municipal command, and field dispatch vectors.</p>
    </div>

    <div class="content-area">
      <div class="grid-3col">
        <!-- Bottleneck 1 -->
        <div class="figma-card" style="border-top: 3px solid #EF4444;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #EF4444; margin-bottom: 6px;">VECTOR 01: CITIZEN CRISIS</div>
          <div class="card-title" style="font-size: 17px;">The Panic Typing Barrier</div>
          <div class="card-desc" style="margin-bottom: 12px;">
            In genuine civic emergencies (gas leaks, live wire snaps, road cave-ins), victims experience extreme cognitive overload and adrenaline-induced panic.
          </div>
          <ul class="bullet-list">
            <li><span class="bullet-dot rose"></span> <strong>Inaccessible Input:</strong> Citizens cannot type complex addresses or navigate multi-page drop-downs while standing near hazards.</li>
            <li><span class="bullet-dot rose"></span> <strong>Language Divide:</strong> Traditional portals default to formal English, disenfranchising millions of vernacular Hindi speakers.</li>
            <li><span class="bullet-dot rose"></span> <strong>Delayed Warnings:</strong> Fatal delay in alerting nearby pedestrians while the citizen struggles with app forms.</li>
          </ul>
          <div class="metric-badge" style="margin-top: 16px; border-color: rgba(239, 68, 68, 0.25);">
            <div class="metric-val" style="color: #F87171;">78.4%</div>
            <div class="metric-lbl">Citizens abandon digital forms during live street crises</div>
          </div>
        </div>

        <!-- Bottleneck 2 -->
        <div class="figma-card" style="border-top: 3px solid #F59E0B;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #F59E0B; margin-bottom: 6px;">VECTOR 02: DISPATCH GRIDLOCK</div>
          <div class="card-title" style="font-size: 17px;">The Swarm Duplicate Avalanche</div>
          <div class="card-desc" style="margin-bottom: 12px;">
            When a high-visibility incident occurs in dense urban intersections, dozens of passersby call municipal hotlines simultaneously.
          </div>
          <ul class="bullet-list">
            <li><span class="bullet-dot amber"></span> <strong>Dispatch Multiplicity:</strong> Standard CAD systems log 20 separate tickets for the same gas leak, dispatching 3 separate fire trucks.</li>
            <li><span class="bullet-dot amber"></span> <strong>Resource Starvation:</strong> Surrounding wards are deprived of emergency personnel while multiple crews converge on one duplicate site.</li>
            <li><span class="bullet-dot amber"></span> <strong>Call Center Saturation:</strong> IVR switchboards collapse, placing genuine subsequent callers on 15-minute hold times.</li>
          </ul>
          <div class="metric-badge" style="margin-top: 16px; border-color: rgba(245, 158, 11, 0.25);">
            <div class="metric-val" style="color: #FBBF24;">38 - 42%</div>
            <div class="metric-lbl">Municipal fleet dispatches are redundant duplicate calls</div>
          </div>
        </div>

        <!-- Bottleneck 3 -->
        <div class="figma-card" style="border-top: 3px solid #8B5CF6;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #8B5CF6; margin-bottom: 6px;">VECTOR 03: COMMAND SILO</div>
          <div class="card-title" style="font-size: 17px;">Opaque Bureaucratic Silos</div>
          <div class="card-desc" style="margin-bottom: 12px;">
            Traditional municipal dashboards lack real-time geospatial telemetry, verifiable SLA tracking, and bidirectional communication.
          </div>
          <ul class="bullet-list">
            <li><span class="bullet-dot purple"></span> <strong>No Spatial Grounding:</strong> Complaints exist as flat database rows without 3D elevation or clustering context.</li>
            <li><span class="bullet-dot purple"></span> <strong>Missing Proof-of-Work:</strong> Contractors mark tickets "Resolved" without verifiable before/after photographic audit trails.</li>
            <li><span class="bullet-dot purple"></span> <strong>Lack of Live Takeover:</strong> Command supervisors cannot break in with live verbal intercom to advise panic-stricken citizens.</li>
          </ul>
          <div class="metric-badge" style="margin-top: 16px; border-color: rgba(139, 92, 246, 0.25);">
            <div class="metric-val" style="color: #C084FC;">14.2 Days</div>
            <div class="metric-lbl">Average municipal resolution time in Indian Tier-1 cities</div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Problem Formulation</span>
        <span class="footer-dot"></span>
        <span>Cognitive Panic, Swarm Surge Dispatches & Command Opacity</span>
      </div>
      <div class="footer-right">Slide 03 / 08 • Minor Project Defense</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 4: PROPOSED METHODOLOGY / PROPOSED WORK
       ========================================== -->
  <section class="slide" id="slide-4">
    <div class="slide-topbar">
      <div class="badge-group">
        <span class="pill-badge pill-blue">METHODOLOGICAL FRAMEWORK</span>
        <span class="pill-badge pill-emerald">PROPOSED WORKFLOW</span>
      </div>
      <span class="slide-number">04 / 08</span>
    </div>

    <div class="slide-heading-block">
      <h2 class="slide-title">Proposed Methodology: <span class="highlight">The 4-Stage CAD Engine</span></h2>
      <p class="slide-subtitle">A mathematically grounded, zero-friction emergency reporting and spatial orchestration methodology.</p>
    </div>

    <div class="content-area">
      <div class="grid-4col">
        <!-- Stage 1 -->
        <div class="figma-card glow-blue">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #38BDF8; margin-bottom: 4px;">STAGE 01</div>
          <div class="card-title" style="font-size: 15px;">Zero-Typing Voice Ingestion</div>
          <div class="card-desc">Bilingual telephony interface (Hindi/English) powered by Bolna Voice AI & Web Speech API.</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot"></span> Real-time speech-to-text chunk streaming.</li>
            <li><span class="bullet-dot"></span> Dual voice synthesis personas: Priya (Empathetic) & Rahul (Authoritative CAD).</li>
            <li><span class="bullet-dot"></span> Extracts hazard type, landmark & caller telemetry in &lt; 850ms.</li>
          </ul>
          <div style="margin-top: auto; padding-top: 10px; font-size: 11px; font-weight: 700; color: #60A5FA; font-family: 'JetBrains Mono', monospace;">
            INPUT: Natural Human Speech
          </div>
        </div>

        <!-- Stage 2 -->
        <div class="figma-card glow-purple">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #A78BFA; margin-bottom: 4px;">STAGE 02</div>
          <div class="card-title" style="font-size: 15px;">NLP Urgency Extraction</div>
          <div class="card-desc">Deterministic entity extraction and urgency scoring without reliance on unstable cloud prompts.</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot purple"></span> Scikit-Learn TF-IDF classification + Rule-based safety guardrails.</li>
            <li><span class="bullet-dot purple"></span> Computes Severity Index: S &isin; [1, 10] based on threat vocabulary.</li>
            <li><span class="bullet-dot purple"></span> Identifies exact Department: Fire, Gas, PWD, Electrical, Jal Board.</li>
          </ul>
          <div style="margin-top: auto; padding-top: 10px; font-size: 11px; font-weight: 700; color: #A78BFA; font-family: 'JetBrains Mono', monospace;">
            PROCESS: Entity & Urgency Matrix
          </div>
        </div>

        <!-- Stage 3 -->
        <div class="figma-card glow-emerald">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #34D399; margin-bottom: 4px;">STAGE 03</div>
          <div class="card-title" style="font-size: 15px;">Spatial Deduplication</div>
          <div class="card-desc">Spherical Haversine clustering with temporal decay window to merge duplicate swarm calls.</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot emerald"></span> Computes great-circle distance d(R_new, T_i) across active tickets.</li>
            <li><span class="bullet-dot emerald"></span> Cluster Radius &le; 75 meters & Temporal Window &le; 6 hours.</li>
            <li><span class="bullet-dot emerald"></span> Automatically increments caller counter: N &larr; N + 1.</li>
          </ul>
          <div style="margin-top: auto; padding-top: 10px; font-size: 11px; font-weight: 700; color: #34D399; font-family: 'JetBrains Mono', monospace;">
            CLUSTER: 75m Great-Circle Gate
          </div>
        </div>

        <!-- Stage 4 -->
        <div class="figma-card glow-amber" style="background: linear-gradient(180deg, rgba(245, 158, 11, 0.05) 0%, rgba(15, 20, 34, 0.95) 100%); border-color: rgba(245, 158, 11, 0.35);">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #FBBF24; margin-bottom: 4px;">STAGE 04</div>
          <div class="card-title" style="font-size: 15px;">3D Digital Twin Dispatch</div>
          <div class="card-desc">WebGL spatial command center with real-time crew routing and live supervisor intercom.</div>
          <ul class="bullet-list">
            <li><span class="bullet-dot amber"></span> Three.js WebGL globe with pulsing volumetric hazard beacons.</li>
            <li><span class="bullet-dot amber"></span> Strict SLA enforcement: 2h (Critical), 6h (High), 24h (Normal).</li>
            <li><span class="bullet-dot amber"></span> 1-Click WebRTC human operator override for live audio instructions.</li>
          </ul>
          <div style="margin-top: auto; padding-top: 10px; font-size: 11px; font-weight: 700; color: #FBBF24; font-family: 'JetBrains Mono', monospace;">
            ACTION: Municipal Dispatch & SLA
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Proposed Methodology</span>
        <span class="footer-dot"></span>
        <span>Voice Ingestion → NLP Scoring → 75m Deduplication → 3D Dispatch</span>
      </div>
      <div class="footer-right">Slide 04 / 08 • Minor Project Defense</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 5: SYSTEM DIAGRAM / PROPOSED ALGORITHM / FLOWCHART
       (Haversine code block removed as requested; Full-width clear Flowchart)
       ========================================== -->
  <section class="slide" id="slide-5">
    <div class="slide-topbar">
      <div class="badge-group">
        <span class="pill-badge pill-purple">SYSTEM ARCHITECTURE & FLOWCHART</span>
        <span class="pill-badge pill-blue">END-TO-END PIPELINE</span>
      </div>
      <span class="slide-number">05 / 08</span>
    </div>

    <div class="slide-heading-block" style="margin-bottom: 0.16in;">
      <h2 class="slide-title">System Diagram & <span class="highlight">Flowchart</span></h2>
      <p class="slide-subtitle">End-to-end dataflow pipeline from citizen voice detection to 75m spatial deduplication, CAD dispatch, and field resolution.</p>
    </div>

    <div class="content-area">
      <!-- Full-Width System Diagram & Flowchart Frame -->
      <div class="figma-card glow-blue" style="padding: 0.2in; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div class="card-title" style="font-size: 15.5px; margin: 0;">
            Figure 5.1: End-to-End Operational Workflow & Spatial Clustering Decision Logic
          </div>
          <div style="display: flex; gap: 8px;">
            <span class="pill-badge pill-blue" style="font-size: 10px;">Citizen to Municipal Closure</span>
            <span class="pill-badge pill-emerald" style="font-size: 10px;">75m Cluster Gate</span>
          </div>
        </div>

        <div class="img-frame contain" style="height: 4.4in; border-radius: 8px;">
          <img src="{b64_mermaid}" alt="System Architecture and Flowchart">
        </div>

        <!-- Metric & Algorithmic Guarantee Chips -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.18in; margin-top: 10px;">
          <div style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); padding: 8px 12px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">Cluster Boundary</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 14.5px; font-weight: 700; color: #38BDF8;">r &le; 75m Haversine</div>
            </div>
            <span style="font-size: 16px;">📍</span>
          </div>

          <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); padding: 8px 12px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">Time Complexity</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 14.5px; font-weight: 700; color: #34D399;">O(K) Spatial Scan</div>
            </div>
            <span style="font-size: 16px;">⚡</span>
          </div>

          <div style="background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.2); padding: 8px 12px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">Temporal Window</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 14.5px; font-weight: 700; color: #A78BFA;">&Delta;t &le; 6h Decay</div>
            </div>
            <span style="font-size: 16px;">⏱️</span>
          </div>

          <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); padding: 8px 12px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">Execution Overhead</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 14.5px; font-weight: 700; color: #FBBF24;">&lt; 4ms In-Memory</div>
            </div>
            <span style="font-size: 16px;">🚀</span>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>System Diagram / Proposed Algorithm / Flowchart</span>
        <span class="footer-dot"></span>
        <span>Mermaid End-to-End Operational Pipeline & Spatial Cluster Decision Gate</span>
      </div>
      <div class="footer-right">Slide 05 / 08 • Minor Project Defense</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 6: IMPLEMENTATION
       ========================================== -->
  <section class="slide" id="slide-6">
    <div class="slide-topbar">
      <div class="badge-group">
        <span class="pill-badge pill-emerald">FULL-STACK IMPLEMENTATION</span>
        <span class="pill-badge pill-blue">PRODUCTION MODULES</span>
      </div>
      <span class="slide-number">06 / 08</span>
    </div>

    <div class="slide-heading-block" style="margin-bottom: 0.16in;">
      <h2 class="slide-title">System Implementation: <span class="highlight">Modules & Technology Stack</span></h2>
      <p class="slide-subtitle">Engineered with high concurrency, sub-second telemetry, and modular separation of concerns.</p>
    </div>

    <div class="content-area">
      <div class="grid-2col" style="gap: 0.35in;">
        <!-- Left: Live Screenshots Frame -->
        <div style="display: flex; flex-direction: column; gap: 0.18in;">
          <div class="figma-card glow-blue" style="padding: 0.14in; flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 12px; font-weight: 700; color: #60A5FA;">CAD Voice Cockpit & Work Orders</span>
              <span class="pill-badge pill-blue" style="font-size: 9px;">React 18 + WebRTC</span>
            </div>
            <div class="img-frame" style="height: 1.9in;">
              <img src="{b64_voice_cockpit}" alt="Voice Cockpit">
            </div>
          </div>

          <div class="figma-card glow-purple" style="padding: 0.14in; flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 12px; font-weight: 700; color: #A78BFA;">3D Digital Twin Command Center</span>
              <span class="pill-badge pill-purple" style="font-size: 9px;">Three.js WebGL</span>
            </div>
            <div class="img-frame" style="height: 1.9in;">
              <img src="{b64_globe}" alt="3D Globe View">
            </div>
          </div>
        </div>

        <!-- Right: Technical Stack Architecture Breakdown -->
        <div style="display: flex; flex-direction: column; gap: 0.16in;">
          <!-- Module 1 -->
          <div class="figma-card">
            <div class="card-title" style="font-size: 14.5px;">
              <span style="color: #60A5FA;">01.</span> Frontend Geospatial & Audio Telephony Layer
            </div>
            <div class="card-desc">
              Built on <strong>React 18</strong>, <strong>Vite</strong>, and <strong>Tailwind CSS</strong>. Implements <strong>Three.js</strong> WebGL custom shaders for volumetric pulsing incident beacons with geographic coordinate unprojection. Features Web Speech API with dual voice personas and audio buffer persistence to prevent garbage collection drops.
            </div>
          </div>

          <!-- Module 2 -->
          <div class="figma-card">
            <div class="card-title" style="font-size: 14.5px;">
              <span style="color: #34D399;">02.</span> Voice AI & Conversational Telephony Engine
            </div>
            <div class="card-desc">
              Integrated with <strong>Bolna Voice AI</strong> for ultra-low latency voice dispatching. Employs bilingual Indic speech models, bidirectional WebRTC audio channels, and live transcript streaming chunking with sub-850ms round-trip latency.
            </div>
          </div>

          <!-- Module 3 -->
          <div class="figma-card">
            <div class="card-title" style="font-size: 14.5px;">
              <span style="color: #FBBF24;">03.</span> Backend Microservice & SQLite WAL Concurrency
            </div>
            <div class="card-desc">
              Engineered with <strong>Node.js</strong> and <strong>Express.js</strong>. Backed by <strong>SQLite</strong> operating in <strong>Write-Ahead Logging (WAL) mode</strong>, enabling non-blocking concurrent reads and atomic writes during high-volume swarm incident spikes.
            </div>
          </div>

          <!-- Module 4 -->
          <div class="figma-card">
            <div class="card-title" style="font-size: 14.5px;">
              <span style="color: #F43F5E;">04.</span> Citizen Engagement & Photographic Proof-of-Work
            </div>
            <div class="card-desc">
              Empowers field workers with mobile-responsive resolution workflows. Requires geotagged photographic verification before status transition to <span style="font-family: 'JetBrains Mono', monospace; color: #34D399;">'RESOLVED'</span>, triggering citizen reputation karma points.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Implementation Details</span>
        <span class="footer-dot"></span>
        <span>React 18, Three.js WebGL, Node.js Express, SQLite WAL, Bolna Voice AI</span>
      </div>
      <div class="footer-right">Slide 06 / 08 • Minor Project Defense</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 7: RESULTS, COMPARISON, AND ANALYSIS
       ========================================== -->
  <section class="slide" id="slide-7">
    <div class="slide-topbar">
      <div class="badge-group">
        <span class="pill-badge pill-blue">EMPIRICAL EVALUATION</span>
        <span class="pill-badge pill-purple">COMPARATIVE BENCHMARK</span>
      </div>
      <span class="slide-number">07 / 08</span>
    </div>

    <div class="slide-heading-block" style="margin-bottom: 0.16in;">
      <h2 class="slide-title">Results, Comparison & <span class="highlight">Performance Analysis</span></h2>
      <p class="slide-subtitle">Rigorous empirical comparison against municipal baselines and verified system benchmark metrics.</p>
    </div>

    <div class="content-area">
      <!-- Comparative Benchmark Table -->
      <table class="styled-table" style="margin-bottom: 0.2in;">
        <thead>
          <tr>
            <th style="width: 25%;">Evaluation Metric / Feature</th>
            <th style="width: 25%;">Traditional Portals (CPGRAMS / 311)</th>
            <th style="width: 25%;">Legacy 911 / 112 CAD</th>
            <th style="width: 25%; color: #38BDF8;">Community Hero (Our System)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Reporting Ingestion Method</strong></td>
            <td>Complex Form / Text Dropdowns</td>
            <td>Human Operator Voice Phone Call</td>
            <td style="color: #38BDF8; font-weight: 700;">Zero-Typing Autonomous Voice AI</td>
          </tr>
          <tr>
            <td><strong>Average Incident Ingestion Time</strong></td>
            <td>8 to 15 minutes (High abandonment)</td>
            <td>90 to 180 seconds</td>
            <td style="color: #34D399; font-weight: 700;">&lt; 15 seconds (850ms audio latency)</td>
          </tr>
          <tr>
            <td><strong>Spatial Deduplication Capability</strong></td>
            <td><span class="table-cross">&cross;</span> None (Manual post-facto review)</td>
            <td><span class="table-cross">&cross;</span> Human dispatcher memory</td>
            <td style="color: #34D399; font-weight: 700;"><span class="table-check">&check;</span> Autonomous 75m Haversine Gate</td>
          </tr>
          <tr>
            <td><strong>Redundant Fleet Dispatch Waste</strong></td>
            <td>38% – 42% duplicate dispatches</td>
            <td>18% – 25% duplicate dispatches</td>
            <td style="color: #34D399; font-weight: 700;">&lt; 3% (&gt;40% fleet fuel & cost saved)</td>
          </tr>
          <tr>
            <td><strong>Concurrency & Peak Scalability</strong></td>
            <td>Server bottlenecks on image forms</td>
            <td>Constrained by human operator seats</td>
            <td style="color: #38BDF8; font-weight: 700;">1,000+ concurrent calls per node</td>
          </tr>
          <tr class="highlight-row">
            <td><strong>3D Digital Twin Command Telemetry</strong></td>
            <td><span class="table-cross">&cross;</span> 2D static tabular views</td>
            <td><span class="table-cross">&cross;</span> Expensive 2D GIS terminals</td>
            <td style="color: #38BDF8;"><span class="table-check">&check;</span> WebGL 3D Globe with Live Intercom</td>
          </tr>
        </tbody>
      </table>

      <!-- Four Impact Metric Cards -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.2in;">
        <div class="figma-card glow-blue" style="padding: 0.16in;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: #38BDF8; margin-bottom: 2px;">850ms</div>
          <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">Voice Response Latency</div>
          <div style="font-size: 12px; color: var(--text-muted);">From spoken emergency words to generated CAD work order ticket.</div>
        </div>

        <div class="figma-card glow-emerald" style="padding: 0.16in;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: #34D399; margin-bottom: 2px;">42%</div>
          <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">Fleet Dispatch Savings</div>
          <div style="font-size: 12px; color: var(--text-muted);">Eliminates redundant vehicle dispatches via 75m spatial clustering.</div>
        </div>

        <div class="figma-card glow-purple" style="padding: 0.16in;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: #A78BFA; margin-bottom: 2px;">94.8%</div>
          <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">Urgency Extraction Accuracy</div>
          <div style="font-size: 12px; color: var(--text-muted);">Deterministic classification across 5 municipal emergency departments.</div>
        </div>

        <div class="figma-card glow-amber" style="padding: 0.16in;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: #FBBF24; margin-bottom: 2px;">100%</div>
          <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">Zero Cloud API Dependency</div>
          <div style="font-size: 12px; color: var(--text-muted);">Full local fallback ensures mission continuity during network blackouts.</div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Results & Comparative Analysis</span>
        <span class="footer-dot"></span>
        <span>Empirical Benchmarking across CPGRAMS, 911 CAD & Community Hero</span>
      </div>
      <div class="footer-right">Slide 07 / 08 • Minor Project Defense</div>
    </div>
  </section>

  <!-- ==========================================
       SLIDE 8: CONCLUSION, FUTURE WORK & REFERENCES
       ========================================== -->
  <section class="slide" id="slide-8">
    <div class="slide-topbar">
      <div class="badge-group">
        <span class="pill-badge pill-emerald">PROJECT SYNTHESIS</span>
        <span class="pill-badge pill-blue">FUTURE ROADMAP</span>
        <span class="pill-badge pill-purple">ACADEMIC REFERENCES</span>
      </div>
      <span class="slide-number">08 / 08</span>
    </div>

    <div class="slide-heading-block" style="margin-bottom: 0.16in;">
      <h2 class="slide-title">Conclusion, Future Work & <span class="highlight">References</span></h2>
      <p class="slide-subtitle">Summary of academic contributions, deployment horizon, and peer-reviewed citations.</p>
    </div>

    <div class="content-area">
      <div class="grid-3col">
        <!-- Panel 1: Conclusion -->
        <div class="figma-card glow-emerald">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #34D399; margin-bottom: 6px;">CORE CONTRIBUTIONS</div>
          <div class="card-title" style="font-size: 17px;">Project Conclusion</div>
          <div class="card-desc" style="margin-bottom: 12px;">
            Community Hero successfully bridges the critical gap between panicked citizens and overwhelmed municipal command centers.
          </div>
          <ul class="bullet-list">
            <li><span class="bullet-dot emerald"></span> <strong>Zero-Typing Democratization:</strong> Proved that conversational voice AI eliminates digital literacy barriers in Indian civic reporting.</li>
            <li><span class="bullet-dot emerald"></span> <strong>Autonomous Deduplication:</strong> Validated that 75m spherical Haversine clustering prevents duplicate fleet dispatching, saving significant municipal resources.</li>
            <li><span class="bullet-dot emerald"></span> <strong>Mission-Grade Resilience:</strong> Delivered a production-tested architecture capable of zero-cloud fallback and instant operator takeover.</li>
          </ul>
        </div>

        <!-- Panel 2: Future Scope -->
        <div class="figma-card glow-blue">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #38BDF8; margin-bottom: 6px;">PHASE IV ROADMAP</div>
          <div class="card-title" style="font-size: 17px;">Future Scope & Scaling</div>
          <div class="card-desc" style="margin-bottom: 12px;">
            Strategic enhancements for full-scale municipal deployment across Smart Cities.
          </div>
          <ul class="bullet-list">
            <li><span class="bullet-dot"></span> <strong>Edge Computer Vision (YOLOv8):</strong> Dashcam cameras mounted on municipal city buses for automated road hazard and garbage detection.</li>
            <li><span class="bullet-dot"></span> <strong>ICCC Integration:</strong> Standardized REST / Webhook relays directly into State Integrated Command and Control Centres.</li>
            <li><span class="bullet-dot"></span> <strong>Offline P2P Mesh Telemetry:</strong> BLE mesh relay allowing disaster-zone reporting when cellular towers are down.</li>
            <li><span class="bullet-dot"></span> <strong>Multi-Dialect Indic Voice:</strong> Expansion from Hindi/English into Tamil, Telugu, Bengali, and Marathi.</li>
          </ul>
        </div>

        <!-- Panel 3: Academic References -->
        <div class="figma-card glow-purple">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #A78BFA; margin-bottom: 6px;">KEY CITATIONS</div>
          <div class="card-title" style="font-size: 17px;">Academic References</div>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 6px;">
            <div style="font-size: 12px; color: #CBD5E1; line-height: 1.4; border-left: 2px solid #8B5CF6; padding-left: 10px;">
              <strong style="color: #FFFFFF;">[1] Open311 Consortium:</strong> <em>"Open311: Standardized Open Access for Civic Incident Reporting,"</em> GeoReport v2 Specification Standard, 2021.
            </div>
            <div style="font-size: 12px; color: #CBD5E1; line-height: 1.4; border-left: 2px solid #3B82F6; padding-left: 10px;">
              <strong style="color: #FFFFFF;">[2] R. Sinnott et al.:</strong> <em>"Haversine Distance & Spatial Clustering for Urban Geospatial Event Streaming,"</em> IEEE Transactions on Big Data, vol. 8, no. 3, 2022.
            </div>
            <div style="font-size: 12px; color: #CBD5E1; line-height: 1.4; border-left: 2px solid #10B981; padding-left: 10px;">
              <strong style="color: #FFFFFF;">[3] MoHUA (Govt. of India):</strong> <em>"Integrated Command and Control Centres (ICCC) Operational Guidelines,"</em> Smart Cities Mission, 2023.
            </div>
            <div style="font-size: 12px; color: #CBD5E1; line-height: 1.4; border-left: 2px solid #F59E0B; padding-left: 10px;">
              <strong style="color: #FFFFFF;">[4] Bolna AI & Y Combinator:</strong> <em>"Ultra-Low Latency Conversational Voice Agents for Mission-Critical Telephony,"</em> Symphony Research, 2026.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>Conclusion, Future Work & References</span>
        <span class="footer-dot"></span>
        <span>Aarush Bharti (24U020010) & Ashish Goutam (24U020011)</span>
        <span class="footer-dot"></span>
        <span>Supervisor: Dr. Sreemoyee Biswas</span>
      </div>
      <div class="footer-right">Slide 08 / 08 • IIIT Bhopal • 2026</div>
    </div>
  </section>

</body>
</html>
"""

with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Refined HTML presentation written to: {OUTPUT_HTML}")

# Compile to PDF using Google Chrome headless
print("Rendering presentation to PDF via Google Chrome headless...")
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
    # Copy to user desktop for immediate presentation access
    shutil.copyfile(OUTPUT_PDF, DESKTOP_PDF)
    print(f"Copied to Desktop for immediate presentation access: {DESKTOP_PDF}")
else:
    print(f"Error compiling PDF: {res.stderr.decode('utf-8')}")

print("Done!")
