import { eq } from 'drizzle-orm';
import { db } from '..';
import { ProductDto } from '../dto/product.dto';
import { productTable } from '../db/schema';

export const productService = {
  createProduct: async (data: ProductDto) => {
    try {
      const product = await db.insert(productTable).values(data).returning();
      return product;
    } catch (e) {
      console.log(e);
    }
  },
  updateProduct: async (data: ProductDto, id: string) => {
    try {
      const findProduct = await db
        .select()
        .from(productTable)
        .where(eq(productTable.id, id));

      if (findProduct.length === 0) {
        console.log('product not fount');
        return;
      }

      const update = await db
        .update(productTable)
        .set(data)
        .where(eq(productTable.id, id))
        .returning();
      return update;
    } catch (e) {
      console.log(e);
    }
  },
  deleteProduct: async (id: string) => {
    try {
      const product = await db
        .update(productTable)
        .set({ deleteAt: new Date() })
        .where(eq(productTable.id, id))
        .returning();
      return product;
    } catch (e) {
      console.log(e);
    }
  },
  findAllProducts: async () => {
    try {
      const data = await db.select().from(productTable);
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  findProductById: async (id: string) => {
    try {
      const data = await db
        .select()
        .from(productTable)
        .where(eq(productTable.id, id));
      return data;
    } catch (e) {
      console.log(e);
    }
  },
};
