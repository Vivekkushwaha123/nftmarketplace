import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';
import { Navbar, Footer } from '../components/index';
import { NFTProvider } from '../context/NFTContext';

function MyApp({ Component, pageProps }) {
  return (
    <NFTProvider>
      <ThemeProvider attribute="class">
        <div className="dark:bg-nft-dark  min-h-screen">
          <Navbar />
          <div className="pt-65">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
        <Script src="https://kit.fontawesome.com/af43f703ff.js" crossorigin="anonymous" />
      </ThemeProvider>
    </NFTProvider>
  );
}

export default MyApp;
