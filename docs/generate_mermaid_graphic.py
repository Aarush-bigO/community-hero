#!/usr/bin/env python3
"""
Generate High-Resolution Prototype Workflow Diagram
Palette:
- Deep Plum: #3A0F34
- Terracotta: #C75A3A
- Dusty Mauve: #C9A0A7
- Warm Cream: #FAF5F2
"""

import os
from PIL import Image, ImageDraw, ImageFont

W, H = 2800, 1600
img = Image.new("RGBA", (W, H), (250, 245, 242, 255)) # #FAF5F2 Warm Cream
draw = ImageDraw.Draw(img)

# Colors
DEEP_PLUM = (58, 15, 52, 255)       # #3A0F34
TERRACOTTA = (199, 90, 58, 255)     # #C75A3A
DUSTY_MAUVE = (201, 160, 167, 255)  # #C9A0A7
CARD_BG = (255, 255, 255, 255)       # Pure White
CARD_TINT = (245, 236, 232, 255)     # Soft Mauve Tint
TEXT_MUTED = (110, 85, 102, 255)     # #6E5566
BORDER_MUTED = (229, 211, 214, 255) # Soft Border

# Try to find high quality system fonts
font_title = None
font_sub = None
font_node_title = None
font_node_body = None
font_badge = None

font_candidates = [
    "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
    "/System/Library/Fonts/Supplemental/Georgia.ttf",
    "/System/Library/Fonts/Supplemental/Times New Roman.ttf"
]
sans_candidates = [
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/SFNS.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf"
]

for p in font_candidates:
    if os.path.exists(p):
        try:
            font_title = ImageFont.truetype(p, 54)
            break
        except Exception:
            pass

for p in sans_candidates:
    if os.path.exists(p):
        try:
            font_sub = ImageFont.truetype(p, 28)
            font_node_title = ImageFont.truetype(p, 30)
            font_node_body = ImageFont.truetype(p, 22)
            font_badge = ImageFont.truetype(p, 20)
            break
        except Exception:
            pass

if not font_title:
    font_title = font_sub = font_node_title = font_node_body = font_badge = ImageFont.load_default()

# Header
draw.text((120, 80), "COMMUNITY HERO — END-TO-END PROTOTYPE WORKFLOW", fill=DEEP_PLUM, font=font_title)
draw.text((120, 150), "Mermaid Architecture Diagram: From Citizen Detection to PWD Repair & Civic XP Reward", fill=TERRACOTTA, font=font_sub)

# Draw subtle divider
draw.line([(120, 200), (W - 120, 200)], fill=DUSTY_MAUVE, width=3)

# Helper function to draw rounded card
def draw_card(x, y, w, h, title, body_lines, step_tag, fill_c=CARD_BG, border_c=BORDER_MUTED, border_w=3):
    # Shadow
    draw.rounded_rectangle([x + 6, y + 8, x + w + 6, y + h + 8], radius=16, fill=(215, 200, 195, 120))
    # Main card
    draw.rounded_rectangle([x, y, x + w, y + h], radius=16, fill=fill_c, outline=border_c, width=border_w)
    
    # Step Badge
    bw = 140
    bh = 34
    draw.rounded_rectangle([x + 20, y + 16, x + 20 + bw, y + 16 + bh], radius=12, fill=TERRACOTTA)
    draw.text((x + 32, y + 22), step_tag, fill=(255, 255, 255, 255), font=font_badge)
    
    # Title
    draw.text((x + 20, y + 62), title, fill=DEEP_PLUM, font=font_node_title)
    
    # Body lines
    curr_y = y + 108
    for line in body_lines:
        draw.text((x + 20, curr_y), line, fill=TEXT_MUTED, font=font_node_body)
        curr_y += 32

