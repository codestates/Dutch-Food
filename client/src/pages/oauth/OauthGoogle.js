import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { setCookie } from '../../components/Cookie';

function OauthGoogle({ setIsLoginCheck }) {
  const navigate = useNavigate();
  useEffect(() => {
    //url 분리
    const url = new URL(window.location.href);
    //hash 분리
    const hash = url.hash;
    //토큰 분리
    const code = hash.split('=')[1].split('&')[0];

    axios
      .post(
        'http://localhost:8080/oauth/google',
        { data: code },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log('구글 로그인 성공');
        console.log(res.data);
        setCookie('accessToken', res.data.data);
        setIsLoginCheck(true);
        navigate('/main');
      })
      .catch((err) => {
        console.log(err, '구글 로그인 err');
      });
  }, []);
  return <div>구글 로그인중</div>;
}

export default OauthGoogle;
/*
axios
      .get(
        'https://www.googleapis.com/oauth2/v2/userinfo?access_token=' +
          accessToken,
        {
          headers: {
            authorization: `token ${accessToken}`,
            accept: 'application/json',
          },
        }
      )
      .then((res) => {
        console.log(res, '내가찾는');
      })
      .catch((err) => {
        console.log(err, '구글 로그인 err');
      });
  }, []);
  */
