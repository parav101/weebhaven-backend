import express from 'express';
import { UserController } from '../controllers/user.controller';

const router = express.Router();


router.post('/add-address',UserController.addAddress)
router.post('/edit-address',UserController.updateAddress)
router.get('/view-addresses/:userId',UserController.getAddresses)
router.get('/view-address/:addressId',UserController.getAddress)
router.get('/remove-address/:addressId',UserController.removeAddress)


export default router;