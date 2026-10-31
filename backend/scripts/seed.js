import bcrypt from 'bcryptjs';
import {pool} from '../src/config/db.js';
const demo = [
 {name:'Aarav Student',email:'student@careerconnect.demo',password:'Student@123',role:'student'},
 {name:'Priya Recruiter',email:'recruiter@careerconnect.demo',password:'Recruiter@123',role:'recruiter'}
];
try {
 const users={};
 for(const u of demo){
  const hash=await bcrypt.hash(u.password,12);
  const r=await pool.query(`INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4)
   ON CONFLICT(email) DO UPDATE SET email=EXCLUDED.email RETURNING id`,[u.name,u.email,hash,u.role]);
  users[u.role]=r.rows[0].id;
 }
 const jobs=[
 ['Frontend Developer Intern','PixelCraft Studio','Frontend Development','Remote - India','remote','internship','Work with designers and engineers to build polished, accessible React interfaces.',['React','JavaScript','CSS','Git'],8000,'INR','3 months','https://example.com/apply/frontend','2027-03-31'],
 ['Backend Engineering Intern','NimbleCloud Systems','Backend Development','Pune, India','hybrid','internship','Help build reliable APIs, integrate PostgreSQL and write automated tests.',['Node.js','Express','PostgreSQL','REST APIs'],10000,'INR','4 months','https://example.com/apply/backend','2027-04-15'],
 ['Product Design Intern','Northstar Labs','UI/UX Design','Remote - India','remote','internship','Support product discovery and design clear user experiences from research to prototype.',['Figma','Wireframing','Design systems'],6000,'INR','2 months','https://example.com/apply/design','2027-04-20'],
 ['Data Analyst Intern','InsightLoop Analytics','Data Analytics','Mumbai, India','onsite','internship','Prepare datasets, build dashboards and communicate actionable findings.',['SQL','Excel','Python basics'],7000,'INR','3 months','https://example.com/apply/data','2027-05-01']
 ];
 for(const j of jobs){
  await pool.query(`INSERT INTO internships(recruiter_id,title,company,category,location,work_mode,type,description,requirements,stipend,currency,duration,application_url,deadline)
   SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,$14
   WHERE NOT EXISTS(SELECT 1 FROM internships WHERE title=$2 AND company=$3)`,
   [users.recruiter,...j.slice(0,7),JSON.stringify(j[7]),...j.slice(8)]);
 }
 console.log('Demo accounts and sample internships seeded.');
} catch(e){console.error(e);process.exitCode=1;} finally{await pool.end();}
