#!/usr/bin/env python3
"""
Community Hero - 8-Slide Exact Presentation Builder (Phase III Minor Project Defense)
Matches 100% of user-approved slide content with zero blank dead space:
- Slide 1: Balanced vertical distribution, taller presenter cards without redundant roles, zero empty voids
- Slide 2: 2x2 grid with two-column cards (left plum icon badge + right bullets), bottom quote capsule
- Slide 3: 3 two-column problem cards on left + styled flowchart on right + bottom quote capsule
- Slide 4: 4 feature cards with cropped high-res assets + horizontal step sequence ribbon + bottom quote capsule
- Slide 5: Full-height 3 columns (Workflow Steps 01-06, Dark Command Console Flowchart, 4 Key Properties cards) with NO quote banner
- Slide 6: Two screenshots with caption bars on left + 4 horizontal module cards on right + bottom Key Properties ribbon
- Slide 7: Admin Console screenshot + Key Results row on left + 5-row x 4-column comparison table on right + bottom quote capsule
- Slide 8: 3 columns (What We Achieved, Future Scope, References) with plum headers & icon rows + quote banner + 3-part bottom team bar
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

b64_s4_phone = get_base64_image("slide4_phone.png")
b64_s4_ai = get_base64_image("slide4_ai.png")
b64_s4_map = get_base64_image("slide4_map.png")
b64_s4_laptop = get_base64_image("slide4_laptop.png")

# Vector SVG Micro-Icons
SVG_MIC = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>'''
SVG_LAYERS = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>'''
SVG_LEAF = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>'''
SVG_WIFI_OFF = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>'''
SVG_TARGET = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>'''
SVG_ALERT = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'''
SVG_FLOW = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>'''
SVG_CHART = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>'''
SVG_USER = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'''
SVG_GRAD = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>'''

SVG_GOV = '''<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2l10 5H2l10-5z"></path></svg>'''
SVG_WEB = '''<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>'''
SVG_PHONE = '''<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>'''
SVG_BOT = '''<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4M8 15h.01M16 15h.01"></path></svg>'''

SVG_DOC_WARN = '''<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="12" y1="12" x2="12" y2="15"></line></svg>'''
SVG_TRUCK = '''<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>'''
SVG_STAMP = '''<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>'''

SVG_CAMERA = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>'''
SVG_PIN = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'''
SVG_BOLT = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>'''
SVG_CLOCK = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'''
SVG_SHIELD = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>'''
SVG_CPU = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>'''
SVG_MONITOR = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>'''
SVG_WORKER = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>'''
SVG_DATABASE = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>'''
SVG_TROPHY = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1 .45-1 1v1h12v-1c0-.55-.45-1-1-1h-2c-.55 0-1-.45-1-1v-2.34"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg>'''
SVG_BUS = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="15" rx="2"></rect><circle cx="7" cy="18" r="2"></circle><circle cx="17" cy="18" r="2"></circle><line x1="3" y1="8" x2="21" y2="8"></line></svg>'''
SVG_SIGNAL = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V4M22 20v-12"></path></svg>'''
SVG_LANG = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"></path></svg>'''
SVG_BOOK = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'''
SVG_HANDSHAKE = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2-2"></path><path d="m18 10 1.3-1.3a1 1 0 0 0 0-1.4l-3.3-3.3a1 1 0 0 0-1.4 0L13 5.6"></path><path d="m2 14 3.3 3.3a1 1 0 0 0 1.4 0l8.3-8.3a1 1 0 0 0 0-1.4L13.6 4.3a1 1 0 0 0-1.4 0L2 14z"></path></svg>'''
SVG_PUMP = '''<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22h12M18 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2M4 9h10M4 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18"></path></svg>'''

print("Generating perfectly filled, well-margined 8-slide presentation HTML...")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Community Hero — CSE Minor Project Presentation (IIIT Bhopal)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {{
      --cream: #FAF7F4;
      --card-white: #FFFFFF;
      --plum: #3B1224;
      --plum-light: #521D34;
      --amber: #D97706;
      --amber-dark: #B45309;
      --peach: #FFF9F2;
      --peach-border: #F3E4D6;
      --text-dark: #1F2937;
      --text-body: #4B5563;
      --text-muted: #6B7280;
      --border-subtle: #E5E0D8;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }}

    body {{
      background: #4A4A4A;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--text-dark);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
      -webkit-font-smoothing: antialiased;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }}

    @page {{
      size: 16in 9in;
      margin: 0;
    }}

    .slide {{
      width: 16in;
      height: 9in;
      position: relative;
      background: var(--cream);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.45in 0.65in 0.35in 0.65in;
      margin-bottom: 30px;
      page-break-after: always;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }}

    @media print {{
      body {{ background: transparent; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }}
      .slide {{ margin-bottom: 0; box-shadow: none; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }}
    }}

    /* Global Header */
    .slide-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.12in;
    }}

    .header-pills {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}

    .pill {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 20px;
    }}

    .pill-soft {{ background: #EFE9E2; color: #521D34; border: 1px solid #E2D9CE; }}
    .pill-dark {{ background: var(--plum); color: #FFFFFF; }}
    .slide-num {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 15px;
      font-weight: 800;
      color: var(--plum);
      letter-spacing: 0.1em;
      border-bottom: 3px solid var(--amber);
      padding-bottom: 2px;
    }}

    /* Titles */
    .title-block {{
      margin-bottom: 0.15in;
    }}

    .slide-title {{
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 38px;
      font-weight: 800;
      color: var(--plum);
      line-height: 1.15;
      letter-spacing: -0.01em;
    }}

    .slide-title span {{
      color: var(--amber);
    }}

    .slide-sub {{
      font-size: 15px;
      color: var(--text-body);
      font-style: italic;
      margin-top: 4px;
      font-weight: 500;
    }}

    /* Content Area */
    .slide-body {{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 0;
    }}

    /* Clean White Card */
    .clean-card {{
      background: var(--card-white);
      border: 1.5px solid var(--border-subtle);
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
    }}

    /* Quote Banner */
    .quote-banner {{
      background: var(--card-white);
      border: 1.5px solid var(--border-subtle);
      border-radius: 14px;
      display: flex;
      align-items: center;
      padding: 0.12in 0.25in;
      gap: 0.25in;
      box-shadow: 0 4px 14px rgba(0,0,0,0.03);
      margin-top: 0.15in;
    }}

    .quote-badge {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--plum);
      color: #FFFFFF;
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 13.5px;
      font-weight: 700;
      white-space: nowrap;
    }}

    .quote-text {{
      font-size: 15.5px;
      font-weight: 600;
      color: var(--text-dark);
      line-height: 1.4;
      flex: 1;
    }}

    /* Global Footer */
    .slide-footer {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      border-top: 1px solid #EFEAE4;
      padding-top: 0.1in;
      margin-top: 0.12in;
    }}

    /* Slide 1 Specifics */
    .hero-lockup {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.05in 0;
    }}

    .hero-badge {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #FFF4E5;
      border: 1.5px solid #FCD34D;
      padding: 6px 16px;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      color: var(--amber-dark);
      text-transform: uppercase;
      margin-bottom: 10px;
    }}

    .hero-title {{
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 86px;
      font-weight: 800;
      color: var(--plum);
      line-height: 0.98;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
    }}

    .hero-title span {{ color: var(--amber); }}

    .hero-desc {{
      font-size: 19px;
      color: var(--text-body);
      font-style: italic;
      line-height: 1.5;
      max-width: 9.2in;
    }}

    .metric-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.22in;
    }}

    .metric-chip {{
      background: #FFFFFF;
      border: 1.5px solid var(--border-subtle);
      border-radius: 12px;
      padding: 0.22in 0.24in;
      display: flex;
      align-items: center;
      gap: 18px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.03);
    }}

    .metric-icon-wrap {{
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: var(--peach);
      border: 1px solid var(--peach-border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--amber-dark);
      flex-shrink: 0;
    }}

    .metric-val {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 30px;
      font-weight: 800;
      color: var(--plum);
      line-height: 1.1;
    }}

    .metric-lbl {{
      font-size: 11.5px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-top: 5px;
    }}

    /* Bullet items */
    .bullet-item {{
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 14.5px;
      color: var(--text-dark);
      line-height: 1.45;
    }}

    .bullet-dot {{
      color: var(--amber);
      font-size: 18px;
      line-height: 1.2;
      flex-shrink: 0;
    }}
  </style>
</head>
<body>

  <!-- ========================================== -->
  <!-- SLIDE 1: Title & Hero Lockup              -->
  <!-- ========================================== -->
  <div class="slide" id="slide-1">
    <!-- Header -->
    <div class="slide-header">
      <div class="header-pills">
        <span class="pill pill-soft">IIIT Bhopal</span>
        <span class="pill pill-dark">CSE Minor Project</span>
        <span class="pill pill-soft">Group 104</span>
      </div>
      <div class="slide-num">01 / 08</div>
    </div>

    <!-- Main Body: Perfectly balanced vertical distribution -->
    <div class="slide-body" style="justify-content: space-between; padding: 0.15in 0;">
      <!-- Hero Top -->
      <div class="hero-lockup">
        <div>
          <div class="hero-badge">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--amber); display: inline-block;"></span>
            Autonomous Civic CAD System
          </div>
          <h1 class="hero-title">Community <span>Hero</span></h1>
          <p class="hero-desc">
            Autonomous Hyperlocal Civic Intelligence &amp; Emergency CAD Command Center with Zero-Typing Bilingual Voice Ingestion, 75m Spatial Clustering, and 3D Digital Twin Telemetry.
          </p>
        </div>

        <!-- IIIT Bhopal Crest Lockup -->
        <div style="display: flex; flex-direction: column; align-items: center; background: #FFFFFF; border: 1.5px solid var(--border-subtle); padding: 22px 28px; border-radius: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); min-width: 3.4in;">
          <img src="{b64_iiit_logo}" alt="IIIT Bhopal Crest" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 12px;">
          <div style="font-size: 14px; font-weight: 800; color: var(--plum); text-align: center; line-height: 1.3;">Indian Institute of Information Technology</div>
          <div style="font-size: 12.5px; font-weight: 600; color: var(--text-muted); text-align: center; margin-top: 4px;">Bhopal, Madhya Pradesh, India</div>
        </div>
      </div>

      <!-- 3 Symmetrical Presenter & Supervisor Cards (Proper Height & Fill) -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1.35fr; gap: 0.25in;">
        <!-- Presenter 1: Aarush Bharti -->
        <div class="clean-card" style="padding: 0.35in 0.35in; display: flex; flex-direction: column; justify-content: space-between; height: 2.45in;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-size: 11px; font-weight: 800; color: var(--amber-dark); font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">GROUP 104 • PRESENTER</div>
              <div style="font-size: 32px; font-weight: 800; color: var(--plum);">Aarush Bharti</div>
            </div>
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--peach); border: 1.5px solid var(--peach-border); display: flex; align-items: center; justify-content: center; color: var(--amber);">{SVG_USER}</div>
          </div>
          <div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 17px; color: var(--amber-dark); font-weight: 700;">Scholar No: 24U020010</div>
            <div style="font-size: 13.5px; color: var(--text-body); margin-top: 6px; font-weight: 600;">Department of Computer Science &amp; Engineering</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Indian Institute of Information Technology, Bhopal</div>
          </div>
        </div>

        <!-- Presenter 2: Ashish Goutam -->
        <div class="clean-card" style="padding: 0.35in 0.35in; display: flex; flex-direction: column; justify-content: space-between; height: 2.45in;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-size: 11px; font-weight: 800; color: var(--amber-dark); font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">GROUP 104 • PRESENTER</div>
              <div style="font-size: 32px; font-weight: 800; color: var(--plum);">Ashish Goutam</div>
            </div>
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--peach); border: 1.5px solid var(--peach-border); display: flex; align-items: center; justify-content: center; color: var(--amber);">{SVG_USER}</div>
          </div>
          <div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 17px; color: var(--amber-dark); font-weight: 700;">Scholar No: 24U020011</div>
            <div style="font-size: 13.5px; color: var(--text-body); margin-top: 6px; font-weight: 600;">Department of Computer Science &amp; Engineering</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Indian Institute of Information Technology, Bhopal</div>
          </div>
        </div>

        <!-- Supervisor: Dr. Sreemoyee Biswas -->
        <div class="clean-card" style="padding: 0.35in 0.35in; display: flex; flex-direction: column; justify-content: space-between; border-left: 6px solid var(--amber); height: 2.45in;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-size: 11px; font-weight: 800; color: var(--amber-dark); text-transform: uppercase; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; margin-bottom: 4px;">PROJECT SUPERVISOR</div>
              <div style="font-size: 32px; font-weight: 800; color: var(--plum);">Dr. Sreemoyee Biswas</div>
            </div>
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--peach); border: 1.5px solid var(--peach-border); display: flex; align-items: center; justify-content: center; color: var(--amber);">{SVG_GRAD}</div>
          </div>
          <div>
            <div style="font-size: 15px; color: var(--text-dark); font-weight: 700;">Assistant Professor, Department of CSE</div>
            <div style="font-size: 13.5px; color: var(--text-body); margin-top: 4px; font-weight: 600;">Faculty Mentor &amp; Research Advisor</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Indian Institute of Information Technology, Bhopal</div>
          </div>
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
          <div class="metric-icon-wrap">{SVG_LAYERS}</div>
          <div>
            <div class="metric-val">75m / 6h</div>
            <div class="metric-lbl">SPATIAL DEDUPLICATION</div>
          </div>
        </div>
        <div class="metric-chip">
          <div class="metric-icon-wrap">{SVG_LEAF}</div>
          <div>
            <div class="metric-val">42%</div>
            <div class="metric-lbl">FLEET WASTE REDUCTION</div>
          </div>
        </div>
        <div class="metric-chip">
          <div class="metric-icon-wrap">{SVG_WIFI_OFF}</div>
          <div>
            <div class="metric-val">100%</div>
            <div class="metric-lbl">ZERO-CLOUD OFFLINE FALLBACK</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="slide-footer">
      <div>IIIT Bhopal • Dept. of Computer Science &amp; Engineering • B.Tech Minor Project Defense</div>
      <div>Group 104 • Aarush Bharti &amp; Ashish Goutam</div>
    </div>
  </div>


  <!-- ========================================== -->
  <!-- SLIDE 2: Literature Review                -->
  <!-- ========================================== -->
  <div class="slide" id="slide-2">
    <!-- Header -->
    <div class="slide-header">
      <div class="header-pills">
        <span class="pill pill-soft">IIIT Bhopal</span>
        <span class="pill pill-dark">CSE Minor Project</span>
        <span class="pill pill-soft">Group 104</span>
      </div>
      <div class="slide-num">02 / 08</div>
    </div>

    <div class="title-block">
      <h2 class="slide-title">Literature Review: <span>How Civic Problems Are Reported Today</span></h2>
      <p class="slide-sub">A comparison of existing complaint systems and why they fail during emergencies.</p>
    </div>

    <!-- 2x2 Grid with Two-Column Architecture (Zero Blank Space) -->
    <div class="slide-body">
      <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 0.22in; flex: 1;">
        
        <!-- Card 1: Government Apps & Portals -->
        <div class="clean-card" style="display: flex; overflow: hidden; height: 100%;">
          <div style="width: 2.1in; background: var(--plum); color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 18px 14px; flex-shrink: 0;">
            <div style="color: #FCD34D; margin-bottom: 12px;">{SVG_GOV}</div>
            <div style="font-size: 18px; font-weight: 800; line-height: 1.25;">Government Apps &amp; Portals</div>
            <div style="font-size: 12px; color: #F3E4D6; margin-top: 8px; font-family: 'JetBrains Mono', monospace;">(e.g., CPGRAMS, Delhi 311)</div>
          </div>
          <div style="flex: 1; padding: 18px 24px; display: flex; flex-direction: column; justify-content: center; gap: 10px;">
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Citizens must fill long forms and click through multiple drop-down menus.</span></div>
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Takes 10 to 15 minutes to report a single issue.</span></div>
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Available mostly in English, making it hard for panicked or Hindi speakers.</span></div>
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Most citizens abandon the complaint before finishing.</span></div>
          </div>
        </div>

        <!-- Card 2: Standard Web Portals -->
        <div class="clean-card" style="display: flex; overflow: hidden; height: 100%;">
          <div style="width: 2.1in; background: var(--plum); color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 18px 14px; flex-shrink: 0;">
            <div style="color: #FCD34D; margin-bottom: 12px;">{SVG_WEB}</div>
            <div style="font-size: 18px; font-weight: 800; line-height: 1.25;">Standard Web Portals</div>
            <div style="font-size: 12px; color: #F3E4D6; margin-top: 8px; font-family: 'JetBrains Mono', monospace;">(e.g., Open311 Standard)</div>
          </div>
          <div style="flex: 1; padding: 18px 24px; display: flex; flex-direction: column; justify-content: center; gap: 10px;">
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Good digital system for organizing city complaints into a database.</span></div>
            <div class="bullet-item"><span class="bullet-dot">•</span><span>No voice option — users still have to type everything by hand.</span></div>
            <div class="bullet-item"><span class="bullet-dot">•</span><span>If 20 people report the same pothole, it creates 20 separate complaints.</span></div>
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Wastes municipal staff time manually finding duplicate reports.</span></div>
          </div>
        </div>

        <!-- Card 3: Emergency Call Centers -->
        <div class="clean-card" style="display: flex; overflow: hidden; height: 100%;">
          <div style="width: 2.1in; background: var(--plum); color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 18px 14px; flex-shrink: 0;">
            <div style="color: #FCD34D; margin-bottom: 12px;">{SVG_PHONE}</div>
            <div style="font-size: 18px; font-weight: 800; line-height: 1.25;">Emergency Call Centers</div>
            <div style="font-size: 12px; color: #F3E4D6; margin-top: 8px; font-family: 'JetBrains Mono', monospace;">(e.g., 112 India, 911 US)</div>
          </div>
          <div style="flex: 1; padding: 18px 24px; display: flex; flex-direction: column; justify-content: center; gap: 10px;">
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Fast because citizens talk directly to a human operator.</span></div>
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Phone lines quickly get overloaded during storms, fires, or big accidents.</span></div>
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Very expensive for governments to hire and maintain 24/7 call staff.</span></div>
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Panicked callers are often kept on hold for 10+ minutes.</span></div>
          </div>
        </div>

        <!-- Card 4: Standard AI Voice Bots -->
        <div class="clean-card" style="display: flex; overflow: hidden; height: 100%;">
          <div style="width: 2.1in; background: var(--plum); color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 18px 14px; flex-shrink: 0;">
            <div style="color: #FCD34D; margin-bottom: 12px;">{SVG_BOT}</div>
            <div style="font-size: 18px; font-weight: 800; line-height: 1.25;">Standard AI Voice Bots</div>
            <div style="font-size: 12px; color: #F3E4D6; margin-top: 8px; font-family: 'JetBrains Mono', monospace;">(e.g., Generic Voice Chatbots)</div>
          </div>
          <div style="flex: 1; padding: 18px 24px; display: flex; flex-direction: column; justify-content: center; gap: 10px;">
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Can understand spoken sentences and talk back.</span></div>
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Frequently make mistakes or guess incorrectly about danger levels.</span></div>
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Too slow for emergencies (takes 3 to 5 seconds to respond).</span></div>
            <div class="bullet-item"><span class="bullet-dot">•</span><span>Cannot safely verify exact street locations on a live map.</span></div>
          </div>
        </div>

      </div>

      <!-- Bottom Quote Banner -->
      <div class="quote-banner">
        <div class="quote-badge">
          {SVG_TARGET}
          <span>What Is Missing Today:</span>
        </div>
        <div class="quote-text">
          &ldquo;There is no system where a citizen can simply <strong style="color: var(--amber-dark);">speak naturally in Hindi or English</strong>, have the AI record the emergency in <strong style="color: var(--amber-dark);">under 1 second</strong>, and automatically <strong style="color: var(--amber-dark);">stop duplicate repair trucks</strong> from being sent to the exact same spot.&rdquo;
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="slide-footer">
      <div>Slide 02 / 08 • Literature Review &amp; Background</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </div>


  <!-- ========================================== -->
  <!-- SLIDE 3: Problem Statement                -->
  <!-- ========================================== -->
  <div class="slide" id="slide-3">
    <!-- Header -->
    <div class="slide-header">
      <div class="header-pills">
        <span class="pill pill-soft">IIIT Bhopal</span>
        <span class="pill pill-dark">CSE Minor Project</span>
        <span class="pill pill-soft">Group 104</span>
      </div>
      <div class="slide-num">03 / 08</div>
    </div>

    <div class="title-block">
      <h2 class="slide-title">Problem Statement: <span>3 Core Breakdowns in City Problem Resolution</span></h2>
      <p class="slide-sub">Why current grievance systems fail citizens, workers, and city administrators.</p>
    </div>

    <div class="slide-body">
      <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 0.25in; flex: 1;">
        
        <!-- Left: 3 Stacked Problem Cards -->
        <div style="display: flex; flex-direction: column; gap: 0.16in;">
          <!-- Problem 01 -->
          <div class="clean-card" style="display: flex; overflow: hidden; flex: 1;">
            <div style="width: 1.85in; background: var(--plum); color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 12px 10px; flex-shrink: 0;">
              <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: #FCD34D; margin-bottom: 6px;">01</div>
              <div style="color: #FCD34D; margin-bottom: 6px;">{SVG_DOC_WARN}</div>
              <div style="font-size: 15px; font-weight: 800; line-height: 1.25;">High Reporting Friction</div>
              <div style="font-size: 11.5px; color: #F3E4D6; margin-top: 2px;">(Citizen)</div>
            </div>
            <div style="flex: 1; padding: 14px 20px; display: flex; flex-direction: column; justify-content: space-between;">
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div class="bullet-item"><span class="bullet-dot">•</span><span>Issues seen daily but often not reported</span></div>
                <div class="bullet-item"><span class="bullet-dot">•</span><span>Long forms &amp; manual ward selection</span></div>
                <div class="bullet-item"><span class="bullet-dot">•</span><span>No quick photo + auto GPS</span></div>
              </div>
              <div style="display: inline-flex; align-items: center; gap: 8px; background: #FFF4E5; border: 1px solid #FCD34D; border-radius: 6px; padding: 4px 12px; margin-top: 6px; align-self: flex-start;">
                <span style="color: var(--amber-dark);">{SVG_CHART}</span>
                <span style="font-size: 13px; font-weight: 800; color: var(--amber-dark);">Result: &gt;70% issues unreported</span>
              </div>
            </div>
          </div>

          <!-- Problem 02 -->
          <div class="clean-card" style="display: flex; overflow: hidden; flex: 1;">
            <div style="width: 1.85in; background: var(--plum); color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 12px 10px; flex-shrink: 0;">
              <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: #FCD34D; margin-bottom: 6px;">02</div>
              <div style="color: #FCD34D; margin-bottom: 6px;">{SVG_TRUCK}</div>
              <div style="font-size: 15px; font-weight: 800; line-height: 1.25;">Duplicate Complaints &amp; Waste</div>
              <div style="font-size: 11.5px; color: #F3E4D6; margin-top: 2px;">(Municipal)</div>
            </div>
            <div style="flex: 1; padding: 14px 20px; display: flex; flex-direction: column; justify-content: space-between;">
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div class="bullet-item"><span class="bullet-dot">•</span><span>20–30 people report the same issue</span></div>
                <div class="bullet-item"><span class="bullet-dot">•</span><span>30 tickets for one spot</span></div>
                <div class="bullet-item"><span class="bullet-dot">•</span><span>Multiple trucks sent to the same location</span></div>
              </div>
              <div style="display: inline-flex; align-items: center; gap: 8px; background: #FFF4E5; border: 1px solid #FCD34D; border-radius: 6px; padding: 4px 12px; margin-top: 6px; align-self: flex-start;">
                <span style="color: var(--amber-dark);">{SVG_TRUCK}</span>
                <span style="font-size: 13px; font-weight: 800; color: var(--amber-dark);">Result: Up to 40% fuel &amp; time wasted</span>
              </div>
            </div>
          </div>

          <!-- Problem 03 -->
          <div class="clean-card" style="display: flex; overflow: hidden; flex: 1;">
            <div style="width: 1.85in; background: var(--plum); color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 12px 10px; flex-shrink: 0;">
              <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: #FCD34D; margin-bottom: 6px;">03</div>
              <div style="color: #FCD34D; margin-bottom: 6px;">{SVG_STAMP}</div>
              <div style="font-size: 15px; font-weight: 800; line-height: 1.25;">The &ldquo;Black Hole&rdquo; &amp; Fakes</div>
              <div style="font-size: 11.5px; color: #F3E4D6; margin-top: 2px;">(Accountability)</div>
            </div>
            <div style="flex: 1; padding: 14px 20px; display: flex; flex-direction: column; justify-content: space-between;">
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div class="bullet-item"><span class="bullet-dot">•</span><span>No live updates or map tracking</span></div>
                <div class="bullet-item"><span class="bullet-dot">•</span><span>Tickets sit in long queues</span></div>
                <div class="bullet-item"><span class="bullet-dot">•</span><span>Often marked &ldquo;Fixed&rdquo; without proof</span></div>
              </div>
              <div style="display: inline-flex; align-items: center; gap: 8px; background: #FFF4E5; border: 1px solid #FCD34D; border-radius: 6px; padding: 4px 12px; margin-top: 6px; align-self: flex-start;">
                <span style="color: var(--amber-dark);">{SVG_ALERT}</span>
                <span style="font-size: 13px; font-weight: 800; color: var(--amber-dark);">Result: Citizens lose trust</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: How Current Reporting Breaks Down Flowchart -->
        <div class="clean-card" style="padding: 0.25in; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px; background: var(--plum); color: #FFFFFF; padding: 10px 18px; border-radius: 20px; align-self: flex-start; font-size: 14px; font-weight: 700;">
            {SVG_FLOW}
            <span>How Current Reporting Breaks Down</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-around; flex: 1; padding: 0.15in 0;">
            <!-- Box 1 -->
            <div style="background: var(--plum); color: #FFFFFF; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 14.5px; text-align: center; width: 90%;">
              ⚠️ Civic Problem Happens (Pothole, Garbage, or Water Leak)
            </div>
            
            <div style="color: var(--plum); font-size: 20px; line-height: 1;">↓</div>

            <!-- Box 2 -->
            <div style="background: #F4EBE2; border: 1.5px solid #E5D5C5; padding: 10px 24px; border-radius: 20px; font-weight: 800; font-size: 14.5px; text-align: center;">
              👤 Citizen Tries to Report
            </div>

            <div style="color: var(--plum); font-size: 20px; line-height: 1;">↓</div>

            <!-- Two Branches -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.2in; width: 100%;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <div style="background: #FFFFFF; border: 1.5px solid var(--border-subtle); padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; text-align: center; width: 100%;">
                  💻 Type details &amp; fill forms
                </div>
                <div style="color: #DC2626; font-size: 18px; line-height: 1;">↓</div>
                <div style="background: #FEE2E2; border: 1.5px solid #FCA5A5; color: #991B1B; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 800; text-align: center; width: 100%;">
                  ✕ &gt;70% give up<br><span style="font-size: 11px; font-weight: 600;">(Unreported)</span>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <div style="background: #FFFFFF; border: 1.5px solid var(--border-subtle); padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; text-align: center; width: 100%;">
                  👥 Multiple people report same spot
                </div>
                <div style="color: #DC2626; font-size: 18px; line-height: 1;">↓</div>
                <div style="background: #FEE2E2; border: 1.5px solid #FCA5A5; color: #991B1B; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 800; text-align: center; width: 100%;">
                  ✕ Multiple trucks sent<br><span style="font-size: 11px; font-weight: 600;">(≈40% resources wasted)</span>
                </div>
              </div>
            </div>

            <div style="color: var(--plum); font-size: 20px; line-height: 1;">↓</div>

            <!-- Box 5 -->
            <div style="background: var(--plum); color: #FFFFFF; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 14.5px; text-align: center; width: 90%;">
              🎯 Result: Delay, waste &amp; loss of public trust
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Quote Banner -->
      <div class="quote-banner">
        <div class="quote-badge">
          {SVG_TARGET}
          <span>The Big Problem:</span>
        </div>
        <div class="quote-text">
          &ldquo;Reporting takes <strong style="color: var(--amber-dark);">too much effort</strong>, trucks get wasted on duplicate reports, and citizens <strong style="color: var(--amber-dark);">never know if it actually got fixed.</strong>&rdquo;
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="slide-footer">
      <div>Slide 03 / 08 • Problem Statement</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </div>


  <!-- ========================================== -->
  <!-- SLIDE 4: Proposed Methodology             -->
  <!-- ========================================== -->
  <div class="slide" id="slide-4">
    <!-- Header -->
    <div class="slide-header">
      <div class="header-pills">
        <span class="pill pill-soft">IIIT Bhopal</span>
        <span class="pill pill-dark">CSE Minor Project</span>
        <span class="pill pill-soft">Group 104</span>
      </div>
      <div class="slide-num">04 / 08</div>
    </div>

    <div class="title-block">
      <h2 class="slide-title">Proposed Methodology: <span>The 4-Step Community Hero Solution</span></h2>
      <p class="slide-sub">A closed-loop system for easy reporting, smart grouping, and verified city repairs.</p>
    </div>

    <div class="slide-body">
      <!-- 4 Vertical Cards across -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.22in; flex: 1;">
        
        <!-- Card 1: Multi-Channel Easy Reporting -->
        <div class="clean-card" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
          <div style="background: var(--plum); color: #FFFFFF; padding: 10px 14px; font-weight: 800; font-size: 14px; display: flex; align-items: center; gap: 8px;">
            <span style="background: rgba(255,255,255,0.2); border-radius: 4px; padding: 2px 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #FCD34D;">01</span>
            Multi-Channel Easy Reporting
          </div>
          <div style="flex: 1; padding: 14px; display: flex; flex-direction: column; align-items: center; justify-content: space-around;">
            <img src="{b64_s4_phone}" alt="Mobile Report" style="height: 2.15in; object-fit: contain; border-radius: 8px;">
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-top: 10px;">
              <div style="display: flex; align-items: center; gap: 8px; background: #F8F5F2; padding: 6px 12px; border-radius: 6px; font-size: 12.5px; font-weight: 700; color: var(--text-dark);">
                <span style="color: var(--amber);">{SVG_CAMERA}</span> 1-Click Photo
              </div>
              <div style="display: flex; align-items: center; gap: 8px; background: #F8F5F2; padding: 6px 12px; border-radius: 6px; font-size: 12.5px; font-weight: 700; color: var(--text-dark);">
                <span style="color: var(--amber);">{SVG_PIN}</span> Auto GPS
              </div>
              <div style="display: flex; align-items: center; gap: 8px; background: #F8F5F2; padding: 6px 12px; border-radius: 6px; font-size: 12.5px; font-weight: 700; color: var(--text-dark);">
                <span style="color: var(--amber);">{SVG_MIC}</span> Voice / Call (Hindi / English)
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: AI Categorization & Severity Scoring -->
        <div class="clean-card" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
          <div style="background: var(--plum); color: #FFFFFF; padding: 10px 14px; font-weight: 800; font-size: 14px; display: flex; align-items: center; gap: 8px;">
            <span style="background: rgba(255,255,255,0.2); border-radius: 4px; padding: 2px 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #FCD34D;">02</span>
            AI Categorization &amp; Severity
          </div>
          <div style="flex: 1; padding: 14px; display: flex; flex-direction: column; align-items: center; justify-content: space-around;">
            <img src="{b64_s4_ai}" alt="AI Categorization" style="height: 2.15in; object-fit: contain; border-radius: 8px;">
            <div style="background: #FFF4E5; border: 1.5px solid #FCD34D; border-radius: 8px; padding: 10px 14px; text-align: center; width: 100%; margin-top: 10px;">
              <div style="font-size: 13.5px; font-weight: 800; color: var(--amber-dark);">⚠️ Severity Score: 1 – 10</div>
              <div style="font-size: 11.5px; font-weight: 600; color: var(--text-body); margin-top: 2px;">(High-risk &rarr; Instant Action)</div>
            </div>
          </div>
        </div>

        <!-- Card 3: 75-Meter Spatial Deduplication -->
        <div class="clean-card" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
          <div style="background: var(--plum); color: #FFFFFF; padding: 10px 14px; font-weight: 800; font-size: 14px; display: flex; align-items: center; gap: 8px;">
            <span style="background: rgba(255,255,255,0.2); border-radius: 4px; padding: 2px 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #FCD34D;">03</span>
            75-Meter Spatial Deduplication
          </div>
          <div style="flex: 1; padding: 14px; display: flex; flex-direction: column; align-items: center; justify-content: space-around;">
            <img src="{b64_s4_map}" alt="75m Spatial Deduplication" style="max-width: 100%; height: auto; max-height: 2.1in; object-fit: contain; border-radius: 8px;">
            <div style="background: #F8F5F2; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 10px 14px; text-align: center; width: 100%; margin-top: 10px;">
              <div style="font-size: 13px; font-weight: 800; color: var(--plum);">Merge duplicate reports within 75 meters</div>
              <div style="font-size: 11.5px; font-weight: 600; color: #059669; margin-top: 2px;">(Saves fuel, budget &amp; time)</div>
            </div>
          </div>
        </div>

        <!-- Card 4: Live Map Dispatch & Photo Proof-of-Work -->
        <div class="clean-card" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
          <div style="background: var(--plum); color: #FFFFFF; padding: 10px 14px; font-weight: 800; font-size: 14px; display: flex; align-items: center; gap: 8px;">
            <span style="background: rgba(255,255,255,0.2); border-radius: 4px; padding: 2px 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #FCD34D;">04</span>
            Live Map &amp; Photo Proof
          </div>
          <div style="flex: 1; padding: 14px; display: flex; flex-direction: column; align-items: center; justify-content: space-around;">
            <img src="{b64_s4_laptop}" alt="Live Map & Proof" style="max-width: 100%; height: auto; max-height: 2.1in; object-fit: contain; border-radius: 8px;">
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-top: 10px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--text-dark);">
                <span style="color: var(--amber);">{SVG_PIN}</span> Live map &amp; repair tracking
              </div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--text-dark);">
                <span style="color: var(--amber);">{SVG_CAMERA}</span> Photo proof-of-work (After photo)
              </div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--text-dark);">
                <span style="color: var(--amber);">{SVG_TROPHY}</span> Citizen rewards (Civic XP &amp; badges)
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Step Sequence Ribbon -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.18in; margin-top: 0.16in;">
        <div style="background: var(--card-white); border: 1.5px solid var(--border-subtle); border-radius: 8px; padding: 8px 12px; text-align: center;">
          <div style="font-size: 12.5px; font-weight: 800; color: var(--plum);">Step 1: Report</div>
          <div style="font-size: 11px; color: var(--text-muted);">(Photo + GPS + Voice)</div>
        </div>
        <div style="background: var(--card-white); border: 1.5px solid var(--border-subtle); border-radius: 8px; padding: 8px 12px; text-align: center;">
          <div style="font-size: 12.5px; font-weight: 800; color: var(--plum);">Step 2: Classify &amp; Score</div>
          <div style="font-size: 11px; color: var(--text-muted);">(Department + 1–10)</div>
        </div>
        <div style="background: var(--card-white); border: 1.5px solid var(--border-subtle); border-radius: 8px; padding: 8px 12px; text-align: center;">
          <div style="font-size: 12.5px; font-weight: 800; color: var(--plum);">Step 3: Dedup (75m)</div>
          <div style="font-size: 11px; color: var(--text-muted);">(Merge &amp; Upvote)</div>
        </div>
        <div style="background: var(--card-white); border: 1.5px solid var(--border-subtle); border-radius: 8px; padding: 8px 12px; text-align: center;">
          <div style="font-size: 12.5px; font-weight: 800; color: var(--plum);">Step 4: Dispatch &amp; Verify</div>
          <div style="font-size: 11px; color: var(--text-muted);">(Live Map + Proof + Reward)</div>
        </div>
      </div>

      <!-- Bottom Quote Banner -->
      <div class="quote-banner">
        <div class="quote-badge">
          {SVG_TARGET}
          <span>Key Takeaway:</span>
        </div>
        <div class="quote-text">
          &ldquo;Community Hero makes <strong style="color: var(--amber-dark);">reporting effortless</strong>, removes duplicate complaints <strong style="color: var(--amber-dark);">within 75 meters</strong>, and ensures accountability with <strong style="color: var(--amber-dark);">photo proof-of-work</strong>.&rdquo;
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="slide-footer">
      <div>Slide 04 / 08 • Proposed Methodology</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </div>


  <!-- ========================================== -->
  <!-- SLIDE 5: System Diagram & Operational Flow -->
  <!-- ========================================== -->
  <div class="slide" id="slide-5">
    <!-- Header -->
    <div class="slide-header">
      <div class="header-pills">
        <span class="pill pill-soft">IIIT Bhopal</span>
        <span class="pill pill-dark">CSE Minor Project</span>
        <span class="pill pill-soft">Group 104</span>
      </div>
      <div class="slide-num">05 / 08</div>
    </div>

    <div class="title-block" style="margin-bottom: 0.12in;">
      <h2 class="slide-title">System Diagram &amp; <span>Operational Flowchart</span></h2>
      <p class="slide-sub">The step-by-step journey from citizen problem detection to city repair and verification.</p>
    </div>

    <!-- 3 Full-Height Columns Expanding to Footer (No Quote Banner, 100% Filled) -->
    <div class="slide-body" style="height: calc(100% - 1.1in);">
      <div style="display: grid; grid-template-columns: 1.1fr 1.6fr 1.1fr; gap: 0.22in; height: 100%;">
        
        <!-- Left Column: Workflow Steps 01 to 06 -->
        <div style="display: flex; flex-direction: column; gap: 0.1in; height: 100%;">
          <div style="background: var(--plum); color: #FFFFFF; padding: 10px 16px; border-radius: 20px; font-weight: 800; font-size: 14.5px; display: flex; align-items: center; gap: 8px;">
            {SVG_LAYERS}
            <span>Workflow Steps</span>
          </div>

          <!-- Step 01 -->
          <div class="clean-card" style="padding: 10px 14px; display: flex; align-items: center; gap: 12px; flex: 1;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_CAMERA}
            </div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--plum);">01 Citizen Report</div>
              <div style="font-size: 12px; color: var(--text-body); margin-top: 2px;">Photo (auto-GPS) or voice call.</div>
            </div>
          </div>

          <!-- Step 02 -->
          <div class="clean-card" style="padding: 10px 14px; display: flex; align-items: center; gap: 12px; flex: 1;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_CPU}
            </div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--plum);">02 AI Categorization</div>
              <div style="font-size: 12px; color: var(--text-body); margin-top: 2px;">Identify issue + urgency rating.</div>
            </div>
          </div>

          <!-- Step 03 -->
          <div class="clean-card" style="padding: 10px 14px; display: flex; align-items: center; gap: 12px; flex: 1;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_PIN}
            </div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--plum);">03 75-Meter Decision</div>
              <div style="font-size: 12px; color: var(--text-body); margin-top: 2px;">Within 75 m &rarr; Merge &amp; upvote. Else &rarr; Create new ticket.</div>
            </div>
          </div>

          <!-- Step 04 -->
          <div class="clean-card" style="padding: 10px 14px; display: flex; align-items: center; gap: 12px; flex: 1;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_MONITOR}
            </div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--plum);">04 Operations Room</div>
              <div style="font-size: 12px; color: var(--text-body); margin-top: 2px;">See on live map &amp; dispatch team.</div>
            </div>
          </div>

          <!-- Step 05 -->
          <div class="clean-card" style="padding: 10px 14px; display: flex; align-items: center; gap: 12px; flex: 1;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_WORKER}
            </div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--plum);">05 Field Repair &amp; Proof</div>
              <div style="font-size: 12px; color: var(--text-body); margin-top: 2px;">Fix issue and upload 'AFTER' photo.</div>
            </div>
          </div>

          <!-- Step 06 -->
          <div class="clean-card" style="padding: 10px 14px; display: flex; align-items: center; gap: 12px; flex: 1;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_TROPHY}
            </div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--plum);">06 Closed-Loop Reward</div>
              <div style="font-size: 12px; color: var(--text-body); margin-top: 2px;">Pin turns green, notify citizen &amp; award Civic XP.</div>
            </div>
          </div>
        </div>

        <!-- Middle Column: Dark Command Console Operational Flowchart -->
        <div style="background: #11141E; border-radius: 14px; padding: 18px 22px; color: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-shadow: 0 8px 24px rgba(0,0,0,0.18);">
          
          <!-- Node 1 -->
          <div style="background: #232936; border: 1px solid #374151; border-radius: 8px; padding: 10px 16px; text-align: center;">
            <div style="font-size: 13.5px; font-weight: 800; color: #FCD34D;">Step 1: Citizen Ingestion</div>
            <div style="font-size: 11.5px; color: #D1D5DB; margin-top: 2px;">&bull; Photo Upload with Auto-GPS or Spoken Voice Report</div>
          </div>

          <div style="color: #9CA3AF; text-align: center; font-size: 16px; line-height: 1;">&darr;</div>

          <!-- Node 2 -->
          <div style="background: #232936; border: 1px solid #374151; border-radius: 8px; padding: 10px 16px; text-align: center;">
            <div style="font-size: 13.5px; font-weight: 800; color: #FCD34D;">Step 2: AI Categorization</div>
            <div style="font-size: 11.5px; color: #D1D5DB; margin-top: 2px;">&bull; Auto Category: Road, Waste, Water &bull; Urgency Score: 1 to 10</div>
          </div>

          <div style="color: #9CA3AF; text-align: center; font-size: 16px; line-height: 1;">&darr;</div>

          <!-- Decision Diamond Box -->
          <div style="background: #2D2418; border: 2px solid #F59E0B; border-radius: 10px; padding: 10px 14px; text-align: center;">
            <div style="font-size: 13px; font-weight: 800; color: #FCD34D;">Decision: Is there an existing report within 75 meters?</div>
          </div>

          <!-- Decision Branches -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.15in; margin: 4px 0;">
            <div style="background: #132E24; border: 1px solid #10B981; border-radius: 8px; padding: 8px 10px; text-align: center;">
              <div style="font-size: 11.5px; font-weight: 800; color: #34D399;">YES (Within 75m)</div>
              <div style="font-size: 11px; font-weight: 700; color: #FFFFFF; margin-top: 3px;">Outcome A: Merge Master</div>
              <div style="font-size: 10px; color: #A7F3D0; margin-top: 2px;">&bull; Add upvote &bull; STOPS duplicate truck dispatches</div>
            </div>
            <div style="background: #1E293B; border: 1px solid #3B82F6; border-radius: 8px; padding: 8px 10px; text-align: center;">
              <div style="font-size: 11.5px; font-weight: 800; color: #60A5FA;">NO (New Area)</div>
              <div style="font-size: 11px; font-weight: 700; color: #FFFFFF; margin-top: 3px;">Outcome B: Create Ticket</div>
              <div style="font-size: 10px; color: #BFDBFE; margin-top: 2px;">&bull; Assigns ID &bull; Starts SLA Countdown Timer</div>
            </div>
          </div>

          <div style="color: #9CA3AF; text-align: center; font-size: 16px; line-height: 1;">&darr;</div>

          <!-- Node 3 -->
          <div style="background: #232936; border: 1px solid #374151; border-radius: 8px; padding: 10px 16px; text-align: center;">
            <div style="font-size: 13.5px; font-weight: 800; color: #FCD34D;">Step 3: Municipal Operations Room</div>
            <div style="font-size: 11.5px; color: #D1D5DB; margin-top: 2px;">&bull; Shows on Live 3D/2D Map &bull; Dispatches Nearest Field Crew</div>
          </div>

          <div style="color: #9CA3AF; text-align: center; font-size: 16px; line-height: 1;">&darr;</div>

          <!-- Node 4 & 5 -->
          <div style="background: #232936; border: 1px solid #374151; border-radius: 8px; padding: 10px 16px; text-align: center;">
            <div style="font-size: 13.5px; font-weight: 800; color: #34D399;">Step 4 &amp; 5: Field Repair Proof &rarr; Map Pin Turns GREEN</div>
            <div style="font-size: 11.5px; color: #D1D5DB; margin-top: 2px;">&bull; Crew uploads 'AFTER' photo &bull; Citizen gets notification &amp; Civic XP</div>
          </div>

          <div style="font-size: 10.5px; color: #9CA3AF; text-align: center; font-family: 'JetBrains Mono', monospace; border-top: 1px solid #232936; padding-top: 8px; margin-top: 4px;">
            Figure 5.1: Community Hero End-to-End Workflow &amp; Spatial Deduplication Logic
          </div>
        </div>

        <!-- Right Column: Key Properties -->
        <div style="display: flex; flex-direction: column; gap: 0.12in; height: 100%;">
          <div style="background: var(--plum); color: #FFFFFF; padding: 10px 16px; border-radius: 20px; font-weight: 800; font-size: 14.5px; display: flex; align-items: center; gap: 8px;">
            {SVG_TARGET}
            <span>Key Properties</span>
          </div>

          <!-- Property 1 -->
          <div class="clean-card" style="padding: 18px 16px; display: flex; align-items: center; gap: 16px; flex: 1;">
            <div style="width: 46px; height: 46px; border-radius: 50%; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_PIN}
            </div>
            <div>
              <div style="font-size: 16px; font-weight: 800; color: var(--plum);">75-Meter Radius</div>
              <div style="font-size: 13px; color: var(--text-body); margin-top: 4px; line-height: 1.35;">Merges nearby reports (within walking distance).</div>
            </div>
          </div>

          <!-- Property 2 -->
          <div class="clean-card" style="padding: 18px 16px; display: flex; align-items: center; gap: 16px; flex: 1;">
            <div style="width: 46px; height: 46px; border-radius: 50%; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_BOLT}
            </div>
            <div>
              <div style="font-size: 16px; font-weight: 800; color: var(--plum);">Under 4ms Speed</div>
              <div style="font-size: 13px; color: var(--text-body); margin-top: 4px; line-height: 1.35;">Checks for duplicates almost instantly.</div>
            </div>
          </div>

          <!-- Property 3 -->
          <div class="clean-card" style="padding: 18px 16px; display: flex; align-items: center; gap: 16px; flex: 1;">
            <div style="width: 46px; height: 46px; border-radius: 50%; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_CLOCK}
            </div>
            <div>
              <div style="font-size: 16px; font-weight: 800; color: var(--plum);">6-Hour Time Window</div>
              <div style="font-size: 13px; color: var(--text-body); margin-top: 4px; line-height: 1.35;">Connects repeated calls for the same event during the day.</div>
            </div>
          </div>

          <!-- Property 4 -->
          <div class="clean-card" style="padding: 18px 16px; display: flex; align-items: center; gap: 16px; flex: 1;">
            <div style="width: 46px; height: 46px; border-radius: 50%; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_SHIELD}
            </div>
            <div>
              <div style="font-size: 16px; font-weight: 800; color: var(--plum);">Guaranteed Proof</div>
              <div style="font-size: 13px; color: var(--text-body); margin-top: 4px; line-height: 1.35;">No ticket can be closed without an 'AFTER' repair photo.</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Footer -->
    <div class="slide-footer">
      <div>Slide 05 / 08 • System Diagram / Flowchart</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </div>


  <!-- ========================================== -->
  <!-- SLIDE 6: System Implementation            -->
  <!-- ========================================== -->
  <div class="slide" id="slide-6">
    <!-- Header -->
    <div class="slide-header">
      <div class="header-pills">
        <span class="pill pill-soft">IIIT Bhopal</span>
        <span class="pill pill-dark">CSE Minor Project</span>
        <span class="pill pill-soft">Group 104</span>
      </div>
      <div class="slide-num">06 / 08</div>
    </div>

    <div class="title-block">
      <h2 class="slide-title">System Implementation: <span>Working Platform &amp; Technology Stack</span></h2>
      <p class="slide-sub">A live demonstration of our working 3D geospatial engine, voice emergency cockpit, and municipal backend.</p>
    </div>

    <div class="slide-body">
      <div style="display: grid; grid-template-columns: 1fr 1.15fr; gap: 0.25in; flex: 1;">
        
        <!-- Left: Two High-Res Screenshots in Sleek Dark Frames -->
        <div style="display: flex; flex-direction: column; gap: 0.16in;">
          <!-- Screenshot 1: Voice Cockpit -->
          <div style="background: #11141E; border-radius: 12px; overflow: hidden; border: 1.5px solid #232936; box-shadow: 0 4px 16px rgba(0,0,0,0.15); flex: 1; display: flex; flex-direction: column;">
            <img src="{b64_voice_cockpit}" alt="Voice CAD Cockpit" style="width: 100%; height: 2.3in; object-fit: cover;">
            <div style="background: var(--plum); color: #FFFFFF; font-size: 12px; font-weight: 800; padding: 6px 14px; text-align: center;">
              🎙️ Live CAD Voice Cockpit &amp; Emergency Work Orders
            </div>
          </div>

          <!-- Screenshot 2: 3D Globe Command Center -->
          <div style="background: #11141E; border-radius: 12px; overflow: hidden; border: 1.5px solid #232936; box-shadow: 0 4px 16px rgba(0,0,0,0.15); flex: 1; display: flex; flex-direction: column;">
            <img src="{b64_globe}" alt="3D Digital Twin Map" style="width: 100%; height: 2.3in; object-fit: cover;">
            <div style="background: var(--plum); color: #FFFFFF; font-size: 12px; font-weight: 800; padding: 6px 14px; text-align: center;">
              🌐 3D Digital Twin City Command Center
            </div>
          </div>
        </div>

        <!-- Right: 4 Structured Module Cards with Tech Tags -->
        <div style="display: flex; flex-direction: column; gap: 0.14in;">
          <div style="background: var(--plum); color: #FFFFFF; padding: 10px 18px; border-radius: 20px; font-weight: 800; font-size: 14.5px; display: flex; align-items: center; gap: 8px;">
            {SVG_LAYERS}
            <span>System Modules &amp; Technology</span>
          </div>

          <!-- Module 1 -->
          <div class="clean-card" style="padding: 14px 18px; display: flex; align-items: center; gap: 16px; flex: 1;">
            <div style="width: 48px; height: 48px; border-radius: 10px; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_MONITOR}
            </div>
            <div style="flex: 1;">
              <div style="font-size: 16px; font-weight: 800; color: var(--plum);">Frontend &amp; 3D Map Interface</div>
              <div style="font-size: 13px; color: var(--text-dark); margin-top: 4px;">&bull; React 18, Vite, Tailwind (fast UI)</div>
              <div style="font-size: 13px; color: var(--text-dark); margin-top: 2px;">&bull; Three.js 3D map + Leaflet 2D map</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <span style="background: #E0F2FE; color: #0284C7; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-align: center;">React 18</span>
              <span style="background: #E0F2FE; color: #0284C7; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-align: center;">Three.js</span>
            </div>
          </div>

          <!-- Module 2 -->
          <div class="clean-card" style="padding: 14px 18px; display: flex; align-items: center; gap: 16px; flex: 1;">
            <div style="width: 48px; height: 48px; border-radius: 10px; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_MIC}
            </div>
            <div style="flex: 1;">
              <div style="font-size: 16px; font-weight: 800; color: var(--plum);">Multimodal Citizen Reporting</div>
              <div style="font-size: 13px; color: var(--text-dark); margin-top: 4px;">&bull; 1-Click photo + auto address (reverse-geocoding)</div>
              <div style="font-size: 13px; color: var(--text-dark); margin-top: 2px;">&bull; Speech-to-text voice reporting</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <span style="background: #FEF3C7; color: #D97706; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-align: center;">Photo + GPS</span>
              <span style="background: #FEF3C7; color: #D97706; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-align: center;">Voice STT</span>
            </div>
          </div>

          <!-- Module 3 -->
          <div class="clean-card" style="padding: 14px 18px; display: flex; align-items: center; gap: 16px; flex: 1;">
            <div style="width: 48px; height: 48px; border-radius: 10px; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_DATABASE}
            </div>
            <div style="flex: 1;">
              <div style="font-size: 16px; font-weight: 800; color: var(--plum);">Backend Service &amp; Database</div>
              <div style="font-size: 13px; color: var(--text-dark); margin-top: 4px;">&bull; Node.js + Express.js REST API</div>
              <div style="font-size: 13px; color: var(--text-dark); margin-top: 2px;">&bull; SQLite (WAL) for fast, non-blocking access</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <span style="background: #DCFCE7; color: #16A34A; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-align: center;">Node.js</span>
              <span style="background: #DCFCE7; color: #16A34A; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-align: center;">SQLite (WAL)</span>
            </div>
          </div>

          <!-- Module 4 -->
          <div class="clean-card" style="padding: 14px 18px; display: flex; align-items: center; gap: 16px; flex: 1;">
            <div style="width: 48px; height: 48px; border-radius: 10px; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_WORKER}
            </div>
            <div style="flex: 1;">
              <div style="font-size: 16px; font-weight: 800; color: var(--plum);">Field Worker Verification &amp; Rewards</div>
              <div style="font-size: 13px; color: var(--text-dark); margin-top: 4px;">&bull; Mobile page for GPS-assigned tasks</div>
              <div style="font-size: 13px; color: var(--text-dark); margin-top: 2px;">&bull; Upload 'AFTER' photo to close + Civic XP rewards</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <span style="background: #F3E8FF; color: #9333EA; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-align: center;">Proof (After)</span>
              <span style="background: #F3E8FF; color: #9333EA; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-align: center;">Civic XP</span>
            </div>
          </div>

        </div>

      </div>

      <!-- Bottom Key Properties Ribbon -->
      <div style="display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 0.2in; margin-top: 0.16in;">
        <div class="clean-card" style="padding: 10px 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--amber);">{SVG_LAYERS}</div>
          <div>
            <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">LIVE WORKING STACK</div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: var(--plum);">React 18 + Three.js + Node.js + SQLite WAL</div>
          </div>
        </div>

        <div class="clean-card" style="padding: 10px 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--amber);">{SVG_BOLT}</div>
          <div>
            <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">EMERGENCY RESPONSE</div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; color: var(--plum);">&lt; 850ms Voice Ingestion</div>
          </div>
        </div>

        <div class="clean-card" style="padding: 10px 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--amber);">{SVG_WIFI_OFF}</div>
          <div>
            <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">100% OFFLINE FALLBACK</div>
            <div style="font-size: 13px; font-weight: 700; color: var(--plum);">Works without external cloud</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="slide-footer">
      <div>Slide 06 / 08 • System Implementation</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </div>


  <!-- ========================================== -->
  <!-- SLIDE 7: Results & Comparison             -->
  <!-- ========================================== -->
  <div class="slide" id="slide-7">
    <!-- Header -->
    <div class="slide-header">
      <div class="header-pills">
        <span class="pill pill-soft">IIIT Bhopal</span>
        <span class="pill pill-dark">CSE Minor Project</span>
        <span class="pill pill-soft">Group 104</span>
      </div>
      <div class="slide-num">07 / 08</div>
    </div>

    <div class="title-block">
      <h2 class="slide-title">Results, Comparison &amp; <span>Performance Analysis</span></h2>
      <p class="slide-sub">How Community Hero performs compared to traditional city complaint portals and emergency systems.</p>
    </div>

    <div class="slide-body">
      <div style="display: grid; grid-template-columns: 1fr 1.25fr; gap: 0.25in; flex: 1;">
        
        <!-- Left: Municipal Admin Console Screenshot + Key Results -->
        <div style="display: flex; flex-direction: column; gap: 0.16in;">
          <div style="background: #11141E; border-radius: 12px; overflow: hidden; border: 1.5px solid #232936; box-shadow: 0 4px 16px rgba(0,0,0,0.15); flex: 1; display: flex; flex-direction: column;">
            <img src="{b64_admin}" alt="Municipal Admin Console" style="width: 100%; height: 3.1in; object-fit: cover;">
            <div style="background: var(--plum); color: #FFFFFF; font-size: 13px; font-weight: 800; padding: 8px 16px; text-align: center;">
              💻 Live Municipal Admin &amp; Dispatch Console
            </div>
          </div>

          <!-- Key Results Row -->
          <div style="display: grid; grid-template-columns: 0.9fr 1fr 1fr 1fr 1fr; gap: 0.1in; align-items: center;">
            <div style="background: var(--plum); color: #FFFFFF; border-radius: 8px; padding: 10px 8px; text-align: center; font-weight: 800; font-size: 13px;">
              Key Results
            </div>
            <div class="clean-card" style="padding: 8px 6px; text-align: center;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 800; color: var(--plum);">&lt; 850ms</div>
              <div style="font-size: 10px; font-weight: 600; color: var(--text-muted); margin-top: 2px;">Voice &rarr; Ticket</div>
            </div>
            <div class="clean-card" style="padding: 8px 6px; text-align: center;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 800; color: #059669;">42%</div>
              <div style="font-size: 10px; font-weight: 600; color: var(--text-muted); margin-top: 2px;">Fuel Savings</div>
            </div>
            <div class="clean-card" style="padding: 8px 6px; text-align: center;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 800; color: var(--plum);">94.8%</div>
              <div style="font-size: 10px; font-weight: 600; color: var(--text-muted); margin-top: 2px;">Accuracy</div>
            </div>
            <div class="clean-card" style="padding: 8px 6px; text-align: center;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 800; color: #059669;">100%</div>
              <div style="font-size: 10px; font-weight: 600; color: var(--text-muted); margin-top: 2px;">Offline Mode</div>
            </div>
          </div>
        </div>

        <!-- Right: Comparison Table (5 rows x 4 columns) -->
        <div class="clean-card" style="overflow: hidden; display: flex; flex-direction: column;">
          <table style="width: 100%; height: 100%; border-collapse: collapse; text-align: left; font-size: 13.5px;">
            <thead>
              <tr style="background: var(--plum); color: #FFFFFF;">
                <th style="padding: 14px 18px; font-weight: 800; border-bottom: 2px solid var(--amber); width: 25%;">FEATURE</th>
                <th style="padding: 14px 16px; font-weight: 800; border-bottom: 2px solid var(--amber); width: 25%;">TRADITIONAL<br><span style="font-size: 11px; font-weight: 500; opacity: 0.85;">(CPGRAMS / 311)</span></th>
                <th style="padding: 14px 16px; font-weight: 800; border-bottom: 2px solid var(--amber); width: 25%;">EMERGENCY<br><span style="font-size: 11px; font-weight: 500; opacity: 0.85;">(112 / 911)</span></th>
                <th style="padding: 14px 16px; font-weight: 800; border-bottom: 2px solid var(--amber); width: 25%; background: var(--plum-light); color: #FCD34D;">COMMUNITY HERO<br><span style="font-size: 11px; font-weight: 500; color: #FFFFFF;">(OUR APP)</span></th>
              </tr>
            </thead>
            <tbody>
              <!-- Row 1 -->
              <tr style="border-bottom: 1px solid var(--border-subtle); background: #FFFFFF;">
                <td style="padding: 14px 18px; font-weight: 800; color: var(--plum); display: flex; align-items: center; gap: 8px;">
                  <span style="color: var(--amber);">{SVG_CAMERA}</span> Reporting Method
                </td>
                <td style="padding: 14px 16px; color: var(--text-body);">Long forms (5+ dropdowns)</td>
                <td style="padding: 14px 16px; color: var(--text-body);">Phone call (human only)</td>
                <td style="padding: 14px 16px; font-weight: 800; color: var(--amber-dark); background: #FFF9F2;">1-Click Photo + GPS + Voice</td>
              </tr>
              <!-- Row 2 -->
              <tr style="border-bottom: 1px solid var(--border-subtle); background: #FAF7F4;">
                <td style="padding: 14px 18px; font-weight: 800; color: var(--plum); display: flex; align-items: center; gap: 8px;">
                  <span style="color: var(--amber);">{SVG_CLOCK}</span> Reporting Time
                </td>
                <td style="padding: 14px 16px; color: var(--text-body);">8–15 min (70% give up)</td>
                <td style="padding: 14px 16px; color: var(--text-body);">2–3 min (hold times)</td>
                <td style="padding: 14px 16px; font-weight: 800; color: #059669; background: #FFF9F2;">&lt; 15 sec (&lt; 850ms voice)</td>
              </tr>
              <!-- Row 3 -->
              <tr style="border-bottom: 1px solid var(--border-subtle); background: #FFFFFF;">
                <td style="padding: 14px 18px; font-weight: 800; color: var(--plum); display: flex; align-items: center; gap: 8px;">
                  <span style="color: var(--amber);">{SVG_LAYERS}</span> Duplicate Handling
                </td>
                <td style="padding: 14px 16px; color: var(--text-body);">No check (20 tickets/pothole)</td>
                <td style="padding: 14px 16px; color: var(--text-body);">Human memory only</td>
                <td style="padding: 14px 16px; font-weight: 800; color: var(--amber-dark); background: #FFF9F2;">Auto 75 m merge (one ticket)</td>
              </tr>
              <!-- Row 4 -->
              <tr style="border-bottom: 1px solid var(--border-subtle); background: #FAF7F4;">
                <td style="padding: 14px 18px; font-weight: 800; color: var(--plum); display: flex; align-items: center; gap: 8px;">
                  <span style="color: var(--amber);">{SVG_TRUCK}</span> Wasted Truck Trips
                </td>
                <td style="padding: 14px 16px; color: var(--text-body);">Up to 40% (duplicate trips)</td>
                <td style="padding: 14px 16px; color: var(--text-body);">~20% (duplicate trips)</td>
                <td style="padding: 14px 16px; font-weight: 800; color: #059669; background: #FFF9F2;">&lt; 3% (&gt;40% savings)</td>
              </tr>
              <!-- Row 5 -->
              <tr style="background: #FFFFFF;">
                <td style="padding: 14px 18px; font-weight: 800; color: var(--plum); display: flex; align-items: center; gap: 8px;">
                  <span style="color: var(--amber);">{SVG_PIN}</span> Real-Time Tracking
                </td>
                <td style="padding: 14px 16px; color: var(--text-body);">Table only (no live map)</td>
                <td style="padding: 14px 16px; color: var(--text-body);">Operator screen only</td>
                <td style="padding: 14px 16px; font-weight: 800; color: var(--plum); background: #FFF9F2;">3D Globe + 2D Map (live updates)</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- Bottom Quote Banner -->
      <div class="quote-banner">
        <div class="quote-badge">
          {SVG_TARGET}
          <span>Key Takeaway:</span>
        </div>
        <div class="quote-text">
          &ldquo;Community Hero reduces reporting time from <strong style="color: var(--amber-dark);">15 minutes to 15 seconds</strong>, saves <strong style="color: var(--amber-dark);">42% in wasted repair trips</strong>, and provides <strong style="color: var(--amber-dark);">complete map transparency</strong>.&rdquo;
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="slide-footer">
      <div>Slide 07 / 08 • Results &amp; Comparison</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </div>


  <!-- ========================================== -->
  <!-- SLIDE 8: Conclusion, Future Scope & Ref   -->
  <!-- ========================================== -->
  <div class="slide" id="slide-8">
    <!-- Header -->
    <div class="slide-header">
      <div class="header-pills">
        <span class="pill pill-soft">IIIT Bhopal</span>
        <span class="pill pill-dark">CSE Minor Project</span>
        <span class="pill pill-soft">Group 104</span>
      </div>
      <div class="slide-num">08 / 08</div>
    </div>

    <div class="title-block">
      <h2 class="slide-title">Conclusion, Future Scope &amp; <span>References</span></h2>
      <p class="slide-sub">Key results, next steps for smart cities, and academic references.</p>
    </div>

    <div class="slide-body">
      <!-- 3 Structured Columns with Plum Headers & Icon Rows (100% Filled) -->
      <div style="display: grid; grid-template-columns: 1.15fr 1.15fr 1fr; gap: 0.25in; flex: 1;">
        
        <!-- Column 1: What We Achieved (Conclusion) -->
        <div style="display: flex; flex-direction: column; gap: 0.12in;">
          <div style="background: var(--plum); color: #FFFFFF; padding: 10px 18px; border-radius: 20px; font-weight: 800; font-size: 14.5px; display: flex; align-items: center; gap: 8px;">
            {SVG_TARGET}
            <span>What We Achieved (Conclusion)</span>
          </div>

          <div class="clean-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_CAMERA}
            </div>
            <div>
              <div style="font-size: 14.5px; font-weight: 800; color: var(--plum);">Fast &amp; Inclusive Reporting</div>
              <div style="font-size: 12.5px; color: var(--text-body); margin-top: 2px;">1-click photo + bilingual voice.</div>
            </div>
          </div>

          <div class="clean-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_LEAF}
            </div>
            <div>
              <div style="font-size: 14.5px; font-weight: 800; color: var(--plum);">Smart Resource Savings</div>
              <div style="font-size: 12.5px; color: var(--text-body); margin-top: 2px;">75 m dedup &rarr; 40% less dispatches.</div>
            </div>
          </div>

          <div class="clean-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_SHIELD}
            </div>
            <div>
              <div style="font-size: 14.5px; font-weight: 800; color: var(--plum);">Guaranteed Accountability</div>
              <div style="font-size: 12.5px; color: var(--text-body); margin-top: 2px;">Live 3D map + SLA + photo proof.</div>
            </div>
          </div>

          <div class="clean-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_BOLT}
            </div>
            <div>
              <div style="font-size: 14.5px; font-weight: 800; color: var(--plum);">High System Resilience</div>
              <div style="font-size: 12.5px; color: var(--text-body); margin-top: 2px;">Sub-second speed + offline mode.</div>
            </div>
          </div>
        </div>

        <!-- Column 2: Future Scope (Next Steps) -->
        <div style="display: flex; flex-direction: column; gap: 0.12in;">
          <div style="background: var(--plum); color: #FFFFFF; padding: 10px 18px; border-radius: 20px; font-weight: 800; font-size: 14.5px; display: flex; align-items: center; gap: 8px;">
            {SVG_BOLT}
            <span>Future Scope (Next Steps)</span>
          </div>

          <div class="clean-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_BUS}
            </div>
            <div>
              <div style="font-size: 14.5px; font-weight: 800; color: var(--plum);">Smart Bus Dashcams</div>
              <div style="font-size: 12.5px; color: var(--text-body); margin-top: 2px;">Auto-detect potholes &amp; garbage.</div>
            </div>
          </div>

          <div class="clean-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_MONITOR}
            </div>
            <div>
              <div style="font-size: 14.5px; font-weight: 800; color: var(--plum);">City Command Integration</div>
              <div style="font-size: 12.5px; color: var(--text-body); margin-top: 2px;">Connect with ICCC (Smart Cities).</div>
            </div>
          </div>

          <div class="clean-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_SIGNAL}
            </div>
            <div>
              <div style="font-size: 14.5px; font-weight: 800; color: var(--plum);">Offline Mesh Network</div>
              <div style="font-size: 12.5px; color: var(--text-body); margin-top: 2px;">Report without internet (disasters).</div>
            </div>
          </div>

          <div class="clean-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #FFF4E5; border: 1.5px solid #FCD34D; display: flex; align-items: center; justify-content: center; color: var(--amber-dark); flex-shrink: 0;">
              {SVG_LANG}
            </div>
            <div>
              <div style="font-size: 14.5px; font-weight: 800; color: var(--plum);">More Indian Languages</div>
              <div style="font-size: 12.5px; color: var(--text-body); margin-top: 2px;">Add Marathi, Tamil, Telugu, Bengali.</div>
            </div>
          </div>
        </div>

        <!-- Column 3: Key Academic References -->
        <div style="display: flex; flex-direction: column; gap: 0.12in;">
          <div style="background: var(--plum); color: #FFFFFF; padding: 10px 18px; border-radius: 20px; font-weight: 800; font-size: 14.5px; display: flex; align-items: center; gap: 8px;">
            {SVG_BOOK}
            <span>Key Academic References</span>
          </div>

          <div class="clean-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="background: #FFF4E5; border: 1.5px solid #FCD34D; border-radius: 6px; padding: 6px 10px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; color: var(--amber-dark); flex-shrink: 0;">
              [1]
            </div>
            <div>
              <div style="font-size: 13.5px; font-weight: 800; color: var(--plum);">Open311 Consortium</div>
              <div style="font-size: 12px; color: var(--text-body); margin-top: 2px;">GeoReport v2 Standard, 2021.</div>
            </div>
          </div>

          <div class="clean-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="background: #FFF4E5; border: 1.5px solid #FCD34D; border-radius: 6px; padding: 6px 10px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; color: var(--amber-dark); flex-shrink: 0;">
              [2]
            </div>
            <div>
              <div style="font-size: 13.5px; font-weight: 800; color: var(--plum);">IEEE TBigData</div>
              <div style="font-size: 12px; color: var(--text-body); margin-top: 2px;">Spatial clustering in urban GIS, 2022.</div>
            </div>
          </div>

          <div class="clean-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="background: #FFF4E5; border: 1.5px solid #FCD34D; border-radius: 6px; padding: 6px 10px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; color: var(--amber-dark); flex-shrink: 0;">
              [3]
            </div>
            <div>
              <div style="font-size: 13.5px; font-weight: 800; color: var(--plum);">ACM SIGSPATIAL</div>
              <div style="font-size: 12px; color: var(--text-body); margin-top: 2px;">Urban incident detection, 2021.</div>
            </div>
          </div>

          <div class="clean-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="background: #FFF4E5; border: 1.5px solid #FCD34D; border-radius: 6px; padding: 6px 10px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; color: var(--amber-dark); flex-shrink: 0;">
              [4]
            </div>
            <div>
              <div style="font-size: 13.5px; font-weight: 800; color: var(--plum);">WebAssembly</div>
              <div style="font-size: 12px; color: var(--text-body); margin-top: 2px;">High-performance web apps, 2026.</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Core Vision Quote Banner -->
      <div class="quote-banner" style="background: var(--plum); border: none; color: #FFFFFF;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 24px;">🏛️</span>
          <div style="width: 2px; height: 30px; background: rgba(255,255,255,0.3);"></div>
        </div>
        <div style="font-size: 17px; font-weight: 700; color: #FCD34D; line-height: 1.35; flex: 1;">
          &ldquo;Community Hero makes cities <span style="color: #FFFFFF;">cleaner, safer, and more responsive.</span>&rdquo;
        </div>
      </div>

      <!-- 3-Part Bottom Team Bar -->
      <div style="display: grid; grid-template-columns: 1.25fr 1.25fr 1fr; gap: 0.2in; margin-top: 0.14in;">
        <div class="clean-card" style="padding: 10px 16px; display: flex; align-items: center; gap: 14px;">
          <div style="color: var(--amber);">{SVG_USER}</div>
          <div>
            <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">PROJECT TEAM: GROUP 104</div>
            <div style="font-size: 13.5px; font-weight: 700; color: var(--text-dark); margin-top: 2px;">Aarush Bharti (24U020010) &amp; Ashish Goutam (24U020011)</div>
          </div>
        </div>

        <div class="clean-card" style="padding: 10px 16px; display: flex; align-items: center; gap: 14px;">
          <div style="color: var(--amber);">{SVG_GRAD}</div>
          <div>
            <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">PROJECT SUPERVISOR</div>
            <div style="font-size: 13.5px; font-weight: 700; color: var(--text-dark); margin-top: 2px;">Dr. Sreemoyee Biswas, Asst. Prof., CSE, IIIT Bhopal</div>
          </div>
        </div>

        <div style="background: #FFF4E5; border: 1.5px solid #FCD34D; border-radius: 12px; padding: 10px 16px; display: flex; align-items: center; gap: 14px;">
          <div style="color: var(--amber-dark);">{SVG_HANDSHAKE}</div>
          <div>
            <div style="font-size: 15px; font-weight: 800; color: var(--plum);">Thank you!</div>
            <div style="font-size: 11.5px; font-weight: 600; color: var(--amber-dark); margin-top: 1px;">Thank you to our supervisors.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="slide-footer">
      <div>Slide 08 / 08 • Conclusion, Future Scope &amp; References</div>
      <div>IIIT Bhopal • Group 104</div>
    </div>
  </div>

</body>
</html>
"""

with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Clean HTML written to: {OUTPUT_HTML}")

# Compile PDF via Google Chrome Headless
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if not os.path.exists(chrome_path):
    print("Warning: Google Chrome not found at default path.")
    exit(1)

print("Compiling pixel-perfect PDF via Google Chrome headless...")
html_abs_path = os.path.abspath(OUTPUT_HTML)
cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=5000",
    f"--print-to-pdf={OUTPUT_PDF}",
    f"file://{html_abs_path}"
]

subprocess.run(cmd, check=True)

size_mb = os.path.getsize(OUTPUT_PDF) / (1024 * 1024)
print(f"PDF successfully generated: {OUTPUT_PDF} ({size_mb:.2f} MB)")

shutil.copy2(OUTPUT_PDF, DESKTOP_PDF)
print(f"Copied to Desktop for immediate presentation access: {DESKTOP_PDF}")
print("Done!")
