import '../styles/style.css'
import SimpleReactLightbox from 'simple-react-lightbox'
import { GlobalContextProvider } from '../components/contexts/GlobalContext'

function MyApp({ Component, pageProps }) {
  return (
    <GlobalContextProvider>
      <SimpleReactLightbox>
        <Component {...pageProps} />
      </SimpleReactLightbox>
    </GlobalContextProvider>
  )
}

export default MyApp
