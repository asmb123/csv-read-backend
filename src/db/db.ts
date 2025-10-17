import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'csvdb',
  password: 'postgres',
  port: 5432,
});
