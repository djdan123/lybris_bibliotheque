import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Topbar from "../../components/Layout/Topbar";
import Modal from "../../components/ui/Modal";
import { useData } from "../../contexts/DataContext";
import toast from "react-hot-toast";

export default function Inventaire() {
  const { books, addBook, updateBook, deleteBook, updateStock } = useData();
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
  const [stockAdjustId, setStockAdjustId] = useState(null);
  const [stockAdjustValue, setStockAdjustValue] = useState(0);

  // Filtrage des livres
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques réelles
  const totalBooksCount = books.reduce((acc, b) => acc + b.stock, 0);
  const lowStockBooks = books.filter((b) => b.stock < 10);
  const criticalStockCount = lowStockBooks.length;
  const inReplenishment = 0; // à simuler ou à implémenter plus tard

  // Réapprovisionnements urgents (livres avec stock < 5)
  const urgentBooks = books.filter((b) => b.stock < 5).slice(0, 5);

  // Gestion formulaire
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

  const openStockModal = (book) => {
    setStockAdjustId(book.id);
    setStockAdjustValue(book.stock);
  };

  const handleStockUpdate = () => {
    if (stockAdjustId && stockAdjustValue >= 0) {
      updateStock(stockAdjustId, stockAdjustValue);
      setStockAdjustId(null);
      toast.success("Stock mis à jour");
    }
  };

  return (
    <div className="flex bg-[#F6F3EE] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Topbar />

        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Inventaire Global</h1>
              <p className="text-gray-600 mt-1">
                Gérez les stocks de {books.length} ouvrages référencés.
              </p>
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Rechercher un livre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-gray-200 rounded-2xl px-5 py-3 w-80 focus:outline-none"
              />
              <button
                onClick={openAddModal}
                className="bg-gray-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-colors"
              >
                <span className="text-xl">+</span>
                AJOUTER UN OUVRAGE
              </button>
            </div>
          </div>
        </div>

        {/* Stat Cards dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">📚</div>
              <div>
                <p className="text-sm text-gray-500">TOTAL LIVRES</p>
                <p className="text-4xl font-bold text-gray-800">{totalBooksCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center text-2xl">⚠️</div>
              <div>
                <p className="text-sm text-gray-500">STOCK CRITIQUE</p>
                <p className="text-4xl font-bold text-red-600">{criticalStockCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">🔄</div>
              <div>
                <p className="text-sm text-gray-500">EN RÉAPPROVISIONNEMENT</p>
                <p className="text-4xl font-bold text-amber-600">{inReplenishment}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des livres */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Catalogue complet</h2>
          {filteredBooks.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center">
              <p className="text-gray-500">Aucun livre trouvé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={book.cover || `https://picsum.photos/id/${book.id % 200}/300/420`}
                      alt={book.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold">
                      {book.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg leading-tight mb-1">{book.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{book.author}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">STOCK</p>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${book.stock < 10 ? 'bg-red-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(book.stock / 1.5, 100)}%` }}
                            />
                          </div>
                          <span className="font-semibold text-sm">{book.stock}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => openStockModal(book)}
                        className="w-8 h-8 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50"
                        title="Modifier le stock"
                      >
                        ✏️
                      </button>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => openEditModal(book)}
                        className="flex-1 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(book.id, book.title)}
                        className="flex-1 py-2 text-sm bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tableau des réapprovisionnements urgents (basé sur stock < 5) */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="font-semibold text-xl">Réapprovisionnements urgents</h3>
            <a href="#" className="text-blue-600 hover:underline text-sm font-medium">Tout voir →</a>
          </div>
          {urgentBooks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Aucun stock critique pour le moment.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 border-b">
                    <th className="text-left py-4 px-6 font-normal">OUVRAGE</th>
                    <th className="text-left py-4 px-6 font-normal">AUTEUR</th>
                    <th className="text-left py-4 px-6 font-normal">STOCK ACTUEL</th>
                    <th className="text-left py-4 px-6 font-normal">STATUT</th>
                    <th className="text-left py-4 px-6 font-normal">ACTIONS</th>
                   </tr>
                </thead>
                <tbody>
                  {urgentBooks.map((book) => (
                    <tr key={book.id} className="border-b last:border-none hover:bg-gray-50 transition-colors">
                      <td className="py-5 px-6">
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-gray-500">{book.author}</p>
                        </div>
                      </td>
                      <td className="py-5 px-6">{book.author}</td>
                      <td className="py-5 px-6 font-bold text-red-600">{book.stock}</td>
                      <td className="py-5 px-6">
                        <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          URGENT
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <button
                          onClick={() => openStockModal(book)}
                          className="bg-gray-900 text-white px-5 py-2 rounded-2xl text-sm font-medium hover:bg-black"
                        >
                          RÉAPPROVISIONNER
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal d'ajout/modification */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBook ? "Modifier le livre" : "Ajouter un livre"}>
        <div className="space-y-4">
          <input type="text" name="title" placeholder="Titre" value={formData.title} onChange={handleChange} className="w-full border rounded-xl p-3" />
          <input type="text" name="author" placeholder="Auteur" value={formData.author} onChange={handleChange} className="w-full border rounded-xl p-3" />
          <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-xl p-3">
            <option>Fiction</option><option>Histoire</option><option>Sciences</option><option>Poésie</option><option>Classique</option>
          </select>
          <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} className="w-full border rounded-xl p-3" />
          <input type="text" name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} className="w-full border rounded-xl p-3" />
          <input type="text" name="publisher" placeholder="Éditeur" value={formData.publisher} onChange={handleChange} className="w-full border rounded-xl p-3" />
          <input type="text" name="cover" placeholder="URL couverture" value={formData.cover} onChange={handleChange} className="w-full border rounded-xl p-3" />
          <button onClick={handleSubmit} className="w-full bg-gray-900 text-white py-3 rounded-2xl">{editingBook ? "Mettre à jour" : "Ajouter"}</button>
        </div>
      </Modal>

      {/* Modal d'ajustement du stock */}
      <Modal isOpen={stockAdjustId !== null} onClose={() => setStockAdjustId(null)} title="Ajuster le stock">
        <div className="space-y-4">
          <input type="number" value={stockAdjustValue} onChange={(e) => setStockAdjustValue(parseInt(e.target.value) || 0)} className="w-full border rounded-xl p-3" min="0" />
          <button onClick={handleStockUpdate} className="w-full bg-blue-600 text-white py-3 rounded-2xl">Enregistrer</button>
        </div>
      </Modal>
    </div>
  );
}