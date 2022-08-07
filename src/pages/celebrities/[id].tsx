import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import MoonLoader from 'react-spinners/MoonLoader';
import Link from 'next/link';

type OutfitCardProps = {
  id: string;
  image: string;
  description: string | null;
};

const Celebrity: NextPage = () => {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const { status } = useSession();

  const utils = trpc.useContext();
  const { data: celebrityData } = trpc.useQuery(['celebrity.getById', { id }]);
  const followMutation = trpc.useMutation(['celebrity.follow'], {
    onSuccess: (data) => {
      utils.invalidateQueries(['celebrity.getById']);
    },
  });

  const handleFollowClick = async () => {
    followMutation.mutate({ id });
  };

  if (status === 'authenticated' && celebrityData) {
    const { celebrity, following } = celebrityData;

    return (
      <>
        <Head>
          <title>FitDetector</title>
        </Head>

        <main>
          <h1>{celebrity.name}</h1>

          <h2>{celebrity._count.followers} followers</h2>
          {following ? (
            <p>Following</p>
          ) : (
            <button onClick={handleFollowClick}>Follow</button>
          )}

          {celebrity.rating && (
            <h2>Average outfit rating: {celebrity.rating}</h2>
          )}

          {celebrity.outfits.map((outfit) => (
            <OutfitCard
              id={outfit.id}
              image={outfit.image}
              description={outfit.description}
              key={outfit.id}
            />
          ))}
        </main>
      </>
    );
  }

  if (status === 'unauthenticated' && celebrityData) {
    const { celebrity } = celebrityData;

    return <></>;
  }

  return <MoonLoader />;
};

const OutfitCard = ({ id, image, description }: OutfitCardProps) => {
  return (
    <div className='max-w-xs rounded overflow-hidden shadow-lg'>
      <img className='w-full' src={image} />
      <div className='px-6 py-4'>
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

export default Celebrity;
