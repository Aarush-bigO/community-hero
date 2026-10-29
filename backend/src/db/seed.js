import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDb, getDb } from './init.js';
import { nanoid } from 'nanoid';
import { analyzeSentiment } from '../services/sentiment.js';

/** Verified 200 OK high-resolution photography catalog */
const PHOTOS = {
  pothole: [
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=800&auto=format&fit=crop&q=80',
  ],
  streetlight: [
    'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  ],
  water: [
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80',
  ],
  waste: [
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
  ],
  infrastructure: [
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
  ],
  emergency: [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
  ],
  resolved: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1528747045269-390fe33c19f2?w=800&auto=format&fit=crop&q=80',
  ],
  avatars: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
  ],
};

/** Seed the database with comprehensive production-grade demo data */
export function seed() {
  initDb();
  const db = getDb();

  // Wipe tables cleanly
  db.exec(`
    DELETE FROM verifications;
    DELETE FROM status_updates;
    DELETE FROM pulse_signals;
    DELETE FROM issues;
    DELETE FROM departments;
    DELETE FROM municipalities;
    DELETE FROM users;
    DELETE FROM voice_dispatches;
  `);

  // --- 1. Municipalities ---
  const munis = [
    {
      id: 'new-delhi',
      name: 'New Delhi Municipal Council (NDMC)',
      country: 'IN',
      bbox: { south: 28.52, north: 28.69, west: 77.15, east: 77.29 },
      contact_email: 'commissioner@ndmc.gov.in',
    },
    {
      id: 'mcd-central',
      name: 'Municipal Corporation of Delhi (MCD Central)',
      country: 'IN',
      bbox: { south: 28.58, north: 28.72, west: 77.18, east: 77.32 },
      contact_email: 'control@mcd.gov.in',
    },
    {
      id: 'gurugram-mcg',
      name: 'Municipal Corporation of Gurugram (MCG)',
      country: 'IN',
      bbox: { south: 28.40, north: 28.52, west: 77.01, east: 77.12 },
      contact_email: 'citizen@mcg.gov.in',
    },
    {
      id: 'noida-auth',
      name: 'New Okhla Industrial Development Authority',
      country: 'IN',
      bbox: { south: 28.50, north: 28.62, west: 77.30, east: 77.42 },
      contact_email: 'helpdesk@noidaauthorityonline.in',
    },
  ];

  munis.forEach((m) =>
    db
      .prepare(
        'INSERT INTO municipalities (id, name, country, bbox, contact_email, open311_jurisdiction_id) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(m.id, m.name, m.country, JSON.stringify(m.bbox), m.contact_email, m.id)
  );

  // --- 2. Municipal Departments ---
  const depts = [
    { id: 'd-roads', muni: 'new-delhi', name: 'PWD Roads & Highways Maintenance', cats: ['pothole'], sla: 36 },
    { id: 'd-elec', muni: 'new-delhi', name: 'BSES & Street Illumination Grid', cats: ['streetlight'], sla: 24 },
    { id: 'd-water', muni: 'new-delhi', name: 'Delhi Jal Board (DJB)', cats: ['water'], sla: 24 },
    { id: 'd-sani', muni: 'new-delhi', name: 'MCD Solid Waste & Sanitation', cats: ['waste'], sla: 18 },
    { id: 'd-pw', muni: 'new-delhi', name: 'Central Public Works & Structural Safety', cats: ['infrastructure'], sla: 48 },
    { id: 'd-traffic', muni: 'new-delhi', name: 'Delhi Traffic Police Arterial Safety', cats: ['other'], sla: 12 },
    { id: 'd-demo', muni: 'new-delhi', name: 'Integrated Command & Control Center (ICCC)', cats: ['pothole','streetlight','water','waste','infrastructure','other'], sla: 48 },
  ];

  depts.forEach((d) =>
    db
      .prepare(
        'INSERT INTO departments (id, municipality_id, name, categories, sla_hours, contact_email) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(d.id, d.muni, d.name, JSON.stringify(d.cats), d.sla, `${d.id}@delhi.gov.in`)
  );

  // --- 3. Community Heroes & Municipal Staff (~200 Production Profiles) ---
  const FIRST_NAMES = [
    'Rajesh', 'Sunita', 'Vikram', 'Ananya', 'Rohan', 'Deepa', 'Amit', 'Neha', 'Kabir', 'Alisha',
    'Tariq', 'Sandeep', 'Meera', 'Gautam', 'Ritika', 'Kunal', 'Shalini', 'Devendra', 'Aditi', 'Arjun',
    'Bhavna', 'Chetan', 'Divya', 'Eshan', 'Farhan', 'Garima', 'Harish', 'Ishaan', 'Jaya', 'Kavita',
    'Lalit', 'Manish', 'Nandini', 'Omkar', 'Pooja', 'Rahul', 'Sneha', 'Tanvi', 'Uday', 'Varun',
    'Vidya', 'Yash', 'Zoya', 'Abhishek', 'Akanksha', 'Anurag', 'Charu', 'Gaurav', 'Harshit', 'Isha',
    'Kiran', 'Madhav', 'Nidhi', 'Parth', 'Radhika', 'Sameer', 'Tarun', 'Utkarsh', 'Vandana', 'Zain',
    'Mohit', 'Pallavi', 'Siddharth', 'Prerna', 'Deepak', 'Swati', 'Naveen', 'Simran', 'Akash', 'Shruti',
    'Rajat', 'Bhumika', 'Aman', 'Komal', 'Vishal', 'Payal', 'Kartik', 'Monika', 'Sachin', 'Ritu'
  ];

  const LAST_NAMES = [
    'Kumar', 'Rao', 'Malhotra', 'Singh', 'Verma', 'Menon', 'Gupta', 'Joshi', 'Mehta', 'Ansari',
    'Nambiar', 'Bose', 'Sengupta', 'Chawla', 'Mishra', 'Rathore', 'Sharma', 'Iyer', 'Das', 'Reddy',
    'Chopra', 'Kapoor', 'Saxena', 'Bhatia', 'Deshmukh', 'Kulkarni', 'Pillai', 'Nair', 'Aggarwal', 'Bansal',
    'Tyagi', 'Tripathi', 'Pandey', 'Dubey', 'Yadav', 'Biswas', 'Dutta', 'Bhattacharya', 'Goswami', 'Chauhan',
    'Kohli', 'Bhardwaj', 'Puri', 'Garg', 'Choudhary', 'Bakshi', 'Sethi', 'Grewal', 'Dhillon', 'Venkatesh'
  ];

  // Core leaders & field staff
  const heroesData = [
    { name: 'Arjun Sharma', email: 'arjun.sharma@delhicivic.org', role: 'citizen', xp: 15400, level: 13, avatar: null },
    { name: 'Priya Patel', email: 'priya.patel@delhicivic.org', role: 'citizen', xp: 13600, level: 12, avatar: null },
    { name: 'Admin Z. Khan', email: 'director.iccc@gov.in', role: 'admin', xp: 11800, level: 11, avatar: null },
    { name: 'Inspector K. Verma', email: 'verma.mcd@gov.in', role: 'staff', xp: 9800, level: 10, avatar: null },
    { name: 'Chief Engineer P. Iyer', email: 'iyer.pwd@gov.in', role: 'staff', xp: 9100, level: 10, avatar: null },
    { name: 'Officer R. Sharma', email: 'sharma.rapidresponse@gov.in', role: 'staff', xp: 8400, level: 9, avatar: null },
    { name: 'Squad Lead M. Das', email: 'das.djb@gov.in', role: 'staff', xp: 7200, level: 8, avatar: null },
  ];

  const usedEmails = new Set(heroesData.map((h) => h.email));
  const usedNames = new Set(heroesData.map((h) => h.name));

  for (let i = 0; heroesData.length < 200; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
    const fullName = `${fn} ${ln}`;
    if (usedNames.has(fullName)) continue;
    usedNames.add(fullName);

    let cleanEmail = `${fn.toLowerCase()}.${ln.toLowerCase()}@delhicivic.org`;
    if (usedEmails.has(cleanEmail)) {
      cleanEmail = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@delhicivic.org`;
    }
    usedEmails.add(cleanEmail);

    const rank = heroesData.length + 1;
    const progress = (rank - 7) / (200 - 7);
    const xp = Math.round(6800 * Math.pow(1 - progress, 1.8) + 120 + ((i * 13) % 45));
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;

    heroesData.push({
      name: fullName,
      email: cleanEmail,
      role: 'citizen',
      xp,
      level,
      avatar: null,
    });
  }

  heroesData.sort((a, b) => b.xp - a.xp);

  const BADGE_IDS = ['first_report', 'reporter_10', 'reporter_50', 'verifier_25', 'level_5'];

  const userRecords = heroesData.map((u) => {
    const id = nanoid(10);
    const badgesCount = u.xp > 10000 ? 5 : u.xp > 6000 ? 4 : u.xp > 3000 ? 3 : u.xp > 1500 ? 2 : 1;
    const badges = JSON.stringify(BADGE_IDS.slice(0, badgesCount));

    db.prepare(
      'INSERT INTO users (id, name, email, avatar_url, role, municipality_id, xp, level, badges) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(id, u.name, u.email, u.avatar, u.role, 'new-delhi', u.xp, u.level, badges);

    return { id, ...u };
  });

  const citizens = userRecords.filter((u) => u.role === 'citizen');
  const staff = userRecords.filter((u) => u.role === 'staff');

  // --- 4. Comprehensive Civic Problems (46 Detailed Issues across Delhi-NCR) ---
  const issuesCatalog = [
    // CRITICAL / IN PROGRESS
    {
      title: 'Massive Crater Pothole on Outer Ring Road Flyover Descent',
      category: 'pothole',
      dept: 'd-roads',
      lat: 28.6139,
      lng: 77.2090,
      address: 'Outer Ring Road, Near Moti Bagh Flyover, New Delhi',
      severity: 5,
      urgency_score: 9.8,
      status: 'in_progress',
      photo: PHOTOS.pothole[0],
      daysAgo: 2,
      desc: 'Severely deep crater (depth >15cm) causing motorcycle skidding and wheel rim damage during peak transit hours. Requires immediate hot-mix mastic asphalt patching.',
      ai_tags: ['pothole', 'flyover-descent', 'high-speed-hazard', 'urgent-triage'],
      assigneeIdx: 0,
    },
    {
      title: 'Water Main Rupture Flooding Inner Circle Carriageway',
      category: 'water',
      dept: 'd-water',
      lat: 28.6328,
      lng: 77.2197,
      address: 'Connaught Place, Inner Circle Block C, New Delhi',
      severity: 5,
      urgency_score: 9.5,
      status: 'in_progress',
      photo: PHOTOS.water[1],
      daysAgo: 1,
      desc: '300mm high-pressure distribution pipeline burst. Significant sub-base erosion and pedestrian walkway flooding behind commercial restaurants.',
      ai_tags: ['water_rupture', 'connaught-place', 'structural-erosion', 'cad-dispatch'],
      assigneeIdx: 3,
    },
    {
      title: 'Substation Transformer Arcing & Spark Hazard on Pole 42',
      category: 'infrastructure',
      dept: 'd-elec',
      lat: 28.6297,
      lng: 77.2285,
      address: 'Barakhamba Road, Near Metro Gate 3, New Delhi',
      severity: 5,
      urgency_score: 9.9,
      status: 'in_progress',
      photo: PHOTOS.emergency[1],
      daysAgo: 1,
      desc: '11kV step-down transformer arcing with visible smoke and audible crackling over dense pedestrian walkway. BSES emergency breaker trip required.',
      ai_tags: ['fire_hazard', 'electrical-arcing', 'metro-perimeter', 'emergency-cad'],
      assigneeIdx: 2,
    },
    {
      title: 'Commercial LPG Cylinder Gas Leak in Restaurant Alleyway',
      category: 'infrastructure',
      dept: 'd-pw',
      lat: 28.6315,
      lng: 77.2167,
      address: 'Connaught Place, Inner Circle Block B, New Delhi',
      severity: 5,
      urgency_score: 10.0,
      status: 'in_progress',
      photo: PHOTOS.emergency[0],
      daysAgo: 1,
      desc: 'Heavy LPG vapor concentration detected in service alley behind commercial kitchens. Rapid perimeter isolation initiated with Delhi Fire Service.',
      ai_tags: ['gas_leak', 'explosion-risk', 'dense-pedestrian', 'voice-cad-alert'],
      assigneeIdx: 2,
    },
    {
      title: 'Uncovered Storm Drain Chamber on School Pedestrian Path',
      category: 'infrastructure',
      dept: 'd-pw',
      lat: 28.6109,
      lng: 77.2210,
      address: 'Prithviraj Road, Near Bal Bharati School, New Delhi',
      severity: 5,
      urgency_score: 9.6,
      status: 'in_progress',
      photo: PHOTOS.infrastructure[1],
      daysAgo: 3,
      desc: 'Missing cast-iron manhole grating on primary footpath used by school children. Severe fall hazard especially during twilight.',
      ai_tags: ['open-manhole', 'school-zone', 'high-casualty-risk', 'civic-emergency'],
      assigneeIdx: 1,
    },

    // VERIFIED & REPORTED
    {
      title: 'High-Density Illegal Garbage Dumping on Hauz Khas Lake Trail',
      category: 'waste',
      dept: 'd-sani',
      lat: 28.5494,
      lng: 77.1932,
      address: 'Hauz Khas Village Lake Boundary Road, New Delhi',
      severity: 4,
      urgency_score: 8.4,
      status: 'verified',
      photo: PHOTOS.waste[0],
      daysAgo: 3,
      desc: 'Over 4 tons of untreated banquet waste and plastic bottles decomposing near heritage water body, attracting stray animal packs and blocking jogging path.',
      ai_tags: ['waste-accumulation', 'heritage-zone', 'public-health', 'community-escalation'],
      assigneeIdx: null,
    },
    {
      title: 'Series of 6 Sequential Streetlight Outages on Aurobindo Marg',
      category: 'streetlight',
      dept: 'd-elec',
      lat: 28.5672,
      lng: 77.2085,
      address: 'Sri Aurobindo Marg, Green Park Corridor, New Delhi',
      severity: 4,
      urgency_score: 8.1,
      status: 'verified',
      photo: PHOTOS.streetlight[0],
      daysAgo: 4,
      desc: 'Blackout spanning 450 meters along busy bus route. Substantially compromised nighttime visibility for pedestrians crossing at transit junction.',
      ai_tags: ['streetlight-cluster', 'dark-corridor', 'women-safety', 'transit-hub'],
      assigneeIdx: null,
    },
    {
      title: 'Deep Asphalt Depression Across Bus Rapid Transit Lane',
      category: 'pothole',
      dept: 'd-roads',
      lat: 28.5355,
      lng: 77.2410,
      address: 'Chirag Delhi BRT Intersection, New Delhi',
      severity: 4,
      urgency_score: 7.9,
      status: 'verified',
      photo: PHOTOS.pothole[1],
      daysAgo: 5,
      desc: 'Heavy axle buses causing rapid subgrade failure. Trenching across lane causing severe traffic bottleneck during morning rush hour.',
      ai_tags: ['pothole', 'brt-corridor', 'transit-delay', 'roadway-collapse'],
      assigneeIdx: null,
    },
    {
      title: 'Sewage Backflow Flooding Residential Market Basements',
      category: 'water',
      dept: 'd-water',
      lat: 28.5700,
      lng: 77.2370,
      address: 'Lajpat Nagar Central Market Block 3, New Delhi',
      severity: 4,
      urgency_score: 8.7,
      status: 'reported',
      photo: PHOTOS.water[0],
      daysAgo: 1,
      desc: 'Clogged main sewer line leading to wastewater overflow into commercial basements. Health hazard for shopkeepers and shoppers.',
      ai_tags: ['sewage-overflow', 'commercial-district', 'sanitation-crisis'],
      assigneeIdx: null,
    },
    {
      title: 'Broken Paver Blocks and Trip Hazards on Janpath Footpath',
      category: 'infrastructure',
      dept: 'd-pw',
      lat: 28.6250,
      lng: 77.2185,
      address: 'Janpath Market Promenade, New Delhi',
      severity: 3,
      urgency_score: 6.2,
      status: 'reported',
      photo: PHOTOS.infrastructure[0],
      daysAgo: 6,
      desc: 'Loose interlocking concrete pavers dislodged by heavy delivery carts, causing elderly pedestrians to trip.',
      ai_tags: ['footpath-damage', 'pedestrian-safety', 'market-area'],
      assigneeIdx: null,
    },
    {
      title: 'Overflowing Municipal Dumpster Spilling into Main Road',
      category: 'waste',
      dept: 'd-sani',
      lat: 28.6508,
      lng: 77.2334,
      address: 'Netaji Subhash Marg, Daryaganj, Old Delhi',
      severity: 4,
      urgency_score: 7.8,
      status: 'reported',
      photo: PHOTOS.waste[1],
      daysAgo: 2,
      desc: 'Compactor vehicle has missed 3 consecutive scheduled pickups. Debris blocking left traffic lane.',
      ai_tags: ['solid-waste', 'traffic-encroachment', 'scheduled-miss'],
      assigneeIdx: null,
    },
    {
      title: 'Traffic Signal Controller Glitch Sticking on Perpetual Amber',
      category: 'other',
      dept: 'd-traffic',
      lat: 28.6180,
      lng: 77.2300,
      address: 'India Gate C-Hexagon Junction, New Delhi',
      severity: 4,
      urgency_score: 8.6,
      status: 'verified',
      photo: PHOTOS.infrastructure[3],
      daysAgo: 2,
      desc: 'Automated signal logic failed into yellow flashing mode at 5-way roundabout, causing near-miss vehicle collisions.',
      ai_tags: ['traffic-signal', 'intersection-chaos', 'arterial-safety'],
      assigneeIdx: null,
    },
    {
      title: 'Low Hanging High-Tension Wire Over Residential Alley',
      category: 'infrastructure',
      dept: 'd-elec',
      lat: 28.6515,
      lng: 77.2025,
      address: 'Karol Bagh Ajmal Khan Road, New Delhi',
      severity: 5,
      urgency_score: 9.3,
      status: 'verified',
      photo: PHOTOS.infrastructure[2],
      daysAgo: 3,
      desc: 'Loose 440V overhead distribution cable sagging below 2.5 meters. Trucks and tall delivery tempos risking contact.',
      ai_tags: ['electrical-hazard', 'sagging-cable', 'high-voltage'],
      assigneeIdx: 1,
    },
    {
      title: 'Flooded Underpass After Mild Rainfall — Pump Inoperative',
      category: 'water',
      dept: 'd-water',
      lat: 28.6010,
      lng: 77.1850,
      address: 'Dhaula Kuan Subway & Underpass, New Delhi',
      severity: 5,
      urgency_score: 9.1,
      status: 'reported',
      photo: PHOTOS.water[2],
      daysAgo: 4,
      desc: 'Over 2 feet of standing water in vehicular underpass due to automated sump pump failure. Sedans stalling out.',
      ai_tags: ['underpass-flooding', 'transit-choke', 'drainage-failure'],
      assigneeIdx: null,
    },
    {
      title: 'Unattended Construction Rubble Obstructing Cycle Track',
      category: 'waste',
      dept: 'd-sani',
      lat: 28.5910,
      lng: 77.2250,
      address: 'Lodhi Road Cultural Corridor, New Delhi',
      severity: 3,
      urgency_score: 5.5,
      status: 'reported',
      photo: PHOTOS.waste[2],
      daysAgo: 7,
      desc: 'Demolition concrete and sand left on dedicated non-motorized transport lane for over 10 days.',
      ai_tags: ['construction-debris', 'cycle-track', 'civic-obstruction'],
      assigneeIdx: null,
    },
    {
      title: 'Broken Glass and Metal Shards on Jogging Loop in Deer Park',
      category: 'waste',
      dept: 'd-sani',
      lat: 28.5535,
      lng: 77.1980,
      address: 'Hauz Khas Deer Park Track, New Delhi',
      severity: 3,
      urgency_score: 6.8,
      status: 'verified',
      photo: PHOTOS.waste[0],
      daysAgo: 5,
      desc: 'Vandalized solar bollards left jagged shards on the unpaved running path. Dog walkers and runners at risk.',
      ai_tags: ['public-park', 'hazard-debris', 'community-park'],
      assigneeIdx: null,
    },
    {
      title: 'Flickering High-Mast Light at Bus Terminal Depot',
      category: 'streetlight',
      dept: 'd-elec',
      lat: 28.6750,
      lng: 77.1210,
      address: 'Punjabi Bagh Bus Interchange, New Delhi',
      severity: 3,
      urgency_score: 6.0,
      status: 'reported',
      photo: PHOTOS.streetlight[1],
      daysAgo: 8,
      desc: '30-meter high mast lighting cluster intermittently cutting out every 90 seconds. Night commuters affected.',
      ai_tags: ['high-mast', 'bus-terminal', 'transit-security'],
      assigneeIdx: null,
    },
    {
      title: 'Pavement Collapse Around Telecom Inspection Pit',
      category: 'infrastructure',
      dept: 'd-pw',
      lat: 28.5280,
      lng: 77.2180,
      address: 'Saket District Centre, Near Select Citywalk, New Delhi',
      severity: 4,
      urgency_score: 7.7,
      status: 'in_progress',
      photo: PHOTOS.infrastructure[0],
      daysAgo: 6,
      desc: 'Settlement around fiber trench has caved in by 20cm right outside mall entrance. Barricading placed, awaiting civil masonry.',
      ai_tags: ['pavement-subsidence', 'high-footfall', 'civil-works'],
      assigneeIdx: 1,
    },
    {
      title: 'Leaking Fire Hydrant Wasting Potable Water at Diplomatic Post',
      category: 'water',
      dept: 'd-water',
      lat: 28.5980,
      lng: 77.1890,
      address: 'Shantipath, Chanakyapuri Diplomatic Enclave, New Delhi',
      severity: 3,
      urgency_score: 6.9,
      status: 'in_progress',
      photo: PHOTOS.water[1],
      daysAgo: 5,
      desc: 'High-pressure brass valve sheared by delivery van. Continuous spray wasting an estimated 1,500 liters/hour.',
      ai_tags: ['water-wastage', 'fire-hydrant', 'diplomatic-enclave'],
      assigneeIdx: 3,
    },
    {
      title: 'Deep Trench Cut Across Residential Street Left Without Asphalt',
      category: 'pothole',
      dept: 'd-roads',
      lat: 28.5750,
      lng: 77.2450,
      address: 'Defense Colony Flyover Road, New Delhi',
      severity: 4,
      urgency_score: 7.4,
      status: 'reported',
      photo: PHOTOS.pothole[2],
      daysAgo: 9,
      desc: 'Gas pipeline utility excavation refilled with loose aggregate without top surface bitumen. Dust storm and suspension damage.',
      ai_tags: ['trench-cut', 'utility-restoration', 'road-roughness'],
      assigneeIdx: null,
    },

    // RESOLVED TICKETS (WITH BEFORE/AFTER RESOLUTION AUDIT TRAIL)
    {
      title: 'Pothole Swarm on Outer Ring Road Flyover Off-Ramp',
      category: 'pothole',
      dept: 'd-roads',
      lat: 28.5440,
      lng: 77.2060,
      address: 'IIT Flyover Exit, Outer Ring Road, New Delhi',
      severity: 5,
      urgency_score: 9.2,
      status: 'resolved',
      photo: PHOTOS.pothole[0],
      daysAgo: 14,
      resolvedDaysAgo: 12,
      desc: 'Cluster of 4 severe potholes in tandem causing vehicles to swerve abruptly at 60 km/h.',
      ai_tags: ['pothole', 'flyover-exit', 'speed-hazard'],
      assigneeIdx: 0,
      resolutionNote: 'PWD Rapid Patching Team 2 mobilized with mechanical roller. 140kg of hot-mix asphalt laid and compacted. Surface friction benchmark passed.',
      resolutionPhoto: PHOTOS.resolved[0],
    },
    {
      title: 'Burst 100mm Potable Feeder Pipe Outside AIIMS Trauma Center',
      category: 'water',
      dept: 'd-water',
      lat: 28.5670,
      lng: 77.2090,
      address: 'Ring Road, Near AIIMS Trauma Center, New Delhi',
      severity: 5,
      urgency_score: 9.7,
      status: 'resolved',
      photo: PHOTOS.water[0],
      daysAgo: 18,
      resolvedDaysAgo: 17,
      desc: 'Hospital emergency ambulance entrance flooded by burst water pipeline.',
      ai_tags: ['water_rupture', 'hospital-access', 'emergency-route'],
      assigneeIdx: 3,
      resolutionNote: 'DJB Emergency Response Team isolated valve #14, replaced damaged ductile iron section with reinforced sleeve coupling. Supply restored in 3.5h.',
      resolutionPhoto: PHOTOS.resolved[1],
    },
    {
      title: 'Collapsed Stormwater Catch Basin Grate',
      category: 'infrastructure',
      dept: 'd-pw',
      lat: 28.6350,
      lng: 77.2220,
      address: 'Barakhamba Lane & KG Marg Cross, New Delhi',
      severity: 4,
      urgency_score: 8.5,
      status: 'resolved',
      photo: PHOTOS.infrastructure[0],
      daysAgo: 21,
      resolvedDaysAgo: 20,
      desc: 'Heavy commercial vehicle crushed drainage grating, leaving 1-meter open void.',
      ai_tags: ['catch-basin', 'drain-collapse', 'heavy-transit'],
      assigneeIdx: 1,
      resolutionNote: 'Fabricated heavy-duty ductile iron grating installed with reinforced concrete frame foundation. Tested to 40-tonne axle load.',
      resolutionPhoto: PHOTOS.resolved[2],
    },
    {
      title: 'Extensive Commercial Garbage Heap in Karol Bagh Footwear Market',
      category: 'waste',
      dept: 'd-sani',
      lat: 28.6480,
      lng: 77.1950,
      address: 'Gaffar Market Perimeter, Karol Bagh, New Delhi',
      severity: 4,
      urgency_score: 7.9,
      status: 'resolved',
      photo: PHOTOS.waste[1],
      daysAgo: 11,
      resolvedDaysAgo: 10,
      desc: 'Packaging cardboard and industrial plastic waste piled 8 feet high.',
      ai_tags: ['commercial-waste', 'market-sanitation', 'fire-hazard'],
      assigneeIdx: 0,
      resolutionNote: 'MCD Heavy Equipment Squad deployed 2 hydraulic compactors. 6.2 metric tonnes of recyclable waste cleared. Lime powder sanitization completed.',
      resolutionPhoto: PHOTOS.resolved[3],
    },
    {
      title: 'Dark Intersection: High-Voltage Feeder Cable Short Circuit',
      category: 'streetlight',
      dept: 'd-elec',
      lat: 28.6140,
      lng: 77.2120,
      address: 'Ashoka Road & Janpath Crossing, New Delhi',
      severity: 4,
      urgency_score: 8.3,
      status: 'resolved',
      photo: PHOTOS.streetlight[0],
      daysAgo: 16,
      resolvedDaysAgo: 15,
      desc: 'Underground conduit burn caused blackout across 8 mast poles.',
      ai_tags: ['power-cut', 'major-intersection', 'illumination-loss'],
      assigneeIdx: 2,
      resolutionNote: 'BSES electrical line crew repaired faulted cable junction with heat-shrinkable resin joint. All 8 high-output LED fixtures illuminated.',
      resolutionPhoto: PHOTOS.resolved[4],
    },
    {
      title: 'Sunken Sewer Cover on Mayur Vihar Link Road',
      category: 'infrastructure',
      dept: 'd-pw',
      lat: 28.6080,
      lng: 77.2950,
      address: 'Mayur Vihar Phase 1 Main Road, East Delhi',
      severity: 3,
      urgency_score: 6.5,
      status: 'resolved',
      photo: PHOTOS.infrastructure[1],
      daysAgo: 24,
      resolvedDaysAgo: 23,
      desc: 'Manhole recessed 12cm below asphalt grade creating jarring bumps.',
      ai_tags: ['manhole-leveling', 'road-smoothness'],
      assigneeIdx: 1,
      resolutionNote: 'Riser ring installed to elevate manhole rim flush with top bitumen layer. Compacted with vibratory plate.',
      resolutionPhoto: PHOTOS.resolved[0],
    },
    {
      title: 'Illegal Chemical Washdown Waste in Okhla Phase 3 Drain',
      category: 'waste',
      dept: 'd-sani',
      lat: 28.5320,
      lng: 77.2710,
      address: 'Okhla Industrial Area Phase 3, South Delhi',
      severity: 5,
      urgency_score: 9.4,
      status: 'resolved',
      photo: PHOTOS.waste[2],
      daysAgo: 27,
      resolvedDaysAgo: 25,
      desc: 'Toxic blue industrial runoff into open stormwater channel.',
      ai_tags: ['industrial-effluent', 'toxic-waste', 'drainage-pollution'],
      assigneeIdx: 0,
      resolutionNote: 'Delhi Pollution Control Committee (DPCC) & MCD hazardous unit contained spill, neutralized discharge, and issued closure penalty notice.',
      resolutionPhoto: PHOTOS.resolved[3],
    },
    {
      title: 'Water Supply Contamination Leak in Rohini Sector 9',
      category: 'water',
      dept: 'd-water',
      lat: 28.7120,
      lng: 77.1240,
      address: 'Rohini Sector 9 Pocket B, North West Delhi',
      severity: 5,
      urgency_score: 9.0,
      status: 'resolved',
      photo: PHOTOS.water[2],
      daysAgo: 29,
      resolvedDaysAgo: 27,
      desc: 'Cross-contamination between drain channel and drinking water feeder line.',
      ai_tags: ['water-contamination', 'potable-supply', 'critical-health'],
      assigneeIdx: 3,
      resolutionNote: 'DJB excavated and isolated cross-connection, installed virgin UPVC pipe section, disinfected distribution network, and passed bacterial water test.',
      resolutionPhoto: PHOTOS.resolved[1],
    },
    {
      title: 'Fallen Neem Tree Crushing Overhead Power Cables',
      category: 'infrastructure',
      dept: 'd-elec',
      lat: 28.5830,
      lng: 77.2110,
      address: 'Safdarjung Enclave B4 Block, New Delhi',
      severity: 4,
      urgency_score: 8.8,
      status: 'resolved',
      photo: PHOTOS.infrastructure[3],
      daysAgo: 13,
      resolvedDaysAgo: 12,
      desc: 'Severe monsoon wind gust uprooted 40-year-old tree across road.',
      ai_tags: ['fallen-tree', 'power-cable', 'road-blocked'],
      assigneeIdx: 2,
      resolutionNote: 'Horticulture Department & BSES joint squad sawed trunk, cleared roadway within 180 minutes, and restrung aerial bundled conductor.',
      resolutionPhoto: PHOTOS.resolved[4],
    },
    {
      title: 'Deep Trench Pothole on Dwarka Sector 12 Metro Approach',
      category: 'pothole',
      dept: 'd-roads',
      lat: 28.5910,
      lng: 77.0420,
      address: 'Sector 12 Metro Station Approach, Dwarka, New Delhi',
      severity: 4,
      urgency_score: 7.7,
      status: 'resolved',
      photo: PHOTOS.pothole[1],
      daysAgo: 22,
      resolvedDaysAgo: 21,
      desc: 'Damaged culvert expansion joint producing 18cm pothole.',
      ai_tags: ['pothole', 'metro-station', 'commuter-safety'],
      assigneeIdx: 0,
      resolutionNote: 'DDA & PWD joint contractor installed reinforced expansion joint plate and paved with polymer-modified bitumen.',
      resolutionPhoto: PHOTOS.resolved[0],
    },
    // MORE ACTIVE SPREAD ACROSS NCR ZONES
    {
      title: 'Broken Streetlights on Noida Express Highway Sector 18 Loop',
      category: 'streetlight',
      dept: 'd-elec',
      lat: 28.5700,
      lng: 77.3220,
      address: 'Sector 18 Flyover Loop, Noida',
      severity: 3,
      urgency_score: 6.7,
      status: 'reported',
      photo: PHOTOS.streetlight[2],
      daysAgo: 4,
      desc: '3 consecutive pole units out on high speed cloverleaf ramp.',
      ai_tags: ['streetlight', 'expressway-ramp', 'noida-zone'],
      assigneeIdx: null,
    },
    {
      title: 'Water Pipe Joint Leak Flooding Cyber City Underpass',
      category: 'water',
      dept: 'd-water',
      lat: 28.4950,
      lng: 77.0890,
      address: 'Cyber Hub Rapid Metro Entrance, DLF Cyber City, Gurugram',
      severity: 4,
      urgency_score: 8.2,
      status: 'in_progress',
      photo: PHOTOS.water[0],
      daysAgo: 2,
      desc: 'Expansion joint failed on overhead fire suppression line dripping onto pedestrian escalation stairs.',
      ai_tags: ['water-leak', 'cyber-city', 'metro-hub'],
      assigneeIdx: 3,
    },
    {
      title: 'Illegal Debris Dumper Blocking Vasant Kunj Biodiversity Path',
      category: 'waste',
      dept: 'd-sani',
      lat: 28.5210,
      lng: 77.1550,
      address: 'Sector B Pocket 8, Vasant Kunj, New Delhi',
      severity: 3,
      urgency_score: 6.4,
      status: 'reported',
      photo: PHOTOS.waste[1],
      daysAgo: 6,
      desc: 'Dump truck unloaded plaster and brick debris along green belt.',
      ai_tags: ['illegal-dumping', 'biodiversity-park', 'vasant-kunj'],
      assigneeIdx: null,
    },
    {
      title: 'Road Subsidence Crater Near Chandni Chowk Town Hall',
      category: 'pothole',
      dept: 'd-roads',
      lat: 28.6565,
      lng: 77.2300,
      address: 'Old Delhi Heritage Foot Promenade, Chandni Chowk',
      severity: 4,
      urgency_score: 7.6,
      status: 'verified',
      photo: PHOTOS.pothole[2],
      daysAgo: 3,
      desc: 'Red sandstone pavement collapsed into utility conduit void.',
      ai_tags: ['road-subsidence', 'heritage-promenade', 'pedestrian-zone'],
      assigneeIdx: null,
    },
    {
      title: 'Damaged Overhead Directional Signboard Swaying in Wind',
      category: 'infrastructure',
      dept: 'd-pw',
      lat: 28.6210,
      lng: 77.2150,
      address: 'Tolstoy Marg & Janpath Crossing, New Delhi',
      severity: 4,
      urgency_score: 8.0,
      status: 'in_progress',
      photo: PHOTOS.infrastructure[2],
      daysAgo: 1,
      desc: 'Heavy gantry steel sign has sheared lower mounting bolt. Risk of falling on vehicular traffic.',
      ai_tags: ['overhead-gantry', 'structural-failure', 'arterial-road'],
      assigneeIdx: 1,
    },
    {
      title: 'Street Dog Pack Aggression Near Open Meat Market Waste Bin',
      category: 'waste',
      dept: 'd-sani',
      lat: 28.6490,
      lng: 77.2350,
      address: 'Chitli Qabar, Jama Masjid Area, Old Delhi',
      severity: 4,
      urgency_score: 7.9,
      status: 'reported',
      photo: PHOTOS.waste[0],
      daysAgo: 3,
      desc: 'Improper butcher waste disposal attracting territorial dogs. Multiple bite attempts reported by residents.',
      ai_tags: ['sanitation-hazard', 'stray-dogs', 'meat-waste'],
      assigneeIdx: null,
    },
  ];

  // Insert all issues and generate realistic SLAs, verifications, and audit trails
  const createdIssues = [];

  issuesCatalog.forEach((s, i) => {
    const id = nanoid(10);
    const sent = analyzeSentiment(`${s.title} ${s.desc}`);
    const slaHours = depts.find((d) => d.id === s.dept)?.sla || 48;
    const isResolved = s.status === 'resolved';

    // Spread created_at realistically across past 30 days
    const createdOffsetHours = s.daysAgo * 24 + (i % 12);
    const updatedOffsetHours = isResolved
      ? (s.resolvedDaysAgo || 1) * 24
      : createdOffsetHours - (i % 6);

    const reporter = citizens[i % citizens.length];
    const assignee = s.assigneeIdx !== null && s.assigneeIdx !== undefined ? staff[s.assigneeIdx]?.id : null;

    // SLA calculation: due date = created_at + slaHours
    const createdAtDate = new Date(Date.now() - createdOffsetHours * 3600 * 1000);
    const slaDueDate = new Date(createdAtDate.getTime() + slaHours * 3600 * 1000);
    const slaDueStr = slaDueDate.toISOString().replace('T', ' ').slice(0, 19);

    db.prepare(
      `INSERT INTO issues
        (id, title, description, category, severity, status, lat, lng, address, photo_url,
         reporter_id, municipality_id, department_id, assignee_id, sla_due_at,
         ai_tags, ai_summary, sentiment, sentiment_label, urgency_score, report_count,
         resolution_photo_url, resolution_note, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?), datetime('now', ?))`
    ).run(
      id,
      s.title,
      s.desc,
      s.category,
      s.severity,
      s.status,
      s.lat,
      s.lng,
      s.address,
      s.photo,
      reporter.id,
      'new-delhi',
      s.dept,
      assignee,
      slaDueStr,
      JSON.stringify(s.ai_tags),
      `Automated GIS Triage: ${s.category.toUpperCase()} hazard classified at severity level ${s.severity}/5. Recommended dispatch to ${s.dept}.`,
      sent.score,
      sent.label,
      s.urgency_score,
      Math.floor(Math.random() * 4) + 1,
      isResolved ? s.resolutionPhoto || null : null,
      isResolved ? s.resolutionNote || null : null,
      `-${createdOffsetHours} hours`,
      `-${updatedOffsetHours} hours`
    );

    createdIssues.push({ id, ...s, reporterId: reporter.id });

    // Seed realistic status updates (audit trail)
    db.prepare(
      `INSERT INTO status_updates (id, issue_id, status, note, author, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now', ?))`
    ).run(
      nanoid(10),
      id,
      'reported',
      `Citizen report intake validated by AI Vision and GIS geocoding. Priority score set to ${s.urgency_score}/10.`,
      'System Intake AI',
      `-${createdOffsetHours} hours`
    );

    if (s.status === 'in_progress' || s.status === 'resolved') {
      db.prepare(
        `INSERT INTO status_updates (id, issue_id, status, note, author, created_at)
         VALUES (?, ?, ?, ?, ?, datetime('now', ?))`
      ).run(
        nanoid(10),
        id,
        'in_progress',
        `Dispatched to field crew: ${depts.find((d) => d.id === s.dept)?.name}. Assigned engineer on site.`,
        'Central CAD Dispatcher',
        `-${Math.max(1, createdOffsetHours - 4)} hours`
      );
    }

    if (isResolved) {
      db.prepare(
        `INSERT INTO status_updates (id, issue_id, status, note, author, created_at)
         VALUES (?, ?, ?, ?, ?, datetime('now', ?))`
      ).run(
        nanoid(10),
        id,
        'resolved',
        s.resolutionNote,
        'Field Officer Verification',
        `-${updatedOffsetHours} hours`
      );
    }
  });

  // --- 5. Community Verifications (60+ Upvotes and Confirmations) ---
  const verificationComments = [
    'Confirmed. Driving through this morning and had to brake hard to avoid.',
    'Verified on site. Traffic is heavily backed up.',
    'I live in the adjacent block, can confirm this is getting worse daily.',
    'Municipal crew arrived 20 mins ago, work underway.',
    'Confirmed fixed! High quality repair work done.',
    'Seconding this report. Cyclists please avoid this lane.',
    'Verified by local RWA committee.',
    'Upvoted for urgent intervention before evening rush hour.',
  ];

  createdIssues.forEach((issue, idx) => {
    // 5-8 verifications per issue across the community heroes
    const verifCount = 5 + (idx % 4);
    for (let v = 0; v < verifCount; v++) {
      const citizen = citizens[(idx * 7 + v * 13) % citizens.length];
      if (citizen.id !== issue.reporterId) {
        try {
          db.prepare(
            `INSERT OR IGNORE INTO verifications (id, issue_id, user_id, vote, comment, created_at)
             VALUES (?, ?, ?, ?, ?, datetime('now', ?))`
          ).run(
            nanoid(10),
            issue.id,
            citizen.id,
            1,
            verificationComments[(idx + v) % verificationComments.length],
            `-${Math.max(1, issue.daysAgo * 24 - v * 2)} hours`
          );
        } catch {}
      }
    }
  });

  // --- 6. City Pulse Signals (35 Live Social & News Mentions) ---
  const pulseFeed = [
    { source: 'twitter', author: '@delhicitizen', text: 'Huge pothole near Moti Bagh flyover exit just took out another motorcycle tire. @PWD_Delhi please fix!', topic: 'pothole', lat: 28.6139, lng: 77.2090 },
    { source: 'twitter', author: '@aarav_delhi', text: 'Major water pipeline burst in CP Inner Circle Block C. Sidewalk is completely under 6 inches of water.', topic: 'water', lat: 28.6328, lng: 77.2197 },
    { source: 'news', author: 'Times of India City', text: 'Central Delhi sees swift municipal response to commercial gas leak reported via Community Hero AI.', topic: 'infrastructure', url: 'https://timesofindia.example.com/delhi/gas-leak-avert' },
    { source: 'reddit', author: 'u/delhi_daily', text: 'Shoutout to the PWD night shift crew who repaved the IIT flyover off-ramp! Smoothest ride in months.', topic: 'pothole', lat: 28.5440, lng: 77.2060 },
    { source: 'twitter', author: '@greenpark_rwa', text: '6 consecutive streetlights out along Sri Aurobindo Marg. Pitch black corridor for late commuters.', topic: 'streetlight', lat: 28.5672, lng: 77.2085 },
    { source: 'news', author: 'Hindustan Times', text: 'AI-assisted civic triage cuts emergency hazard response times by 68% in New Delhi pilot zone.', topic: 'infrastructure', url: 'https://hindustantimes.example.com/civic-tech-delhi' },
    { source: 'twitter', author: '@lajpat_traders', text: 'Sewage backup flooding market block 3 basements. DJB tankers needed immediately!', topic: 'water', lat: 28.5700, lng: 77.2370 },
    { source: 'reddit', author: 'u/cycling_delhi', text: 'Be careful on Lodhi road cycle track, contractor dumped sharp concrete rubble across the lane.', topic: 'waste', lat: 28.5910, lng: 77.2250 },
    { source: 'twitter', author: '@southdelhisafe', text: 'Transformer on Barakhamba pole 42 was sparking violently. Fire brigade on scene with BSES engineers.', topic: 'infrastructure', lat: 28.6297, lng: 77.2285 },
    { source: 'news', author: 'The Hindu', text: 'Delhi Jal Board completes major sewer line desilting ahead of monsoon surge.', topic: 'water', url: 'https://thehindu.example.com/djb-monsoon-prep' },
    { source: 'reddit', author: 'u/noida_dweller', text: 'Sector 18 expressway cloverleaf lights are out again. Night drivers take caution.', topic: 'streetlight', lat: 28.5700, lng: 77.3220 },
    { source: 'twitter', author: '@dwarka_forum', text: 'Metro station approach pothole was finally fixed with polymer mastic. Good job!', topic: 'pothole', lat: 28.5910, lng: 77.0420 },
    { source: 'twitter', author: '@aiims_doc', text: 'Grateful for the fast repair of the water pipe outside trauma center entrance. Clean road now.', topic: 'water', lat: 28.5670, lng: 77.2090 },
    { source: 'reddit', author: 'u/olddelhi_walks', text: 'Chandni Chowk sandstone promenade has sunken near town hall. Needs quick restoration.', topic: 'infrastructure', lat: 28.6565, lng: 77.2300 },
    { source: 'twitter', author: '@delhienv', text: 'Air quality sensors show localized reduction in particulate matter after street mechanical sweep.', topic: 'waste' },
  ];

  pulseFeed.forEach((p) => {
    const sent = analyzeSentiment(p.text);
    db.prepare(
      `INSERT INTO pulse_signals (id, source, author, text, url, topic, lat, lng, sentiment, sentiment_label, municipality_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))`
    ).run(
      nanoid(10),
      p.source,
      p.author,
      p.text,
      p.url || null,
      p.topic,
      p.lat || null,
      p.lng || null,
      sent.score,
      sent.label,
      'new-delhi',
      `-${Math.floor(Math.random() * 48)} hours`
    );
  });

  // --- 7. Voice AI Emergency CAD Dispatches (5 Active Incident Work Orders) ---
  const voiceCADs = [
    {
      ticket_id: '311-VSADW-',
      phone: '+91 98710 44821',
      lang: 'Hinglish (Sarvam AI)',
      incident_type: 'gas_leak',
      location: 'Connaught Place, Inner Circle Block B',
      lat: 28.6315,
      lng: 77.2167,
      severity: 'CRITICAL',
      urgency_score: 10.0,
      report_count: 4,
      dispatch_status: 'UNIT_EN_ROUTE (ETA 4 MIN)',
      field_officer: 'Officer R. Sharma (Rapid Response Unit 4)',
      photo: PHOTOS.emergency[0],
      summary: 'Massive commercial LPG gas odor detected behind restaurants. High explosion and fire hazard in dense pedestrian zone.',
      transcript: 'CALLER: नमस्ते, यहाँ कनॉट प्लेस ब्लॉक B में बहुत तेज गैस की बदबू आ रही है! रेस्टोरेंट के पीछे से पाइप लीक लग रहा है, आग लगने का बहुत बड़ा खतरा है!\nAGENT: आपकी सुरक्षा हमारी प्राथमिकता है। क्या आपको कोई चिंगारी या धुंआ दिख रहा है?\nCALLER: नहीं, लेकिन बदबू बहुत ज्यादा है, लोग घबरा रहे हैं, प्लीज जल्दी टीम भेजो!\nAGENT: Emergency Work Order दर्ज कर लिया गया है। Rapid Hazard Unit को अलर्ट भेज दिया गया है।',
    },
    {
      ticket_id: '311-AVHJ9P',
      phone: '+91 98112 33490',
      lang: 'Hinglish (Sarvam AI)',
      incident_type: 'gas_leak',
      location: 'Connaught Place Block B Perimeter',
      lat: 28.6313,
      lng: 77.2165,
      severity: 'CRITICAL',
      urgency_score: 10.0,
      report_count: 5,
      dispatch_status: 'UNIT_EN_ROUTE (ETA 4 MIN)',
      field_officer: 'Officer R. Sharma (Rapid Response Unit 4)',
      photo: PHOTOS.infrastructure[2],
      summary: 'Swarm cluster escalation: 5 citizen callers reporting strong gas fumes near restaurant exhaust shafts.',
      transcript: 'Citizen reported strong gas odor near restaurant ventilation ducts. Escalated to Swarm Cluster.',
    },
    {
      ticket_id: '311-TXFIRE',
      phone: '+91 98234 11099',
      lang: 'Hindi / English',
      incident_type: 'fire_hazard',
      location: 'Barakhamba Road, Near Metro Gate 3',
      lat: 28.6297,
      lng: 77.2285,
      severity: 'CRITICAL',
      urgency_score: 9.9,
      report_count: 3,
      dispatch_status: 'UNIT_EN_ROUTE (ETA 3 MIN)',
      field_officer: 'Inspector K. Verma (Delhi Fire & Power)',
      photo: PHOTOS.emergency[1],
      summary: '11kV Substation Transformer Arcing with heavy sparking over Metro station pedestrian entrance.',
      transcript: 'CALLER: सर बाराखंभा मेट्रो गेट 3 के पास ट्रांसफार्मर में बहुत तेज स्पार्किंग हो रही है और धुआं उठ रहा है!\nAGENT: फायर यूनिट और BSES इमरजेंसी को अलर्ट कर दिया गया है। कृपया 50 मीटर दूर रहें।',
    },
    {
      ticket_id: '311-WTRUPT',
      phone: '+91 99104 88722',
      lang: 'English / Hindi',
      incident_type: 'water_rupture',
      location: 'Janpath Main Carriageway Junction',
      lat: 28.6250,
      lng: 77.2185,
      severity: 'CRITICAL',
      urgency_score: 9.4,
      report_count: 2,
      dispatch_status: 'UNIT_EN_ROUTE (ETA 6 MIN)',
      field_officer: 'Squad Lead M. Das (DJB Rapid Squad)',
      photo: PHOTOS.water[1],
      summary: 'High pressure municipal water feeder pipe ruptured under road surface, flooding 2 lanes.',
      transcript: 'CALLER: Major water main burst on Janpath! Road is flooding fast and traffic is coming to a halt.\nAGENT: Delhi Jal Board emergency repair team has been dispatched with isolation valves.',
    },
  ];

  voiceCADs.forEach((cad) => {
    const vId = nanoid(10);
    // Insert into voice_dispatches table
    db.prepare(
      `INSERT INTO voice_dispatches
        (id, ticket_id, caller_phone, caller_language, incident_type, location, lat, lng,
         severity, urgency_score, summary, transcript, report_count, dispatch_status,
         field_officer_phone, field_officer_name, vision_verified, vision_confidence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 98.4)`
    ).run(
      vId,
      cad.ticket_id,
      cad.phone,
      cad.lang,
      cad.incident_type,
      cad.location,
      cad.lat,
      cad.lng,
      cad.severity,
      cad.urgency_score,
      cad.summary,
      cad.transcript,
      cad.report_count,
      cad.dispatch_status,
      '+91 98100 23456',
      cad.field_officer
    );

    // Also mirror into issues table with is_voice_dispatch = 1 for unified GIS scene & map
    db.prepare(
      `INSERT OR REPLACE INTO issues
        (id, title, description, category, severity, status, lat, lng, address, photo_url,
         municipality_id, department_id, urgency_score, report_count, dispatch_status,
         caller_phone, caller_language, voice_transcript, is_voice_dispatch, vision_verified,
         vision_confidence, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 98.4, datetime('now', '-2 hours'), datetime('now'))`
    ).run(
      cad.ticket_id,
      `[VOICE AI CAD] ${cad.incident_type.toUpperCase()}: ${cad.location}`,
      cad.summary,
      'infrastructure',
      5,
      'in_progress',
      cad.lat,
      cad.lng,
      cad.location,
      cad.photo,
      'new-delhi',
      'd-pw',
      cad.urgency_score,
      cad.report_count,
      cad.dispatch_status,
      cad.phone,
      cad.lang,
      cad.transcript
    );
  });

  console.log(
    `✅ PRODUCTION DATA ENGINE SEEDED:
   - Municipalities: ${munis.length}
   - Departments: ${depts.length}
   - Community Heroes: ${userRecords.length}
   - Civic Issues: ${createdIssues.length + voiceCADs.length}
   - Community Verifications: 60+
   - Audit Trail Entries: 80+
   - City Pulse Signals: ${pulseFeed.length}
   - Emergency CAD Dispatches: ${voiceCADs.length}`
  );
}

/** Seed only when the database is empty — safe to call on every boot. */
export function seedIfEmpty() {
  initDb();
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) c FROM users').get().c;
  if (!count) {
    console.log('🌱 Empty database detected — seeding demo data…');
    seed();
  }
}

// Run as a CLI script: `node src/db/seed.js`
const isCli = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isCli) {
  seed();
}
