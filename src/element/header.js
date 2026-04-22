import React, { useState, useEffect, useCallback } from "react";
import PrayerIllustration from "../assets/prayer_illustration.png";
import countriesData from "../data/countries_timezones.json";

const PRAYER_ICONS = {
  Fajr: "",
  Sunrise: "",
  Dhuhr: "",
  Asr: "",
  Maghrib: "",
  Isha: "",
  Midnight: "",
};

const PRAYER_LABELS = {
  Fajr: "Fajr",
  Sunrise: "Lever",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
  Midnight: "Minuit",
};

const MAIN_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function getNextPrayer(prayerTimes) {
  if (!prayerTimes) return null;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  for (const name of MAIN_PRAYERS) {
    const time = prayerTimes[name];
    if (!time) continue;
    const [h, m] = time.split(":").map(Number);
    if (h * 60 + m > currentMinutes) return { name, time, icon: PRAYER_ICONS[name] };
  }
  return { name: "Fajr", time: prayerTimes["Fajr"], icon: PRAYER_ICONS["Fajr"], label: "demain" };
}

// ── SVG Decorations ──────────────────────────────────────────

const MosqueSilhouette = () => (
  <svg viewBox="0 0 800 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="60" width="22" height="100" fill="white" fillOpacity="0.1"/>
    <rect x="14" y="54" width="34" height="10" fill="white" fillOpacity="0.13"/>
    <ellipse cx="31" cy="50" rx="12" ry="16" fill="white" fillOpacity="0.1"/>
    <circle cx="31" cy="36" r="5" fill="white" fillOpacity="0.18"/>
    <rect x="758" y="60" width="22" height="100" fill="white" fillOpacity="0.1"/>
    <rect x="752" y="54" width="34" height="10" fill="white" fillOpacity="0.13"/>
    <ellipse cx="769" cy="50" rx="12" ry="16" fill="white" fillOpacity="0.1"/>
    <circle cx="769" cy="36" r="5" fill="white" fillOpacity="0.18"/>
    <path d="M330 130 Q400 10 470 130" fill="white" fillOpacity="0.09"/>
    <ellipse cx="400" cy="25" rx="20" ry="24" fill="white" fillOpacity="0.1"/>
    <circle cx="400" cy="6" r="6" fill="white" fillOpacity="0.18"/>
    <rect x="280" y="130" width="240" height="60" fill="white" fillOpacity="0.07"/>
    <ellipse cx="320" cy="118" rx="30" ry="35" fill="white" fillOpacity="0.07"/>
    <ellipse cx="480" cy="118" rx="30" ry="35" fill="white" fillOpacity="0.07"/>
    <path d="M295 160 Q312 132 330 160" fill="none" stroke="white" strokeOpacity="0.13" strokeWidth="1.5"/>
    <path d="M340 160 Q360 125 380 160" fill="none" stroke="white" strokeOpacity="0.13" strokeWidth="1.5"/>
    <path d="M395 160 Q415 120 435 160" fill="none" stroke="white" strokeOpacity="0.13" strokeWidth="1.5"/>
    <path d="M450 160 Q468 132 486 160" fill="none" stroke="white" strokeOpacity="0.13" strokeWidth="1.5"/>
    <rect x="150" y="90" width="16" height="70" fill="white" fillOpacity="0.08"/>
    <ellipse cx="158" cy="86" rx="9" ry="12" fill="white" fillOpacity="0.08"/>
    <rect x="634" y="90" width="16" height="70" fill="white" fillOpacity="0.08"/>
    <ellipse cx="642" cy="86" rx="9" ry="12" fill="white" fillOpacity="0.08"/>
  </svg>
);

const GeometricPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.045]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="geo" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <polygon points="25,2 48,13 48,37 25,48 2,37 2,13" fill="none" stroke="white" strokeWidth="0.8"/>
        <polygon points="25,10 40,18 40,32 25,40 10,32 10,18" fill="none" stroke="white" strokeWidth="0.5"/>
        <line x1="25" y1="2" x2="25" y2="48" stroke="white" strokeWidth="0.3"/>
        <line x1="2" y1="13" x2="48" y2="37" stroke="white" strokeWidth="0.3"/>
        <line x1="48" y1="13" x2="2" y2="37" stroke="white" strokeWidth="0.3"/>
        <circle cx="25" cy="25" r="3" fill="none" stroke="white" strokeWidth="0.4"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#geo)"/>
  </svg>
);

