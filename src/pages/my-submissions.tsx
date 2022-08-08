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

const MySubmissions: NextPage = () => {
  const router = useRouter();

  const {
    data: outfits,
    isLoading,
    error,
  } = trpc.useQuery(['outfit.mySubmissions']);

  return (
    <>
      <Head>
        <title>My Submissions - FitDetector</title>
      </Head>

      <main>
        <h1>Outfits you submitted</h1>
        {isLoading && <MoonLoader />}
        {error && <p>There was an error retrieving outfits you submitted</p>}
        {outfits &&
          (outfits.length ? (
            outfits.map((outfit) => (
              <OutfitCard
                id={outfit.id}
                image={outfit.image}
                celebrity={outfit.celebrity.name}
                description={outfit.description}
                key={outfit.id}
              />
            ))
          ) : (
            <p>No outfits you submitted</p>
          ))}
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

export default MySubmissions;
