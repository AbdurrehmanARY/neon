import express from 'express';
// import {
//   forgotPassword,
//   login,
//   logout,
//   register,
//   resetPassword,
//   varifyEmail,
// } from '../controllers/auth.controller';
import { isAuth } from '../middleware/auth.middleware';
import { upload } from '../middleware/multer.middleware';
import { Auth } from '../controllers/auth.controller';

const auth = new Auth();

const router = express.Router();

router.post('/register', upload.single('avatar'), auth.register);
router.get('/varify-email/:token', auth.verifyEmail);
router.post('/login', auth.login);
router.post('/forgot-password', auth.forgotPassword);
router.put('/reset-password/:token', auth.resetPassword);
// router.post('/logout', authRegister.logout);

export default router;
