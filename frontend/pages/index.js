import Head from "next/head";
import Sign_in from "../components/auth/signin_page";
import { useAuthGuard2 } from "../components/useAuthGuard";

export default function SignIn() {

  // gerer l'acces a cette route 
  useAuthGuard2();

  return (
    <>
      <Head>
        <title>Social-network/Authentification</title>
        <meta name="description" content="project social-network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sign_in />
    </>
  );
}
