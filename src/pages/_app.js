import { SessionProvider } from "next-auth/react"
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <style jsx global>{`
        'body': {
          'background': 'black'
        }
      `}</style>
    </SessionProvider>
  )
}