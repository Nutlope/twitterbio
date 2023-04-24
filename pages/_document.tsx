import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  // TODO update this whole document
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Turn your essays into short-form content in seconds."
          />
          <meta
            property="og:site_name"
            content="https://twitterbio-96i1.vercel.app"
          />
          <meta
            property="og:description"
            content="Turn your essays into short-form content in seconds."
          />
          <meta property="og:title" content="Essence" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Twitter Bio Generator" />
          <meta
            name="twitter:description"
            content="Turn your essays into short-form content in seconds."
          />
          <meta
            property="og:image"
            content="https://twitterbio-96i1.vercel.app/og-image.png"
          />
          <meta
            name="twitter:image"
            content="https://twitterbio-96i1.vercel.app/og-image.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
