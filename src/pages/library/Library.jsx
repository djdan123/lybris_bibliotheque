import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Topbar from "../../components/Layout/Topbar";
import Modal from "../../components/ui/Modal";
import { useData } from "../../contexts/DataContext";
import toast from "react-hot-toast";

export default function Library() {
  const { books, addBook, updateBook, deleteBook } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    stock: 1,
    isbn: "",
    publisher: "",
    cover: "",
  });

  // Filtrage des livres
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      category: "Fiction",
      stock: 1,
      isbn: "",
      publisher: "",
      cover: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      stock: book.stock,
      isbn: book.isbn || "",
      publisher: book.publisher || "",
      cover: book.cover || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.author.trim()) {
      toast.error("Le titre et l'auteur sont obligatoires");
      return;
    }

    if (editingBook) {
      updateBook(editingBook.id, formData);
    } else {
      const newBook = {
        ...formData,
        id: Date.now(),
        cover: formData.cover || `https://picsum.photos/id/${Math.floor(Math.random() * 200)}/300/420`,
      };
      addBook(newBook);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Supprimer le livre "${title}" ?`)) {
      deleteBook(id);
    }
  };

  return (
    <div className="flex bg-[#F6F3EE] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Topbar />

        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Bibliothèque</h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Rechercher un livre, auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-200 rounded-2xl px-5 py-3 w-80 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={openAddModal}
              className="bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-black transition-colors"
            >
              + Ajouter un Livre
            </button>
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl">
            <p className="text-gray-500">Aucun livre trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-6xl">📖</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold leading-tight">{book.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{book.author}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="inline-block px-3 py-1 text-xs bg-gray-100 rounded-full">
                      {book.category}
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      Stock: {book.stock}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(book)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(book.id, book.title)}
                      className="flex-1 py-2 text-sm bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
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
        title={editingBook ? "Modifier le livre" : "Ajouter un livre"}
      >
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Titre du livre"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            name="author"
            placeholder="Auteur"
            value={formData.author}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="Fiction">Fiction</option>
            <option value="Histoire">Histoire</option>
            <option value="Sciences">Sciences</option>
            <option value="Poésie">Poésie</option>
            <option value="Classique">Classique</option>
          </select>
          <input
            type="number"
            name="stock"
            placeholder="Quantité en stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            name="isbn"
            placeholder="ISBN (optionnel)"
            value={formData.isbn}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            name="publisher"
            placeholder="Éditeur (optionnel)"
            value={formData.publisher}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            name="cover"
            placeholder="URL de la couverture (optionnel)"
            value={formData.cover}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-gray-900 text-white py-3 rounded-2xl hover:bg-black transition-colors"
          >
            {editingBook ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </Modal>
    </div>
  );
}