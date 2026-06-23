/**
 * Lightweight i18n — no dependency, persisted to localStorage.
 *
 * Civic platforms (SeeClickFix ships 80+ languages) must meet residents in
 * their own language. We keep a flat key dictionary and a `useT()` hook that
 * re-renders on language change via a tiny Zustand store. Missing keys fall
 * back to English, then to the key itself, so the UI never shows blanks.
 */
import { create } from 'zustand';

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

const DICT = {
  en: {
    'nav.map': 'Map', 'nav.pulse': 'Pulse', 'nav.dashboard': 'Dashboard',
    'nav.heroes': 'Heroes', 'nav.admin': 'Admin', 'nav.report': 'Report Issue',
    'nav.signin': 'Sign in', 'nav.live': 'LIVE',
    'pulse.title': 'City Pulse',
    'pulse.subtitle': 'Passive listening across social media, news, and forums — sentiment-tagged in real time.',
    'pulse.mentions': 'Mentions', 'pulse.avg': 'Avg Sentiment',
    'pulse.negative': 'Negative', 'pulse.positive': 'Positive',
    'pulse.byTopic': 'By Topic', 'pulse.bySource': 'By Source',
    'pulse.empty': 'No pulse signals yet.', 'pulse.simulate': 'Inject signal',
    'common.justNow': 'just now', 'common.liveOn': 'Live feed on',
  },
  hi: {
    'nav.map': 'मानचित्र', 'nav.pulse': 'पल्स', 'nav.dashboard': 'डैशबोर्ड',
    'nav.heroes': 'नायक', 'nav.admin': 'प्रशासन', 'nav.report': 'समस्या दर्ज करें',
    'nav.signin': 'साइन इन', 'nav.live': 'लाइव',
    'pulse.title': 'सिटी पल्स',
    'pulse.subtitle': 'सोशल मीडिया, समाचार और मंचों पर निष्क्रिय निगरानी — रीयल टाइम में भावना-टैग।',
    'pulse.mentions': 'उल्लेख', 'pulse.avg': 'औसत भावना',
    'pulse.negative': 'नकारात्मक', 'pulse.positive': 'सकारात्मक',
    'pulse.byTopic': 'विषय अनुसार', 'pulse.bySource': 'स्रोत अनुसार',
    'pulse.empty': 'अभी कोई संकेत नहीं।', 'pulse.simulate': 'संकेत जोड़ें',
    'common.justNow': 'अभी', 'common.liveOn': 'लाइव फ़ीड चालू',
  },
  es: {
    'nav.map': 'Mapa', 'nav.pulse': 'Pulso', 'nav.dashboard': 'Panel',
    'nav.heroes': 'Héroes', 'nav.admin': 'Admin', 'nav.report': 'Reportar',
    'nav.signin': 'Iniciar sesión', 'nav.live': 'EN VIVO',
    'pulse.title': 'Pulso de la Ciudad',
    'pulse.subtitle': 'Escucha pasiva en redes sociales, noticias y foros — con sentimiento en tiempo real.',
    'pulse.mentions': 'Menciones', 'pulse.avg': 'Sentimiento medio',
    'pulse.negative': 'Negativo', 'pulse.positive': 'Positivo',
    'pulse.byTopic': 'Por tema', 'pulse.bySource': 'Por fuente',
    'pulse.empty': 'Aún no hay señales.', 'pulse.simulate': 'Inyectar señal',
    'common.justNow': 'ahora', 'common.liveOn': 'Feed en vivo activo',
  },
  fr: {
    'nav.map': 'Carte', 'nav.pulse': 'Pouls', 'nav.dashboard': 'Tableau',
    'nav.heroes': 'Héros', 'nav.admin': 'Admin', 'nav.report': 'Signaler',
    'nav.signin': 'Connexion', 'nav.live': 'EN DIRECT',
    'pulse.title': 'Pouls de la Ville',
    'pulse.subtitle': "Écoute passive sur les réseaux sociaux, l'actualité et les forums — sentiment en temps réel.",
    'pulse.mentions': 'Mentions', 'pulse.avg': 'Sentiment moyen',
    'pulse.negative': 'Négatif', 'pulse.positive': 'Positif',
    'pulse.byTopic': 'Par sujet', 'pulse.bySource': 'Par source',
    'pulse.empty': 'Aucun signal pour le moment.', 'pulse.simulate': 'Injecter un signal',
    'common.justNow': "à l'instant", 'common.liveOn': 'Flux en direct activé',
  },
};

export const useLang = create((set) => ({
  lang: localStorage.getItem('ch_lang') || 'en',
  setLang: (lang) => {
    localStorage.setItem('ch_lang', lang);
    set({ lang });
  },
}));

/** Returns a translate function `t(key)` bound to the current language. */
export function useT() {
  const lang = useLang((s) => s.lang);
  return (key) => DICT[lang]?.[key] ?? DICT.en[key] ?? key;
}
