import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/auth.js';

// login
router.post('/login', login)
// register
router.post('/register', register)



export default router