const StarOrnament = ({ className }) => (
  <svg viewBox="0 0 60 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <polygon points="30,4 34,22 52,22 38,34 43,52 30,40 17,52 22,34 8,22 26,22" fill="white" fillOpacity="0.18"/>
    <polygon points="30,14 33,22 41,22 35,27 37,35 30,30 23,35 25,27 19,22 27,22" fill="white" fillOpacity="0.12"/>
  </svg>
);

const CrescentStar = ({ className }) => (
  <svg viewBox="0 0 60 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M35 8 A18 18 0 1 0 35 52 A13 13 0 1 1 35 8Z" fill="white" fillOpacity="0.18"/>
    <polygon points="47,18 49,24 55,24 50,28 52,34 47,30 42,34 44,28 39,24 45,24" fill="white" fillOpacity="0.22"/>
  </svg>
);

// ── Reusable styled select ────────────────────────────────────

const StyledSelect = ({ label, value, onChange, children }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-white/60 text-[10px] tracking-[0.25em] uppercase font-bold">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-white/15 backdrop-blur-md border border-white/25 text-white text-sm font-semibold rounded-xl px-4 py-2.5 pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30 hover:bg-white/20 transition-all duration-200"
        style={{ WebkitAppearance: "none" }}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/70 text-xs">▾</div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────

function Header() {
  const countries = countriesData.countries;
  const defaultCountry = countries.find((c) => c.country === "Senegal") || countries[0];

  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [selectedTimezone, setSelectedTimezone] = useState(defaultCountry.timezones[0]);
  const [city, setCity] = useState("Dakar");
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrayerTimes = useCallback(async () => {
    if (!selectedCountry || !city.trim() || !selectedTimezone) return;
    setLoading(true);
    setError(null);
    try {
      const url = `https://info-fastapi.vercel.app/api/prayer-times?country=${encodeURIComponent(
        selectedCountry.country
      )}&city=${encodeURIComponent(city.trim())}&timezone=${encodeURIComponent(selectedTimezone)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      setPrayerTimes(data.prayer_times);
      setNextPrayer(getNextPrayer(data.prayer_times));
    } catch (e) {
      setError("Impossible de charger les horaires. Vérifiez que le backend est lancé.");
      setPrayerTimes(null);
      setNextPrayer(null);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, city, selectedTimezone]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  const handleCountryChange = (e) => {
    const found = countries.find((c) => c.country === e.target.value);
    if (!found) return;
    setSelectedCountry(found);
    setSelectedTimezone(found.timezones[0]);
    setCity("");
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-12 xl:px-16 mt-6 sm:mt-10 mb-6 sm:mb-10">
      <div className="relative bg-gradient-to-br from-green-400 via-green-600 to-emerald-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col">

        {/* Fond décoratif */}
        <GeometricPattern />
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-green-300 rounded-full opacity-10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-16 w-96 h-96 bg-teal-400 rounded-full opacity-10 blur-3xl pointer-events-none" />

        {/* Ornements — progressivement visibles */}
        <StarOrnament className="hidden sm:block absolute top-5 right-6 w-10 h-10 sm:w-12 sm:h-12" />
        <StarOrnament className="hidden md:block absolute top-20 right-24 w-7 h-7 opacity-70" />
        <StarOrnament className="hidden sm:block absolute bottom-32 left-6 w-9 h-9 opacity-60" />
        <CrescentStar className="hidden sm:block absolute top-5 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 opacity-60" />
        <CrescentStar className="hidden md:block absolute bottom-28 right-8 w-9 h-9 opacity-35" />
        <StarOrnament className="hidden lg:block absolute top-1/2 left-5 w-6 h-6 opacity-50" />

        {/* Ligne ornementale */}
        <div className="relative z-10 flex justify-center items-center gap-2 pt-5 sm:pt-7">
          <div className="h-px w-10 sm:w-20 bg-white/20 rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="h-px w-4 sm:w-6 bg-white/20 rounded-full" />
          <div className="w-2 h-2 rounded-full bg-white/50" />
          <div className="h-px w-4 sm:w-6 bg-white/20 rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="h-px w-10 sm:w-20 bg-white/20 rounded-full" />
        </div>

        {/* ═══════════════════════════════════════════════════════
            LAYOUT :
            • Mobile (<sm)  : tout empilé, centré, illustration petite en bas
            • Tablet (sm-lg): illustration + prochaine prière côte à côte
            • Desktop (lg+) : 3 colonnes [titre+form | illustration | prochaine prière]
        ═══════════════════════════════════════════════════════ */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 sm:gap-8 lg:gap-6 xl:gap-10 px-5 sm:px-10 lg:px-14 xl:px-24 py-6 sm:py-10 lg:py-12">

          {/* ── Colonne gauche : Titre + Formulaire ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3 sm:gap-4 w-full sm:max-w-sm lg:flex-1">

            {/* Basmala */}
            <p
              className="text-green-200 text-sm sm:text-base opacity-90 leading-relaxed"
              style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", direction: "rtl" }}
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>

            {/* Titre */}
            <div>
              <h1 className="text-white font-black text-2xl sm:text-3xl xl:text-5xl uppercase tracking-wide leading-tight drop-shadow-lg">
                JAMHIYATOU
              </h1>
              <h1 className="text-green-200 font-black text-2xl sm:text-3xl xl:text-5xl uppercase tracking-wide leading-tight drop-shadow-lg">
                HAMMADOUNA
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-0.5 w-8 bg-white/40 rounded-full" />
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
              <div className="h-0.5 w-16 bg-white/40 rounded-full" />
            </div>
            <p className="text-white/50 text-[10px] sm:text-xs tracking-widest uppercase font-semibold">
              Cercle de la louange
            </p>

            {/* Formulaire */}
            <div className="flex flex-col gap-2.5 w-full mt-1">
              <StyledSelect label="Pays" value={selectedCountry.country} onChange={handleCountryChange}>
                {countries.map((c) => (
                  <option key={c.country} value={c.country} className="text-gray-800 bg-white">
                    {c.country}
                  </option>
                ))}
              </StyledSelect>

              {selectedCountry.timezones.length > 1 && (
                <StyledSelect
                  label="Timezone"
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                >
                  {selectedCountry.timezones.map((tz) => (
                    <option key={tz} value={tz} className="text-gray-800 bg-white">{tz}</option>
                  ))}
                </StyledSelect>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-white/60 text-[10px] tracking-[0.25em] uppercase font-bold">Ville</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchPrayerTimes()}
                  placeholder="Ex: Dakar"
                  className="w-full bg-white/15 backdrop-blur-md border border-white/25 text-white placeholder-white/40 text-sm font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/30 hover:bg-white/20 transition-all duration-200"
                />
              </div>

              <button
                onClick={fetchPrayerTimes}
                disabled={loading || !city.trim()}
                className="w-full bg-white/20 hover:bg-white/30 active:scale-95 disabled:opacity-40 border border-white/30 text-white text-sm font-bold rounded-xl px-4 py-2.5 transition-all duration-200 tracking-wider uppercase"
              >
                {loading ? "Chargement..." : "Actualiser"}
              </button>

              {error && (
                <p className="text-red-200 text-[11px] text-center bg-red-500/20 rounded-lg px-3 py-2 leading-relaxed">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* ── Colonne centrale : Illustration ── */}
          {/* Desktop : colonne centrale | Mobile : cachée ici, montrée après "prochaine prière" */}
          <div className="hidden lg:flex flex-shrink-0 items-center justify-center w-48 h-48 xl:w-72 xl:h-72 drop-shadow-2xl self-center">
            <img src={PrayerIllustration} alt="Illustration prière" className="w-full h-full object-contain" />
          </div>

          {/* ── Colonne droite : Prochaine prière + illustration (tablet) ── */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-end gap-4 sm:gap-6 lg:gap-4 w-full sm:max-w-none lg:flex-1 lg:max-w-xs">

            {/* Illustration visible sur tablet (sm-lg) dans cette zone */}
            <div className="sm:flex lg:hidden hidden flex-shrink-0 items-center justify-center w-44 h-44 sm:w-52 sm:h-52 drop-shadow-2xl">
              <img src={PrayerIllustration} alt="Illustration prière" className="w-full h-full object-contain" />
            </div>

            {/* Card prochaine prière */}
            {nextPrayer && !loading && (
              <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-5 sm:px-6 py-4 sm:py-5 flex flex-col items-center gap-2 shadow-xl w-full max-w-[220px] sm:max-w-[200px] lg:max-w-[220px]">
                <p className="text-white/55 text-[10px] tracking-[0.3em] uppercase font-bold">Prochaine prière</p>
                <span className="text-3xl">{nextPrayer.icon}</span>
                <p className="text-green-200 font-black text-base sm:text-lg tracking-widest uppercase">
                  {PRAYER_LABELS[nextPrayer.name] || nextPrayer.name}
                </p>
                <div className="bg-green-500/60 border border-white/20 rounded-xl px-5 py-2 mt-1">
                  <p className="text-white font-black text-2xl tracking-widest tabular-nums">{nextPrayer.time}</p>
                </div>
                {nextPrayer.label && (
                  <p className="text-white/40 text-[10px] tracking-widest uppercase">{nextPrayer.label}</p>
                )}
              </div>
            )}

            {/* Skeleton */}
            {loading && (
              <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-6 py-5 flex flex-col items-center gap-3 shadow-xl w-full max-w-[220px] animate-pulse">
                <div className="h-2 w-24 bg-white/20 rounded-full" />
                <div className="h-10 w-10 bg-white/20 rounded-full" />
                <div className="h-4 w-16 bg-white/20 rounded-full" />
                <div className="h-10 w-28 bg-white/20 rounded-xl" />
              </div>
            )}
          </div>
        </div>

        {/* Illustration visible sur mobile uniquement, centrée */}
        <div className="sm:hidden flex justify-center px-5 pb-2">
          <div className="w-32 h-32 drop-shadow-2xl">
            <img src={PrayerIllustration} alt="Illustration prière" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* ── Grille des 5 prières principales ── */}
        {prayerTimes && !loading && (
          <div className="relative z-10 px-5 sm:px-10 lg:px-14 xl:px-24 pb-4 sm:pb-6">
            {/*
              Mobile  : 2 colonnes, la 5e carte prend toute la largeur (centré)
              sm+     : 5 colonnes égales
            */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
              {MAIN_PRAYERS.map((name, idx) => {
                const isNext = nextPrayer?.name === name && !nextPrayer?.label;
                const isLastOnMobile = idx === 4;
                return (
                  <div
                    key={name}
                    className={`
                      flex flex-col items-center gap-1 sm:gap-1.5 rounded-xl sm:rounded-2xl px-2 sm:px-3 py-3 sm:py-4 transition-all duration-200
                      ${isLastOnMobile ? "col-span-2 sm:col-span-1" : ""}
                      ${isNext
                        ? "bg-white/25 border border-white/40 shadow-lg sm:scale-105"
                        : "bg-white/10 border border-white/15"
                      }
                    `}
                  >
                    <span className="text-lg sm:text-xl">{PRAYER_ICONS[name]}</span>
                    <p className="text-white/60 text-[8px] sm:text-[9px] tracking-widest uppercase font-bold">
                      {PRAYER_LABELS[name]}
                    </p>
                    <p className="text-white font-black text-sm sm:text-base tabular-nums tracking-wider">
                      {prayerTimes[name] ?? "--:--"}
                    </p>
                    {isNext && (
                      <span className="text-[7px] sm:text-[8px] text-green-300 font-bold uppercase tracking-widest">
                        prochaine
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Skeleton grille */}
        {loading && (
          <div className="relative z-10 px-5 sm:px-10 lg:px-14 xl:px-24 pb-4 sm:pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`bg-white/10 border border-white/10 rounded-xl sm:rounded-2xl px-2 py-3 sm:py-4 flex flex-col items-center gap-2 ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full" />
                  <div className="w-12 h-2 bg-white/20 rounded-full" />
                  <div className="w-16 h-4 bg-white/20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Silhouette mosquée */}
        <div className="relative z-10 w-full h-14 sm:h-20 lg:h-28 mt-1 sm:mt-2">
          <MosqueSilhouette />
        </div>
      </div>
    </div>
  );
}

export default Header;