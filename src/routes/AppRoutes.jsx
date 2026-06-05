import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/storage"; // ou votre méthode pour vérifier l'auth

// Import des pages
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Library from "../pages/library/Library";
import InventaireGlobal from "../pages/library/inventory";
import Editeurs from "../pages/library/Editeurs";
import GestionInventaire from "../pages/library/GestionInventaire";
import Auteurs from "../pages/authors/Auteurs";
import Analytics from "../pages/analytics/Analytics";
import Profile from "../pages/profile/Profile";

// Composant de protection (si non connecté, redirige vers login)
const PrivateRoute = ({ children }) => {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />

        {/* Routes protégées */}
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/library" element={
          <PrivateRoute>
            <Library />
          </PrivateRoute>
        } />
        <Route path="/inventory" element={
          <PrivateRoute>
            <InventaireGlobal />
          </PrivateRoute>
        } />
        <Route path="/inventory/management" element={
          <PrivateRoute>
            <GestionInventaire />
          </PrivateRoute>
        } />
        <Route path="/authors" element={
          <PrivateRoute>
            <Auteurs />
          </PrivateRoute>
        } />
        {/* Correction du typo : /editeurs au lieu de /librtary */}
        <Route path="/editeurs" element={
          <PrivateRoute>
            <Editeurs />
          </PrivateRoute>
        } />
        <Route path="/analytics" element={
          <PrivateRoute>
            <Analytics />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800">404 - Page non trouvée</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
}