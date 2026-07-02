import Author from '../models/Author.js';

export const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find().sort({ createdAt: -1 });
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Auteur non trouvé' });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAuthor = async (req, res) => {
  try {
    const author = new Author(req.body);
    const savedAuthor = await author.save();
    res.status(201).json(savedAuthor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!author) {
      return res.status(404).json({ message: 'Auteur non trouvé' });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Auteur non trouvé' });
    }
    res.status(200).json({ message: 'Auteur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};