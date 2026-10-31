import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

const publicUser = (row) => ({ id: row.id, name: row.name, email: row.email, role: row.role, headline: row.headline, createdAt: row.created_at });
function tokenFor(user) { return jwt.sign({ sub: user.id, id: user.id, role: user.role, name: user.name }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN }); }

export async function register(data) {
  const exists = await pool.query('SELECT id FROM users WHERE email = $1', [data.email.toLowerCase()]);
  if (exists.rowCount) throw new HttpError(409, 'An account with this email already exists', 'EMAIL_EXISTS');
  const hash = await bcrypt.hash(data.password, 12);
  const result = await pool.query(
    `INSERT INTO users(name,email,password_hash,role,headline)
     VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,role,headline,created_at`,
    [data.name, data.email.toLowerCase(), hash, data.role, data.headline || null],
  );
  const user = publicUser(result.rows[0]);
  return { user, token: tokenFor(user) };
}
export async function login(data) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [data.email.toLowerCase()]);
  const row = result.rows[0];
  if (!row || !(await bcrypt.compare(data.password, row.password_hash))) throw new HttpError(401, 'Email or password is incorrect', 'INVALID_CREDENTIALS');
  const user = publicUser(row);
  return { user, token: tokenFor(user) };
}
export async function getMe(id) {
  const result = await pool.query('SELECT id,name,email,role,headline,created_at FROM users WHERE id=$1', [id]);
  if (!result.rowCount) throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');
  return publicUser(result.rows[0]);
}
