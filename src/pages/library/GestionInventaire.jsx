import React, { useState, useMemo } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Topbar from "../../components/Layout/Topbar";
import Modal from "../../components/ui/Modal";
import { useData } from "../../contexts/DataContext";
import toast from "react-hot-toast";

export default function GestionInventaire() {
  const { books, addBook, updateBook, deleteBook, updateStock } = useData();

  // États
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("Toutes");
  const [statusFilter, setStatusFilter] = useState("Tous");
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
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedBookForOrder, setSelectedBookForOrder] = useState(null);

  const itemsPerPage = 5;

  // Filtres et pagination
  const filteredBooks = useMemo(() => {
    let filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.isbn && book.isbn.includes(searchTerm))
    );
    if (categoryFilter !== "Toutes") {
      filtered = filtered.filter((book) => book.category === categoryFilter);
    }
    if (statusFilter === "Stock bas") {
      filtered = filtered.filter((book) => book.stock < 10);
    } else if (statusFilter === "En stock") {
      filtered = filtered.filter((book) => book.stock >= 10);
    }
    return filtered;
  }, [books, searchTerm, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistiques réelles
  const totalTitles = books.length;
  const lowStockCount = books.filter((b) => b.stock < 10).length;
  const pendingOrders = 0; // Simulé, pourrait être un état plus tard

  // Livres nécessitant un réassort (stock < seuil, ici seuil = 5)
  const urgentReplenishments = books.filter((b) => b.stock < 5).slice(0, 3);

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
      updateBook(editingBook._id, formData);
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
    if (window.confirm(`Supprimer définitivement "${title}" ?`)) {
      deleteBook(id);
      if (paginatedBooks.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const openStockModal = (book) => {
    setStockAdjustId(book._id);
    setStockAdjustValue(book.stock);
  };

  const handleStockUpdate = () => {
    if (stockAdjustId && stockAdjustValue >= 0) {
      updateStock(stockAdjustId, stockAdjustValue);
      setStockAdjustId(null);
      toast.success("Stock mis à jour");
    }
  };

  const openOrderModal = (book) => {
    setSelectedBookForOrder(book);
    setOrderModalOpen(true);
  };

  const handleOrder = () => {
    if (selectedBookForOrder) {
      // Simuler une commande : on augmente le stock de 20 exemplaires
      const newStock = selectedBookForOrder.stock + 20;
      updateStock(selectedBookForOrder._id, newStock);
      setOrderModalOpen(false);
      toast.success(`Commande passée pour ${selectedBookForOrder.title} (+20 exemplaires)`);
    }
  };

  // Calcul du pourcentage de stock (basé sur une capacité max arbitraire de 100)
  const getStockPercentage = (stock) => Math.min((stock / 100) * 100, 100);

  // Obtenir la couleur de la barre de progression
  const getProgressColor = (stock) => (stock < 20 ? "bg-red-500" : "bg-blue-600");

  return (
    <div className="flex bg-[#F6F3EE] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Topbar />

        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion de l'Inventaire</h1>
            <p className="text-gray-600">Aperçu complet du catalogue et gestion des stocks</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Rechercher par livre, auteur, ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-200 rounded-2xl px-5 py-3 w-96 focus:outline-none focus:border-gray-400"
            />
            <button
              onClick={openAddModal}
              className="bg-gray-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-colors"
            >
              <span className="text-xl">+</span>
              Ajouter un Titre
            </button>
          </div>
        </div>

        {/* Stat Cards dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">📚</div>
              <div>
                <p className="text-sm text-gray-500">Total des Titres</p>
                <p className="text-4xl font-bold text-gray-800">{totalTitles}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-3xl">⚠️</div>
              <div>
                <p className="text-sm text-gray-500">Alertes Stock Bas</p>
                <p className="text-4xl font-bold text-red-600">{lowStockCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl">🚚</div>
              <div>
                <p className="text-sm text-gray-500">Commandes en Cours</p>
                <p className="text-4xl font-bold text-amber-600">{pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tableau principal */}
          <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-semibold text-xl">Stock Principal</h2>
              <div className="flex gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl bg-white"
                >
                  <option value="Toutes">Catégorie : Toutes</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Histoire">Histoire</option>
                  <option value="Sciences">Sciences</option>
                  <option value="Poésie">Poésie</option>
                  <option value="Classique">Classique</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl bg-white"
                >
                  <option value="Tous">Statut : Tous</option>
                  <option value="En stock">En stock (≥10)</option>
                  <option value="Stock bas">Stock bas (&lt;10)</option>
                </select>
              </div>
            </div>

            {paginatedBooks.length === 0 ? (
              <div className="p-12 text-center text-gray-500">Aucun livre trouvé.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 border-b">
                      <th className="text-left py-5 px-6 font-normal">Livre</th>
                      <th className="text-left py-5 px-6 font-normal">Catégorie</th>
                      <th className="text-left py-5 px-6 font-normal">Niveau de Stock</th>
                      <th className="text-left py-5 px-6 font-normal">Statut</th>
                      <th className="text-left py-5 px-6 font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {paginatedBooks.map((book) => {
                      const progress = getStockPercentage(book.stock);
                      const isLowStock = book.stock < 10;
                      return (
                        <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5">
                            <div>
                              <p className="font-medium">{book.title}</p>
                              <p className="text-sm text-gray-500">{book.author}</p>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-4 py-1 bg-gray-100 text-xs font-medium rounded-full">
                              {book.category}
                            </span>
                           </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getProgressColor(book.stock)}`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium tabular-nums w-14">
                                {book.stock}
                              </span>
                            </div>
                           </td>
                          <td className="px-6 py-5">
                            <span
                              className={`px-4 py-1.5 text-xs font-medium rounded-full ${
                                isLowStock
                                  ? "bg-red-100 text-red-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {isLowStock ? "STOCK BAS" : "EN STOCK"}
                            </span>
                           </td>
                          <td className="px-6 py-5">
                            <div className="flex gap-3">
                              <button
                                onClick={() => openEditModal(book)}
                                className="p-2 hover:bg-gray-100 rounded-xl"
                                title="Modifier"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => openStockModal(book)}
                                className="p-2 hover:bg-gray-100 rounded-xl"
                                title="Ajuster le stock"
                              >
                                🔄
                              </button>
                              <button
                                onClick={() => handleDelete(book._id, book.title)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                                title="Supprimer"
                              >
                                🛒
                              </button>
                            </div>
                           </td>
                         </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-6 border-t flex items-center justify-between text-sm text-gray-500 flex-wrap gap-3">
                <p>
                  Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
                  {Math.min(currentPage * itemsPerPage, filteredBooks.length)} sur {filteredBooks.length} titres
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-xl disabled:opacity-50"
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-xl ${
                        currentPage === page
                          ? "bg-gray-900 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded-xl disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar droite */}
          <div className="lg:col-span-4 space-y-6">
            {/* Réassorts Urgents (dynamique) */}
            <div className="bg-[#1F2937] text-white rounded-3xl p-6">
              <h3 className="font-semibold mb-5">Réassorts Urgents</h3>
              <div className="space-y-4">
                {urgentReplenishments.length === 0 ? (
                  <p className="text-gray-400 text-sm">Aucun réassort urgent.</p>
                ) : (
                  urgentReplenishments.map((book) => (
                    <div key={book._id} className="bg-white/10 rounded-2xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Stock : {book.stock} | Seuil : 5
                          </p>
                        </div>
                        <div className="text-xs px-3 py-1 bg-red-500/30 text-red-300 rounded-full">
                          URGENT
                        </div>
                      </div>
                      <button
                        onClick={() => openOrderModal(book)}
                        className="mt-4 w-full bg-white text-gray-900 py-2.5 rounded-2xl text-sm font-medium hover:bg-gray-100"
                      >
                        Commander
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button className="mt-6 w-full border border-white/30 py-3 rounded-2xl hover:bg-white/10 transition-colors">
                Voir tout l'urgent
              </button>
            </div>

            {/* Mouvement Stock (simulé) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Mouvement Stock</h3>
              <div className="h-60 flex items-end justify-around gap-3 px-4">
                {["LUN", "MAR", "MER", "JEU", "VEN", "SAM"].map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                      style={{ height: `${[45, 65, 85, 55, 95, 40][i]}%` }}
                    ></div>
                    <span className="text-xs text-gray-500">{day}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                Rotation de stock augmentée de 12% par rapport au mois dernier
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Ajout / Modification */}
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

      {/* Modal Ajustement stock */}
      <Modal isOpen={stockAdjustId !== null} onClose={() => setStockAdjustId(null)} title="Ajuster le stock">
        <div className="space-y-4">
          <input type="number" value={stockAdjustValue} onChange={(e) => setStockAdjustValue(parseInt(e.target.value) || 0)} className="w-full border rounded-xl p-3" min="0" />
          <button onClick={handleStockUpdate} className="w-full bg-blue-600 text-white py-3 rounded-2xl">Enregistrer</button>
        </div>
      </Modal>

      {/* Modal de commande */}
      <Modal isOpen={orderModalOpen} onClose={() => setOrderModalOpen(false)} title="Passer une commande">
        {selectedBookForOrder && (
          <div className="space-y-4">
            <p>
              <strong>{selectedBookForOrder.title}</strong> – Stock actuel : {selectedBookForOrder.stock} exemplaires.
            </p>
            <p>Voulez-vous commander 20 exemplaires supplémentaires ?</p>
            <button onClick={handleOrder} className="w-full bg-green-600 text-white py-3 rounded-2xl">Confirmer la commande</button>
          </div>
        )}
      </Modal>
    </div>
  );
}