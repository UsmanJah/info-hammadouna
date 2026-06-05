import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const cardRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.classList.add("animate-fade");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Credentials admin
    const adminEmail = "admin@gmail.com";
    const adminPassword = "123456";

    if (email === adminEmail && password === adminPassword) {
      // Sauvegarde connexion
      localStorage.setItem("auth", "true");

      // Redirection
      navigate("/admin");
    } else {
      alert("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      
      {/* Background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#16a34a] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#16a34a] opacity-10 rounded-full blur-3xl"></div>

      {/* Card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-green-100 opacity-0"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-[#16a34a] flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">L</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#16a34a]">
            Bienvenue
          </h1>

          <p className="text-gray-500 mt-3 text-sm">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Adresse email
            </label>

            <input
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#16a34a] focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mot de passe
            </label>

            <input
              type="password"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#16a34a] focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                className="accent-[#16a34a]"
              />
              Se souvenir de moi
            </label>

            <a
              href="#"
              className="text-[#16a34a] hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#16a34a] hover:bg-green-700 text-white py-3 rounded-2xl font-bold text-lg shadow-lg hover:shadow-green-300 transition-all duration-300 hover:-translate-y-1"
          >
            Se connecter
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Admin Dashboard sécurisé
        </p>
      </div>

      {/* Animation */}
      <style>
        {`
          .animate-fade {
            animation: fadeIn 0.8s ease forwards;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(25px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}