import Head from 'next/head';
import MoonLoader from 'react-spinners/MoonLoader';

const LoadingPage = () => {
  return (
    <>
      <Head>
        <title>FitDetector</title>
      </Head>

      <main className='flex justify-center items-center h-screen'>
        <MoonLoader />
      </main>
    </>
  );
};

export default LoadingPage;
