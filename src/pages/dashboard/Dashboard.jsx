import React, { useMemo, useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Topbar from "../../components/Layout/Topbar";
import StatCard from "../../components/ui/StateCard";
import Modal from "../../components/ui/Modal";
import { useData } from "../../contexts/DataContext";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { books, authors, publishers, getLowStockBooks, getTotalBooks, addBook, updateStock } = useData();

  // États pour les modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isArrivalModalOpen, setIsArrivalModalOpen] = useState(false);
  const [newArrival, setNewArrival] = useState({ title: "", author: "", stock: 1, category: "Fiction" });

  // 1. Cartes statistiques
  const totalBooks = getTotalBooks();
  const lowStockCount = getLowStockBooks().length;

  const newBooksThisWeek = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return books.filter(book => book._id > oneWeekAgo).length;
  }, [books]);

  // 2. Activités récentes
  const recentActivities = useMemo(() => {
    const bookActivities = books.map(book => ({
      id: book._id,
      type: "book",
      title: book.title,
      author: book.author,
      timestamp: book._id,
      icon: "📖",
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      message: `Nouveau livre ajouté : "${book.title}"`
    }));
    const authorActivities = authors.map(author => ({
      id: author._id,
      type: "author",
      name: author.name,
      timestamp: author._id,
      icon: "👤",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      message: `Nouvel auteur inscrit : ${author.name}`
    }));
    const allActivities = [...bookActivities, ...authorActivities];
    allActivities.sort((a, b) => b.timestamp - a.timestamp);
    return allActivities.slice(0, 3);
  }, [books, authors]);

  // 3. Top des stocks
  const topStockBooks = useMemo(() => {
    return [...books].sort((a, b) => b.stock - a.stock).slice(0, 4);
  }, [books]);

  const timeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  };

  // Gestion Rapport AI
  const generateReport = () => {
    // Simuler un rapport textuel
    const totalAuthors = authors.length;
    const totalPublishers = publishers.length;
    const criticalStock = getLowStockBooks().length;
    const report = `
      📊 RAPPORT GÉNÉRAL DE LA BIBLIOTHÈQUE 📊
      ----------------------------------------
      📚 Total livres en stock : ${totalBooks}
      🆕 Nouveaux livres (7j) : ${newBooksThisWeek}
      👤 Auteurs référencés : ${totalAuthors}
      🏢 Éditeurs partenaires : ${totalPublishers}
      ⚠️ Alertes stock bas : ${criticalStock}
      ⭐ Top livre stock : ${topStockBooks[0]?.title || 'Aucun'} (${topStockBooks[0]?.stock || 0} ex.)
    `;
    // Afficher dans une alerte ou un modal – ici on affiche dans une notification
    toast.custom((t) => (
      <div className="bg-white rounded-2xl shadow-xl p-4 max-w-md border-l-4 border-blue-600">
        <pre className="text-sm font-mono whitespace-pre-wrap">{report}</pre>
        <button onClick={() => toast.dismiss(t._id)} className="mt-2 text-blue-600 text-sm">
          Fermer
        </button>
      </div>
    ), { duration: 8000 });
    setIsReportModalOpen(false);
  };

  // Gestion Nouvel Arrivage
  const handleArrivalSubmit = () => {
    if (!newArrival.title.trim() || !newArrival.author.trim()) {
      toast.error("Veuillez remplir le titre et l'auteur");
      return;
    }
    const newBook = {
      id: Date.now(),
      title: newArrival.title,
      author: newArrival.author,
      category: newArrival.category,
      stock: newArrival.stock,
      isbn: `ISBN-${Math.floor(Math.random() * 1000000)}`,
      publisher: "Non spécifié",
      cover: `https://picsum.photos/id/${Math.floor(Math.random() * 200)}/300/420`,
    };
    addBook(newBook);
    setNewArrival({ title: "", author: "", stock: 1, category: "Fiction" });
    setIsArrivalModalOpen(false);
  };

  return (
    <div className="flex bg-[#F6F3EE] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Topbar />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="LIVRES EN STOCK" value={`${totalBooks} ex.`} subtitle="Total exemplaires" color="border-blue-500" icon="📚" />
          <StatCard title="NOUVEAUX LIVRES" value={newBooksThisWeek.toString()} subtitle="Ajoutés cette semaine" color="border-yellow-500" icon="🆕" />
          <StatCard title="ALERTES STOCK" value={lowStockCount.toString()} subtitle={`${lowStockCount} titre${lowStockCount > 1 ? 's' : ''} sous seuil`} color="border-red-500" icon="⚠️" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Sales Analysis (graphique statique) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Analyse des Ventes Hebdomadaires</h2>
                <p className="text-sm text-gray-500">Performance des revenus par catégorie</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1 text-sm">
                <span>7 derniers jours</span>
                <span className="text-gray-400">▼</span>
              </div>
            </div>
            <div className="h-80 bg-[#F8F5F0] rounded-xl flex items-center justify-center border border-gray-100 relative">
              <div className="absolute inset-0 flex items-end justify-between px-8 pb-8">
                <div className="flex-1 h-full flex items-end gap-3 relative">
                  {["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"].map((day, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{ height: `${[65,45,85,70,95,55,40][idx]}%` }}></div>
                      <span className="text-xs text-gray-500 mt-2">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Activités Récentes</h3>
              <a href="#" className="text-blue-600 text-sm hover:underline">Voir tout</a>
            </div>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity._id} className="flex gap-3">
                  <div className={`w-8 h-8 ${activity.bgColor} rounded-lg flex items-center justify-center ${activity.iconColor} text-sm`}>{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{timeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Stock */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800">Livres les plus en stock</h3>
              <a href="/inventory" className="text-blue-600 text-sm hover:underline">Gérer l'inventaire →</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topStockBooks.map((book, idx) => (
                <div key={book._id} className="group">
                  <div className="relative overflow-hidden rounded-xl mb-3">
                    <img src={book.cover || `https://picsum.photos/id/${100 + idx}/300/420`} alt={book.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold">#{idx+1}</div>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-xs">{book.stock} ex.</div>
                  </div>
                  <p className="font-medium text-sm">{book.title}</p>
                  <p className="text-xs text-gray-500">{book.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions avec boutons fonctionnels */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm flex flex-col">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">⚡</div>
                <div>
                  <h3 className="font-semibold">Actions Rapides</h3>
                  <p className="text-xs text-gray-500">Besoin d'aide avec vos rapports ?</p>
                </div>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                >
                  Générer Rapport AI
                </button>
                <button 
                  onClick={() => setIsArrivalModalOpen(true)}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <span>Nouvel Arrivage</span>
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>
            <div className="mt-auto pt-8">
              <div className="flex items-center justify-center h-28 border border-dashed border-gray-300 rounded-2xl text-center">
                <div><div className="text-3xl mb-1">📦</div><p className="text-xs text-gray-500">Glisser un nouveau livre ici</p></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Rapport AI */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Génération de rapport IA">
        <p className="text-gray-600 mb-4">Cliquez sur "Générer" pour produire un rapport instantané de votre bibliothèque.</p>
        <button onClick={generateReport} className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">
          Générer le rapport
        </button>
      </Modal>

      {/* Modal Nouvel Arrivage */}
      <Modal isOpen={isArrivalModalOpen} onClose={() => setIsArrivalModalOpen(false)} title="Nouvel arrivage">
        <div className="space-y-4">
          <input type="text" placeholder="Titre du livre" value={newArrival.title} onChange={e => setNewArrival({...newArrival, title: e.target.value})} className="w-full border rounded-xl p-3" />
          <input type="text" placeholder="Auteur" value={newArrival.author} onChange={e => setNewArrival({...newArrival, author: e.target.value})} className="w-full border rounded-xl p-3" />
          <select value={newArrival.category} onChange={e => setNewArrival({...newArrival, category: e.target.value})} className="w-full border rounded-xl p-3">
            <option>Fiction</option><option>Histoire</option><option>Sciences</option><option>Poésie</option><option>Classique</option>
          </select>
          <input type="number" min="1" value={newArrival.stock} onChange={e => setNewArrival({...newArrival, stock: parseInt(e.target.value) || 1})} className="w-full border rounded-xl p-3" />
          <button onClick={handleArrivalSubmit} className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-black">Ajouter cet ouvrage</button>
        </div>
      </Modal>
    </div>
  );
}