import Head from "next/head";
import Header from "../components/header";
import Profile_user from "../components/user/profile";
import { useAuthGuard } from "../controller/useAuthGuard";

export default function SignIn() {

  // gerer l'acces a cette route 
  useAuthGuard();

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
