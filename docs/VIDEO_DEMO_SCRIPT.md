# 🎬 Community Hero — Official Video Demo Recording Script
### Bolna x Y Combinator Symphony Buildathon & Phase III Evaluation
**Target Duration:** 2 minutes 30 seconds – 3 minutes  
**Presenter:** Aarush Bharti (Group 104, IIIT Bhopal)  
**URL on Screen:** `http://localhost:5173/dispatch` (Voice AI Cockpit) & `http://localhost:5173/` (3D Digital Twin)

---

## 📋 Pre-Recording Setup Checklist
1. Open Google Chrome with two tabs ready:
   - **Tab 1:** `http://localhost:5173/dispatch` (Voice AI Dispatch Cockpit)
   - **Tab 2:** `http://localhost:5173/` (Landing / 3D Earth Globe)
2. Ensure your computer volume / speakers are turned up so the browser's spoken audio is picked up clearly by your recording software (QuickTime, Loom, OBS, or Screen Studio).
3. Test audio by clicking `[Test]` in the top bar of the cockpit.

---

## ⏱️ Video Script Breakdown

### 0:00 – 0:30 | The Hook & Problem Statement
* **Screen View:** Tab 2 (`http://localhost:5173/`) — 3D Earth globe rotating smoothly, highlighting live incident beacons.

| Timecode | Visual / Screen Action | Spoken Narration (What Aarush Says) |
| :--- | :--- | :--- |
| **0:00 – 0:15** | Slowly rotate the 3D Earth globe, showing live hazard pins in New Delhi and Bengaluru. | *"Hi everyone, I'm Aarush Bharti from IIIT Bhopal. When a critical emergency strikes—like a commercial gas leak or an exploded electrical transformer—citizens panic. They cannot fill out multi-step web forms, and traditional 911 or 311 hotlines force them through 15-minute rigid IVR phone trees."* |
| **0:15 – 0:30** | Switch smoothly to Tab 1: **Voice Cockpit** (`http://localhost:5173/dispatch`). Hover over the top tactical bar. | *"This is **Community Hero**—an autonomous, bilingual voice AI layer built on Bolna, Sarvam Indic speech models, and Open311 standards that turns panicked voice calls into instant, deduplicated CAD field dispatches in sub-seconds."* |

---

### 0:30 – 1:15 | Live Voice Intake & Dual Human Voice Personas
* **Screen View:** Top Command Bar of the Voice Cockpit.

| Timecode | Visual / Screen Action | Spoken Narration (What Aarush Says) |
| :--- | :--- | :--- |
| **0:30 – 0:45** | Click **`[ 👩 The Girl (Priya) ]`**, then click **`[ ▶ Test ]`**. Listen to Priya's natural human response. | *"First, let's look at our natural human speech engine. In emergency response, robotic synthesizers sound cold and unconvincing. Here, we offer dual human dispatcher personas. This is Dispatcher Priya—warm, clear, and reassuring."* |
| **0:45 – 0:55** | Click **`[ 👨 That Boy (Rahul) ]`**, then click **`[ ▶ Test ]`**. Listen to Rahul's authoritative response. | *"And with one click, we can switch to Officer Rahul—calm, grounded, and authoritative. Both eliminate robotic monotone and calibrate pitch and rate to authentic human emergency cadence."* |
| **0:55 – 1:15** | Click **`[🔥 Gas leak CP Block B]`** under Quick Live Speech (or click **`Talk Live (Mic)`** and say: *"Major commercial gas leak at Connaught Place Block B, send emergency units now!"*). | *"Let's test live emergency intake. A citizen calls in about an LPG gas leak at Connaught Place. Watch what happens."*  <br><br>*(Pause 3 seconds while the system plays the emergency chime and speaks the CAD work order in natural human voice).* <br><br>*"In under 800 milliseconds, our NLP engine extracts the exact coordinates, assigns a 9.8 urgency rating, and speaks a localized verbal order back to the caller."* |

---

### 1:15 – 1:45 | Incident Variety & Swarm-Surge Deduplication
* **Screen View:** Quick Live Speech Chips & Left CAD Drawer.

