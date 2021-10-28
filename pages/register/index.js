import React, { useState } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios';

function index() {

    const router = useRouter();

    const [userData, setUSerData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        try {
            await axios.post('/api/register', userData);
            router.replace('/profile');
        } catch (err) {
            console.log(err.response.data);
        }
    }

    return (
        <div>
            <label>Username</label>
            <input type="text" onChange={(e) => setUSerData({...userData, username: e.target.value})}/>
            <label>Email</label>
            <input type="text" onChange={(e) => setUSerData({...userData, email: e.target.value})} />
            <label>Password</label>
            <input type="text" onChange={(e) => setUSerData({...userData, password: e.target.value})} />
            <input type="submit" onClick={(e) => handleSubmit(e)} />
        </div>
    )
}

export default index
