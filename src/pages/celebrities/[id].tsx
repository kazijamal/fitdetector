import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import { getAuthSession } from '../../server/common/get-server-session';

import AuthNavbar from '../../components/AuthNavbar';
import Navbar from '../../components/Navbar';
import LoadingPage from '../../components/LoadingPage';
import ErrorPage from '../../components/ErrorPage';
import OutfitCard from '../../components/OutfitCard';

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
    return <LoadingPage />;
  }

  if (authSession && celebrityData) {
    const { celebrity, following } = celebrityData;

    return (
      <>
        <Head>
          <title>{celebrity.name} - FitDetector</title>
        </Head>

        <AuthNavbar />

        <main className='container max-w-2xl mx-auto flex flex-col items-center px-4'>
          <div className='my-4'>
            <div className='flex justify-between'>
              <div>
                <h1 className='my-3 text-3xl font-bold'>{celebrity.name}</h1>
                <h2 className='my-1 text-lg'>
                  {celebrity._count.followers} followers
                </h2>
                {following ? (
                  <button
                    className='btn gap-2 mt-1'
                    onClick={() => {
                      unfollowMutation.mutate({ id });
                    }}
                  >
                    Unfollow
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-secondary'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    className='btn gap-2 mt-1'
                    onClick={() => {
                      followMutation.mutate({ id });
                    }}
                  >
                    Follow
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-secondary'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className='stats shadow bg-base-200'>
                <div className='stat'>
                  <div className='stat-figure text-secondary'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                      />
                    </svg>
                  </div>
                  <div className='stat-title'>Rating</div>
                  <div className='stat-value'>
                    {celebrity.rating ? `${celebrity.rating}/10` : 'N/A'}
                  </div>
                  <div className='stat-desc'>
                    {celebrity.outfits.length} outfits
                  </div>
                </div>
              </div>
            </div>

            <div className='my-4 flex flex-col items-center gap-5 pb-8'>
              <h1 className='text-2xl font-bold'>Outfits</h1>
              {celebrity.outfits.map((outfit) => (
                <OutfitCard outfit={outfit} key={outfit.id} />
              ))}
            </div>
          </div>
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

        <Navbar />

        <main className='container max-w-2xl mx-auto flex flex-col items-center px-4'>
          <div className='my-4'>
            <div className='flex justify-between'>
              <div>
                <h1 className='my-3 text-3xl font-bold'>{celebrity.name}</h1>
                <h2 className='my-1 text-lg'>
                  {celebrity._count.followers} followers
                </h2>
              </div>

              <div className='stats shadow bg-base-200'>
                <div className='stat'>
                  <div className='stat-figure text-secondary'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                      />
                    </svg>
                  </div>
                  <div className='stat-title'>Rating</div>
                  <div className='stat-value'>
                    {celebrity.rating ? `${celebrity.rating}/10` : 'N/A'}
                  </div>
                  <div className='stat-desc'>
                    {celebrity.outfits.length} outfits
                  </div>
                </div>
              </div>
            </div>

            <div className='my-4 flex flex-col items-center gap-5 pb-8'>
              <h1 className='text-2xl font-bold'>Outfits</h1>
              {celebrity.outfits.map((outfit) => (
                <OutfitCard outfit={outfit} key={outfit.id} />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  return <ErrorPage />;
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
