import type { NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { api } from '../utils/api';
import { getServerAuthSession } from '../server/auth';
import MoonLoader from 'react-spinners/MoonLoader';

import AuthNavbar from '../components/AuthNavbar';
import OutfitCard from '../components/OutfitCard';

const MySubmissions: NextPage = () => {
  const {
    data: outfits,
    isLoading,
    error,
  } = api.outfit.mySubmissions.useQuery();

  return (
    <>
      <Head>
        <title>My Submissions - FitDetector</title>
      </Head>

      <AuthNavbar />

      <main className='container mx-auto flex flex-col items-center p-4'>
        <h1 className='m-3 text-2xl font-bold text-center'>
          Outfits you submitted
        </h1>
        <div className='m-2 flex gap-5 flex-col items-center'>
          {isLoading && <MoonLoader />}
          {error && <p>There was an error retrieving outfits you submitted</p>}
          {outfits &&
            (outfits.length ? (
              outfits.map((outfit) => (
                <OutfitCard outfit={outfit} key={outfit.id} />
              ))
            ) : (
              <p>No outfits you submitted</p>
            ))}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const authSession = await getServerAuthSession(ctx);

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

export default MySubmissions;
