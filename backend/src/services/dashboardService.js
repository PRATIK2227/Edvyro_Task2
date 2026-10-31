import { pool } from '../config/db.js';
export async function dashboard(user) {
  if (user.role === 'student') {
    const r = await pool.query(
      `SELECT COUNT(*)::int AS applications,
       COUNT(*) FILTER (WHERE status='shortlisted')::int AS shortlisted,
       COUNT(*) FILTER (WHERE status='accepted')::int AS accepted
       FROM applications WHERE student_id=$1`,[user.id]);
    const b = await pool.query('SELECT COUNT(*)::int AS bookmarks FROM bookmarks WHERE user_id=$1',[user.id]);
    return { ...r.rows[0], bookmarks:b.rows[0].bookmarks };
  }
  const r = await pool.query(
    `SELECT COUNT(*)::int AS internships,
     COUNT(*) FILTER (WHERE status='open')::int AS open_internships
     FROM internships WHERE recruiter_id=$1`,[user.id]);
  const a = await pool.query(
    `SELECT COUNT(*)::int AS applications FROM applications a JOIN internships i ON i.id=a.internship_id WHERE i.recruiter_id=$1`,[user.id]);
  return { ...r.rows[0], applications:a.rows[0].applications };
}
