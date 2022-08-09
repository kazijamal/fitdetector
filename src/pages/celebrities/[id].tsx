import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import { getAuthSession } from '../../server/common/get-server-session';
import MoonLoader from 'react-spinners/MoonLoader';

type OutfitCardProps = {
  id: string;
  image: string;
  description: string | null;
};

const Celebrity: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ authSession }) => {
  const router = useRouter();
  const utils = trpc.useContext();
  const id = typeof router.query.id === 'string' ? router.query.id : '';

  const {
    data: celebrityData,
    isLoading,
    error,
  } = trpc.useQuery(['celebrity.getById', { id }]);

  const followMutation = trpc.useMutation(['celebrity.follow'], {
    onSuccess: (data) => {
      utils.invalidateQueries(['celebrity.getById']);
    },
  });

  const unfollowMutation = trpc.useMutation(['celebrity.unfollow'], {
    onSuccess: (data) => {
      utils.invalidateQueries(['celebrity.getById']);
    },
  });

  if (isLoading) {
    return (
      <>
        <Head>
          <title>FitDetector</title>
        </Head>

        <main>
          <MoonLoader />
        </main>
      </>
    );
  }

  if (authSession && celebrityData) {
    const { celebrity, following } = celebrityData;

    return (
      <>
        <Head>
          <title>{celebrity.name} - FitDetector</title>
        </Head>

        <main>
          <h1>{celebrity.name}</h1>

          <h2>{celebrity._count.followers} followers</h2>
          {following ? (
            <button
              onClick={() => {
                unfollowMutation.mutate({ id });
              }}
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={() => {
                followMutation.mutate({ id });
              }}
            >
              Follow
            </button>
          )}

          {celebrity.rating && (
            <h2>Average outfit rating: {celebrity.rating}</h2>
          )}

          <h1>Outfits</h1>
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

  if (!authSession && celebrityData) {
    const { celebrity } = celebrityData;

    return (
      <>
        <Head>
          <title>{celebrity.name} - FitDetector</title>
        </Head>

        <main>
          <h1>{celebrity.name}</h1>

          <h2>{celebrity._count.followers} followers</h2>

          {celebrity.rating && (
            <h2>Average outfit rating: {celebrity.rating}</h2>
          )}

          <h1>Outfits</h1>
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

  return (
    <>
      <Head>
        <title>FitDetector</title>
      </Head>

      <main>
        <p>There was an error retrieving celebrity information</p>
      </main>
    </>
  );
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const authSession = await getAuthSession(ctx);

  return {
    props: {
      authSession,
    },
  };
};

export default Celebrity;
