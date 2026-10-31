import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Opportunities from './pages/Opportunities';
import JobDetail from './pages/JobDetail';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import PostInternship from './pages/PostInternship';
import './styles.css';
function App(){return <AuthProvider><BrowserRouter><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="opportunities" element={<Opportunities/>}/><Route path="opportunities/:id" element={<JobDetail/>}/><Route path="login" element={<Auth/>}/><Route path="register" element={<Auth mode="register"/>}/><Route element={<ProtectedRoute/>}><Route path="dashboard" element={<Dashboard/>}/></Route><Route element={<ProtectedRoute roles={['recruiter','admin']}/> }><Route path="post" element={<PostInternship/>}/></Route><Route path="*" element={<Home/>}/></Route></Routes></BrowserRouter></AuthProvider>}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
