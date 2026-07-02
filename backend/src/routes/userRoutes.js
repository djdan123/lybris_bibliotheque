// backend/src/routes/userRoutes.js
import express from 'express';
import { getUsers, getUserById } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Récupérer tous les utilisateurs (réservé admin)
router.get('/', getUsers);

// Récupérer un utilisateur par ID
router.get('/:id', getUserById);

export default router;