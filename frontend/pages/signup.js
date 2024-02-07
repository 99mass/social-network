import Head from 'next/head';
import Sign_up from '../components/auth/signup_page';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isValideSession } from '../utils/cookies';

export default function SignIn() {

  const router = useRouter();
  useEffect(() => {
    if(isValideSession()) router.replace("/home")
  }, []);

  return (
    <>
      <Head>
        <title>Social-network/Authentification</title>
        <meta name="description" content="project social-network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sign_up />
    </>
  );
}