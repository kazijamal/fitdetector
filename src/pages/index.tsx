import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { authOptions as nextAuthOptions } from './api/auth/[...nextauth]';
import { Key } from 'react';

type OutfitCardProps = {
  image: string;
  name: string;
  description: string;
};

const Home: NextPage = ({
  nextAuthSession,
  recentOutfits,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
        {nextAuthSession ? (
          <div className='flex'>
            <Link href='#'>
              <a className='m-1 bg-purple-400 hover:bg-purple-600 text-white py-2 px-4 rounded'>
                Submit a photo
              </a>
            </Link>
            <Link href='/api/auth/signout'>
              <a className='m-1 bg-red-400 hover:bg-red-600 text-white py-2 px-4 rounded'>
                Sign out
              </a>
            </Link>
          </div>
        ) : (
          <Link href='/api/auth/signin'>
            <a className='m-1 bg-purple-400 hover:bg-purple-600 text-white py-2 px-4 rounded'>
              Sign in to submit a photo
            </a>
          </Link>
        )}
        <form className='w-full max-w-md m-3'>
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
          {recentOutfits.map(
            (
              outfit: { image: string; name: string; description: string },
              index: Key | null | undefined
            ) => (
              <OutfitCard
                image={outfit.image}
                name={outfit.name}
                description={outfit.description}
                key={index}
              />
            )
          )}
        </div>
      </main>
    </>
  );
};

const OutfitCard = ({ image, name, description }: OutfitCardProps) => {
  return (
    <div className='max-w-xs rounded overflow-hidden shadow-lg'>
      <img className='w-full' src={image} />
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>{name}</div>
        <p className='text-gray-700 text-base'>{description}</p>
        <div className='pt-4 pb-2'>
          <Link href='#'>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const nextAuthSession = await getServerSession(
    context.req,
    context.res,
    nextAuthOptions
  );

  const recentOutfits = [
    {
      image: 'https://cdn.mos.cms.futurecdn.net/giaJ8MhXBN5YjDYKa4FbWH.jpg',
      name: 'Tim Henson',
      description: 'What jacket is he wearing?',
    },
    {
      image:
        'https://www.highsnobiety.com/static-assets/thumbor/wlnnmLyG7pzVjZVkTa3bx961cT8=/1600x1975/www.highsnobiety.com/static-assets/wp-content/uploads/2022/05/22222248/kanye-west-balenciaga-spring-2023-boots-outfit.jpg',
      name: 'Kanye West',
      description: 'What boots is he wearing?',
    },
    {
      image:
        'https://images.complex.com/complex/images/c_fill,dpr_auto,f_auto,q_auto,w_1400/fl_lossy,pg_1/p3rruj3otb7unklgckyp/best-tyler-the-creator-outfits-british-fashion-awards-2019?fimg-client-default',
      name: 'Tyler the Creator',
      description: 'What hat is he wearing?',
    },
  ];

  return {
    props: { nextAuthSession, recentOutfits },
  };
};
