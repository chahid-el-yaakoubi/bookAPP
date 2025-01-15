import express from 'express';
const router = express.Router();
import { register, login, verify } from '../controllers/auth.js';

// login
router.post('/login', login)
// register
router.post('/register', register)


router.post('/verify/:iduser', verify)



export default router