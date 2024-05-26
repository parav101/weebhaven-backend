import express from 'express';
import { UserController } from '../controllers/user.controller';
import { AdminRoleRequired } from '../middleware/admin.middleware';

const router = express.Router();

router.get('/test-user',(req,res)=>{
    res.status(200).send({message:"UserController"})
  })

router.post('/register-user',UserController.registerUser)

router.post('/login',UserController.login)



export default router;