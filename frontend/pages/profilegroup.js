import Head from "next/head";
import Header from "../components/header";
import Profile_group from "../components/profilegroup/profile_group";
import { useAuthGuard } from "../components/useAuthGuard";

export default function SignIn() {

  // gerer l'acces a cette route 
  useAuthGuard();

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
