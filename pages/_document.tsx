import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Generate your next Twitter bio in seconds."
          />
          <meta property="og:site_name" content="twitterbio.io" />
          <meta
            property="og:description"
            content="Generate your next Twitter bio in seconds."
          />
          <meta property="og:title" content="Twitter Bio Generator" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Twitter Bio Generator" />
          <meta
            name="twitter:description"
            content="Generate your next Twitter bio in seconds."
          />
          <meta
            property="og:image"
            content="https://twitterbio.io/og-image.png"
          />
          <meta
            name="twitter:image"
            content="https://twitterbio.io/og-image.png"
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

/*
CODE EXPLANATION:
This code is a custom implementation of the Document component in Next.js. It defines the structure of an HTML document, 
including the head, which contains metadata and links to resources, and the body, which contains the main content and script imports.

The head includes several meta tags for open graph (og) and Twitter Cards, which are used by social media platforms to display rich 
information when the website is shared. The og tags provide information about the site, such as the site name, title, and description,
while the Twitter tags provide similar information specifically for Twitter. The head also includes a link to a favicon, which is a small icon 
that is displayed next to the site title in a browser.

The body contains two components: Main, which is the main content of the page, and NextScript, which is a script that is necessary for the Next.js 
framework to work properly.

This Document component is exported and can be used as the default document for the Next.js app by setting it in the next.config.js file.
*/
