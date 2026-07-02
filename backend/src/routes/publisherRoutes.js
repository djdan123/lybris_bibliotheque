import express from 'express';
import {
  getPublishers,
  getPublisherById,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from '../controllers/publisherController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getPublishers);
router.get('/:id', getPublisherById);
router.post('/', createPublisher);
router.put('/:id', updatePublisher);
router.delete('/:id', deletePublisher);

export default router;