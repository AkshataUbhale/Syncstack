import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in the environment");
}

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql,{schema});

export{sql}