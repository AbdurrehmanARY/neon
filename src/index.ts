import express from 'express';
import dotenv from 'dotenv';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

const port = process.env.Port || 3000;
app.use(express.json());
app.use(cookieParser());

// const client = postgres(process.env.DATABASE_URL!);
// export const db = drizzle(client);

// import productRouter from './routes/product.route';
import authRouter from './routes/auth.route';

// app.use('/api/v1/products', productRouter);
app.use('/api/v1/auth', authRouter);

app.get('/', (req, res) => {
  res.send('working');
});

app.listen(5000, () => {
  console.log(`server is running on ${port}`);
});
