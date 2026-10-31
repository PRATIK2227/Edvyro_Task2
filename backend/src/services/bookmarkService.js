import { pool } from '../config/db.js';
export async function listBookmarks(userId) {
  const r = await pool.query(
    `SELECT i.id,i.title,i.company,i.category,i.location,i.work_mode AS "workMode",i.stipend,i.currency,i.created_at AS "createdAt"
     FROM bookmarks b JOIN internships i ON i.id=b.internship_id WHERE b.user_id=$1 ORDER BY b.created_at DESC`,
    [userId],
  );
  return r.rows;
}
export async function addBookmark(userId, internshipId) {
  await pool.query('INSERT INTO bookmarks(user_id,internship_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[userId,internshipId]);
}
export async function removeBookmark(userId, internshipId) {
  await pool.query('DELETE FROM bookmarks WHERE user_id=$1 AND internship_id=$2',[userId,internshipId]);
}
