// frontend/src/pages/AdminPanel.jsx


import React, { useState } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';


export default function AdminPanel(){
const { academyCode } = useParams();
const [msg, setMsg] = useState('');


const createTeacher = async () => {
const name = prompt('Teacher name');
const email = prompt('Teacher email');
const password = prompt('Teacher password (min 8 chars)');


try{
await axios.post(`/${academyCode}/admin/create-teacher`, { name, email, password });
setMsg('Teacher created');
}catch(e){ setMsg(e.response?.data?.message || 'Error'); }
};


const createStudent = async () => {
const name = prompt('Student name');
const email = prompt('Student email');
const password = prompt('Student password');
try{
await axios.post(`/${academyCode}/admin/create-student`, { name, email, password });
setMsg('Student created');
}catch(e){ setMsg(e.response?.data?.message || 'Error'); }
};


return (
<div style={{padding:20}}>
<h2>Admin Panel - {academyCode}</h2>
<div style={{display:'flex', gap:8}}>
<button onClick={createTeacher}>Create Teacher</button>
<button onClick={createStudent}>Create Student</button>
</div>
<div style={{marginTop:12,color:'green'}}>{msg}</div>
</div>
);
}