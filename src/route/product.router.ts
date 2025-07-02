import express from 'express';
import {
  deleteProduct,
  getProduct,
  getSingleProduct,
  postProduct,
  updateProduct,
} from '../controller/product.controller';
const router = express.Router();

router.post('/', postProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/', getProduct);
router.get('/:id', getSingleProduct);

export default router;
