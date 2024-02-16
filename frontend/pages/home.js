import Head from "next/head";
import Header from "../components/header";
import LeftBloc from "../components/home/left_bloc";
import MidlleBloc from "../components/home/middle_bloc";
import RightBloc from "../components/home/rigthB_bloc";
import { useAuthGuard } from "../controller/useAuthGuard";


export default function Home() {

  // gerer l'acces a cette route 
  useAuthGuard();


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
