import React, { createContext, useState, useEffect, useContext } from 'react';
import { getBooks, saveBooks, getAuthors, saveAuthors, getPublishers, savePublishers } from '../services/storage';
import toast from 'react-hot-toast';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // État
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement initial
  useEffect(() => {
    setBooks(getBooks());
    setAuthors(getAuthors());
    setPublishers(getPublishers());
    setLoading(false);
  }, []);

  // Persistance automatique
  useEffect(() => {
    if (!loading) saveBooks(books);
  }, [books, loading]);

  useEffect(() => {
    if (!loading) saveAuthors(authors);
  }, [authors, loading]);

  useEffect(() => {
    if (!loading) savePublishers(publishers);
  }, [publishers, loading]);

  // CRUD Livres
  const addBook = (book) => {
    const newBook = { ...book, id: Date.now() };
    setBooks([...books, newBook]);
    toast.success('Livre ajouté avec succès');
    return newBook;
  };

  const updateBook = (id, updatedBook) => {
    setBooks(books.map(book => book.id === id ? { ...book, ...updatedBook } : book));
    toast.success('Livre mis à jour');
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
    toast.success('Livre supprimé');
  };

  const updateStock = (id, newStock) => {
    setBooks(books.map(book => book.id === id ? { ...book, stock: newStock } : book));
    toast.success('Stock mis à jour');
  };

  // CRUD Auteurs
  const addAuthor = (author) => {
    const newAuthor = { ...author, id: Date.now() };
    setAuthors([...authors, newAuthor]);
    toast.success('Auteur ajouté');
  };

  const updateAuthor = (id, updatedAuthor) => {
    setAuthors(authors.map(author => author.id === id ? { ...author, ...updatedAuthor } : author));
    toast.success('Auteur modifié');
  };

  const deleteAuthor = (id) => {
    setAuthors(authors.filter(author => author.id !== id));
    toast.success('Auteur supprimé');
  };

  // CRUD Éditeurs
  const addPublisher = (publisher) => {
    const newPublisher = { ...publisher, id: Date.now() };
    setPublishers([...publishers, newPublisher]);
    toast.success('Éditeur ajouté');
  };

  const updatePublisher = (id, updatedPublisher) => {
    setPublishers(publishers.map(p => p.id === id ? { ...p, ...updatedPublisher } : p));
    toast.success('Éditeur modifié');
  };

  const deletePublisher = (id) => {
    setPublishers(publishers.filter(p => p.id !== id));
    toast.success('Éditeur supprimé');
  };

  // Utilitaires
  const getLowStockBooks = () => books.filter(book => book.stock < 10);
  const getTotalBooks = () => books.reduce((acc, b) => acc + b.stock, 0);

  return (
    <DataContext.Provider value={{
      books, authors, publishers, loading,
      addBook, updateBook, deleteBook, updateStock,
      addAuthor, updateAuthor, deleteAuthor,
      addPublisher, updatePublisher, deletePublisher,
      getLowStockBooks, getTotalBooks
    }}>
      {children}
    </DataContext.Provider>
  );
};