import Head from "next/head";
import Header from "../components/header";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isValideSession } from "../utils/cookies";
import Profile_group from "../components/profilegroup/profile_group";

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
        <title>Social-network/profile-group</title>
        <meta name="description" content="project social-network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section className="section-group-profile">
        <Profile_group/>
      </section>
    </>
  );
}
