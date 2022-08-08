import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { getAuthSession } from '../../server/common/get-server-session';
import { isValidHttpUrl } from '../../utils/utils';
import MoonLoader from 'react-spinners/MoonLoader';

const Outfit: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ authSession }) => {
  const router = useRouter();
  const utils = trpc.useContext();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const [ratingInput, setRatingInput] = useState('');

  const {
    data: outfitData,
    isLoading,
    error,
  } = trpc.useQuery(['outfit.getById', { id }]);

  const outfitRatingMutation = trpc.useMutation(['outfit.createRating'], {
    onSuccess: (data) => {
      utils.invalidateQueries(['outfit.getById']);
    },
  });

  const handleRatingSubmit = async () => {
    if (
      ratingInput === '' ||
      Number(ratingInput) < 0 ||
      Number(ratingInput) > 10
    ) {
      console.log('invalid rating');
    } else {
      outfitRatingMutation.mutate({
        outfitId: id,
        value: Number(ratingInput),
      });
    }
  };

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

  if (authSession && outfitData) {
    const { outfit, following, rating } = outfitData;

    return (
      <>
        <Head>
          <title>FitDetector</title>
        </Head>

        <main>
          <div>
            <h1>Outfit</h1>

            <Link href={`/celebrities/${outfit.celebrity.id}`}>
              <a>{outfit.celebrity.name}</a>
            </Link>
            {following && <p>Following</p>}

            <img src={outfit.image} />

            {outfit.description && (
              <>
                <h3>Description</h3>
                <p>{outfit.description}</p>
              </>
            )}

            {outfit.source && (
              <>
                <h3>Source</h3>
                {isValidHttpUrl(outfit.source) ? (
                  <a href={outfit.source}>{outfit.source}</a>
                ) : (
                  <p>{outfit.source}</p>
                )}
              </>
            )}

            {outfit.rating && <p>Rating: {outfit.rating}</p>}
            {rating ? (
              <p>Your rating: {rating}</p>
            ) : (
              <div>
                <label>
                  Your rating (1-10):{' '}
                  <input
                    type='number'
                    min='1'
                    max='10'
                    value={ratingInput}
                    onChange={(e) => setRatingInput(e.target.value)}
                  />
                </label>
                <button onClick={handleRatingSubmit}>Submit</button>
              </div>
            )}

            <p>
              Submitted by {outfit.user.name} on{' '}
              {outfit.createdAt.toLocaleString()}
            </p>
          </div>

          <div>
            <h2>Clothing</h2>
            {outfit.clothing.length ? (
              <ul>
                {outfit.clothing.map((clothing) => (
                  <li key={clothing.id}>
                    <h3>{clothing.type}</h3>
                    <p>Brand: {clothing.brand}</p>
                    {clothing.price && <p>Price: ${clothing.price}</p>}
                    <p>
                      Link: <a href={clothing.link}>{clothing.link}</a>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No submitted clothing</p>
            )}
            <Link href={`/submit-clothing/${outfit.id}`}>
              <button>Submit Clothing</button>
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

        <main>
          <div>
            <h1>Outfit</h1>

            <Link href={`/celebrities/${outfit.celebrity.id}`}>
              <a>{outfit.celebrity.name}</a>
            </Link>

            <img src={outfit.image} />

            {outfit.description && (
              <>
                <h3>Description</h3>
                <p>{outfit.description}</p>
              </>
            )}

            {outfit.source && (
              <>
                <h3>Source</h3>
                {isValidHttpUrl(outfit.source) ? (
                  <a href={outfit.source}>{outfit.source}</a>
                ) : (
                  <p>{outfit.source}</p>
                )}
              </>
            )}

            {outfit.rating && <p>Rating: {outfit.rating}</p>}

            <p>
              Submitted by {outfit.user.name} on{' '}
              {outfit.createdAt.toLocaleString()}
            </p>
          </div>

          <div>
            <h2>Clothing</h2>
            {outfit.clothing.length ? (
              <ul>
                {outfit.clothing.map((clothing) => (
                  <li key={clothing.id}>
                    <h3>{clothing.type}</h3>
                    <p>Brand: {clothing.brand}</p>
                    {clothing.price && <p>Price: ${clothing.price}</p>}
                    <p>
                      Link: <a href={clothing.link}>{clothing.link}</a>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No submitted clothing</p>
            )}
          </div>
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
        <p>There was an error retrieving outfit information</p>
      </main>
    </>
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

export default Outfit;
