import Head from "next/head";
import Header from "../components/header";
import GroupPage from "../components/group/group_page";
import styles from "../styles/modules/group.module.css";
import { useAuthGuard } from "../components/useAuthGuard";

export default function Goup() {

  // gerer l'acces a cette route 
  useAuthGuard();

  return (
    <>
      <Head>
        <title>Social-network/group</title>
        <meta name="description" content="project social-network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section id="section-group" className={styles.sectionGroup}>
        <GroupPage />
      </section>
    </>
  );
}
