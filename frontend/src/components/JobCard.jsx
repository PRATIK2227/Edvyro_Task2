import {MapPin,Clock3,Bookmark,ArrowUpRight} from 'lucide-react';
import {Link} from 'react-router-dom';
export default function JobCard({job,saved=false,onSave}){return <article className="job-card">
 <div className="job-card-top"><div className="company-avatar">{job.company?.slice(0,1).toUpperCase()}</div><span className="job-type">{job.type||'internship'}</span></div>
 <h3>{job.title}</h3><p className="company-name">{job.company}</p><div className="job-meta"><span><MapPin size={14}/>{job.location}</span><span><Clock3 size={14}/>{job.workMode}</span></div>
 <div className="job-card-bottom"><div><strong>{Number(job.stipend||0)===0?'Unpaid':`${job.currency||'INR'} ${Number(job.stipend).toLocaleString('en-IN')}`}</strong><small>/ month</small></div><div className="card-actions"><button className={saved?'save-btn active':'save-btn'} onClick={()=>onSave?.(job.id)} aria-label="Save internship"><Bookmark size={17} fill={saved?'currentColor':'none'}/></button><Link to={`/opportunities/${job.id}`} className="arrow-btn" aria-label="View internship"><ArrowUpRight size={18}/></Link></div></div>
 </article>}
