import Form from './form';

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/SUrQjWVq22X
 */
export default function Page() {
  return (
    <section className="w-full h-screen flex items-center justify-center py-12">
      <div className="container space-y-12 px-4 md:px-6 mx-auto max-w-[800px]">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl max-w-[550px]">
            Generate your next social bio using ChatGPT
          </h2>
          <p className="max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
            47,118 bios generated so far.
          </p>
        </div>
        <Form />
        <footer className="flex justify-center space-x-4">
          <a
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            href="https://twitter.com/nutlope"
          >
            X
          </a>
          <a
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            href="https://github.com/Nutlope/twitterbio"
          >
            GitHub
          </a>
          <a
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            href="https://vercel.com/templates/next.js/twitter-bio?__vercel_draft=1"
          >
            Deploy your own
          </a>
        </footer>
      </div>
    </section>
  );
}
