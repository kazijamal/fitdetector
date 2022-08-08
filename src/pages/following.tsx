import type { NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';
import { getAuthSession } from '../server/common/get-server-session';
import MoonLoader from 'react-spinners/MoonLoader';

type OutfitCardProps = {
  id: string;
  image: string;
  celebrity: string;
  description: string | null;
};

const Following: NextPage = () => {
  const router = useRouter();

  const {
    data: followingData,
    isLoading,
    error,
  } = trpc.useQuery(['celebrity.following']);

  return (
    <>
      <Head>
        <title>Following - FitDetector</title>
      </Head>

      <main>
        {isLoading && <MoonLoader />}
        {error && <p>There was an error retrieving following data</p>}
        {followingData && (
          <>
            <h1>Celebrities you follow</h1>
            {followingData.celebrities.length ? (
              <ul>
                {followingData.celebrities.map((celebrity) => (
                  <li key={celebrity.id}>
                    <Link href={`/celebrities/${celebrity.id}`}>
                      <a>{celebrity.name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No celebrities you follow</p>
            )}

            <h1>Recent outfits from celebrities you follow</h1>
            {followingData.recentOutfits.length ? (
              followingData.recentOutfits.map((outfit) => (
                <OutfitCard
                  id={outfit.id}
                  image={outfit.image}
                  celebrity={outfit.celebrity.name}
                  description={outfit.description}
                  key={outfit.id}
                />
              ))
            ) : (
              <p>No recent outfits from celebrities you follow</p>
            )}
          </>
        )}
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
