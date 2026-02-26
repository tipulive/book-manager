import dotenv from "dotenv";
import path from "node:path";
import { z } from "zod";

const NODE_ENV = process.env.NODE_ENV ?? "development";

/**
 * Explicitly load the correct env file
 */
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${NODE_ENV}`),
});

/**
 * Detect production
 */
const isProd = NODE_ENV === "production";

/**
 * Base schema
 */
const baseSchema = {
  DB_HOST: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_NAME: z.string().min(1),
  PORT: z.coerce.number().int().positive(),
};

/**
 * Dev schema
 */
const devSchema = z.object({
  ...baseSchema,
  DB_PASSWORD: z.string(),          // empty allowed
  JWT_SECRET: z.string().min(10),
});

/**
 * Prod schema
 */
const prodSchema = z.object({
  ...baseSchema,
  DB_PASSWORD: z.string().min(12),  // strong password
  JWT_SECRET: z.string().min(32),   // strong secret
});

/**
 * Export validated env
 */
export const env = (isProd ? prodSchema : devSchema).parse(process.env);