import Head from 'next/head'
import Header from '../components/header'
import LeftBloc from '../components/home/left_bloc'
import ListUser from '../components/chat/chat';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isValideSession } from '../utils/cookies';

export default function Chat() {
    const router = useRouter();
    useEffect(() => {
      if(!isValideSession()) router.push("/")
    }, []);

    return (
        <>
            <Head>
                <title>Social-network/chat</title>
                <meta name="description" content="project social-network" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <section className='section-chat' >
                <LeftBloc />
                <ListUser />
            </section>
        </>
    );
}