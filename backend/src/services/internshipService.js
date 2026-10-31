import { pool } from '../config/db.js';
import { HttpError } from '../utils/HttpError.js';
const fields = `i.id,i.title,i.company,i.category,i.location,i.work_mode AS "workMode",i.type,i.description,i.requirements,i.stipend,i.currency,i.duration,i.application_url AS "applicationUrl",i.deadline,i.status,i.created_at AS "createdAt",i.updated_at AS "updatedAt",u.name AS "recruiterName"`;

export async function listInternships(q) {
  const clauses = [`i.status = 'open'`], values = [];
  const add = (sql, value) => { values.push(value); clauses.push(sql.replace('?', `$${values.length}`)); };
  if (q.search) {
    const pattern = `%${q.search}%`;
    values.push(pattern, pattern, pattern);
    const n = values.length;
    clauses.push(`(i.title ILIKE $${n-2} OR i.company ILIKE $${n-1} OR i.description ILIKE $${n})`);
  }
  if (q.category) add('LOWER(i.category)=LOWER(?)', q.category);
  if (q.location) add('i.location ILIKE ?', `%${q.location}%`);
  if (q.workMode) add('i.work_mode=?', q.workMode);
  if (q.type) add('i.type=?', q.type);
  const where = `WHERE ${clauses.join(' AND ')}`;
  const count = await pool.query(`SELECT COUNT(*)::int AS total FROM internships i ${where}`, values);
  const sort = q.sort === 'stipend' ? 'i.stipend DESC, i.created_at DESC' : 'i.created_at DESC';
  const rows = await pool.query(
    `SELECT ${fields} FROM internships i JOIN users u ON u.id=i.recruiter_id ${where}
     ORDER BY ${sort} LIMIT $${values.length+1} OFFSET $${values.length+2}`,
    [...values, q.limit, (q.page-1)*q.limit],
  );
  return { data: rows.rows, pagination: { page:q.page, limit:q.limit, total:count.rows[0].total, totalPages:Math.ceil(count.rows[0].total/q.limit) } };
}
export async function getInternship(id) {
  const result = await pool.query(`SELECT ${fields} FROM internships i JOIN users u ON u.id=i.recruiter_id WHERE i.id=$1`, [id]);
  if (!result.rowCount) throw new HttpError(404, 'Internship not found', 'INTERNSHIP_NOT_FOUND');
  return result.rows[0];
}
export async function createInternship(userId, data) {
  const r = await pool.query(
    `INSERT INTO internships(recruiter_id,title,company,category,location,work_mode,type,description,requirements,stipend,currency,duration,application_url,deadline,status)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,$14,$15) RETURNING *`,
    [userId,data.title,data.company,data.category,data.location,data.workMode,data.type,data.description,JSON.stringify(data.requirements),data.stipend,data.currency,data.duration,data.applicationUrl || null,data.deadline || null,data.status],
  );
  return r.rows[0];
}
export async function updateInternship(userId,id,data) {
  const map = {title:'title',company:'company',category:'category',location:'location',workMode:'work_mode',type:'type',description:'description',requirements:'requirements',stipend:'stipend',currency:'currency',duration:'duration',applicationUrl:'application_url',deadline:'deadline',status:'status'};
  const entries = Object.entries(data).filter(([k]) => map[k]);
  const values = entries.map(([k,v]) => k === 'requirements' ? JSON.stringify(v) : v);
  const sets = entries.map(([k,i]) => `${map[k]}=$${i+1}${k==='requirements'?'::jsonb':''}`);
  values.push(id,userId);
  const r = await pool.query(`UPDATE internships SET ${sets.join(',')},updated_at=NOW() WHERE id=$${values.length-1} AND recruiter_id=$${values.length} RETURNING *`, values);
  if (!r.rowCount) throw new HttpError(404, 'Internship not found or not owned by this recruiter', 'INTERNSHIP_NOT_FOUND');
  return r.rows[0];
}
export async function deleteInternship(userId,id) {
  const r = await pool.query('DELETE FROM internships WHERE id=$1 AND recruiter_id=$2 RETURNING id',[id,userId]);
  if (!r.rowCount) throw new HttpError(404, 'Internship not found or not owned by this recruiter', 'INTERNSHIP_NOT_FOUND');
}
