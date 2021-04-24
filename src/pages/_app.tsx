import "../styles/styles.sass";
import "../styles/highlight.css";
import { GeistProvider, CssBaseline } from "@geist-ui/react";

const App = ({ Component, pageProps }) => {
  return (
    <GeistProvider themeType="dark">
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  );
};

export default App;
