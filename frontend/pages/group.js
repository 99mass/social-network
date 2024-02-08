import Head from "next/head";
import Header from "../components/header";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isValideSession } from "../utils/cookies";
import GroupPage from "../components/group/group_page";
import styles from "../styles/modules/group.module.css";

export default function Goup() {
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
