import express from 'express';
import dotenv from 'dotenv';
import productRouter from './route/product.route';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
dotenv.config();

const app = express();
const port = process.env.Port || 3000;
app.use(express.json());

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);

app.use('/api/v1/products', productRouter);
app.get('/', (req, res) => {
  res.send('working');
});

app.listen(5000, () => {
  console.log(`server is running on ${port}`);
});
