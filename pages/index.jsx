import Head from 'next/head'
import { NotLoggedIn } from '../components/pages/NotLoggedIn'
import { CookiesProvider } from 'react-cookie';

export default function Home() {
  return (
    <CookiesProvider>
      <Head>
        <title>CodeIt</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <NotLoggedIn />
    </CookiesProvider>
  )
}
