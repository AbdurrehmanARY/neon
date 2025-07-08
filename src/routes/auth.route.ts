import express from 'express';
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  varifyEmail,
} from '../controllers/auth.controller';
import { isAuth } from '../middleware/auth.middleware';
const router = express.Router();

router.post('/register', register);
router.get('/varify-email/:token', varifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/logout', logout);

export default router;
