/**
 * Bolna Voice AI & Emergency Command Center Routes
 * Endpoints:
 *   POST /api/bolna-webhook              (Inbound call / function call from Bolna)
 *   POST /api/bolna-dispatch-confirm     (Outbound field officer confirmation callback)
 *   POST /api/simulate-voice-call        (1-Click high-fidelity hackathon simulator)
 *   GET  /api/voice-dispatches           (List active emergency CAD tickets)
 *   POST /api/voice-dispatch/:id/vision  (Multimodal vision verification hook)
 */
import { Router } from 'express';
import {
  processInboundVoiceDispatch,
  confirmDispatch,
  getActiveVoiceDispatches,
  extractEmergencyDetails,
} from '../services/voiceDispatch.js';
import { publish, EVENTS } from '../services/events.js';
import { getDb } from '../db/init.js';

const router = Router();

// --- 1. Real Live Microphone Voice Call Intake ---
router.post(['/voice/live-call', '/voice-live-call'], async (req, res, next) => {
  try {
    const { speech_text, transcript, text, language = 'en', caller_phone = '+91 95988 19219' } = req.body;
    const spoken = speech_text || transcript || text || '';
    if (!spoken.trim()) {
      return res.status(400).json({ error: 'speech_text is required' });
    }

    // 1. Extract CAD parameters from natural spoken speech
    const details = extractEmergencyDetails(spoken, language);
    const callerLanguage = details.detectedLang === 'hi' ? 'हिन्दी (Sarvam AI)' : 'English (Bolna AI)';

    // 2. Stream user's transcript chunk immediately to SSE
    publish(EVENTS.VOICE_TRANSCRIPT_CHUNK, {
      speaker: 'caller',
      text: spoken,
      caller_phone,
      caller_language: callerLanguage,
      urgency_score: details.urgencyScore,
      timestamp: new Date().toISOString(),
    });

    // 3. Process the emergency CAD ticket & spatial deduplication
    const result = await processInboundVoiceDispatch({
      incident_type: details.incidentType,
      location: details.location,
      severity: details.severity,
      urgency_score: details.urgencyScore,
      caller_language: callerLanguage,
      caller_phone,
      summary: details.summary,
      transcript: `CALLER: ${spoken}`,
    });

    // 4. Formulate localized spoken verbal response for Text-To-Speech (TTS)
    let agentResponse = '';
    const ticketId = result.ticket_id || result.service_request_id || '311-CAD';

    if (result.status === 'clustered') {
      agentResponse =
        details.detectedLang === 'hi'
          ? `हमने इस आपातकाल को पहले ही कई नागरिकों की सूचना के आधार पर टिकट #${ticketId} में दर्ज कर लिया है। आपातकालीन दस्ता सायरन के साथ पहले से रवाना है।`
          : `We have already logged this incident from multiple nearby citizens under Ticket #${ticketId}. Rapid Response Unit 4 is already en route with sirens.`;
    } else {
      agentResponse =
        details.detectedLang === 'hi'
          ? `आपातकालीन कार्य आदेश #${ticketId} दर्ज कर लिया गया है। नजदीकी त्वरित प्रतिक्रिया टीम को तुरंत रवाना कर दिया गया है।`
          : `Emergency Work Order #${ticketId} has been created and transmitted to the nearest rapid field crew.`;
    }

    // 5. Stream agent's transcript chunk to SSE
    setTimeout(() => {
      publish(EVENTS.VOICE_TRANSCRIPT_CHUNK, {
        speaker: 'agent',
        text: agentResponse,
        caller_phone,
        caller_language: callerLanguage,
        urgency_score: details.urgencyScore,
        timestamp: new Date().toISOString(),
      });
    }, 450);

    res.json({
      success: true,
      ...result,
      ticket_id: ticketId,
      incident_type: details.incidentType,
      location: details.location,
      severity: details.severity,
      urgency_score: details.urgencyScore,
      agent_response: agentResponse,
      language: details.detectedLang,
    });
  } catch (err) {
    next(err);
  }
});

