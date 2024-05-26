import express from 'express';
import { productController } from '../controllers/product.controller';
import { upload } from '../middleware/image.middleware';
import { AdminRoleRequired } from '../middleware/admin.middleware';

const router = express.Router();

router.post('/add-images',AdminRoleRequired,upload.array('file'),productController.viewImages)
router.post('/add-image',AdminRoleRequired,upload.single('file'),productController.viewImage)
router.post('/add-product',AdminRoleRequired, productController.addProduct)
router.post('/update-product',AdminRoleRequired,productController.updateProduct)
router.post('/update-productInfo',AdminRoleRequired,productController.updateProductOnly)
router.post('/add-attributte',AdminRoleRequired,productController.addAtributes)
router.post('/add-productEntry',AdminRoleRequired,productController.addProdcutEntries)
router.get('/delete-product/:id',AdminRoleRequired,productController.deleteProducts)





export default router;