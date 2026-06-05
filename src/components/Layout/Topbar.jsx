import React, { useState, useEffect } from "react";
import { Bell, Search, Info, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Topbar({ onSearch }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Charger l'utilisateur connecté
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Mettre à jour la date
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      setCurrentDate(now.toLocaleDateString("fr-FR", options));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000); // mise à jour chaque minute
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
      {/* Titre dynamique (pourrait être passé en prop) */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        {currentUser && (
          <p className="text-sm text-gray-500">
            Bienvenue, {currentUser.name || currentUser.email}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {/* Barre de recherche */}
        <div className="relative">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Rechercher un livre..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-white rounded-xl pl-10 pr-4 py-2 border border-gray-200 w-72 outline-none focus:border-blue-300"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Info / Aide */}
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Info size={18} className="text-gray-600" />
        </button>

        {/* Date */}
        <span className="text-sm text-gray-500 hidden md:block">
          {currentDate}
        </span>

        {/* Avatar / Déconnexion */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Déconnexion"
          >
            <LogOut size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}