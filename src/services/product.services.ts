// import { product } from "../db/sc/dto/product.dto"
import { eq } from 'drizzle-orm';
// import { db } from '../db';
// import { db } from '../db';
import { db } from '..';
import { ProductDto } from '../dto/product.dto';
import { productTable } from '../db/schema';
// import { productTable } from '../db/schema';

export const productService = {
  createProduct: async (data: ProductDto) => {
    const product = await db.insert(productTable).values(data).returning();
    return product;
  },
  updateProduct: async (data: ProductDto, id: string) => {
    const update = await db
      .update(productTable)
      .set(data)
      .where(eq(productTable.id, id))
      .returning();
    return update;
  },
  deleteProduct: async (id: string) => {
    const product = await db
      .update(productTable)
      .set({ deleteAt: new Date() })
      .where(eq(productTable.id, id))
      .returning();
    return product;
  },
  allProduct: async () => {
    const data = await db.select().from(productTable);

    return data;
  },
  singleProduct: async (id: string) => {
    const data = await db
      .select()
      .from(productTable)
      .where(eq(productTable.id, id));
    return data;
  },
};
