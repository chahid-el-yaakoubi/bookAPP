import express from 'express';
const router = express.Router();

import { getUser, getUsers, updateUser, deleteUser, countByUser, requestPasswordUpdate, updatePassword, verifyUserEmail, verifyUserCode, requestPasswordReset, resetPassword } from '../controllers/user.js';
import { verifyToken , verifyUser, verifyAdmin} from '../utils/verifyToken.js';

// router.get('/checkoutauth', verifyToken, (req, res, next)=>{
//     res.send('you are logged in')
// })
// router.get('/checkuser/:id', verifyUSer, (req, res, next)=>{
//     res.send('you are logged in and you can delete your account')
// })
// router.get('/checkadmin/:id', verifyAdmin, (req, res, next)=>{
//     res.send('you are logged in and you can delete all accounts')
// })
// UPDATE 
router.put('/:id', verifyUser ,updateUser)
 
// DELETE
router.delete('/:id',verifyUser, deleteUser)
// GET
router.post('/:id', verifyUser, getUser)
// GET ALL
router.get('/', verifyAdmin, getUsers)
router.get('/count/users', verifyAdmin, countByUser)
router.post("/request-password-update", requestPasswordUpdate);


// Email verification routes
router.post('/email-verification', verifyUserEmail);
router.put('/:userId/verify-code', verifyToken, verifyUserCode);

// Password routes
router.put('/:id/password', verifyToken, updatePassword);
 

export default router;
 