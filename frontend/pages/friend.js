import Head from "next/head";
import Header from "../components/header";
import { useAuthGuard } from "../controller/useAuthGuard";
import FriendPage from "../components/friend/friend_page";

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
        <FriendPage />
      </section>
    </>
  );
}
