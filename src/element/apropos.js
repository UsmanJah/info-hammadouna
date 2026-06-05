import React, { useEffect, useRef, useState } from "react";
import AproposImage from "../assets/apropos_image.png";

const stats = [
  { value: "1992", label: "Fondée en" },
  // { value: "1000+", label: "Membres" },
  { value: "40",   label: "Événements /an" },
  { value: "43",    label: "Sections" },
];

function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Apropos() {
  const [heroRef, heroVisible]   = useFadeIn();
  const [statsRef, statsVisible] = useFadeIn();

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #ffffff 0%)" }}>

      {/* ── Bande verte supérieure ── */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400" />

      {/* ── Bulles flottantes ── */}
      <div className="absolute top-10 left-8 w-24 h-24 bg-green-200/40 rounded-full blur-xl pointer-events-none" />
      <div className="absolute top-32 right-16 w-40 h-40 bg-emerald-300/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-300/25 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-24 right-8 w-56 h-56 bg-green-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-16 w-32 h-32 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-3/4 right-1/3 w-16 h-16 bg-teal-200/30 rounded-full blur-xl pointer-events-none" />

      {/* ── Dessins islamiques SVG ── */}

      {/* Étoile islamique 8 branches — haut droite */}
      <svg className="absolute top-8 right-10 w-20 h-20 opacity-10 pointer-events-none" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,5 47,28 70,28 52,43 59,66 40,52 21,66 28,43 10,28 33,28" fill="#16a34a"/>
        <polygon points="40,15 45,30 60,30 48,40 53,55 40,45 27,55 32,40 20,30 35,30" fill="#15803d" fillOpacity="0.5"/>
      </svg>

      {/* Croissant + étoile — haut gauche */}
      <svg className="absolute top-16 left-6 w-16 h-16 opacity-10 pointer-events-none" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 6 A18 18 0 1 0 32 54 A13 13 0 1 1 32 6Z" fill="#16a34a"/>
        <polygon points="46,14 48,21 55,21 49,25 51,32 46,28 41,32 43,25 37,21 44,21" fill="#15803d"/>
      </svg>

      {/* Motif géométrique islamique — milieu gauche */}
      <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-28 h-64 opacity-[0.06] pointer-events-none" viewBox="0 0 80 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ap-geo-l" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="none" stroke="#16a34a" strokeWidth="1"/>
            <polygon points="20,9 32,15 32,25 20,31 8,25 8,15" fill="none" stroke="#16a34a" strokeWidth="0.6"/>
            <circle cx="20" cy="20" r="3" fill="none" stroke="#16a34a" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="80" height="200" fill="url(#ap-geo-l)"/>
      </svg>

      {/* Motif géométrique islamique — milieu droit */}
      <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-64 opacity-[0.06] pointer-events-none" viewBox="0 0 80 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ap-geo-r" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="none" stroke="#16a34a" strokeWidth="1"/>
            <polygon points="20,9 32,15 32,25 20,31 8,25 8,15" fill="none" stroke="#16a34a" strokeWidth="0.6"/>
            <circle cx="20" cy="20" r="3" fill="none" stroke="#16a34a" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="80" height="200" fill="url(#ap-geo-r)"/>
      </svg>

      {/* Arabesques bas gauche */}
      <svg className="absolute bottom-0 left-0 w-48 h-48 opacity-[0.07] pointer-events-none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="120" r="80" fill="none" stroke="#16a34a" strokeWidth="1.5"/>
        <circle cx="0" cy="120" r="60" fill="none" stroke="#16a34a" strokeWidth="1"/>
        <circle cx="0" cy="120" r="40" fill="none" stroke="#16a34a" strokeWidth="0.8"/>
        <circle cx="0" cy="120" r="20" fill="none" stroke="#16a34a" strokeWidth="0.6"/>
        <line x1="0" y1="40" x2="80" y2="120" stroke="#16a34a" strokeWidth="0.5"/>
        <line x1="0" y1="60" x2="60" y2="120" stroke="#16a34a" strokeWidth="0.5"/>
        <line x1="0" y1="80" x2="40" y2="120" stroke="#16a34a" strokeWidth="0.5"/>
      </svg>

      {/* Arabesques haut droit */}
      <svg className="absolute top-0 right-0 w-48 h-48 opacity-[0.07] pointer-events-none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <circle cx="120" cy="0" r="80" fill="none" stroke="#16a34a" strokeWidth="1.5"/>
        <circle cx="120" cy="0" r="60" fill="none" stroke="#16a34a" strokeWidth="1"/>
        <circle cx="120" cy="0" r="40" fill="none" stroke="#16a34a" strokeWidth="0.8"/>
        <circle cx="120" cy="0" r="20" fill="none" stroke="#16a34a" strokeWidth="0.6"/>
        <line x1="120" y1="80" x2="40" y2="0" stroke="#16a34a" strokeWidth="0.5"/>
        <line x1="120" y1="60" x2="60" y2="0" stroke="#16a34a" strokeWidth="0.5"/>
        <line x1="120" y1="40" x2="80" y2="0" stroke="#16a34a" strokeWidth="0.5"/>
      </svg>

      {/* Étoile bas droite */}
      <svg className="absolute bottom-16 right-6 w-14 h-14 opacity-[0.12] pointer-events-none" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <polygon points="30,3 34,20 50,20 37,30 42,47 30,37 18,47 23,30 10,20 26,20" fill="#16a34a"/>
      </svg>

      {/* Mini étoile milieu */}
      <svg className="absolute top-1/3 right-1/4 w-8 h-8 opacity-[0.15] pointer-events-none" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <polygon points="30,3 34,20 50,20 37,30 42,47 30,37 18,47 23,30 10,20 26,20" fill="#15803d"/>
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 flex flex-col gap-20">

        {/* ── SECTION PRINCIPALE ── */}
        <div
          ref={heroRef}
          className={`flex flex-col lg:flex-row items-center gap-14 lg:gap-20 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >

          {/* Image */}
          <div className="relative flex-shrink-0 w-full max-w-sm mx-auto lg:mx-0">

            {/* Cadre vert décalé derrière */}
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-green-500/10 border-2 border-green-200/60 pointer-events-none" />

            {/* Image principale */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={AproposImage}
                alt="Hammadouna"
                className="w-full object-cover aspect-square"
              />
              {/* Gradient overlay bas */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-900/50 to-transparent" />
              {/* Badge Alhamdulillah */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-green-100 rounded-full px-5 py-1.5 shadow-lg">
                <span
                  className="text-green-700 font-semibold text-base"
                  style={{ fontFamily: "'Amiri','Scheherazade New',serif" }}
                >
                  الْحَمْدُ لِلَّه
                </span>
              </div>
            </div>

            {/* Pastille déco coin haut gauche */}
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">🕌</span>
            </div>
          </div>

          {/* Texte */}
          <div className="flex flex-col gap-6 flex-1 text-center lg:text-left">

            {/* Label */}
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <div className="w-1 h-5 bg-green-500 rounded-full" />
              <span className="text-green-600 text-xs font-black tracking-[0.3em] uppercase">Qui sommes-nous</span>
            </div>

            {/* Titre */}
            <div>
              <h2 className="text-gray-900 font-black text-4xl sm:text-5xl leading-tight">
                A Propos de
              </h2>
              <h3 className="text-green-600 font-black text-2xl sm:text-3xl mt-1 leading-tight">
                Jamhiyatou Hammâdoûna
              </h3>
            </div>

            {/* Séparateur */}
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <div className="h-0.5 w-8 bg-green-400 rounded-full" />
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <div className="h-0.5 w-16 bg-green-400 rounded-full" />
            </div>

            {/* Paragraphes */}
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              La <strong className="text-gray-800 font-bold">Jamhiyatou Hammâdoûna</strong> est un cercle de disciples de la Faydatou Tidjaniyya dont la mission consiste à se préoccuper d’Allah, à persister dans Son souvenir et à prier sur l’Élu, le Prophète Muhammad (PSL).".
            </p>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              À travers leurs activités, conférences et événements, Ils œuvrent pour le renforcement de l'unité, la diffusion du savoir islamique.
            </p>

            {/* Citation */}
            <div className="bg-green-50 border-l-4 border-green-500 rounded-r-2xl px-5 py-4 text-left">
              <p
                className="text-green-800 text-base leading-relaxed"
                style={{ fontFamily: "'Amiri','Scheherazade New',serif", direction: "rtl" }}
              >
                وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا
              </p>
              <p className="text-green-600 text-xs font-semibold mt-2 tracking-wide">
                Sourate Al-Imran — 3:103
              </p>
            </div>

            {/* Tagline */}
            <p className="text-gray-400 text-xs italic tracking-widest">
              « Le site de la louange » — Hammadouna.info
            </p>
          </div>
        </div>

        {/* ── STATS ── */}
        <div
          ref={statsRef}
          className={`transition-all duration-700 delay-150 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {stats.map(({ value, label }, i) => (
              <div
                key={label}
                className="group relative bg-white border border-gray-100 rounded-2xl px-6 py-8 flex flex-col items-center gap-1 shadow-sm hover:shadow-xl hover:border-green-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Fond hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <span className="relative z-10 text-green-600 group-hover:text-white font-black text-4xl transition-colors duration-300">{value}</span>
                <span className="relative z-10 text-gray-400 group-hover:text-green-100 text-xs font-semibold tracking-wider uppercase text-center transition-colors duration-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Apropos;