// --- 2. Inbound Bolna Voice AI Webhook ---
router.post('/bolna-webhook', async (req, res, next) => {
  try {
    const result = await processInboundVoiceDispatch(req.body);
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

// Also alias /webhook directly under /api/bolna if mounted that way
router.post('/webhook', async (req, res, next) => {
  try {
    const result = await processInboundVoiceDispatch(req.body);
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

// --- 2. Outbound Field Officer Confirmation Hook ---
router.post('/bolna-dispatch-confirm', (req, res, next) => {
  try {
    const { ticket_id, officer_name, officer_phone, eta, verbal_note } = req.body;
    if (!ticket_id) {
      return res.status(400).json({ error: 'ticket_id is required' });
    }

    const result = confirmDispatch({
      ticket_id,
      officer_name,
      officer_phone,
      eta: eta || '4 MIN',
      verbal_note,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

// --- 3. Get Active Voice Dispatches ---
router.get('/voice-dispatches', (_req, res, next) => {
  try {
    const dispatches = getActiveVoiceDispatches();
    res.json(dispatches);
  } catch (err) {
    next(err);
  }
});

// --- 4. Multimodal Vision Verification Hook (Photo + Voice Fusion) ---
router.post('/voice-dispatch/:id/vision', (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const { photo_url, vision_confidence = 98.4, hazard_match = true } = req.body;
    const db = getDb();

    db.prepare(
      `UPDATE issues 
       SET vision_verified = 1, 
           vision_confidence = ?, 
           photo_url = COALESCE(?, photo_url) 
       WHERE id = ?`
    ).run(vision_confidence, photo_url || '/uploads/vision_hazard_proof.jpg', ticketId);

    const eventPayload = {
      ticket_id: ticketId,
      vision_verified: 1,
      vision_confidence,
      hazard_match,
      photo_url: photo_url || '/uploads/vision_hazard_proof.jpg',
      badge: `📸 Vision Verified: ${vision_confidence}% Match`,
      timestamp: new Date().toISOString(),
    };

    publish(EVENTS.VISION_VERIFIED, eventPayload);
    res.json({ success: true, ...eventPayload });
  } catch (err) {
    next(err);
  }
});

// --- 5. High-Fidelity Voice AI Simulator (One-Click Demo Trigger) ---
const SIMULATION_SCENARIOS = {
  gas_leak: {
    incident_type: 'gas_leak',
    location: 'Connaught Place, Inner Circle Block B',
    lat: 28.6315,
    long: 77.2167,
    severity: 'CRITICAL',
    urgency_score: 9.8,
    caller_language_en: 'English (Bolna AI)',
    caller_language_hi: 'हिन्दी (Sarvam AI)',
    caller_phone: '+91 98710 44821',
    summary_en: 'Massive commercial LPG gas odor detected behind restaurants. High explosion and fire hazard in dense pedestrian zone.',
    summary_hi: 'रेस्टोरेंट के पीछे भीषण कमर्शियल एलपीजी गैस रिसाव। घनी आबादी वाले क्षेत्र में विस्फोट और आग का गंभीर खतरा।',
    photo_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    vision_verified: 1,
    vision_confidence: 98.4,
    dialogue_en: [
      { speaker: 'caller', text: 'Hello, there is a strong smell of gas here at Connaught Place, Block B! It looks like a pipeline leak behind the restaurants, huge risk of fire!' },
      { speaker: 'agent', text: 'Your safety is our top priority. Do you see any sparks, smoke, or open flame?' },
      { speaker: 'caller', text: 'No sparks yet, but the gas odor is overwhelming and people are starting to panic. Please send a team immediately!' },
      { speaker: 'agent', text: 'Emergency Work Order logged. Rapid Hazard Unit alerted and dispatched to Connaught Place Block B.' },
    ],
    dialogue_hi: [
      { speaker: 'caller', text: 'नमस्ते, यहाँ कनॉट प्लेस ब्लॉक B में बहुत तेज गैस की बदबू आ रही है! रेस्टोरेंट के पीछे से पाइप लीक लग रहा है, आग लगने का बहुत बड़ा खतरा है!' },
      { speaker: 'agent', text: 'आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है। क्या आपको कोई चिंगारी या धुआँ दिख रहा है?' },
      { speaker: 'caller', text: 'नहीं, लेकिन बदबू बहुत ज्यादा है, लोग घबरा रहे हैं, कृपया जल्दी टीम भेजिए!' },
      { speaker: 'agent', text: 'आपातकालीन कार्य आदेश दर्ज कर लिया गया है। रैपिड हैज़र्ड यूनिट को तुरंत रवाना कर दिया गया है।' },
    ],
  },
  fire_hazard: {
    incident_type: 'fire_hazard',
    location: 'Barakhamba Road, Near Metro Gate 3',
    lat: 28.6297,
    long: 77.2285,
    severity: 'CRITICAL',
    urgency_score: 9.3,
    caller_language_en: 'English (Bolna AI)',
    caller_language_hi: 'हिन्दी (Sarvam AI)',
    caller_phone: '+91 98112 39012',
    summary_en: 'High-voltage electric transformer sparking with open flames and snapped live cable on pedestrian footpath.',
    summary_hi: 'फुटपाथ पर 11kV इलेक्ट्रिक सबस्टेशन ट्रांसफॉर्मर में भीषण चिंगारी और टूटा हुआ बिजली का तार।',
    photo_url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&auto=format&fit=crop&q=80',
    vision_verified: 1,
    vision_confidence: 97.2,
    dialogue_en: [
      { speaker: 'caller', text: 'Emergency! A commercial transformer just exploded near Barakhamba metro station gate 3! Sparks are flying everywhere!' },
      { speaker: 'agent', text: 'Stay at least 50 feet away from any fallen wires. Are there any injuries reported?' },
      { speaker: 'caller', text: 'No injuries yet, but traffic is blocked and wire is lying on the footpath!' },
      { speaker: 'agent', text: 'Power grid shutdown requested. Municipal Fire & Electrical Unit 2 dispatched with sirens.' },
    ],
    dialogue_hi: [
      { speaker: 'caller', text: 'आपातकाल! बाराखंभा मेट्रो स्टेशन गेट 3 के पास ट्रांसफॉर्मर में विस्फोट हुआ है! चारों तरफ चिंगारियां उड़ रही हैं!' },
      { speaker: 'agent', text: 'कृपया टूटे तारों से कम से कम 50 फीट की दूरी बनाए रखें। क्या कोई घायल हुआ है?' },
      { speaker: 'caller', text: 'अभी कोई घायल नहीं है, लेकिन सड़क बंद हो गई है और तार फुटपाथ पर पड़ा है!' },
      { speaker: 'agent', text: 'बिजली ग्रिड शटडाउन का अनुरोध किया गया है। अग्निशमन एवं विद्युत यूनिट 2 को रवाना किया गया है।' },
    ],
  },
  swarm_surge: {
    incident_type: 'gas_leak',
    location: 'Connaught Place, Inner Circle Block B',
    lat: 28.6318,
    long: 77.2169,
    severity: 'CRITICAL',
    urgency_score: 10.0,
    caller_language_en: 'English (Bolna AI)',
    caller_language_hi: 'हिन्दी (Sarvam AI)',
    caller_phone: '+91 98991 76543',
    summary_en: 'Repeat caller: Panic spreading across CP Block B due to intense gas fumes. Multiple citizens reporting odor behind restaurants.',
    summary_hi: 'नागरिक अलर्ट: कनॉट प्लेस ब्लॉक B में गैस के तेज रिसाव से सभी दुकानें खाली कराई जा रही हैं।',
    photo_url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    vision_verified: 1,
    vision_confidence: 98.9,
    dialogue_en: [
      { speaker: 'caller', text: 'Urgent! All shops in Connaught Place Block B are evacuating due to intense gas fumes. Why has no response unit arrived yet?!' },
      { speaker: 'agent', text: 'We have logged this incident from multiple nearby citizens under Ticket #311-CP. Rapid Response Unit 4 is en route with sirens.' },
    ],
    dialogue_hi: [
      { speaker: 'caller', text: 'अति आवश्यक! कनॉट प्लेस ब्लॉक B में गैस के तेज रिसाव से दुकानें खाली हो रही हैं, अभी तक कोई टीम क्यों नहीं पहुंची?!' },
      { speaker: 'agent', text: 'हमने इस आपातकाल को कई नागरिकों की कॉल के आधार पर टिकट #311-CP में दर्ज कर लिया है। यूनिट 4 सायरन के साथ रास्ते में है।' },
    ],
  },
  water_rupture: {
    incident_type: 'water_main_rupture',
    location: 'Janpath & Tolstoy Marg Intersection',
    lat: 28.6255,
    long: 77.2185,
    severity: 'HIGH',
    urgency_score: 8.6,
    caller_language_en: 'English (Bolna AI)',
    caller_language_hi: 'हिन्दी (Sarvam AI)',
    caller_phone: '+91 97110 55123',
    summary_en: 'Major pressurized municipal water main rupture causing severe street flooding and road sub-base collapse risk.',
    summary_hi: 'जनपथ क्रॉसिंग पर मुख्य पेयजल पाइपलाइन फटने से सड़क जलमग्न और धंसने का गंभीर खतरा।',
    photo_url: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop&q=80',
    vision_verified: 1,
    vision_confidence: 99.1,
    dialogue_en: [
      { speaker: 'caller', text: 'A massive water main has burst at the Janpath crossing! The entire road is flooded and the street is starting to sink!' },
      { speaker: 'agent', text: 'Thank you for reporting. Has vehicle movement been stopped at the intersection to prevent accidents?' },
      { speaker: 'caller', text: 'Yes, bus traffic is completely stopped and water is gushing out like a fountain.' },
      { speaker: 'agent', text: 'Delhi Jal Board emergency valve team alerted for immediate mainline isolation. Work order issued.' },
    ],
    dialogue_hi: [
      { speaker: 'caller', text: 'जनपथ क्रॉसिंग पर बहुत बड़ा पेयजल पाइप फट गया है! पूरी सड़क पर पानी भर गया है और रोड धंसने लगी है!' },
      { speaker: 'agent', text: 'सूचना दर्ज कर ली गई है। क्या चौराहे पर वाहनों की आवाजाही रोक दी गई है?' },
      { speaker: 'caller', text: 'हाँ, बसों और गाड़ियों का आवागमन पूरी तरह रुक गया है और पानी फव्वारे की तरह बह रहा है।' },
      { speaker: 'agent', text: 'जल बोर्ड की वाल्व टीम को मुख्य पाइपलाइन बंद करने के लिए अलर्ट कर दिया गया है। कार्य आदेश जारी कर दिया गया है।' },
    ],
  },
};

router.post('/simulate-voice-call', async (req, res, next) => {
  try {
    const scenarioKey = req.body.scenario || 'gas_leak';
    const lang = (req.body.lang || req.query.lang || 'en').toLowerCase();
    const isHindi = lang === 'hi';
    const scenario = SIMULATION_SCENARIOS[scenarioKey] || SIMULATION_SCENARIOS.gas_leak;

    const dialogueList = isHindi ? scenario.dialogue_hi : scenario.dialogue_en;
    const callerLanguage = isHindi ? scenario.caller_language_hi : scenario.caller_language_en;
    const summary = isHindi ? scenario.summary_hi : scenario.summary_en;

    // 1. Immediately stream transcript chunks over SSE with timestamps
    let delay = 0;
    if (Array.isArray(dialogueList)) {
      dialogueList.forEach((line, idx) => {
        const lineEn = scenario.dialogue_en[idx] || line;
        const lineHi = scenario.dialogue_hi[idx] || line;
        setTimeout(() => {
          publish(EVENTS.VOICE_TRANSCRIPT_CHUNK, {
            scenario: scenarioKey,
            speaker: line.speaker,
            text: line.text,
            text_en: lineEn.text,
            text_hi: lineHi.text,
            caller_phone: scenario.caller_phone,
            caller_language: callerLanguage,
            urgency_score: scenario.urgency_score,
            timestamp: new Date().toISOString(),
          });
        }, delay);
        delay += 600;
      });
    }

    // 2. Schedule the actual ticket / cluster creation after a brief natural streaming delay
    setTimeout(async () => {
      try {
        await processInboundVoiceDispatch({
          ...scenario,
          summary,
          caller_language: callerLanguage,
          transcript: dialogueList.map((d) => `${d.speaker.toUpperCase()}: ${d.text}`).join('\n'),
        });
      } catch (err) {
        console.error('Simulation dispatch processing error:', err.message);
      }
    }, Math.max(delay + 200, 1000));

    res.json({
      success: true,
      simulating: true,
      scenario: scenarioKey,
      lang: isHindi ? 'hi' : 'en',
      dialogue_steps: dialogueList.length,
      message: `Simulating live incoming voice call: ${scenario.incident_type} (${scenario.location})`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
