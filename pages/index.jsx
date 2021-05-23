import Head from 'next/head'
import { NotLoggedIn } from '../components/pages/NotLoggedIn'

export default function Home() {
  return (
    <>
      <Head>
        <title>Codeit</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <NotLoggedIn />
    </>
  )
}
