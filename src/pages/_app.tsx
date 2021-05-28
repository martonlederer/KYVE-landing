import "../styles/styles.sass";
import "../styles/highlight.css";
import { CssBaseline, GeistProvider } from "@geist-ui/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import * as gtag from "../gtag";

const isProduction = process.env.NODE_ENV === "production";

const App = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      /* invoke analytics function only for production */
      if (isProduction) gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <GeistProvider themeType="dark">
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  );
};

export default App;
