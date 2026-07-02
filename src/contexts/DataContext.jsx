import React, { createContext, useState, useEffect, useContext } from 'react';
import { bookService } from '../services/bookService';
import { authorService } from '../services/authorService';
import { publisherService } from '../services/publisherService';
import toast from 'react-hot-toast';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Vérifier si l'utilisateur est connecté (token présent)
      const user = localStorage.getItem('currentUser');
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const [booksRes, authorsRes, publishersRes] = await Promise.all([
          bookService.getAll(),
          authorService.getAll(),
          publisherService.getAll(),
        ]);
        setBooks(booksRes.data);
        setAuthors(authorsRes.data);
        setPublishers(publishersRes.data);
      } catch (error) {
        console.error('Erreur chargement données:', error);
        toast.error('Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // CRUD Livres
  const addBook = async (book) => {
    try {
      const response = await bookService.create(book);
      setBooks([...books, response.data]);
      toast.success('Livre ajouté avec succès');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const updateBook = async (id, updatedBook) => {
    try {
      const response = await bookService.update(id, updatedBook);
      setBooks(books.map(b => b.id === id ? response.data : b));
      toast.success('Livre mis à jour');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const deleteBook = async (id) => {
    try {
      await bookService.delete(id);
      setBooks(books.filter(b => b.id !== id));
      toast.success('Livre supprimé');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const updateStock = async (id, stock) => {
    try {
      const response = await bookService.updateStock(id, stock);
      setBooks(books.map(b => b.id === id ? response.data : b));
      toast.success('Stock mis à jour');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  // CRUD Auteurs
  const addAuthor = async (author) => {
    try {
      const response = await authorService.create(author);
      setAuthors([...authors, response.data]);
      toast.success('Auteur ajouté');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const updateAuthor = async (id, updatedAuthor) => {
    try {
      const response = await authorService.update(id, updatedAuthor);
      setAuthors(authors.map(a => a.id === id ? response.data : a));
      toast.success('Auteur modifié');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const deleteAuthor = async (id) => {
    try {
      await authorService.delete(id);
      setAuthors(authors.filter(a => a.id !== id));
      toast.success('Auteur supprimé');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  // CRUD Éditeurs
  const addPublisher = async (publisher) => {
    try {
      const response = await publisherService.create(publisher);
      setPublishers([...publishers, response.data]);
      toast.success('Éditeur ajouté');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const updatePublisher = async (id, updatedPublisher) => {
    try {
      const response = await publisherService.update(id, updatedPublisher);
      setPublishers(publishers.map(p => p.id === id ? response.data : p));
      toast.success('Éditeur modifié');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const deletePublisher = async (id) => {
    try {
      await publisherService.delete(id);
      setPublishers(publishers.filter(p => p.id !== id));
      toast.success('Éditeur supprimé');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  // Utilitaires
  const getLowStockBooks = () => books.filter(b => b.stock < 10);
  const getTotalBooks = () => books.reduce((acc, b) => acc + b.stock, 0);

  return (
    <DataContext.Provider value={{
      books, authors, publishers, loading,
      addBook, updateBook, deleteBook, updateStock,
      addAuthor, updateAuthor, deleteAuthor,
      addPublisher, updatePublisher, deletePublisher,
      getLowStockBooks, getTotalBooks,
    }}>
      {children}
    </DataContext.Provider>
  );
};