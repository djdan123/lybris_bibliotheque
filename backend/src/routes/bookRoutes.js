import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  updateStock,
  getBookStats,
} from '../controllers/bookController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

router.get('/stats', getBookStats);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.put('/:id/stock', updateStock);
router.delete('/:id', deleteBook);

export default router;