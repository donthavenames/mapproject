import ErrorBoundary from '../components/ErrorBoundary'
import '../style/global.css'

export default function MyApp({ Component, pageProps }) {
  return <ErrorBoundary>
    <Component {...pageProps} />
  </ErrorBoundary>
}
