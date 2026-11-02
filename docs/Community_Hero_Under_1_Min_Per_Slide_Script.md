# 🎙️ Community Hero — Under 1-Minute Per Slide Viva Script
**Phase III Minor Project Defense • Group 104 • Department of CSE, IIIT Bhopal**  
**Presenters:** Aarush Bharti (24U020010) & Ashish Goutam (24U020011)  
**Project Supervisor:** Dr. Sreemoyee Biswas  

> **⏱️ Presentation Strategy:**  
> Each slide is scripted for **~45 to 50 seconds** (~100–120 words at a relaxed 130 wpm speaking pace).  
> This leaves 10–15 seconds of buffer per slide for pauses, examiner eye contact, or quick interjections.

---

### Slide 1: Title & Hero Lockup
* **Screen Focus:** Title typography, IIIT seal, symmetric presenter badges, bottom 4 metric chips.  
* **Target Time:** 45 seconds (95 words)

> "Respected faculty and supervisor Dr. Sreemoyee Biswas, good morning. We are Group 104—Aarush Bharti and Ashish Goutam—presenting our Phase III Minor Project: **Community Hero**.
> 
> Current city grievance portals fail during emergencies because citizens face cumbersome forms and slow response times. Community Hero is an **Autonomous Hyperlocal Civic Intelligence & CAD Command Center**. We combine zero-typing bilingual voice ingestion, sub-second natural language classification, an automated 75-meter spatial deduplication algorithm, and an interactive 3D digital twin. 
> 
> As highlighted on our dashboard, our pipeline ingests calls in under 850 milliseconds, reduces fleet dispatch waste by 42%, and runs with a 100% offline fallback."

👉 **What to Point to:** Tap the 4 bottom metric chips (`<850ms`, `75m / 6h`, `42%`, `100%`).

---

### Slide 2: Literature Review (How Civic Problems Are Reported Today)
* **Screen Focus:** 4 comparison cards (Govt Apps, Web Portals, Call Centers, Generic AI Bots) + bottom quote banner.  
* **Target Time:** 50 seconds (115 words)

> "To understand where existing engineering solutions fall short, we reviewed the four primary grievance channels used today.
> 
> First, **Government Apps like CPGRAMS or Delhi 311** require 10 to 15 minutes of manual dropdown navigation in English, causing over 70% of citizens to abandon reports midway.
> 
> Second, **Standard Web Portals like Open311** organize tickets into databases, but lack voice support and treat duplicate reports as isolated tickets, overwhelming municipal staff.
> 
> Third, **Emergency Hotlines like 112** are fast but suffer from severe line congestion during peak crises and high operator costs.
> 
> Finally, **generic AI voicebots** take 3 to 5 seconds per response and hallucinate locations. 
> 
> Today, there is no system capable of sub-second bilingual voice intake that also prevents duplicate repair trucks from rolling out."

👉 **What to Point to:** Point sequentially across the 4 plum container cards, ending at the bottom quote capsule.

---

### Slide 3: Problem Statement (3 Core Breakdowns)
* **Screen Focus:** 3 left-hand breakdown cards (Friction, Duplication, Black Hole) + right-side flowchart.  
* **Target Time:** 45 seconds (105 words)

> "This brings us to the three fundamental breakdowns in municipal problem resolution.
> 
> First, **High Reporting Friction**: citizens observe hazards daily but ignore them because there is no frictionless photo-and-auto-GPS trigger.
> 
> Second, **Duplicate Complaints & Municipal Resource Drain**: when a water pipe bursts or a transformer sparks, 20 to 30 people report it independently. Without spatial clustering, cities dispatch multiple repair crews to the exact same spot, wasting up to 40% in fuel and operational man-hours.
> 
> Third, **The Accountability Black Hole**: tickets languish in queues and get marked resolved without verifiable proof. 
> 
> In short: reporting takes too much effort, resources are wasted on duplicates, and citizens lose trust."

👉 **What to Point to:** Gesture down the right flowchart from *Civic Problem Happens* down to *Result: Delay, Waste & Loss of Trust*.

---

### Slide 4: Proposed Methodology (The 4-Step Solution)
* **Screen Focus:** 4 feature cards with live UI mockups (Mobile, AI, 75m Radar, Laptop Dispatch + Before/After proof).  
* **Target Time:** 50 seconds (115 words)

> "To solve this end-to-end, Community Hero implements a closed-loop 4-step architecture.
> 
> **Step 1: Multi-Channel Easy Reporting.** Citizens report via 1-click photo with automatic reverse-geocoding, or simply speak a natural voice memo in Hindi or English.
> 
> **Step 2: AI Categorization & Severity.** Our NLP pipeline extracts the problem type—road, waste, or electrical hazard—and scores urgency from 1 to 10 in milliseconds.
> 
> **Step 3: 75-Meter Spatial Deduplication.** Our GIS engine clusters all reports filed within a 75-meter walking radius over a 6-hour window into one master ticket, converting repeated calls into automated upvotes.
> 
> **Step 4: Live Dispatch & Photo-Proof.** Crews receive GPS-assigned work orders and can only close tickets by uploading verifiable 'AFTER' photos, awarding Civic XP to citizens."

