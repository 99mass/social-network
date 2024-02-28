import Head from "next/head";
import Header from "../components/header";
import { useAuthGuard } from "../controller/useAuthGuard";
import PageHome from "../components/home/page_home";

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
        <PageHome />
      </section>
    </>
  );
}
