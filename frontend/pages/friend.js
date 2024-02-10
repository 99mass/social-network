import Head from "next/head";
import Header from "../components/header";
import LeftBloc from "../components/home/left_bloc";
import MiddleBlocFriend from "../components/friend/middle_bloc";
import { useAuthGuard } from "../controller/useAuthGuard";

export default function Friend() {

  // gerer l'acces a cette route 
  useAuthGuard();

  return (
    <>
      <Head>
        <title>Social-network/friend-requests</title>
        <meta name="description" content="project social-network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section className="section-friend">
        <LeftBloc />
        <MiddleBlocFriend />
      </section>
    </>
  );
}
