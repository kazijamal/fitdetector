import type { NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { trpc } from '../utils/trpc';
import { getAuthSession } from '../server/common/get-server-session';
import MoonLoader from 'react-spinners/MoonLoader';

import AuthNavbar from '../components/AuthNavbar';
import OutfitCard from '../components/OutfitCard';

const Following: NextPage = () => {
  const {
    data: followingData,
    isLoading,
    error,
  } = trpc.useQuery(['celebrity.following']);

  return <>
    <Head>
      <title>Following - FitDetector</title>
    </Head>

    <AuthNavbar />

    <main className='container mx-auto flex flex-col items-center p-4'>
      {isLoading && <MoonLoader />}
      {error && <p>There was an error retrieving following data</p>}
      {followingData && (
        <>
          <div className='my-4'>
            <h1 className='m-3 text-2xl font-bold text-center'>
              Celebrities you follow
            </h1>
            {followingData.celebrities.length ? (
              <p className='text-center'>
                {followingData.celebrities.map((celebrity) => (
                  <span key={celebrity.id} className='mx-3'>
                    <Link href={`/celebrities/${celebrity.id}`} className='link'>
                      {celebrity.name}
                    </Link>
                  </span>
                ))}
              </p>
            ) : (
              <p>No celebrities you follow</p>
            )}
          </div>

          <div className='my-4'>
            <h1 className='m-3 text-2xl font-bold text-center'>
              Recent outfits from celebrities you follow
            </h1>
            <div className='m-2 flex gap-5 flex-col items-center'>
              {followingData.recentOutfits.length ? (
                followingData.recentOutfits.map((outfit) => (
                  <OutfitCard outfit={outfit} key={outfit.id} />
                ))
              ) : (
                <p>No recent outfits from celebrities you follow</p>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  </>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const authSession = await getAuthSession(ctx);

  if (!authSession) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      authSession,
    },
  };
};

export default Following;
