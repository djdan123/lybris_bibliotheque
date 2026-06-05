import React, { useMemo } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Topbar from "../../components/Layout/Topbar";
import { useData } from "../../contexts/DataContext";

export default function Analytics() {
  const { books, authors } = useData();

  // Statistiques réelles
  const totalBooksInStock = useMemo(() => {
    return books.reduce((acc, book) => acc + book.stock, 0);
  }, [books]);

  const totalTitles = books.length;
  const activeAuthors = authors.length;

  // Répartition par genre (basée sur les livres)
  const genreDistribution = useMemo(() => {
    const distribution = {};
    books.forEach(book => {
      const genre = book.category;
      if (genre) {
        distribution[genre] = (distribution[genre] || 0) + 1;
      }
    });
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    return Object.entries(distribution).map(([genre, count]) => ({
      genre,
      percent: Math.round((count / total) * 100),
      count
    }));
  }, [books]);

  // Simuler des ventes (à remplacer par de vraies données plus tard)
  const simulatedSales = 12450; // montant fictif
  const simulatedSoldBooks = totalBooksInStock > 100 ? Math.round(totalBooksInStock * 0.3) : 284;
  const salesTrend = "+12%"; // simulé
  const rotationRate = "64.2%"; // simulé

  // Tendance auteurs (simulée)
  const authorTrend = activeAuthors > 80 ? "-2 ce mois" : "+5 ce mois";
  const authorTrendColor = activeAuthors > 80 ? "text-amber-600" : "text-emerald-600";

  return (
    <div className="flex bg-[#F6F3EE] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Topbar />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Analytics &amp; Rapports</h1>
          <p className="text-gray-600">Performance globale de votre bibliothèque</p>
        </div>

        {/* Stats Cards dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Ventes Totales (sim.)</p>
            <p className="text-4xl font-bold mt-2">{simulatedSales.toLocaleString()} FBU</p>
            <p className="text-emerald-600 text-sm mt-2">{salesTrend} ce mois</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Livres en Stock</p>
            <p className="text-4xl font-bold mt-2">{totalBooksInStock.toLocaleString()}</p>
            <p className="text-emerald-600 text-sm mt-2">{totalTitles} titres distincts</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Auteurs Actifs</p>
            <p className="text-4xl font-bold mt-2">{activeAuthors}</p>
            <p className={`${authorTrendColor} text-sm mt-2`}>{authorTrend}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Taux de Rotation</p>
            <p className="text-4xl font-bold mt-2">{rotationRate}</p>
            <p className="text-red-600 text-sm mt-2">-2.4%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique des ventes (placeholder interactif possible avec Recharts) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm h-96 flex items-center justify-center border border-dashed border-gray-200">
            <div className="text-center">
              <p className="text-gray-400 text-lg">📊 Évolution du stock / emprunts</p>
              <p className="text-sm text-gray-500 mt-2">
                (Intégrez Recharts pour afficher les tendances réelles)
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Données actuelles : {totalBooksInStock} livres en stock, {activeAuthors} auteurs.
              </p>
            </div>
          </div>

          {/* Répartition par genre (dynamique) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-semibold mb-6">Répartition par Genre</h3>
            {genreDistribution.length === 0 ? (
              <p className="text-gray-500">Aucune donnée de genre disponible.</p>
            ) : (
              <div className="space-y-5">
                {genreDistribution.map((item) => (
                  <div key={item.genre}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.genre}</span>
                      <span className="font-medium">{item.percent}% ({item.count} livres)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}