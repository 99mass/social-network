import Head from 'next/head'
import Header from '../components/header'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isValideSession } from '../utils/cookies';
import GroupPage from '../components/group/group_page';



export default function Goup() {

    const router = useRouter();
    useEffect(() => {
      if(!isValideSession()) router.push("/")
    }, []);

    return (
        <>
            <Head>
                <title>Social-network/group</title>
                <meta name="description" content="project social-network" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <section className='section-group' >
              <GroupPage />
            </section>
        </>
    );
}