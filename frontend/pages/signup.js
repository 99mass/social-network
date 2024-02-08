import Head from "next/head";
import Sign_up from "../components/auth/signup_page";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isValideSession } from "../utils/cookies";

export default function SignIn() {
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      const isValid = await isValideSession();
      if (isValid) {
        router.push("/home");
      }
    };

    checkSession();
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
