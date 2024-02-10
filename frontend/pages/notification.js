import Head from 'next/head'
import Header from '../components/header'
import LeftBloc from '../components/home/left_bloc'
import Notification from '../components/notification/notification_page';
import { useAuthGuard } from '../controller/useAuthGuard';



export default function Friend() {
    // gerer l'acces a cette route 
    useAuthGuard();

    return (
        <>
            <Head>
                <title>Social-network/notification</title>
                <meta name="description" content="project social-network" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <section className='section-notification' >
                <LeftBloc />
                <Notification />
            </section>
        </>
    );
}