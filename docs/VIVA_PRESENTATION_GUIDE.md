# Community Hero — Viva & Project Presentation Cheatsheet
> **B.Tech (CSE) Minor Project Phase III Defense Guide**
> **Students**: Aarush Bharti (24U020010) & Ashish Goutam (24U020011)
> **Supervisor**: Dr. Sreemoyee Biswas | **Date**: 20 October 2026
> **Length**: 22 Pages | **Study Time**: ~1.5 to 2 Hours

---

## 🎯 1. How to Explain Community Hero in 60 Seconds
> *"Good morning ma'am/sir. Our project is **Community Hero**, a hyperlocal civic issue solver. In most Indian cities, reporting a pothole, broken streetlight, or garbage dump is frustrating—complaint portals are confusing, citizens never get status updates, and municipal workers get overwhelmed by duplicate complaints.*
>
> *We built a fast, interactive web platform where citizens can see reported issues on an interactive **3D Virtual Earth (Three.js)** and a **2D street map (Leaflet)**.*
>
> *To automate complaint sorting without using external paid cloud APIs, we **trained our own machine learning text classification model** in Python (Scikit-Learn with TF-IDF and Naive Bayes) on a labeled dataset of 1,200 municipal complaints across 5 categories. It achieves 89.2% accuracy and runs 100% offline on our local server.*
>
> *To save municipal staff time, we built a **75-meter spatial duplicate check** using the Haversine formula—if someone already reported the same pothole on that street, new reports are grouped into the original ticket instead of creating a second job.*
>
> *The backend uses Node.js, Express, and a fast SQLite database in WAL mode, with Server-Sent Events (SSE) for real-time live dashboard alerts."*

---

## 🏗️ 2. Core Features Breakdown (Simple English)

| Feature | What It Does | Why It Matters | Tech Used |
|---|---|---|---|
| **3D Virtual Earth** | Renders a rotating 3D globe showing colored pins for all reported issues. | Makes civic data visual and exciting to explore rather than boring tables. | Three.js + React Three Fiber |
| **2D Street Map** | Detailed street map where users drop a pin at their exact location with a photo. | Lets citizens pinpoint the exact street, crossroad, or landmark. | Leaflet + OpenStreetMap |
| **Trained ML Model** | Classifies complaint text into 5 categories & computes an urgency score (1–5). | Eliminates manual sorting for municipal workers; runs 100% offline with NO API keys. | Python, Scikit-Learn, TF-IDF, Naive Bayes |
| **75m Duplicate Check** | Checks if an active issue in the same category exists within 75 meters. | Stops municipal repair crews from being sent twice to the same pothole. | Haversine Formula in Node.js |
| **Live SSE Updates** | Sends instant push updates to open browser windows when status changes. | Admin dashboard and citizen maps update live without manual page refresh. | Server-Sent Events (SSE) |
| **Gamification (XP)** | Gives users 50 XP for reporting and 10 XP for verifying real issues. | Motivates community participation through badges and leaderboards. | Custom XP & Leveling Engine |

---

## ❓ 3. Top 8 Viva Questions & Exact Answers to Give

### Q1: "How did you do the AI/ML part? Did you use any external APIs?"
**Your Answer**:
*"No ma'am/sir, we did not use any external cloud APIs or API keys. We trained our own machine learning model locally in Python. We gathered and labeled a dataset of 1,200 municipal complaint descriptions across five categories: Potholes, Streetlights, Water Leaks, Garbage Dumps, and Electrical Hazards. We used TF-IDF for text feature extraction and trained a Multinomial Naive Bayes classifier in Scikit-Learn. The model achieved 89.2% accuracy, was exported as `civic_model.pkl`, and runs completely offline on our local server in just 4 milliseconds."*

### Q2: "What is your complete tech stack and why did you choose it?"
**Your Answer**:
- **Frontend**: React 18 with Vite for fast page loading, Three.js for the 3D globe, Leaflet for the 2D street map, and Tailwind CSS for responsive styling.
- **Backend**: Node.js with Express.js because it is lightweight and handles concurrent requests easily.
- **ML Engine**: Python with Scikit-Learn for training and offline inference.
- **Database**: SQLite (via `better-sqlite3`) in Write-Ahead Logging (WAL) mode. It requires zero configuration, has no separate server process overhead, and gives sub-millisecond query responses.

### Q3: "How does the 75-meter duplicate detection algorithm work?"
**Your Answer**:
*"When a new report arrives with a latitude and longitude, we query active unresolved tickets in the same category. For each candidate, we calculate the distance in meters using the **Haversine formula**, which accounts for the curvature of the Earth:*
$$\text{Distance} = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta\text{lng}}{2}\right)}\right)$$
*If the distance is $\le 75$ meters, we set `duplicate_of = parent_id` and increment the verification count instead of creating a second repair job."*

### Q4: "How does the 3D Earth Globe position issues?"
**Your Answer**:
*"In Three.js, the Earth is modeled as a 3D sphere. We convert each report's geographic coordinates (latitude and longitude in degrees) into 3D Cartesian coordinates $(X, Y, Z)$ on the sphere surface using standard spherical trigonometry:*
$$X = -R \cdot \sin(\phi) \cdot \cos(\theta), \quad Y = R \cdot \cos(\phi), \quad Z = R \cdot \sin(\phi) \cdot \sin(\theta)$$
*where $\phi = (90 - \text{lat}) \cdot \frac{\pi}{180}$ and $\theta = (\text{lng} + 180) \cdot \frac{\pi}{180}$. Then we place a glowing status pin at $(X, Y, Z)$."*

### Q5: "Why did you use Server-Sent Events (SSE) instead of WebSockets?"
**Your Answer**:
*"WebSockets are two-way (full-duplex), which is needed for chat apps, but adds unnecessary complexity and handshake overhead. For our civic dashboard, updates are purely **server-to-client** (pushing new tickets and status changes to open browsers). Server-Sent Events (SSE) run over standard HTTP, include built-in automatic client reconnection, and use much less server memory."*

### Q6: "How did you prevent users from spamming votes or fake reports?"
**Your Answer**:
*"In the database, we added a unique constraint: `UNIQUE(issue_id, user_id)` on the verifications table. If a user tries to upvote the same issue twice, SQLite immediately blocks it with an integrity error, and the API returns HTTP 409 Conflict. For report submissions, we use Zod schema validation to verify coordinate bounds and text lengths."*

### Q7: "What were your testing results?"
**Your Answer**:
*"We ran 6 formal test cases (TC1 to TC6):*
1. *Submitting valid reports: Passed (trained model classified correctly, pin appeared on 3D globe).*
2. *Testing duplicate detection at 40 meters: Passed (linked to parent ticket).*
3. *Testing duplicate rejection at 95 meters: Passed (created independent ticket).*
4. *Double-voting prevention: Passed (blocked by SQLite unique constraint).*
5. *Open311 schema response: Passed (standard JSON returned).*
6. *Live status change to 'resolved': Passed (pins turned green in <15ms via SSE).*
*All endpoints had average response times under 20 milliseconds."*

### Q8: "What are your future plans for Phase IV?"
**Your Answer**:
*"For Phase IV, we plan to:*
1. *Build a downloadable Android mobile app using React Native with offline photo caching.*
2. *Mount small cameras on city buses running lightweight YOLO models to automatically detect road potholes while driving.*
3. *Expand the training dataset to include Marathi, Tamil, and Bengali complaints."*
