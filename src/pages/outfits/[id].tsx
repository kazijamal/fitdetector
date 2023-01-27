import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { api } from '../../utils/api';
import { getServerAuthSession } from '../../server/auth';
import { isValidHttpUrl } from '../../utils/utils';

import AuthNavbar from '../../components/AuthNavbar';
import Navbar from '../../components/Navbar';
import LoadingPage from '../../components/LoadingPage';
import ErrorPage from '../../components/ErrorPage';

const Outfit: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ authSession }) => {
  const router = useRouter();
  const utils = api.useContext();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const [ratingInput, setRatingInput] = useState('5');

  const {
    data: outfitData,
    isLoading,
    error,
  } = api.outfit.getById.useQuery({ id });

  const outfitRatingMutation = api.outfit.createRating.useMutation({
    onSuccess: (data) => {
      utils.outfit.getById.invalidate();
    },
  });

  const handleRatingSubmit = async () => {
    outfitRatingMutation.mutate({
      outfitId: id,
      value: Number(ratingInput),
    });
  };

  const deleteOutfitMutation = api.outfit.delete.useMutation({
    onSuccess: (data) => {
      router.push('/');
    },
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (authSession && outfitData) {
    const { outfit, rating } = outfitData;

    return (
      <>
        <Head>
          <title>FitDetector</title>
        </Head>

        <AuthNavbar />

        <main className='container max-w-2xl mx-auto flex flex-col items-center px-4'>
          <div className='my-4'>
            <div className='flex justify-between'>
              <div>
                <h1 className='my-3 text-3xl font-bold'>
                  {outfit.celebrity.name}
                </h1>
                <Link
                  href={`/celebrities/${outfit.celebrity.id}`}
                  legacyBehavior
                >
                  <button className='btn'>View Celebrity</button>
                </Link>
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
                    {outfit.rating ? `${outfit.rating}/10` : 'N/A'}
                  </div>
                  <div className='stat-desc'>
                    {outfit._count.ratings} ratings
                  </div>
                </div>
              </div>
            </div>

            <img src={outfit.image} className='my-5' />

            {outfit.description && (
              <div className='my-3'>
                <h2 className='text-lg font-semibold'>Description</h2>
                <p>{outfit.description}</p>
              </div>
            )}

            {outfit.source && (
              <>
                <div className='my-3'>
                  <h2 className='text-lg font-semibold'>Source</h2>
                  {isValidHttpUrl(outfit.source) ? (
                    <a
                      href={outfit.source}
                      className='link link-accent link-hover break-all'
                    >
                      {outfit.source}
                    </a>
                  ) : (
                    <p>{outfit.source}</p>
                  )}
                </div>
              </>
            )}

            <div className='my-3'>
              {rating ? (
                <div className='my-3'>
                  <h2 className='text-lg'>
                    <strong className='font-semibold'>Your Rating: </strong>{' '}
                    {rating}
                  </h2>
                </div>
              ) : (
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Enter Rating (1-10)</span>
                  </label>
                  <div className='input-group'>
                    <select
                      className='select select-bordered'
                      value={ratingInput}
                      onChange={(e) => setRatingInput(e.target.value)}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                    </select>
                    <button
                      onClick={handleRatingSubmit}
                      className='btn btn-square'
                    >
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
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p>
              Submitted by {outfit.user.name} on{' '}
              {outfit.createdAt.toLocaleString()}
            </p>

            {authSession.user?.id === outfit.userId && (
              <button
                className='btn mt-3 gap-2'
                onClick={() => {
                  deleteOutfitMutation.mutate({ id });
                }}
              >
                Delete Outfit
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                  />
                </svg>
              </button>
            )}
          </div>

          <div className='my-4 flex flex-col items-center gap-5 pb-8'>
            <h1 className='text-2xl font-bold'>Clothing</h1>
            {outfit.clothing.length ? (
              <div className='my-3 flex gap-5 flex-col items-center'>
                {outfit.clothing.map((clothing) => (
                  <div
                    className='card card-compact w-full bg-base-200 shadow-xl'
                    key={clothing.id}
                  >
                    <div className='card-body'>
                      <h2 className='card-title'>{clothing.type}</h2>
                      <p>
                        <strong className='font-semibold'>Brand:</strong>{' '}
                        {clothing.brand}
                      </p>
                      {clothing.price && (
                        <p>
                          <strong className='font-semibold'>Price:</strong> $
                          {clothing.price}
                        </p>
                      )}
                      <p className='break-all'>
                        <strong className='font-semibold'>Link:</strong>{' '}
                        <a
                          href={clothing.link}
                          className='link link-accent link-hover'
                        >
                          {clothing.link}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No submitted clothing</p>
            )}
            <Link href={`/submit-clothing/${outfit.id}`} legacyBehavior>
              <button className='btn btn-primary'>Submit Clothing</button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (!authSession && outfitData) {
    const { outfit } = outfitData;

    return (
      <>
        <Head>
          <title>FitDetector</title>
        </Head>

        <Navbar />

        <main className='container max-w-2xl mx-auto flex flex-col items-center px-4'>
          <div className='my-4'>
            <div className='flex justify-between'>
              <div>
                <h1 className='my-3 text-3xl font-bold'>
                  {outfit.celebrity.name}
                </h1>
                <Link
                  href={`/celebrities/${outfit.celebrity.id}`}
                  legacyBehavior
                >
                  <button className='btn'>View Celebrity</button>
                </Link>
              </div>

              {outfit.rating && (
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
                    <div className='stat-value'>10/10</div>
                    <div className='stat-desc'>
                      {outfit._count.ratings} ratings
                    </div>
                  </div>
                </div>
              )}
            </div>

            <img src={outfit.image} className='my-5' />

            {outfit.description && (
              <div className='my-3'>
                <h2 className='text-lg font-semibold'>Description</h2>
                <p>{outfit.description}</p>
              </div>
            )}

            {outfit.source && (
              <>
                <div className='my-3'>
                  <h2 className='text-lg font-semibold'>Source</h2>
                  {isValidHttpUrl(outfit.source) ? (
                    <a
                      href={outfit.source}
                      className='link link-accent link-hover break-all'
                    >
                      {outfit.source}
                    </a>
                  ) : (
                    <p>{outfit.source}</p>
                  )}
                </div>
              </>
            )}

            <p>
              Submitted by {outfit.user.name} on{' '}
              {outfit.createdAt.toLocaleString()}
            </p>
          </div>

          <div className='my-4 flex flex-col items-center gap-5 pb-8'>
            <h1 className='text-2xl font-bold'>Clothing</h1>
            {outfit.clothing.length ? (
              <div className='my-3 flex gap-5 flex-col items-center'>
                {outfit.clothing.map((clothing) => (
                  <div
                    className='card card-compact w-full bg-base-200 shadow-xl'
                    key={clothing.id}
                  >
                    <div className='card-body'>
                      <h2 className='card-title'>{clothing.type}</h2>
                      <p>
                        <strong className='font-semibold'>Brand:</strong>{' '}
                        {clothing.brand}
                      </p>
                      {clothing.price && (
                        <p>
                          <strong className='font-semibold'>Price:</strong> $
                          {clothing.price}
                        </p>
                      )}
                      <p>
                        <strong className='font-semibold'>Link:</strong>{' '}
                        <a
                          href={clothing.link}
                          className='link link-accent link-hover break-all'
                        >
                          {clothing.link}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No submitted clothing</p>
            )}
          </div>
        </main>
      </>
    );
  }

  return <ErrorPage />;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const authSession = await getServerAuthSession(ctx);

  return {
    props: {
      authSession,
    },
  };
};

export default Outfit;
