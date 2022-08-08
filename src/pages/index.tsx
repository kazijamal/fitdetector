import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { useSession, signIn, signOut } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import MoonLoader from 'react-spinners/MoonLoader';
import { useState } from 'react';
import { useRouter } from 'next/router';

type OutfitCardProps = {
  id: string;
  image: string;
  celebrity: string;
  description: string | null;
};

const Home: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const {
    data: recentOutfits,
    isLoading,
    isError,
  } = trpc.useQuery(['outfit.getRecent']);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/celebrity-search?q=${searchQuery}`);
  };

  return (
    <>
      <Head>
        <title>FitDetector</title>
        <meta
          name='description'
          content='Find out what clothes your favorite celebrities are wearing'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='container mx-auto flex flex-col items-center justify-center min-h-screen p-4'>
        <h1 className='text-6xl font-extrabold text-gray-700 m-2'>
          <span className='text-purple-300'>Fit</span>Detector
        </h1>
        <p className='text-lg text-gray-600 m-2 text-center'>
          Find out what clothes your favorite celebrities are wearing
        </p>
        {status === 'authenticated' && (
          <div className='flex'>
            <Link href='/submit-outfit'>
              <a className='m-1 bg-purple-400 hover:bg-purple-600 text-white py-2 px-4 rounded'>
                Submit an outfit photo
              </a>
            </Link>
            <Link href='/following'>
              <a className='m-1 bg-purple-400 hover:bg-purple-600 text-white py-2 px-4 rounded'>
                Following
              </a>
            </Link>
            <Link href='/my-submissions'>
              <a className='m-1 bg-purple-400 hover:bg-purple-600 text-white py-2 px-4 rounded'>
                Your Submissions
              </a>
            </Link>
            <button
              className='m-1 bg-red-400 hover:bg-red-600 text-white py-2 px-4 rounded'
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </div>
        )}
        {status === 'unauthenticated' && (
          <button
            className='m-1 bg-purple-400 hover:bg-purple-600 text-white py-2 px-4 rounded'
            onClick={() => signIn()}
          >
            Sign in to submit an outfit photo
          </button>
        )}
        <form className='w-full max-w-md m-3' onSubmit={handleSearchSubmit}>
          <label className='mb-2 text-sm font-medium text-gray-900 sr-only'>
            Search
          </label>
          <div className='relative'>
            <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
              <svg
                aria-hidden='true'
                className='w-5 h-5 text-gray-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                ></path>
              </svg>
            </div>
            <input
              type='search'
              className='block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-purple-300 focus:border-purple-300'
              placeholder='Search Celebrities...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type='submit'
              className='text-white absolute right-2.5 bottom-2.5 bg-purple-400 hover:bg-purple-600 focus:ring-4 focus:outline-none focus:ring-purple-200 font-medium rounded-lg text-sm px-4 py-2'
            >
              Search
            </button>
          </div>
        </form>

        <h2 className='m-3 text-2xl font-extrabold text-gray-700'>
          Recently submitted outfit photos
        </h2>
        <div className='m-2 flex gap-3 flex-col items-center'>
          {isLoading && <MoonLoader />}
          {isError && <p>There was an error retrieving recent outfits</p>}
          {recentOutfits &&
            recentOutfits.map((outfit) => (
              <OutfitCard
                id={outfit.id}
                image={outfit.image}
                celebrity={outfit.celebrity.name}
                description={outfit.description}
                key={outfit.id}
              />
            ))}
        </div>
      </main>
    </>
  );
};

const OutfitCard = ({ id, image, celebrity, description }: OutfitCardProps) => {
  return (
    <div className='max-w-xs rounded overflow-hidden shadow-lg'>
      <img className='w-full' src={image} />
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>{celebrity}</div>
        {description && (
          <p className='text-gray-700 text-base'>{description}</p>
        )}
        <div className='pt-4 pb-2'>
          <Link href={`/outfits/${id}`}>
            <a className='bg-purple-400 hover:bg-purple-600 text-white py-2 px-4 rounded'>
              View outfit info
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
