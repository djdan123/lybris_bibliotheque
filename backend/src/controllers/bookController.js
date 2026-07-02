import Book from '../models/Book.js';

// Obtenir tous les livres
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un livre par ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouveau livre
export const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un livre
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un livre
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour le stock
export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { stock, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir les statistiques des livres
export const getBookStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalStock = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$stock' } } }
    ]);
    const lowStock = await Book.countDocuments({ stock: { $lt: 10 } });
    const categories = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      totalTitles: totalBooks,
      totalStock: totalStock[0]?.total || 0,
      lowStock,
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};