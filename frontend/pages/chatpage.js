import Head from "next/head";
import Header from "../components/header";
import LeftBloc from "../components/home/left_bloc";
import ListUser from "../components/chat/chat";
import DiscussionPage from "../components/chat/discussion";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isValideSession } from "../utils/cookies";

export default function Chatpage() {
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
        <title>Social-network/chat</title>
        <meta name="description" content="project social-network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section className="section-chat-page">
        <LeftBloc />
        <DiscussionPage />
      </section>
    </>
  );
}
