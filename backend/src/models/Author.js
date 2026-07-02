import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
  },
  birth: {
    type: String,
    trim: true,
  },
  death: {
    type: String,
    trim: true,
  },
  works: {
    type: Number,
    default: 0,
    min: 0,
  },
  genre: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Actif', 'Classique', 'Premium', 'Émergent'],
    default: 'Actif',
  },
  image: {
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

authorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Author = mongoose.model('Author', authorSchema);
export default Author;