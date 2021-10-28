import axios from 'axios';
import { setCookie } from 'nookies'
import { getUrl } from '../../services/getUrl';

export default async (req, res) => {
  const { password, identifier } = req.body;

  try {
    const postRes = await axios.post(`${getUrl()}/auth/local`, {
      identifier,
      password,
    })

    setCookie({ res }, 'jwt', postRes.data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 5,
      path: '/',
    });

    res.status(200).end();
  } catch (e) {
    res.status(400).send(e.response.data.message[0].messages[0]);
  }
}