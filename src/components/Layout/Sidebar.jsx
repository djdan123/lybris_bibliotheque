import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
  LayoutDashboard,
  Library,
  BookOpen,
  Users,
  UserCircle,
  ChevronDown,
  BarChart3,
  Building2,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  // =========================
  // USER STATE (depuis currentUser)
  // =========================
  const [user, setUser] = useState({
    name: "Invité",
    avatar: "https://i.pravatar.cc/40",
  });

  // =========================
  // MENU STATE
  // =========================
  const [openLibrary, setOpenLibrary] = useState(true);
  const [openInventory, setOpenInventory] = useState(false);

  // =========================
  // LOAD USER FROM LOGIN
  // =========================
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser({
        name: parsed.name || parsed.email || "Utilisateur",
        avatar: parsed.avatar || "https://i.pravatar.cc/40",
      });
    }
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#031633] text-white flex flex-col justify-between">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="p-6">
          <h1 className="text-3xl font-bold">Libris</h1>
          <p className="text-xs text-gray-400">MANAGEMENT</p>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-8 space-y-1 px-3">
          {/* DASHBOARD */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? "bg-[#13284d]" : "hover:bg-[#0f2445]"
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span className="text-sm">Dashboard</span>
          </NavLink>

          {/* BIBLIOTHÈQUE */}
          <div>
            <button
              onClick={() => setOpenLibrary(!openLibrary)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#0f2445] transition-all"
            >
              <div className="flex items-center gap-3">
                <Library size={18} />
                <span className="text-sm">Bibliothèque</span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform ${openLibrary ? "rotate-180" : ""}`}
              />
            </button>

            {openLibrary && (
              <div className="ml-6 mt-1 space-y-1">
                <NavLink
                  to="/library"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                      isActive ? "bg-[#13284d]" : "hover:bg-[#0f2445]"
                    }`
                  }
                >
                  Catalogue Général
                </NavLink>

                <NavLink
                  to="/editeurs"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                      isActive ? "bg-[#13284d]" : "hover:bg-[#0f2445]"
                    }`
                  }
                >
                  <Building2 size={16} />
                  Éditeurs
                </NavLink>
              </div>
            )}
          </div>

          {/* INVENTAIRE */}
          <div>
            <button
              onClick={() => setOpenInventory(!openInventory)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#0f2445] transition-all"
            >
              <div className="flex items-center gap-3">
                <BookOpen size={18} />
                <span className="text-sm">Inventaire</span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform ${openInventory ? "rotate-180" : ""}`}
              />
            </button>

            {openInventory && (
              <div className="ml-6 mt-1 space-y-1">
                <NavLink
                  to="/inventory"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                      isActive ? "bg-[#13284d]" : "hover:bg-[#0f2445]"
                    }`
                  }
                >
                  Inventaire Global
                </NavLink>
                <NavLink
                  to="/inventory/management"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                      isActive ? "bg-[#13284d]" : "hover:bg-[#0f2445]"
                    }`
                  }
                >
                  Gestion Inventaire
                </NavLink>
              </div>
            )}
          </div>

          {/* AUTEURS */}
          <NavLink
            to="/authors"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? "bg-[#13284d]" : "hover:bg-[#0f2445]"
              }`
            }
          >
            <Users size={18} />
            <span className="text-sm">Auteurs</span>
          </NavLink>

          {/* ANALYTICS */}
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? "bg-[#13284d]" : "hover:bg-[#0f2445]"
              }`
            }
          >
            <BarChart3 size={18} />
            <span className="text-sm">Analytics</span>
          </NavLink>

          {/* PROFIL */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? "bg-[#13284d]" : "hover:bg-[#0f2445]"
              }`
            }
          >
            <UserCircle size={18} />
            <span className="text-sm">Profil</span>
          </NavLink>
        </nav>
      </div>

      {/* USER INFO + LOGOUT */}
      <div className="p-5 border-t border-[#11284d]">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-sm font-semibold">{user.name}</h3>
            <p className="text-xs text-gray-400">ADMINISTRATEUR</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
            title="Déconnexion"
          >
            <LogOut size={18} className="text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>
    </aside>
  );
}