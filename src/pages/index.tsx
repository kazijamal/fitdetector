import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { api } from '../utils/api';
import { getServerAuthSession } from '../server/auth';
import MoonLoader from 'react-spinners/MoonLoader';

import AuthNavbar from '../components/AuthNavbar';
import Navbar from '../components/Navbar';
import OutfitCard from '../components/OutfitCard';

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ authSession }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: recentOutfits,
    isLoading,
    error,
  } = api.outfit.getRecent.useQuery();

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/celebrity-search?q=${searchQuery}`);
  };

  return <>
    <Head>
      <title>FitDetector</title>
      <meta
        name='description'
        content='Find out what clothes your favorite celebrities are wearing'
      />
      <link rel='icon' href='/favicon.ico' />
    </Head>

    {authSession ? <AuthNavbar /> : <Navbar />}

    <main className='container mx-auto flex flex-col items-center p-4'>
      <h1 className='text-6xl font-extrabold m-2'>
        <span className='text-secondary'>Fit</span>Detector
      </h1>
      <h2 className='text-lg text-center m-2'>
        Find out what clothes your favorite celebrities are wearing
      </h2>

      <form
        className='w-full max-w-md m-2 form-control'
        onSubmit={handleSearchSubmit}
      >
        <div className='input-group'>
          <input
            type='text'
            className='input input-bordered w-full text-lg'
            placeholder='Search celebrities...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
          <button className='btn btn-square' type='submit'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </button>
        </div>
      </form>

      <h2 className='text-lg text-center m-1'>or</h2>

      {authSession ? (
        <div className='flex flex-wrap'>
          <Link href='/submit-outfit' className='btn btn-primary m-2'>
            Submit an Outfit
          </Link>
        </div>
      ) : (
        <button className='btn btn-primary m-2' onClick={() => signIn()}>
          Sign in to submit an outfit
        </button>
      )}

      <h1 className='m-3 text-2xl font-bold text-center'>
        Recently submitted outfits
      </h1>
      <div className='m-2 flex gap-5 flex-col items-center'>
        {isLoading && <MoonLoader />}
        {error && <p>There was an error retrieving recent outfits</p>}
        {recentOutfits &&
          (recentOutfits.length ? (
            recentOutfits.map((outfit) => (
              <OutfitCard outfit={outfit} key={outfit.id} />
            ))
          ) : (
            <p>No recent outfits</p>
          ))}
      </div>
    </main>
  </>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const authSession = await getServerAuthSession(ctx);

  return {
    props: {
      authSession,
    },
  };
};

export default Home;
