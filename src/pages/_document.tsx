import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { CssBaseline } from "@geist-ui/react";
import { GA_TRACKING_ID } from "../gtag";

const isProduction = process.env.NODE_ENV === "production";

class Document extends NextDocument {
  render() {
    const styles = CssBaseline.flush();

    return (
      <Html lang="en">
        <Head>
          {/* Primary Meta Tags */}
          <title>KYVE</title>
          <meta name="title" content="KYVE" />
          <meta
            name="description"
            content="Enabling infinite scalability for Web3."
          />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://kyve.network/" />
          <meta property="og:title" content="KYVE" />
          <meta
            property="og:description"
            content="Enabling infinite scalability for Web3."
          />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://kyve.network/" />
          <meta property="twitter:title" content="KYVE" />
          <meta
            property="twitter:description"
            content="Enabling infinite scalability for Web3."
          />

          <link
            rel="icon"
            href="https://kyve.network/favicon.svg"
            type="image/svg"
          />
          <meta property="og:image" content="https://kyve.network/og.png" />
          <meta
            property="twitter:image"
            content="https://kyve.network/og.png"
          />

          {isProduction && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
              />

              <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `
                  (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:2464580,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
                }}
              />
            </>
          )}

          {styles}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