| Timecode | Visual / Screen Action | Spoken Narration (What Aarush Says) |
| :--- | :--- | :--- |
| **1:15 – 1:30** | Click **`[⚡ Transformer fire Barakhamba]`**. Listen to the unique 11kV fire response. Then click **`[💧 Janpath water rupture]`**. | *"Unlike generic bots, every hazard has its own dedicated operational protocol. If we report a transformer fire at Barakhamba Road, it requests grid power isolation and Fire Engine 7. If we report a Janpath water pipe burst, it dispatches the Delhi Jal Board."* |
| **1:30 – 1:45** | Click **`[🚨 Swarm duplicate (CP)]`**. Point the cursor to the Work Orders card showing **18 Callers** clustered under `#311`. | *"Now, what happens when 20 citizens call about the same disaster at once? Usually, 911 dispatchers get overwhelmed by duplicate tickets. Community Hero implements **Spatial Swarm Deduplication** within an 80-meter Haversine radius. Instead of creating 20 tickets, it clusters them, escalates the priority to Critical, and alerts incident command without clogging field lines."* |

---

### 1:45 – 2:15 | VoiceStudio Telephony & Human Operator Takeover
* **Screen View:** Active Call card & Human Operator Takeover panel.

| Timecode | Visual / Screen Action | Spoken Narration (What Aarush Says) |
| :--- | :--- | :--- |
| **1:45 – 2:00** | Click the **`Carrier Line`** button to show the VoiceStudio Telephony SIP/WebRTC modal with 18ms RTT, then close it. | *"Inspired by VoiceStudio, we also feature a full carrier telephony line simulation with real-time WebRTC telemetry, sub-20 millisecond round-trip time, and zero packet loss."* |
| **2:00 – 2:15** | Toggle **`Take Over`** button to ON (yellow badge turns on). Type into the *Say on Call* input: *"Fire Unit 4 is 90s away. Evacuate 100m north!"* and hit **`Say`**. | *"And if a human command supervisor needs to intervene, they simply hit **Human Operator Takeover**. AI speech pauses, and the supervisor can inject direct verbal orders straight to the caller on the line."* |

---

### 2:15 – 2:45 | Interactive Waveform Player & 3D Digital Twin
* **Screen View:** Audio Dispatch Playback widget & 3D Earth Globe.

| Timecode | Visual / Screen Action | Spoken Narration (What Aarush Says) |
| :--- | :--- | :--- |
| **2:15 – 2:30** | Click the **Play (▶)** button on the **Audio Dispatch Playback** waveform player. Watch the canvas bars pulse. | *"Command leads can review recorded transmissions directly using our dual-gradient Opus waveform visualizer with synchronized timecode seeking."* |
| **2:30 – 2:45** | Switch to Tab 2 (`http://localhost:5173/map` or `http://localhost:5173/`). Click a pin to lock coordinates. | *"Every voice dispatch instantly closes the loop with our 3D digital twin and Open311 v2 compliant API, mobilizing verified municipal repair crews with strict SLAs."* |

---

### 2:45 – 3:00 | Outro & Submission Summary
* **Screen View:** Tab 1 (`http://localhost:5173/dispatch`) showing the full active command center.

| Timecode | Spoken Narration (What Aarush Says) |
| :--- | :--- |
| **2:45 – 3:00** | *"Community Hero transforms passive municipal hotlines into an autonomous, empathetic, and life-saving voice intelligence infrastructure. Built for the **Bolna x Y Combinator Symphony Buildathon** by Team Community Hero, Group 104, IIIT Bhopal. Thank you!"* |

---

## 💡 Quick Tips for a 10/10 Video
1. **Speak with confidence and energy**: Keep the pace brisk and conversational.
2. **Let the voice AI speak**: When the AI speaks, pause for 2–3 seconds so the judges clearly hear the audio quality.
3. **Keep the mouse smooth**: Avoid frantic cursor shaking; point cleanly to the buttons you click.
4. **Resolution**: 1080p full screen with your Chrome browser maximized gives the sharpest presentation.

