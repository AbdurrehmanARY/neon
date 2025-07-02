import { Request, Response } from 'express';
import { productService } from '../services/product.services';
import { ProductDto } from '../dto/product.dto';
export const postProduct = async (req: Request, res: Response) => {
  try {
    const data: ProductDto = req.body;
    const { name, description, price, inStock, category } = req.body;
    if (!name || !description || !price || !inStock || !category) {
      res.json({
        message: 'please enter all field',
      });
    }
    const product = await productService.createProduct(data);
    if (!product) {
      res.json({
        message: 'there is an error while updating product',
      });
    }

    res.json({
      message: 'product added successfully',
      product,
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const data: ProductDto = req.body;
    const { name, description, price, inStock, category } = req.body;

    if (!name || !description || !price || !inStock || !category) {
      res.json({
        message: 'please enter all field',
      });
    }
    if (!id) {
      res.json({
        message: 'product id is not provided',
      });
      return;
    }
    const product = await productService.updateProduct(data, id);

    if (!product) {
      res.json({
        message: 'there is an error while updating product',
      });
    }

    res.json({
      message: 'product updated successfully',
      product,
    });
    return;
  } catch (e) {
    console.log(e);
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  if (!id) {
    res.json({
      message: 'product id is not provided',
    });
    return;
  }
  const product = await productService.deleteProduct(id);
  if (!product) {
    res.json({
      message: 'there is an error while deleting product',
    });
  }
  res.json({
    message: 'product deleted successfully',
  });
};
export const getProduct = async (req: Request, res: Response) => {
  const products = await productService.allProduct();
  console.log(products);
  if (products.length === 0) {
    res.json({
      message: 'no products found',
    });
    return;
  }

  res.json({
    message: 'product get successfully',
    products,
  });
};

export const getSingleProduct = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const product = await productService.singleProduct(id);
  if (!product) {
    res.json({
      message: 'there is an error while updating product',
    });
  }
  res.json({
    message: 'product get successfully',
    product,
  });
};
