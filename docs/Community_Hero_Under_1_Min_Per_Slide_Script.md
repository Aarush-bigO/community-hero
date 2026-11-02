# 🗣️ Community Hero — Simple, No-Jargon Viva Script (Under 1 Min Per Slide)
**Phase III Minor Project Defense • Group 104 • Department of CSE, IIIT Bhopal**  
**Presenters:** Aarush Bharti (24U020010) & Ashish Goutam (24U020011)  
**Supervisor:** Dr. Sreemoyee Biswas  

> **💡 How to use this script:**  
> Speak naturally, like you are explaining your project to a smart friend. Each slide takes **only 35 to 45 seconds** to say. No heavy buzzwords or complicated technical jargon.

---

### Slide 1: Title & Introduction
* **Slide on screen:** Title with your names, IIIT Bhopal crest, and 4 metric badges at the bottom.
* **Speaking time:** ~40 seconds (~85 words)

> "Good morning teachers and our guide, Dr. Sreemoyee Biswas. We are Group 104—Aarush Bharti and Ashish Goutam—and our project is **Community Hero**.
> 
> Today, when people see a broken road, an open drain, or a garbage dump, reporting it is slow and annoying. 
> 
> Community Hero fixes this. Instead of filling out long forms, citizens can simply take a photo or speak naturally in Hindi or English. 
> 
> Our system records the issue in under one second, automatically groups duplicate complaints within 75 meters so the city doesn't waste trucks, and shows everything live on a 3D city map."

👉 **What to point to:** Point to the 4 bottom badges: `< 850ms`, `75m / 6h`, `42% fuel saved`, and `100% offline`.

---

### Slide 2: How Civic Problems Are Reported Today
* **Slide on screen:** 4 comparison boxes (Govt Apps, Web Portals, Call Centers, AI Bots).
* **Speaking time:** ~45 seconds (~95 words)

> "On this slide, we looked at the existing options and why they fail:
> 
> 1. **Government Apps like Delhi 311 or CPGRAMS:** They make you fill long forms with lots of dropdowns in English. Most people just give up midway.
> 2. **Standard Web Portals:** You still have to type everything by hand. If 20 people report the same pothole, it creates 20 separate complaints and wastes staff time.
> 3. **Emergency Call Centers like 112:** People can talk to a human, but phone lines get jammed during storms or big accidents.
> 4. **Generic AI voice bots:** They are slow, make mistakes on how dangerous an issue is, and can't pinpoint exact locations on a map."

👉 **What to point to:** Briefly gesture to each of the 4 dark cards from left to right.

---

### Slide 3: The 3 Big Problems We Are Solving
* **Slide on screen:** 3 numbered cards on the left, and the flow diagram on the right.
* **Speaking time:** ~40 seconds (~85 words)

> "This leads to three big real-world problems:
> 
> First, **Too much effort for citizens:** Filling out forms takes 10 to 15 minutes, so over 70% of everyday problems never get reported.
> 
> Second, **Huge municipal waste:** When a pipe bursts, dozens of neighbors report it. The city ends up sending multiple repair trucks to the exact same spot, wasting up to 40% of their fuel and time.
> 
> Third, **Lack of trust:** Complaints sit in long queues, and often get marked 'Resolved' without any proof. Citizens lose trust in the system."

👉 **What to point to:** Trace your finger down the right flowchart: *Problem Happens → Multiple people report → Multiple trucks sent → Delay & waste*.

---

### Slide 4: Our 4-Step Solution
* **Slide on screen:** 4 feature columns with screenshots (Mobile phone, AI brain, 75m circle, Before/After photos).
* **Speaking time:** ~45 seconds (~100 words)

> "Here is our 4-step solution in Community Hero:
> 
> **Step 1: Easy Reporting.** A citizen snaps a quick photo, and the app automatically picks up their GPS location. Or they can simply press a button and speak in Hindi or English.
> 
> **Step 2: Smart AI Categorization.** Our system immediately detects what the issue is—roads, garbage, water, or electricity—and rates its urgency from 1 to 10.
> 
> **Step 3: 75-Meter Grouping.** If 10 people report the same issue within 75 meters, the system automatically merges them into one single master ticket and adds upvotes.
> 
> **Step 4: Live Map and Photo Proof.** City workers fix the problem and must upload an 'AFTER' photo to close the ticket. The citizen gets notified and earns reward points."

