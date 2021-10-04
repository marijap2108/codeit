import Head from 'next/head'
import { NotLoggedIn } from '../components/pages/NotLoggedIn'
import { CookiesProvider } from 'react-cookie';
import { useCookies } from 'react-cookie';
import { App } from './app'

export default function Home() {
  const [cookies] = useCookies(['codeItId'])
  return (
    <CookiesProvider>
      <Head>
        <title>CodeIt</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      {cookies.codeItId ?
        <App />
      :
        <NotLoggedIn />
      }
    </CookiesProvider>
  )
}
