import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const LoginComponent = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    identifier: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/login', { ...userData });
      router.push('/profile');
    } catch (err) {
      console.log(err.response.data);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="text" name="identifier" onChange={e => setUserData({...userData, identifier: e.target.value})} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" onChange={e => setUserData({...userData, password: e.target.value})} />
        </label>
        <br />
        <button>Login</button>
      </form>
    </div>
  )
}

export default LoginComponent;