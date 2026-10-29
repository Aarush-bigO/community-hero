import { Link } from 'react-router-dom';
import { CheckCircle2, Mail, Linkedin } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useT, useLang, LANGUAGES } from '../i18n';

export default function Footer() {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);

  return (
    <footer className="relative hairline border-x-0 border-b-0 bg-[#08090C]/95 backdrop-blur-2xl pt-16 pb-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 mb-4 group">
              <BrandLogo size={36} />
              <span className="font-display font-bold text-lg text-silver-100 tracking-tight">Community Hero</span>
            </div>
            <p className="text-sm text-silver-400 max-w-xs leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-marigold-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-marigold-400" /> {t('footer.open311')}
            </div>

            {/* Language Switcher in Footer */}
            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-silver-500 mb-2.5">
                System Language / भाषा
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      lang === l.code
                        ? 'bg-marigold-500/20 text-marigold-300 border border-marigold-400/50 shadow-[0_0_12px_rgba(234,170,0,0.3)]'
                        : 'bg-white/[0.04] text-silver-400 border border-white/5 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-silver-500 mb-2.5">
                {t('footer.connect')}
              </p>
              <div className="flex items-center gap-2.5">
                <Social href="mailto:aarushbharti2005@gmail.com" label="Email">
                  <Mail className="w-4 h-4" />
                </Social>
                <Social href="https://x.com/Aarush52410944" label="X (Twitter)">
                  <XLogo className="w-[15px] h-[15px]" />
                </Social>
                <Social href="https://www.linkedin.com/in/aarush-bharti-667a43324/" label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </Social>
              </div>
            </div>
          </div>

          <FooterCol
            title={t('footer.product')}
            links={[
              [t('footer.liveMap'), '/map'],
              [t('footer.cityPulse'), '/pulse'],
              [t('footer.dashboard'), '/dashboard'],
              [t('footer.reportIssue'), '/report'],
            ]}
          />
          <FooterCol
            title={t('footer.platform')}
            links={[
              [t('footer.adminPortal'), '/admin'],
              [t('footer.leaderboard'), '/leaderboard'],
              ['Voice AI Cockpit', '/dispatch'],
              [t('footer.open311Api'), '/map'],
            ]}
          />
          <FooterCol
            title={t('footer.resources')}
            links={[
              [t('footer.github'), 'https://github.com/Aarush-bigO/community-hero'],
              [t('footer.architecture'), 'https://github.com/Aarush-bigO/community-hero/blob/main/docs/ARCHITECTURE.md'],
              [t('footer.open311Spec'), 'https://wiki.open311.org/GeoReport_v2/'],
            ]}
          />
        </div>

        <div className="mt-12 pt-6 hairline border-x-0 border-b-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-silver-500">
          <p>{t('footer.copyright')}</p>
          <p className="flex items-center gap-4">
            <span>{t('footer.built')}</span>
            <span className="flex items-center gap-1.5 text-marigold-300">
              <span className="w-1.5 h-1.5 rounded-full bg-marigold-400 animate-pulse" /> {t('footer.operational')}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function Social({ href, label, children }) {
  const isMail = href.startsWith('mailto:');
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(isMail ? {} : { target: '_blank', rel: 'noreferrer' })}
      className="grid place-items-center w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10
                 text-silver-300 hover:text-white hover:border-marigold-400/50 hover:bg-marigold-500/10
                 hover:shadow-[0_0_15px_rgba(234,170,0,0.25)] transition"
    >
      {children}
    </a>
  );
}

function XLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="font-display font-semibold text-sm text-silver-100 mb-4 tracking-wide">{title}</p>
      <ul className="space-y-2.5 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            {href.startsWith('http') ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-silver-400 hover:text-marigold-300 transition"
              >
                {label}
              </a>
            ) : (
              <Link to={href} className="text-silver-400 hover:text-marigold-300 transition">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
