import express from 'express';
import { UserController } from '../controllers/user.controller';
import { AdminRoleRequired } from '../middleware/admin.middleware';

const router = express.Router();


router.post('/register-admin',AdminRoleRequired,UserController.registerAdmin)
router.get('/verify-admin',UserController.verifyAdmin)


export default router;