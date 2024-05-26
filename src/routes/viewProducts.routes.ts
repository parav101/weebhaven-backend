import express from 'express';
import { productController } from '../controllers/product.controller';

const router = express.Router();



router.get('/view-products',productController.viewProducts)
router.get('/view-product/:name',productController.viewSingleProducts)
router.get('/view-featured-products',productController.viewFeaturedProducts)
// router.get('/view-productEntry/:productId&:type&:attribute',productController.viewProdcutEntryInfo)
// router.get('/view-productEntries/:productId&:size&:colour',productController.viewProdcutEntryInfo)
// router.get('/view-productEntry/:productId&:size',productController.viewProdcutEntryInfo)
router.get('/view-productEntry/:productId&:size&:colour',productController.viewProductEntryId)


export default router;