import {Link,NavLink,Outlet,useNavigate} from 'react-router-dom';
import {BriefcaseBusiness,Bookmark,LayoutDashboard,LogOut,Menu,X,ArrowUpRight} from 'lucide-react';
import {useState} from 'react';
import {useAuth} from '../context/AuthContext';
export default function Layout(){
 const {user,logout}=useAuth();const [open,setOpen]=useState(false);const navigate=useNavigate();
 const leave=()=>{logout();navigate('/');};
 return <div className="app-shell">
  <header className="topbar"><Link to="/" className="brand"><span className="brand-mark"><BriefcaseBusiness size={19}/></span>career<span>connect</span></Link>
   <button className="mobile-menu" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button>
   <nav className={open?'nav-links open':'nav-links'}><NavLink to="/opportunities">Find opportunities</NavLink>{user&&<NavLink to="/dashboard">Dashboard</NavLink>}{user?.role==='recruiter'&&<NavLink to="/post">Post an opening</NavLink>}</nav>
   <div className="top-actions">{user?<><span className="user-chip">{user.name?.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><button className="btn btn-ghost" onClick={leave}><LogOut size={16}/> Sign out</button></>:<><Link className="btn btn-ghost" to="/login">Log in</Link><Link className="btn btn-dark" to="/register">Get started <ArrowUpRight size={16}/></Link></>}</div>
  </header><main><Outlet/></main><footer className="footer"><div className="brand"><span className="brand-mark"><BriefcaseBusiness size={16}/></span>career<span>connect</span></div><p>Good work starts with the right opportunity.</p><small>© {new Date().getFullYear()} CareerConnect. Built to help early careers move forward.</small></footer>
 </div>;
}
