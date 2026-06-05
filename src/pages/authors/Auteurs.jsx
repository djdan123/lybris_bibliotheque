import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Topbar from "../../components/Layout/Topbar";
import Modal from "../../components/ui/Modal";
import { useData } from "../../contexts/DataContext";
import toast from "react-hot-toast";

export default function Auteurs() {
  const { authors, addAuthor, updateAuthor, deleteAuthor } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    birth: "",
    death: "",
    works: 0,
    genre: "",
    status: "Actif",
    image: "",
  });

  // Filtrage
  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingAuthor(null);
    setFormData({
      name: "",
      birth: "",
      death: "",
      works: 0,
      genre: "",
      status: "Actif",
      image: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      birth: author.birth,
      death: author.death || "",
      works: author.works,
      genre: author.genre,
      status: author.status,
      image: author.image || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Le nom de l'auteur est obligatoire");
      return;
    }
    if (editingAuthor) {
      updateAuthor(editingAuthor.id, formData);
    } else {
      const newAuthor = {
        ...formData,
        id: Date.now(),
        image: formData.image || `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 64}/300/300`,
      };
      addAuthor(newAuthor);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Supprimer l'auteur "${name}" ?`)) {
      deleteAuthor(id);
    }
  };

  return (
    <div className="flex bg-[#F6F3EE] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Topbar />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Répertoire des Auteurs</h1>
          <p className="text-gray-600 mt-1">Découvrez et gérez votre catalogue d'auteurs</p>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Rechercher un auteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={openAddModal}
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-black transition-colors"
          >
            + Nouvel Auteur
          </button>
        </div>

        {/* Authors Grid */}
        {filteredAuthors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center">
            <p className="text-gray-500">Aucun auteur trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuthors.map((author) => (
              <div
                key={author.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="h-64 relative">
                  <img
                    src={author.image || "https://picsum.photos/id/64/300/300"}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-xl text-xs font-medium">
                    {author.status}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-xl">{author.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {author.birth} — {author.death || "présent"}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Œuvres</p>
                      <p className="font-semibold">{author.works}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Genre</p>
                      <p className="font-medium">{author.genre}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => openEditModal(author)}
                      className="flex-1 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(author.id, author.name)}
                      className="flex-1 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Ajout / Modification */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAuthor ? "Modifier l'auteur" : "Ajouter un auteur"}
      >
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
          />
          <input
            type="text"
            name="birth"
            placeholder="Naissance (ex: 1937, Alger)"
            value={formData.birth}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
          />
          <input
            type="text"
            name="death"
            placeholder="Décès (laisser vide si vivant)"
            value={formData.death}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
          />
          <input
            type="number"
            name="works"
            placeholder="Nombre d'œuvres"
            value={formData.works}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre littéraire"
            value={formData.genre}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
          >
            <option value="Actif">Actif</option>
            <option value="Classique">Classique</option>
            <option value="Premium">Premium</option>
            <option value="Émergent">Émergent</option>
          </select>
          <input
            type="text"
            name="image"
            placeholder="URL de la photo (optionnel)"
            value={formData.image}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-gray-900 text-white py-3 rounded-2xl"
          >
            {editingAuthor ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </Modal>
    </div>
  );
}