import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import "@fontsource/open-sans";
import "@fontsource/open-sans/700.css";
import "../styles/globals.css";
import "../styles/responsive.css";
import type { AppProps /*, AppContext */ } from "next/app";
import type { NextPage } from "next";
import { Header } from "../modules/header/header";
import React from "react";
import { Footer } from "../modules/footer/footer";
import { QueryClientProvider, QueryClient } from "react-query";
import { getHeader } from "../modules/cms/api/get-header";
import { getFooter } from "../modules/cms/api/get-footer";

const queryClient = new QueryClient();

type Props = AppProps & { header: any, footer: any }
const App: React.FC<Props> = ({ Component, pageProps, header, footer }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div id="the-page" className="the-page">
          <div className="the-page-liner">
            <Header data={header} />
            <Component {...pageProps} />
            <Footer data={footer} />
          </div>
        </div>
      </QueryClientProvider>
    </>
  );
};

(App as any).getInitialProps = async (appContext) => {
  const [header, footer] = await Promise.all([
    getHeader(),
    getFooter()
  ])

  return {
    header,
    footer
  }
} 

export default App;
