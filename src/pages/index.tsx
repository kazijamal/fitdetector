import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import { getAuthSession } from '../server/common/get-server-session';
import MoonLoader from 'react-spinners/MoonLoader';

import AuthNavbar from '../components/AuthNavbar';
import Navbar from '../components/Navbar';

type OutfitCardProps = {
  id: string;
  image: string;
  celebrity: string;
  description: string | null;
  createdAt: Date;
};

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ authSession }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: recentOutfits,
    isLoading,
    error,
  } = trpc.useQuery(['outfit.getRecent']);

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

      {authSession ? <AuthNavbar /> : <Navbar />}

      <main className='container mx-auto flex flex-col items-center p-4'>
        <h1 className='text-6xl font-extrabold m-2'>
          <span className='text-primary'>Fit</span>Detector
        </h1>
        <h2 className='text-lg text-center m-2'>
          Find out what clothes your favorite celebrities are wearing
        </h2>

        <form className='w-full max-w-md m-2' onSubmit={handleSearchSubmit}>
          <div className='relative'>
            <input
              type='search'
              className='input input-bordered p-4 w-full'
              placeholder='Search celebrities...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            <button
              type='submit'
              className='btn btn-primary btn-sm absolute right-2 bottom-2 px-4 py-2'
            >
              Search
            </button>
          </div>
        </form>

        <h2 className='text-lg text-center m-1'>or</h2>

        {authSession ? (
          <div className='flex flex-wrap'>
            <Link href='/submit-outfit'>
              <a className='btn btn-primary m-2'>Submit an Outfit</a>
            </Link>
          </div>
        ) : (
          <button className='btn btn-primary m-2' onClick={() => signIn()}>
            Sign in to submit an outfit
          </button>
        )}

        <h1 className='m-3 text-2xl font-bold'>Recently submitted outfits</h1>
        <div className='m-2 flex gap-5 flex-col items-center'>
          {isLoading && <MoonLoader />}
          {error && <p>There was an error retrieving recent outfits</p>}
          {recentOutfits &&
            (recentOutfits.length ? (
              recentOutfits.map((outfit) => (
                <OutfitCard
                  id={outfit.id}
                  image={outfit.image}
                  celebrity={outfit.celebrity.name}
                  description={outfit.description}
                  createdAt={outfit.createdAt}
                  key={outfit.id}
                />
              ))
            ) : (
              <p>No recent outfits</p>
            ))}
        </div>
      </main>
    </>
  );
};

const OutfitCard = ({
  id,
  image,
  celebrity,
  description,
  createdAt,
}: OutfitCardProps) => {
  return (
    <div className='card card-normal max-w-sm shadow-lg bg-base-200'>
      <img className='' src={image} alt='' />
      <div className='card-body'>
        <div className='card-title'>{celebrity}</div>
        {description && <p className=''>{description}</p>}
        <p>Submitted on {createdAt.toLocaleString()}</p>
        <div className='card-actions justify-end pt-3'>
          <Link href={`/outfits/${id}`}>
            <a className='btn btn-primary'>View Outfit</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const authSession = await getAuthSession(ctx);

  return {
    props: {
      authSession,
    },
  };
};

export default Home;
