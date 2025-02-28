import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();


export default defineConfig({
    dialect: 'postgresql',
    schema: './utils/schema.jsx',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_BnNh9j8qRDYM@ep-rough-scene-a94yjjwk-pooler.gwc.azure.neon.tech/neondb?sslmode=require',
    },
    out: "./drizzle",
});
