import mongoose from 'mongoose';

const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  books: {
    type: Number,
    default: 0,
    min: 0,
  },
  contact: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['PREMIUM', 'STANDARD', 'INDEPENDENT'],
    default: 'STANDARD',
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

publisherSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Publisher = mongoose.model('Publisher', publisherSchema);
export default Publisher;