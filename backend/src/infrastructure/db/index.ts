import { Pool } from "pg";

export const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fuelEU",
  password: "password",
  port: 5432
});
