import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Globe } from "lucide-react";
import { authService } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true); // Toggle entre Login et Register
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email et mot de passe sont obligatoires");
      return;
    }
    if (!isLogin && !formData.name) {
      setError("Le nom est obligatoire pour l'inscription");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isLogin) {
        response = await authService.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }
      const { user, token } = response.data;
      localStorage.setItem('currentUser', JSON.stringify({ ...user, token }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Connexion avec Google / Facebook (simulation)
  const handleSocialLogin = (provider) => {
    const user = {
      name: provider === "google" ? "Daniel Matondo" : "Daniel Matondo",
      email: "daniel.matondo@libris.com",
      avatar: "https://i.pravatar.cc/300",
    };

    localStorage.setItem("currentUser", JSON.stringify(user));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F6F3EE] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-10 shadow-sm">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-[#031633] text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-3xl font-bold">L</span>
          </div>
          <h1 className="text-3xl font-bold mt-4">Libris</h1>
          <p className="text-gray-500 text-sm">ATHENAEUM MODERN</p>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">
            {isLogin ? "Connexion" : "Créer un compte"}
          </h2>
          <p className="text-gray-500 mt-2">
            {isLogin 
              ? "Bienvenue dans votre bibliothèque" 
              : "Rejoignez la communauté Libris"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="text-sm font-semibold uppercase text-gray-500">Nom complet</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 mt-2 outline-none focus:border-[#031633]"
                placeholder="Votre nom"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-semibold uppercase text-gray-500">Adresse e-mail</label>
            <div className="relative mt-2">
              <Mail size={18} className="absolute left-4 top-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#031633]"
                placeholder="nom@exemple.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold uppercase text-gray-500">Mot de passe</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-[#031633]"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
            <div className="relative mt-2">
              <Lock size={18} className="absolute left-4 top-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-12 outline-none focus:border-[#031633]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#031633] text-white py-3.5 rounded-2xl font-semibold hover:bg-black transition-colors disabled:opacity-70"
          >
            {loading ? "Chargement..." : (isLogin ? "Se connecter" : "Créer mon compte")}
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-[#031633] font-semibold hover:underline"
            >
              {isLogin ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
        </div>

        {/* Social Login */}
        <div className="mt-8">
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 uppercase">Ou continuer avec</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSocialLogin("google")}
              className="border border-gray-300 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Google
            </button>

            <button
              onClick={() => handleSocialLogin("facebook")}
              className="border border-gray-300 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Globe size={18} />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}