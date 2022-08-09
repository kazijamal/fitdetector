import Head from 'next/head';
import Link from 'next/link';

const ErrorPage = () => {
  return (
    <>
      <Head>
        <title>FitDetector</title>
      </Head>

      <main className='flex flex-col justify-center items-center h-screen p-5'>
        <h1 className='text-center text-xl m-3'>
          There was an unexpected error, please go home and try again.
        </h1>
        <Link href='/'>
          <button className='btn btn-primary m-3'>Go Home</button>
        </Link>
      </main>
    </>
  );
};

export default ErrorPage;
