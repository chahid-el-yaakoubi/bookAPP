import express from 'express';
const router = express.Router();
import { register, login, verify, verifyAdmin, CheckUsername, verifyUserCode } from '../controllers/auth.js';

// login
router.post('/login', login)
router.post('/verifyAdmin', verifyAdmin)
router.post('/reset-password', verifyUserCode);

// register
router.post('/register', register)
router.post('/check-username', CheckUsername)


router.post('/verify/:iduser', verify)



export default router