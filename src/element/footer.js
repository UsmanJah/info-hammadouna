import { useState } from "react";

/* ── Islamic geometry SVGs (same system as site) ── */
function Star12({ size = 80, color = "#46D67A", opacity = 0.13 }) {
  const s = size / 2;
  const pts = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * Math.PI) / 12 - Math.PI / 2;
    const r = i % 2 === 0 ? s * 0.95 : s * 0.5;
    return `${s + r * Math.cos(angle)},${s + r * Math.sin(angle)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
      <polygon points={pts} fill={color} />
    </svg>
  );
}

function GeomTile({ size = 90, color = "#46D67A", opacity = 0.1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" style={{ opacity }}>
      <polygon points="27,5 63,5 85,27 85,63 63,85 27,85 5,63 5,27" fill="none" stroke={color} strokeWidth="1.5" />
      <line x1="45" y1="5" x2="45" y2="85" stroke={color} strokeWidth="0.8" />
      <line x1="5" y1="45" x2="85" y2="45" stroke={color} strokeWidth="0.8" />
      <line x1="14" y1="14" x2="76" y2="76" stroke={color} strokeWidth="0.8" />
      <line x1="76" y1="14" x2="14" y2="76" stroke={color} strokeWidth="0.8" />
      <polygon points="36,20 54,20 70,36 70,54 54,70 36,70 20,54 20,36" fill="none" stroke={color} strokeWidth="1" />
      <polygon points="45,30 60,45 45,60 30,45" fill="none" stroke={color} strokeWidth="1" />
    </svg>
  );
}

function IslamicStar({ size = 50, color = "#46D67A", opacity = 0.15 }) {
  const s = size / 2;
  const pts = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * Math.PI) / 8;
    const r = i % 2 === 0 ? s * 0.95 : s * 0.42;
    return `${s + r * Math.cos(angle)},${s + r * Math.sin(angle)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
      <polygon points={pts} fill={color} />
    </svg>
  );
}

/* ── Social icons as SVG ── */
function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function IconYoutube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );
}

