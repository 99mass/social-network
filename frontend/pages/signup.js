import Head from "next/head";
import Sign_up from "../components/auth/signup_page";
import { useAuthGuard2 } from "../controller/useAuthGuard";

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
      <Sign_up />
    </>
  );
}
