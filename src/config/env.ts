import dotenv from 'dotenv';
dotenv.config(); // Loads .env into process.env
import z from 'zod';
const envSchema = z.object({
  Port: z.number(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});
const _env = envSchema.parse(process.env);

// if (!_env.success) {
//   console.error('❌ Invalid environment variables:', _env.error.format());
//   process.exit(1); // Stop app if env is invalid
// }

// const _env = envSchema.safeParse(process.env);

// if (!_env.success) {
//   console.error('❌ Invalid environment variables:', _env.error.format());
//   process.exit(1); // Stop app if env is invalid
// }
