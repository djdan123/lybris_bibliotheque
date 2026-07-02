import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "L'auteur est obligatoire"],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Fiction', 'Histoire', 'Sciences', 'Poésie', 'Classique'],
    default: 'Fiction',
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 1,
  },
  isbn: {
    type: String,
    trim: true,
  },
  publisher: {
    type: String,
    trim: true,
  },
  cover: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Book = mongoose.model('Book', bookSchema);
export default Book;