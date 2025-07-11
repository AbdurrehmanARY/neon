import express from 'express';
import {
  deleteProduct,
  getProducts,
  getSingleProduct,
  postProduct,
  Product,
  updateProduct,
} from '../controllers/product.controller';
const router = express.Router();
const product = new Product();

router.post('/', product.postProduct);
router.put('/:id', product.updateProduct);
router.delete('/:id', product.deleteProduct);
router.get('/', product.getProducts);
router.get('/:id', product.getSingleProduct);

export default router;
