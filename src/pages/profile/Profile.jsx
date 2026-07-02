import React, { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";
import Sidebar from "../../components/Layout/Sidebar";
import Topbar from "../../components/Layout/Topbar";

export default function Profile() {
  const [user, setUser] = useState({
    name: "Daniel Matondo",
    email: "daniel.matondo@libris.com",
    phone: "+257 69 123 456",
    bio: "Administrateur de la bibliothèque Libri's Management...",
    avatar: "https://i.pravatar.cc/300", // Photo par défaut
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setUser(response.data);
      } catch (error) {
        toast.error("Erreur chargement profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await authService.updateProfile(user);
      toast.success("Profil mis à jour");
      const stored = JSON.parse(localStorage.getItem('currentUser'));
      if (stored) {
        localStorage.setItem('currentUser', JSON.stringify({ ...stored, ...user }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur");
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Upload Photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex bg-[#F6F3EE] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Topbar />

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Mon Profil</h1>

          <div className="bg-white rounded-3xl shadow-sm p-8">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white shadow-md">
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="mt-4 cursor-pointer text-blue-600 text-sm font-medium hover:underline">
                  Changer la photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Informations */}
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-3xl px-5 py-4 focus:outline-none"
                  />
                </div>

                <div className="pt-6 border-t">
                  <button 
                    onClick={handleSave}
                    className="bg-gray-900 text-white px-8 py-3 rounded-2xl hover:bg-black transition-colors"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}