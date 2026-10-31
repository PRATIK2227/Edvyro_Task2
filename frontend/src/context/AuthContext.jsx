import {createContext,useContext,useEffect,useState} from 'react';
import {api} from '../lib/api';
const AuthContext=createContext(null);
export function AuthProvider({children}){
 const [user,setUser]=useState(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{const token=localStorage.getItem('cc_token');if(!token){setLoading(false);return;}
 api.get('/auth/me').then(r=>setUser(r.data.data.user)).catch(()=>localStorage.removeItem('cc_token')).finally(()=>setLoading(false));},[]);
 const login=async(email,password)=>{const r=await api.post('/auth/login',{email,password});localStorage.setItem('cc_token',r.data.data.token);setUser(r.data.data.user);return r.data.data.user;};
 const register=async(payload)=>{const r=await api.post('/auth/register',payload);localStorage.setItem('cc_token',r.data.data.token);setUser(r.data.data.user);return r.data.data.user;};
 const logout=()=>{localStorage.removeItem('cc_token');setUser(null);};
 return <AuthContext.Provider value={{user,loading,login,register,logout}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
