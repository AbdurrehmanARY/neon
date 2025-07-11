import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import productRouter from './routes/product.route';
import authRouter from './routes/auth.route';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();
const app = express();

const port = process.env.PORT || 3000; // ✅ Use PORT (uppercase)

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/products', productRouter);
app.use('/api/v1/auth', authRouter);

app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('working');
});

// ✅ Start server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
