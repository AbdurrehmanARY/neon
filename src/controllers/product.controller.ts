import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { ProductDto } from '../dto/product.dto';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';

export class Product {
  postProduct = asyncHandler(async (req: Request, res: Response) => {
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

    return res.json({
      message: 'product added successfully',
      product,
    });
  });
  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const { success } = z.string().uuid().safeParse(id);
    if (!success) {
      res.json({
        message: 'incorrect uuid format',
      });
      return;
    }
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
        message: 'product not found',
      });
      return;
    }
    return res.json({
      message: 'product updated successfully',
      product,
    });
  });
  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const { success } = z.string().uuid().safeParse(id);
    if (!success) {
      res.json({
        message: 'incorrect uuid format',
      });
      return;
    }

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
  });
  getProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await productService.findAllProducts();
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
  });
  getSingleProduct = asyncHandler(async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const { success } = z.string().uuid().safeParse(id);
    if (!success) {
      res.json({
        message: 'incorrect uuid format',
      });
      return;
    }
    const product = await productService.findProductById(id);
    if (!product) {
      res.json({
        message: 'there is an error while updating product',
      });
    }
    res.json({
      message: 'product get successfully',
      product,
    });
  });
}

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
    const { success } = z.string().uuid().safeParse(id);
    if (!success) {
      res.json({
        message: 'incorrect uuid format',
      });
      return;
    }
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
        message: 'product not found',
      });
      return;
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
  try {
    const id: string = req.params.id;
    const { success } = z.string().uuid().safeParse(id);
    if (!success) {
      res.json({
        message: 'incorrect uuid format',
      });
      return;
    }

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
  } catch (e) {
    console.log(e);
  }
};
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.findAllProducts();
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
  } catch (e) {
    console.log(e);
  }
};

export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const { success } = z.string().uuid().safeParse(id);
    if (!success) {
      res.json({
        message: 'incorrect uuid format',
      });
      return;
    }
    const product = await productService.findProductById(id);
    if (!product) {
      res.json({
        message: 'there is an error while updating product',
      });
    }
    res.json({
      message: 'product get successfully',
      product,
    });
  } catch (e) {
    console.log(e);
  }
};
