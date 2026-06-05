import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Topbar from '../../components/Layout/Topbar';
import { useData } from '../../contexts/DataContext';
import Modal from '../../components/ui/Modal'; // à créer
import toast from 'react-hot-toast';

export default function Editeurs() {
  const { publishers, addPublisher, updatePublisher, deletePublisher } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', location: '', contact: '', type: 'STANDARD' });

  const handleSubmit = () => {
    if (editing) {
      updatePublisher(editing.id, form);
    } else {
      addPublisher({ ...form, books: 0 });
    }
    closeModal();
  };

  const openEdit = (publisher) => {
    setEditing(publisher);
    setForm(publisher);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm({ name: '', location: '', contact: '', type: 'STANDARD' });
  };

  const confirmDelete = (id, name) => {
    if (window.confirm(`Supprimer l'éditeur "${name}" ?`)) {
      deletePublisher(id);
    }
  };

  return (
    <div className="flex bg-[#F6F3EE] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Topbar />
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Répertoire des Éditeurs</h1>
            <p className="text-gray-600">Gérez votre catalogue de maisons d'édition</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="bg-gray-900 text-white px-6 py-3 rounded-2xl">
            + Nouvel Éditeur
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {publishers.map(pub => (
            <div key={pub.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-xl">{pub.name}</h3>
                  <p className="text-gray-500 text-sm">{pub.location}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">{pub.type}</span>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500">OUVRAGES</p>
                  <p className="text-3xl font-bold">{pub.books.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">CONTACT</p>
                  <p className="font-medium">{pub.contact}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => openEdit(pub)} className="flex-1 py-2 border border-gray-300 rounded-2xl hover:bg-gray-50">Modifier</button>
                <button onClick={() => confirmDelete(pub.id, pub.name)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100">Supprimer</button>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? "Modifier l'éditeur" : "Ajouter un éditeur"}>
          <input type="text" placeholder="Nom" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-xl p-3 mb-3" />
          <input type="text" placeholder="Localisation" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full border rounded-xl p-3 mb-3" />
          <input type="text" placeholder="Contact" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} className="w-full border rounded-xl p-3 mb-3" />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border rounded-xl p-3 mb-4">
            <option value="PREMIUM">Premium</option>
            <option value="STANDARD">Standard</option>
            <option value="INDEPENDENT">Indépendant</option>
          </select>
          <button onClick={handleSubmit} className="w-full bg-gray-900 text-white py-3 rounded-2xl">Enregistrer</button>
        </Modal>
      </main>
    </div>
  );
}