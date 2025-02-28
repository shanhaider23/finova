import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
const sql = neon(
	'postgresql://neondb_owner:npg_BnNh9j8qRDYM@ep-rough-scene-a94yjjwk-pooler.gwc.azure.neon.tech/neondb?sslmode=require'
);
export const db = drizzle(sql, { schema });
