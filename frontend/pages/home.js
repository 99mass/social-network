import Head from "next/head";
import Header from "../components/header";
import LeftBloc from "../components/home/left_bloc";
import MidlleBloc from "../components/home/middle_bloc";
import RightBloc from "../components/home/rigthB_bloc";
import { isValideSession } from "../utils/cookies";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
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
        <title>Social-network/home</title>
        <meta name="description" content="project social-network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section className="section-index">
        <LeftBloc />
        <MidlleBloc />
        <RightBloc />
      </section>
    </>
  );
}
