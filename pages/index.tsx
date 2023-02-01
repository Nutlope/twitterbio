import { AnimatePresence, motion } from 'framer-motion'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import DropDown, { VibeType } from '../components/DropDown'
import Footer from '../components/Footer'
import Github from '../components/GitHub'
import Header from '../components/Header'
import LoadingDots from '../components/LoadingDots'
import ResizablePanel from '../components/ResizablePanel'

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [length, setLength] = useState(42)
  const [vibe, setVibe] = useState<VibeType>('Professional')
  const [generatedSummaries, setGeneratedSummaries] = useState<String>('')

  console.log('Streamed response: ', generatedSummaries)

  const prompt =
    vibe === 'Funny'
      ? `Generate 2 funny text summaries with no hashtags and clearly labeled "1." and "2.". Make sure there is a joke in there and it's a little ridiculous. Make sure each generated summary is ${length} words minimun/limit and base it on this context: ${summary}${
          summary.slice(-1) === '.' ? '' : '.'
        }`
      : `Generate 2 ${vibe} summaries clearly labeled "1." and "2.". Make sure each generated summary ${length} words minimun/limit and base them on this context: ${summary}${
          summary.slice(-1) === '.' ? '' : '.'
        }`

  const generateSummary = async (e: any) => {
    e.preventDefault()
    setGeneratedSummaries('')
    setLoading(true)
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    })
    console.log('Edge function returned.')

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      setGeneratedSummaries((prev) => prev + chunkValue)
    }

    setLoading(false)
  }

  return (
    <div className='flex flex-col items-center justify-center max-w-5xl min-h-screen py-2 mx-auto'>
      <Head>
        <title>Text Summarizer</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />
      <main className='flex flex-col items-center justify-center flex-1 w-full px-4 mt-12 text-center sm:mt-20'>
        <a
          className='flex items-center justify-center px-4 py-2 mb-5 space-x-2 text-sm text-gray-600 transition-colors bg-white border border-gray-300 rounded-full shadow-md max-w-fit hover:bg-gray-100'
          href='https://github.com/ryarturogi/text-sumarizer'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className='max-w-2xl text-4xl font-bold sm:text-6xl text-slate-900'>
          Generate a summary from a text in seconds.
        </h1>
        <div className='w-full max-w-xl'>
          <div className='flex items-center mt-10 space-x-3'>
            <div className='flex items-center justify-center w-12 h-10 text-sm text-white bg-black rounded-full'>
              <p>1</p>
            </div>
            <p className='font-medium text-left'>
              Copy current summary{' '}
              <span className='text-slate-500'>
                (or write a few sentences about the topic you want to write
                about)
              </span>
              .
            </p>
          </div>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            className='w-full my-5 border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black'
            placeholder={
              'e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com.'
            }
          />
          <div className='flex items-center mb-5 space-x-3'>
            <div className='flex items-center justify-center w-10 h-10 text-sm text-white bg-black rounded-full'>
              <p>2</p>
            </div>
            <p className='font-medium text-left'>Select your vibe.</p>
          </div>
          <div className='block'>
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>
          <div className='flex items-center mt-8 mb-5 space-x-3'>
            <div className='flex items-center justify-center w-10 h-10 text-sm text-white bg-black rounded-full'>
              <p>3</p>
            </div>
            <p className='font-medium text-left'>
              Select the length of your summary.
            </p>

            {/* input counter */}
            <div className='flex items-center justify-center w-20 h-8 ml-2 text-sm text-white bg-black rounded'>
              <p>{length} words</p>
            </div>
          </div>

          <div className='flex items-center justify-center w-full mt-12 space-x-3'>
            <div className='flex items-center justify-center w-12 h-10 text-sm text-white bg-blue-600 rounded-full'>
              <p>10</p>
            </div>
            <input
              type='range'
              min='10'
              max='100'
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className='w-full h-2 bg-gray-300 rounded-full cursor-pointer'
            />
            <div className='flex items-center justify-center w-12 h-10 text-sm text-white bg-blue-600 rounded-full'>
              <p>100</p>
            </div>
          </div>
          <div className='flex items-center justify-between mt-5 space-x-3'>
            <p className='text-sm text-gray-500'>Short</p>
            <p className='text-sm text-gray-500'>Long</p>
          </div>

          {!loading && (
            <button
              className={`w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80 ${
                summary.length === 10 && 'opacity-50 cursor-not-allowed'
              }`}
              onClick={(e) => generateSummary(e)}
              disabled={summary.length === 0}
            >
              Generate summary &rarr;
            </button>
          )}
          {loading && (
            <button
              className='w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80'
              disabled
            >
              <LoadingDots color='white' style='large' />
            </button>
          )}
        </div>
        <Toaster
          position='top-center'
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className='h-px bg-gray-700 border-1 dark:bg-gray-700' />
        <ResizablePanel>
          <AnimatePresence mode='wait'>
            <motion.div className='my-10 space-y-10'>
              {generatedSummaries && (
                <>
                  <div>
                    <h2 className='mx-auto text-3xl font-bold sm:text-4xl text-slate-900'>
                      Your generated summaries
                    </h2>
                  </div>
                  <div className='flex flex-col items-center justify-center max-w-xl mx-auto space-y-8'>
                    {generatedSummaries
                      .substring(generatedSummaries.indexOf('1') + 3)
                      .split('2.')
                      .map((generatedSummary) => {
                        return (
                          <div
                            className='p-4 transition bg-white border shadow-md rounded-xl hover:bg-gray-100 cursor-copy'
                            onClick={() => {
                              navigator.clipboard.writeText(generatedSummary)
                              toast('summary copied to clipboard', {
                                icon: '✂️',
                              })
                            }}
                            key={generatedSummary}
                          >
                            <p>{generatedSummary}</p>
                          </div>
                        )
                      })}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  )
}

export default Home