👉 **What to Point to:** Point to the 75m radar circle in Card 3, then the Before/After photo comparison in Card 4.

---

### Slide 5: System Diagram & Operational Flowchart
* **Screen Focus:** Left workflow column, central dark decision flowchart, right-hand Key Properties.  
* **Target Time:** 50 seconds (110 words)

> "Slide 5 details our system flowchart and operational logic.
> 
> When ingestion occurs—either via photo upload or spoken call—the event enters Step 2 for classification.
> 
> The core algorithmic decision is: *'Is there an active incident within 75 meters?'*
> - If **YES**, it branches into **Outcome A**: it merges into the existing master incident, increments the crowd priority upvote counter, and crucially **blocks redundant crew dispatches**.
> - If **NO**, it executes **Outcome B**: mints a unique ticket ID, alerts the municipal operations room on the 3D map, and initiates the SLA countdown timer.
> 
> This spatial check executes in **under 4 milliseconds**, ensuring real-time speed without cloud lock-in."

👉 **What to Point to:** Follow the central flowchart arrows from the yellow decision diamond into Outcome A (Green) and Outcome B (Blue).

---

### Slide 6: System Implementation & Technology Stack
* **Screen Focus:** Two dark mode UI screenshots (Voice Cockpit & 3D Digital Twin) + 4 stack cards on right.  
* **Target Time:** 50 seconds (115 words)

> "Here we present our working implementation and tech stack. These are live screenshots of our platform running locally.
> 
> In the top left, you see our **CAD Emergency Voice Cockpit**, featuring dual human dispatcher personas, real-time waveform visualization, and a 1-click human supervisor takeover panel.
> 
> Below it is our **3D Digital Twin City Command Center**, powered by Three.js and Leaflet, displaying live hazard beacons and work order statuses across Delhi.
> 
> On the engineering side:
> - **Frontend:** React 18, Vite, and Tailwind CSS for instant rendering.
> - **Backend:** Node.js with Express REST endpoints.
> - **Database:** SQLite with Write-Ahead Logging (WAL) for concurrent, zero-latency reads and writes.
> - **Resilience:** Fully operational offline without requiring external paid cloud APIs."

👉 **What to Point to:** Highlight the CAD Voice Cockpit screenshot, then the Three.js 3D globe screenshot.

---

### Slide 7: Results, Comparison & Performance Analysis
* **Screen Focus:** Left municipal admin screenshot + right performance comparison matrix + bottom key metrics.  
* **Target Time:** 50 seconds (115 words)

> "Slide 7 benchmarks Community Hero against existing systems across 5 key operational metrics.
> 
> First, **Reporting Time**: reduced from 10 to 15 minutes down to **under 15 seconds** using our sub-850ms voice intake.
> 
> Second, **Duplicate Handling**: while CPGRAMS and 112 generate isolated tickets or rely on human memory, Community Hero automatically merges calls within 75 meters.
> 
> Third, **Wasted Truck Dispatches**: slashed from roughly 40% duplicate dispatches down to **under 3%**, delivering an estimated **42% savings in municipal fuel and fleet costs**.
> 
> Fourth, **Tracking Transparency**: replaced opaque status queues with a real-time 3D geospatial map.
> 
> Our system achieves **94.8% classification accuracy** while maintaining complete local offline capability."

👉 **What to Point to:** Walk your finger down the 'COMMUNITY HERO (OUR APP)' column of the table, ending on the `42% Fuel Savings` badge.

---

### Slide 8: Conclusion, Future Scope & References
* **Screen Focus:** 3 structured columns (Achievements, Future Scope, References) + supervisor footer.  
* **Target Time:** 45 seconds (100 words)

> "In conclusion, Community Hero bridges the critical gap between panicked citizens and municipal field execution. We achieved frictionless bilingual voice intake, intelligent spatial deduplication, guaranteed photo verification, and sub-second performance.
> 
> Looking to future scope, we plan to:
> 1. Integrate computer vision models on public bus dashcams to passively detect potholes and garbage mounds.
> 2. Connect directly to municipal Integrated Command and Control Centers (ICCC).
> 3. Implement an offline peer-to-peer mesh network for disaster zones, and expand to more Indic regional languages.
> 
> Our work builds on the Open311 standard and IEEE spatial clustering research. We sincerely thank our guide Dr. Sreemoyee Biswas and the evaluation committee. We are now open for viva questions."

👉 **What to Point to:** Conclude by gesturing to the supervisor acknowledgement card and the Group 104 footer.
