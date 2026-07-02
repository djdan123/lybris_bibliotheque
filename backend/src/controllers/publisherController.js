import Publisher from '../models/Publisher.js';

export const getPublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find().sort({ createdAt: -1 });
    res.status(200).json(publishers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublisherById = async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) {
      return res.status(404).json({ message: 'Éditeur non trouvé' });
    }
    res.status(200).json(publisher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPublisher = async (req, res) => {
  try {
    const publisher = new Publisher(req.body);
    const savedPublisher = await publisher.save();
    res.status(201).json(savedPublisher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!publisher) {
      return res.status(404).json({ message: 'Éditeur non trouvé' });
    }
    res.status(200).json(publisher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndDelete(req.params.id);
    if (!publisher) {
      return res.status(404).json({ message: 'Éditeur non trouvé' });
    }
    res.status(200).json({ message: 'Éditeur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};