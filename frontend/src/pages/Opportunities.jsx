import {useEffect,useState} from 'react';
import {Search,SlidersHorizontal} from 'lucide-react';
import {api} from '../lib/api';
import {useAuth} from '../context/AuthContext';
import JobCard from '../components/JobCard';
export default function Opportunities(){
 const [jobs,setJobs]=useState([]),[search,setSearch]=useState(''),[category,setCategory]=useState(''),[mode,setMode]=useState(''),[loading,setLoading]=useState(true),[saved,setSaved]=useState([]);
 const {user}=useAuth();
 const load=()=>{setLoading(true);const p=new URLSearchParams();if(search)p.set('search',search);if(category)p.set('category',category);if(mode)p.set('workMode',mode);api.get(`/internships?${p}`).then(r=>setJobs(r.data.data||[])).catch(()=>setJobs([])).finally(()=>setLoading(false));};
 useEffect(()=>{const t=setTimeout(load,250);return()=>clearTimeout(t);},[search,category,mode]);
 useEffect(()=>{if(user?.role==='student')api.get('/bookmarks').then(r=>setSaved((r.data.data||[]).map(x=>x.id))).catch(()=>{});},[user]);
 const toggle=async(id)=>{if(!user){alert('Please log in to save opportunities.');return;}try{if(saved.includes(id)){await api.delete(`/bookmarks/${id}`);setSaved(s=>s.filter(x=>x!==id));}else{await api.put(`/bookmarks/${id}`);setSaved(s=>[...s,id]);}}catch(e){alert(String(e));}};
 return <section className="page-section"><div className="page-intro"><div className="eyebrow">THE OPPORTUNITY BOARD</div><h1>Find your <em>starting point.</em></h1><p>Explore roles where curiosity is valued and potential gets room to grow.</p></div>
 <div className="filter-bar"><div className="search-field"><Search size={19}/><input placeholder="Search role, company or skill…" value={search} onChange={e=>setSearch(e.target.value)}/></div><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{['Frontend Development','Backend Development','UI/UX Design','Data Analytics','Marketing','Embedded Systems'].map(x=><option key={x}>{x}</option>)}</select><select value={mode} onChange={e=>setMode(e.target.value)}><option value="">All work modes</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">On-site</option></select><span className="filter-count"><SlidersHorizontal size={15}/>{jobs.length} roles</span></div>
 {loading?<div className="loading">Finding opportunities…</div>:jobs.length?<div className="job-grid">{jobs.map(j=><JobCard key={j.id} job={j} saved={saved.includes(j.id)} onSave={toggle}/>)}</div>:<div className="empty-state"><Search size={28}/><h3>No matching opportunities yet</h3><p>Try a different keyword or clear a filter.</p></div>}
 </section>;
}
