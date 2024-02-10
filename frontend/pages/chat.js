import Head from "next/head";
import Header from "../components/header";
import LeftBloc from "../components/home/left_bloc";
import ListUser from "../components/chat/chat";
import { useAuthGuard } from "../components/useAuthGuard";

export default function Chat() {

    // gerer l'acces a cette route 
    useAuthGuard();

  return (
    <>
      <Head>
        <title>Social-network/chat</title>
        <meta name="description" content="project social-network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section className="section-chat">
        <LeftBloc />
        <ListUser />
      </section>
    </>
  );
}
