import z from 'zod';

export interface ProductDto {
  name: string;
  price: number;
  description: string;
  inStock: boolean;
  category: string;
}

export const categoryEnum = z.enum(['electronic', 'audio', 'video', 'garment']);

const productDto = z.object({
  name: z.string().min(1, { message: 'name is required' }),
  description: z.string().min(1, { message: 'description is required' }),
  price: z.number(),
  inStock: z.boolean(),
  category: categoryEnum.default('electronic'),
});

// const product = {
//   id: 'c7b76f53-8a34-42f7-9d92-90f5f88b772e', // UUID
//   name: 'Wireless Bluetooth Earbuds',
//   description: 'High-quality earbuds with noise cancellation and long battery life.',
//   price: 5999, // stored as integer (e.g. in PKR cents or raw PKR)
//   inStock: true,
//   category: 'Audio Accessories',
//   createdAt: new Date().toISOString(), // timestamp with timezone
//   updatedAt: new Date().toISOString(), // timestamp with timezone
//   deleteAt: null // or `new Date().toISOString()` if soft-deleted
// };

//  enum Category {
//     Audio="Audio",
//     Headphone="Headphone",
//     Watch="Watch",
//     // "Sports"
// }
