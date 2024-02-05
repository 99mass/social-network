import Head from 'next/head';
import Sign_up from '../components/auth/signup_page';

export default function SignIn() {
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