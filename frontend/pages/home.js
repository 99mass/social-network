import Head from 'next/head'
import Header from '../components/header'
import LeftBloc from '../components/home/left_bloc'
import MidlleBloc from '../components/home/middle_bloc'
import RightBloc from '../components/home/rigthB_bloc'

export default function Home() {
  return (
    <>
      <Head>
        <title>Social-network/home</title>
        <meta name="description" content="project social-network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section className='section-index' >
        <LeftBloc />
        <MidlleBloc />
        <RightBloc />
      </section>
    </>
  );
}
