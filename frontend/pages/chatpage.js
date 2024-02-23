import Head from "next/head";
import Header from "../components/header";
import LeftBloc from "../components/home/left_bloc";
import styes from "../styles/modules/discussion.module.css"
import DiscussionPage from "../components/chat/discussion";
import { useAuthGuard } from "../controller/useAuthGuard";

export default function Chatpage() {

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
      <section className={`section-chat-page ${styes.sectionChatPage}`}>
        <LeftBloc />
        <DiscussionPage />
      </section>
    </>
  );
}
