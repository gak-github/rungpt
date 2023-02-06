import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import mainImage from '@/assets/images/main_image.jpg'
import { Form, Button, Spinner } from 'react-bootstrap'
import { useState } from 'react'

export default function Home() {

  const [quote, setQuote] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteLoadingError, setQuoteLoadingError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const prompt = formData.get("prompt")?.toString().trim();
    if (prompt) {
      try {
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const response = await fetch("/api/rungpt?prompt=" + encodeURIComponent(prompt));
        const body = await response.json();
        setQuote(body.quote);
      } catch (error) {
        console.error(error);
        setQuoteLoadingError(true);
      } finally {
        setQuoteLoading(false);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Quote generator for running</title>
        <meta name="description" content="This app is integrated with an Open AI API (GPT-3), built on Next.js and deployed in Netlify" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/leaf.png" />
      </Head>
      <main className={styles.main}>
        <h1>RUN A MARATHON</h1>
        <div className={styles.mainImageContainer}>
          <Image
            src={mainImage}
            fill
            alt='A picture of a man running'
            priority
            className={styles.mainImage}
          />
        </div>
        <Form onSubmit={handleSubmit} className={styles.inputForm}>
          <Form.Group className='mb-3' controlId='prompt-input'>
            <Form.Label>Create a motivational quote for running</Form.Label>
            <Form.Control
              name='prompt'
              placeholder='e.g. running, endurance, marathon'
              maxLength={100}
            />
          </Form.Group>
          <Button type='submit' className='mb-3' disabled={quoteLoading}>
            Make me run
          </Button>
        </Form>
        {quoteLoading && <Spinner animation='border' />}
        {quoteLoadingError && "Something went wrong. Please try again."}
        {quote && <h5>{quote}</h5>}
      </main>
    </>
  )
}