import Head from 'next/head'
import Header from '../components/header'
import LeftBloc from '../components/home/left_bloc'
import Comment from '../components/comment/comment_bloc';



export default function Friend() {
    return (
        <>
            <Head>
                <title>Social-network/notification</title>
                <meta name="description" content="project social-network" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
                <section id='section-comment' >
                <LeftBloc />
                <Comment/>
            </section>
        </>
    );
}