const LINKS = {
  navigation: [
    { label: "Accueil", href: "#" },
    { label: "Prêches", href: "#" },
    { label: "Évènements", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Bibliothèque", href: "#" },
    { label: "Contact", href: "#" },
  ],
  ressources: [
    { label: "Calendrier islamique", href: "#" },
    { label: "Horaires de prières", href: "#" },
  ],
};

const SOCIALS = [
  { icon: <IconFacebook />, label: "Facebook", href: "https://www.facebook.com/profile.php?id=100069429655606&locale=fr_FR" },
  { icon: <IconInstagram />, label: "Instagram", href: "https://www.instagram.com/jamhiyatou_hammadouna/" },
  { icon: <IconYoutube />, label: "YouTube", href: "https://www.youtube.com/@Jamhiyatouhammadouna" },
];

/* ── Accordion column for mobile ── */
function AccordionCol({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="footer-accordion-col">
      {/* Mobile toggle */}
      <button
        className="footer-col-toggle"
        onClick={() => setOpen(o => !o)}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <h4 className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#46D67A", letterSpacing: 2, margin: 0 }}>
          {title}
        </h4>
        <span style={{
          color: "#46D67A", fontSize: 18, lineHeight: 1,
          transition: "transform .2s ease",
          display: "inline-block",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
        }}>
          ›
        </span>
      </button>

      {/* Desktop static heading */}
      <h4
        className="footer-col-heading text-xs font-bold uppercase tracking-widest mb-4"
        style={{ color: "#46D67A", letterSpacing: 2 }}
      >
        {title}
      </h4>

      {/* Body */}
      <div className={`footer-col-body ${open ? "expanded" : "collapsed"}`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap');

        .footer-link {
          color: rgba(255,255,255,.55);
          text-decoration: none;
          font-size: 13.5px;
          transition: color .15s ease;
          display: block;
          padding: 3px 0;
        }
        .footer-link:hover { color: #46D67A; }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
          color: rgba(255,255,255,.7);
          text-decoration: none;
          transition: all .18s ease;
          cursor: pointer;
        }
        .social-btn:hover {
          background: #46D67A;
          border-color: #46D67A;
          color: #0F7755;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(70,214,122,.35);
        }

        .newsletter-input:focus { outline: none; border-color: #46D67A !important; }
        .newsletter-btn:hover {
          background: #2db85e !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(70,214,122,.4) !important;
        }
        .newsletter-btn { transition: all .18s ease; }

        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(70,214,122,.25), transparent);
        }

        /* ── Verset Wal Asr ── */
        .wasr-band {
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .wasr-separator {
          width: 1px;
          height: 64px;
          background: rgba(70,214,122,.25);
          flex-shrink: 0;
        }
        .wasr-arabic {
          font-family: "Scheherazade New", "Amiri", Georgia, serif;
          font-size: 22px;
          color: #46D67A;
          line-height: 1.9;
          direction: rtl;
          text-align: right;
          flex: 1;
          min-width: 220px;
        }
        .wasr-translation {
          flex: 1;
          min-width: 200px;
        }
        .wasr-surah-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #46D67A;
          margin-bottom: 8px;
        }
        .wasr-translation p {
          font-size: 12.5px;
          color: rgba(255,255,255,.55);
          line-height: 1.75;
          font-style: italic;
        }

        /* ── Responsive ── */
        .newsletter-band-inner {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .newsletter-form {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          width: 100%;
        }
        .newsletter-input {
          flex: 1;
          min-width: 0;
          width: 100%;
        }
        .newsletter-btn { white-space: nowrap; }

        .footer-grid {
          display: grid;
          gap: 40px;
          grid-template-columns: 1fr;
        }

        .footer-col-toggle { display: none; }
        .footer-col-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .footer-bottom {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .footer-bottom-legal {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        @media (min-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px 40px;
          }
          .footer-brand-col { grid-column: 1 / -1; }
          .newsletter-form { width: auto; }
          .newsletter-input { min-width: 200px; width: auto; }
          .wasr-separator { display: block; }
        }

        @media (min-width: 900px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr;
            gap: 40px;
          }
          .footer-brand-col { grid-column: auto; }
          .footer-col-toggle { display: none !important; }
          .footer-col-body { display: flex !important; }
          .newsletter-band-inner { flex-wrap: nowrap; }
        }

        @media (max-width: 599px) {
          .footer-col-heading { display: none !important; }
          .footer-col-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            background: none;
            border: none;
            border-bottom: 1px solid rgba(70,214,122,.1);
            padding: 14px 0;
            cursor: pointer;
          }
          .footer-col-body.collapsed { display: none; }
          .footer-col-body.expanded {
            display: flex;
            padding-top: 10px;
            padding-bottom: 14px;
          }
          .footer-grid { gap: 0; }
          .footer-brand-col {
            padding-bottom: 28px;
            border-bottom: 1px solid rgba(70,214,122,.1);
            margin-bottom: 4px;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .footer-bottom-legal { gap: 12px; }
          .bismillah-block { display: block; width: 100%; }
          .wasr-separator { display: none; }
          .wasr-arabic { font-size: 18px; }
          .wasr-band { gap: 16px; }
        }

        @media (min-width: 600px) {
          .footer-col-toggle { display: none !important; }
          .footer-col-heading { display: block !important; }
          .footer-col-body { display: flex !important; padding-top: 0; padding-bottom: 0; }
        }
      `}</style>

      {/* ── Verset Wal 'Asr band ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a5c41 0%, #0F7755 100%)" }}
      >
        {/* Decorative geometry */}
        <div style={{ position: "absolute", left: -30, top: -30, pointerEvents: "none" }}>
          <Star12 size={160} color="#46D67A" opacity={0.1} />
        </div>
        <div style={{ position: "absolute", right: -20, bottom: -20, pointerEvents: "none" }}>
          <GeomTile size={130} color="#46D67A" opacity={0.1} />
        </div>
        <div style={{ position: "absolute", right: "40%", top: -10, pointerEvents: "none" }}>
          <IslamicStar size={60} color="#46D67A" opacity={0.1} />
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10 relative" style={{ zIndex: 1 }}>
          <div className="wasr-band">
            {/* Arabe — droite à gauche */}
            <div className="wasr-arabic">
              وَٱلْعَصْرِ ﴿١﴾ إِنَّ ٱلْإِنسَـٰنَ لَفِى خُسْرٍ ﴿٢﴾ إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّـٰلِحَـٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ ﴿٣﴾
            </div>

            {/* Séparateur vertical */}
            <div className="wasr-separator" />

            {/* Traduction — gauche */}
            <div className="wasr-translation">
              <p className="wasr-surah-label">Sourate Al-'Asr · 103</p>
              <p>
                Par le Temps ! Certes, l'être humain est en perdition,<br />
                sauf ceux qui ont la foi, accomplissent les bonnes œuvres,<br />
                s'enjoignent mutuellement la vérité et se recommandent mutuellement la patience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main footer ── */}
      <div style={{ background: "linear-gradient(180deg, #0D2B1F 0%, #091a12 100%)" }}>
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-10">
          <div className="footer-grid">

            {/* Brand column */}
            <div className="footer-brand-col">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{ width: 44, height: 44, background: "linear-gradient(135deg, #46D67A, #0F7755)", boxShadow: "0 4px 14px rgba(70,214,122,.3)", flexShrink: 0 }}
                >
                  <span style={{ fontSize: 20 }}>🕌</span>
                </div>
                <div>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>
                    JAMHIYATOU
                  </span>
                  <p style={{ fontSize: 10, color: "#46D67A", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginTop: -2 }}>
                    HAMMADOUNA
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,.45)", maxWidth: 280 }}>
                Un espace de connaissance, de spiritualité et de fraternité pour la communauté musulmane.
              </p>

              {/* Bismillah */}
              <div className="bismillah-block mb-6 px-4 py-3 rounded-xl"
                style={{ background: "rgba(70,214,122,.07)", border: "1px solid rgba(70,214,122,.15)", display: "inline-block" }}>
                <p style={{ fontFamily: "serif", fontSize: 18, color: "#46D67A", letterSpacing: 1 }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 2 }}>
                  Au nom d'Allah, le Tout Miséricordieux
                </p>
              </div>

              {/* Socials */}
              <div className="flex gap-2 flex-wrap">
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="social-btn" title={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <AccordionCol title="Navigation">
              <nav className="flex flex-col gap-0.5">
                {LINKS.navigation.map(l => (
                  <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
                ))}
              </nav>
            </AccordionCol>

            {/* Ressources */}
            <AccordionCol title="Ressources">
              <nav className="flex flex-col gap-0.5">
                {LINKS.ressources.map(l => (
                  <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
                ))}
              </nav>
            </AccordionCol>
          </div>

          {/* Divider */}
          <div className="divider-line my-10" />

          {/* Bottom bar */}
          <div className="footer-bottom">
            <div className="flex items-center gap-3">
              <IslamicStar size={18} color="#46D67A" opacity={0.6} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,.3)" }}>
                © {new Date().getFullYear()} Jamhiyatou Hammadouna — Tous droits réservés.
              </p>
            </div>

            <div className="flex items-center gap-1" style={{ color: "rgba(255,255,255,.25)", fontSize: 12 }}>
              <span>Fait avec</span>
              <span style={{ color: "#46D67A", margin: "0 3px" }}>✦</span>
              <span>pour la communauté</span>
            </div>

            <div className="footer-bottom-legal">
              {["Confidentialité", "CGU", "Mentions légales"].map(l => (
                <a key={l} href="#" className="footer-link" style={{ fontSize: 12 }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}