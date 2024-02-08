import Head from "next/head";
import Header from "../components/header";
import Profile_user from "../components/user/profile";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isValideSession } from "../utils/cookies";

export default function SignIn() {
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      const isValid = await isValideSession();
      if (!isValid) {
        router.push("/");
      }
    };

    checkSession();
  }, []);

  return (
    <>
      <Head>
        <title>Social-network/profile-user</title>
        <meta name="description" content="project social-network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section className="section-user-profile">
        <Profile_user />
      </section>
    </>
  );
}