👉 **What to point to:** Point to the 75m radar circle in box 3, and the 'Before' vs 'After' photo in box 4.

---

### Slide 5: System Diagram & Workflow
* **Slide on screen:** 6 workflow steps on left, dark decision flow in center, 4 key properties on right.
* **Speaking time:** ~45 seconds (~95 words)

> "This diagram shows the complete step-by-step logic.
> 
> When a report comes in, the system checks:  
> *'Is there already a report for this issue within 75 meters?'*
> 
> - If **YES**, it merges into the existing complaint and adds an upvote. This immediately stops duplicate repair trucks from being sent.
> - If **NO**, it creates a brand-new ticket, alerts the city control room on the live map, and starts a countdown timer to get it fixed.
> 
> When the repair crew finishes, they upload an 'AFTER' photo, the pin turns green, and the citizen is notified.
> 
> This entire duplicate check takes under 4 milliseconds."

👉 **What to point to:** Follow the arrows into the green 'YES (Merge)' box and the blue 'NO (New Ticket)' box.

---

### Slide 6: Working System & Tech Stack
* **Slide on screen:** Screenshots of the live Voice Cockpit and 3D Globe map on the left, tech stack on the right.
* **Speaking time:** ~45 seconds (~95 words)

> "These are live screenshots of our working project.
> 
> On top is our **Emergency Voice Cockpit**: an operator or citizen speaks, and the system shows audio waveforms and generates the emergency work order in real time.
> 
> Below that is our **3D City Command Center**, showing live incident pins across the city on a 3D digital globe.
> 
> For our tech stack:
> - We used **React and Tailwind CSS** for a fast and clean user interface.
> - We used **Three.js and Leaflet** for the interactive 3D and 2D maps.
> - The backend is built with **Node.js, Express, and SQLite**.
> - Most importantly, the entire system can run locally without needing paid cloud services."

👉 **What to point to:** Point to the Voice Cockpit screenshot, then the 3D globe screenshot.

---

### Slide 7: Results & Comparison
* **Slide on screen:** Control room console screenshot on left, comparison table on right, key metrics at bottom.
* **Speaking time:** ~45 seconds (~95 words)

> "On this slide, we compare Community Hero with current systems:
> 
> - **Reporting time:** Reduced from 15 minutes down to just 15 seconds—or under 1 second using voice.
> - **Duplicate handling:** Instead of creating 20 tickets for one pothole, our app combines them into one.
> - **Wasted truck trips:** Slashed from 40% duplicate trips down to less than 3%, saving around 42% in municipal fuel.
> - **Tracking:** Instead of confusing tables, officials see everything live on a 3D map.
> 
> Overall, our AI reaches 94.8% accuracy in categorizing problems and setting urgency."

👉 **What to point to:** Run your hand down the 'COMMUNITY HERO' column in the table, pointing to `15 seconds` and `< 3% wasted trips`.

---

### Slide 8: Conclusion & Future Scope
* **Slide on screen:** 3 columns (What We Achieved, Future Scope, References) + Thank You box.
* **Speaking time:** ~40 seconds (~85 words)

> "To conclude, Community Hero makes city problem reporting faster for citizens and saves serious money and fuel for municipalities.
> 
> In the future, we want to:
> 1. Mount smart cameras on public buses to automatically detect potholes while driving.
> 2. Connect directly to city Smart City command centers.
> 3. Build offline mesh networks so people can still report during natural disasters when mobile towers fail.
> 4. Add more Indian languages like Marathi, Tamil, and Bengali.
> 
> Thank you to our supervisor Dr. Sreemoyee Biswas and the examination committee. We are happy to answer your questions."

👉 **What to point to:** Point to the supervisor card and the Thank You box on the bottom right.
