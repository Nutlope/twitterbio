import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo.png" />
          <meta
            name="description"
            content="Generate your next SWOT analysis in seconds."
          />
          <meta property="og:site_name" content="swot-generator.com" />
          <meta
            property="og:description"
            content="Generate your next SWOT analysis in seconds."
          />
          <meta property="og:title" content="SWOT Generator" />
          <meta name="swot:card" content="summary_large_image" />
          <meta name="swot:title" content="SWOT analysis Generator" />
          <meta
            name="swot:description"
            content="Generate your next SWOT analysis in seconds."
          />
          <meta
            property="og:image"
            content="https://swot-generator-mflodmark.vercel.app/og-image.png"
          />
          <meta
            name="swot:image"
            content="https://swot-generator-mflodmark.vercel.app/og-image.png"
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
