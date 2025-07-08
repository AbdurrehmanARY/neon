// import { defineConfig } from 'drizzle-kit';

// export default defineConfig({
//   out: './drizzle',
//   schema: './src/db/schema.ts',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// });

// // import type { Config } from 'drizzle-kit';

// // export default {
// //   schema: './src/db/schema.ts',
// //   out: './drizzle',
// //   dialect: 'postgresql', // instead of driver: 'pg'
// //   dbCredentials: {
// //     host: process.env.DB_HOST!,
// //     port: Number(process.env.DB_PORT!),
// //     user: process.env.DB_USER!,
// //     password: process.env.DB_PASSWORD,

// //     database: process.env.DB_NAME!,
// //   },
// // } satisfies Config;

// drizzle.config.ts
// drizzle.config.ts
import type { Config } from 'drizzle-kit';
import * as schema from './src/db/schema'; // ✅ import your schema

export default {
  out: './drizzle',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  dialect: 'postgresql',
  tables: schema, // ✅ NEW recommended way
} satisfies Config;