def draw_arrow(x1, y1, x2, y2, label=""):
    draw.line([(x1, y1), (x2, y2)], fill=TERRACOTTA, width=4)
    # Arrow head
    if x2 > x1: # pointing right
        draw.polygon([(x2, y2), (x2 - 16, y2 - 10), (x2 - 16, y2 + 10)], fill=TERRACOTTA)
        if label:
            draw.text((x1 + (x2 - x1)//2 - 40, y1 - 32), label, fill=DEEP_PLUM, font=font_badge)
    elif y2 > y1: # pointing down
        draw.polygon([(x2, y2), (x2 - 10, y2 - 16), (x2 + 10, y2 - 16)], fill=TERRACOTTA)
        if label:
            draw.text((x1 + 12, y1 + (y2 - y1)//2 - 12), label, fill=DEEP_PLUM, font=font_badge)

# ROW 1 Nodes (Top Pipeline)
# Node 1: Citizen Ingestion
draw_card(120, 260, 520, 230,
          "Citizen Ingestion Layer",
          ["• Geotagged photo upload (Leaflet pin)",
           "• Automated GPS reverse-geocoding",
           "• Voice helpline IVR telephony (Hindi/Eng)"],
          "STAGE 01", fill_c=CARD_BG, border_c=TERRACOTTA, border_w=3)

# Arrow 1 -> 2
draw_arrow(640, 375, 760, 375, "")

# Node 2: Offline ML Triage
draw_card(760, 260, 560, 230,
          "Offline NLP Classifier",
          ["• Scikit-Learn TF-IDF (1,2 n-grams)",
           "• Multinomial Naive Bayes (89.2% Acc)",
           "• Automated Urgency Rating (1 to 5)",
           "• 4.2ms latency • 0 Cloud API Keys"],
          "STAGE 02", fill_c=CARD_BG, border_c=DUSTY_MAUVE, border_w=3)

# Arrow 2 -> 3
draw_arrow(1320, 375, 1440, 375, "")

# Node 3: 75m Haversine Decision
draw_card(1440, 260, 560, 230,
          "75m Spatial Dedup Engine",
          ["• Haversine spherical distance formula",
           "• Evaluates nearby active complaints",
           "• Public vs Private road classification",
           "• Decision: Cluster vs New Ticket"],
          "DECISION", fill_c=CARD_TINT, border_c=DEEP_PLUM, border_w=3)

# Branches from Node 3:
# Branch Down-Left: Duplicate <= 75m
# Branch Down-Right: New Ticket > 75m
draw_line_coords = [(1600, 490), (1600, 570), (1040, 570), (1040, 640)]
for i in range(len(draw_line_coords)-1):
    draw.line([draw_line_coords[i], draw_line_coords[i+1]], fill=TERRACOTTA, width=4)
draw.polygon([(1040, 640), (1030, 624), (1050, 624)], fill=TERRACOTTA)
draw.text((1180, 535), "Distance <= 75m (Duplicate)", fill=DEEP_PLUM, font=font_badge)

draw_line_coords_r = [(1840, 490), (1840, 570), (2200, 570), (2200, 640)]
for i in range(len(draw_line_coords_r)-1):
    draw.line([draw_line_coords_r[i], draw_line_coords_r[i+1]], fill=TERRACOTTA, width=4)
draw.polygon([(2200, 640), (2190, 624), (2210, 624)], fill=TERRACOTTA)
draw.text((1920, 535), "Distance > 75m (New Issue)", fill=DEEP_PLUM, font=font_badge)

# ROW 2 Nodes (Branching Outcomes)
# Node 4A: Cluster into Parent
draw_card(760, 640, 560, 210,
          "Cluster into Parent Ticket",
          ["• Links ticket to master ID",
           "• verification_count += 1",
           "• Citizen receives +10 Civic XP",
           "• STOPS duplicate crew dispatch!"],
          "OUTCOME A", fill_c=CARD_BG, border_c=TERRACOTTA, border_w=3)

# Node 4B: Create New Ticket in SQLite
draw_card(1920, 640, 560, 210,
          "Create Standalone Ticket",
          ["• SQLite WAL mode ACID insert",
           "• Schema-compliant Open311 v2 payload",
           "• Assigns PWD ward maintenance ID",
           "• Coordinates projected on 3D Globe"],
          "OUTCOME B", fill_c=CARD_BG, border_c=DEEP_PLUM, border_w=3)

# Arrows from 4A and 4B to Municipal CAD
# Both converge into Municipal CAD Node in ROW 3
draw.line([(1040, 850), (1040, 930), (1400, 930), (1400, 980)], fill=TERRACOTTA, width=4)
draw.line([(2200, 850), (2200, 930), (1400, 930)], fill=TERRACOTTA, width=4)
draw.polygon([(1400, 980), (1390, 964), (1410, 964)], fill=TERRACOTTA)

# ROW 3 Node: Municipal Dispatch CAD
draw_card(1100, 980, 600, 230,
          "Municipal CAD Operations Room",
          ["• Server-Sent Events (SSE) live push stream",
           "• Prioritizes by urgency score (1-5) and votes",
           "• Dispatches nearest PWD repair crew",
           "• Full audit trail & commissioner view"],
          "STAGE 03", fill_c=DEEP_PLUM, border_c=TERRACOTTA, border_w=4)

# Overwrite text colors inside dark card for readability
draw.text((1120, 1042), "Municipal CAD Operations Room", fill=(255, 255, 255, 255), font=font_node_title)
curr_y = 1088
for line in ["• Server-Sent Events (SSE) live push stream",
             "• Prioritizes by urgency score (1-5) and votes",
             "• Dispatches nearest PWD repair crew",
             "• Full audit trail & commissioner view"]:
    draw.text((1120, curr_y), line, fill=(245, 236, 232, 255), font=font_node_body)
    curr_y += 32

# Arrow from Stage 3 to Stage 4
draw_arrow(1700, 1095, 1850, 1095, "")

# ROW 3 Node 6: Field Repair & Closure
draw_card(1850, 980, 630, 230,
          "PWD Field Repair & Verification",
          ["• Crew arrives at GPS pin coordinates",
           "• Road patch laid & steam-rolled",
           "• Resolution photo uploaded to portal",
           "• Admin marks ticket as 'Resolved'"],
          "STAGE 04", fill_c=CARD_BG, border_c=TERRACOTTA, border_w=3)

# Arrow from Stage 4 down to Final Citizen XP
draw.line([(2165, 1210), (2165, 1270), (1700, 1270), (1700, 1320)], fill=TERRACOTTA, width=4)
draw.polygon([(1700, 1320), (1690, 1304), (1710, 1304)], fill=TERRACOTTA)

# ROW 4 Final Node: Citizen Push & XP
draw_card(1200, 1320, 800, 190,
          "Closed-Loop Resolution & Citizen Reward",
          ["• Real-time SSE push turns map pin GREEN across all open browsers (<15ms)",
           "• Citizen receives resolution notification with after-repair photo",
           "• Citizen awarded +50 Civic XP & unlocked neighborhood hero badge!"],
          "CLOSED LOOP", fill_c=CARD_TINT, border_c=DUSTY_MAUVE, border_w=3)

# Save output
out_path = "/Users/aarush/Desktop/Community Hero/docs/presentation_assets/slide_mermaid_prototype.png"
img.save(out_path, "PNG", dpi=(300, 300))
print(f"Mermaid prototype diagram saved to: {out_path}")
