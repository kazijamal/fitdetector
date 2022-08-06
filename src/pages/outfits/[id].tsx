import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import MoonLoader from 'react-spinners/MoonLoader';
import { isValidHttpUrl } from '../../utils/utils';
import Link from 'next/link';
import { useState } from 'react';

const Outfit: NextPage = () => {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const { status } = useSession();

  const utils = trpc.useContext();
  const { data: outfitData } = trpc.useQuery(['outfit.getById', { id }]);
  const outfitRatingMutation = trpc.useMutation(['outfit.createRating'], {
    onSuccess: (data) => {
      utils.invalidateQueries(['outfit.getById']);
    },
  });

  const [ratingInput, setRatingInput] = useState('');

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

  if (status === 'authenticated' && outfitData) {
    const { outfit, follows, rating } = outfitData;

    return (
      <>
        <Head>
          <title>FitDetector</title>
        </Head>

        <main>
          <div>
            <h1>Outfit</h1>

            <h2>{outfit.celebrity.name}</h2>
            {follows && <p>Following</p>}

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
              outfit.clothing.map((clothing) => (
                <div key={clothing.id}>
                  <h3>{clothing.type}</h3>
                  <p>Brand: {clothing.brand}</p>
                  {clothing.price && <p>Price: ${clothing.price}</p>}
                  <p>
                    Link: <a href={clothing.link}>{clothing.link}</a>
                  </p>
                </div>
              ))
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

  if (status === 'unauthenticated' && outfitData) {
    const { outfit } = outfitData;

    return (
      <>
        <Head>
          <title>FitDetector</title>
        </Head>

        <main>
          <div>
            <h1>Outfit</h1>

            <h2>{outfit.celebrity.name}</h2>

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
              outfit.clothing.map((clothing) => (
                <div key={clothing.id}>
                  <h3>{clothing.type}</h3>
                  <p>Brand: {clothing.brand}</p>
                  {clothing.price && <p>Price: ${clothing.price}</p>}
                  <p>
                    Link: <a href={clothing.link}>{clothing.link}</a>
                  </p>
                </div>
              ))
            ) : (
              <p>No submitted clothing</p>
            )}
          </div>
        </main>
      </>
    );
  }

  return <MoonLoader />;
};

export default Outfit;
