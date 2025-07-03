import express from 'express';
import {
  deleteProduct,
  getProducts,
  getSingleProduct,
  postProduct,
  updateProduct,
} from '../controllers/product.controller';
const router = express.Router();

router.post('/', postProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/', getProducts);
router.get('/:id', getSingleProduct);

export default router;
