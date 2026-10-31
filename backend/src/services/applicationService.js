import { pool } from '../config/db.js';
import { HttpError } from '../utils/HttpError.js';

export async function apply(userId, internshipId, coverLetter = '') {
  const job = await pool.query(`SELECT id,status FROM internships WHERE id=$1`, [internshipId]);
  if (!job.rowCount || job.rows[0].status !== 'open') throw new HttpError(404, 'Open internship not found', 'INTERNSHIP_NOT_FOUND');
  try {
    const result = await pool.query(
      `INSERT INTO applications(student_id,internship_id,cover_letter) VALUES($1,$2,$3)
       RETURNING id,student_id AS "studentId",internship_id AS "internshipId",status,created_at AS "createdAt"`,
      [userId,internshipId,coverLetter],
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') throw new HttpError(409, 'You have already applied to this internship', 'ALREADY_APPLIED');
    throw error;
  }
}
export async function mine(userId) {
  const r = await pool.query(
    `SELECT a.id,a.status,a.created_at AS "appliedAt",i.id AS "internshipId",i.title,i.company,i.location,i.work_mode AS "workMode",i.stipend,i.currency
     FROM applications a JOIN internships i ON i.id=a.internship_id WHERE a.student_id=$1 ORDER BY a.created_at DESC`,
    [userId],
  );
  return r.rows;
}
export async function received(userId) {
  const r = await pool.query(
    `SELECT a.id,a.status,a.cover_letter AS "coverLetter",a.created_at AS "appliedAt",u.name AS "studentName",u.email AS "studentEmail",i.id AS "internshipId",i.title
     FROM applications a JOIN internships i ON i.id=a.internship_id JOIN users u ON u.id=a.student_id
     WHERE i.recruiter_id=$1 ORDER BY a.created_at DESC`,
    [userId],
  );
  return r.rows;
}
export async function updateStatus(userId, applicationId, status) {
  const r = await pool.query(
    `UPDATE applications a SET status=$1,updated_at=NOW()
     FROM internships i WHERE a.id=$2 AND a.internship_id=i.id AND i.recruiter_id=$3
     RETURNING a.id,a.status`,
    [status,applicationId,userId],
  );
  if (!r.rowCount) throw new HttpError(404,'Application not found','APPLICATION_NOT_FOUND');
  return r.rows[0];
}
