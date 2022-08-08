import type { NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { getAuthSession } from '../../server/common/get-server-session';

const SubmitClothing: NextPage = () => {
  const router = useRouter();
  const outfitId =
    typeof router.query.outfitId === 'string' ? router.query.outfitId : '';
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');

  const clothingMutation = trpc.useMutation(['clothing.create'], {
    onSuccess: (data) => {
      router.push(`/outfits/${data.outfitId}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clothingMutation.mutate({
      outfitId,
      type,
      brand,
      price: price === '' ? null : Number(price),
      link,
    });
  };

  return (
    <>
      <Head>
        <title>Submit Clothing | FitDetector</title>
      </Head>

      <main className='container mx-auto flex flex-col items-center justify-center min-h-screen p-4'>
        <h1 className='text-3xl font-bold text-gray-700'>Submit Clothing</h1>

        <form className='flex flex-col gap-5 m-5' onSubmit={handleSubmit}>
          <label>
            <p className='text-lg font-medium'>Clothing Type</p>
            <input
              type='text'
              placeholder='Jacket'
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
              required
              className='my-3 px-3 py-2 border border-gray-300 rounded-md w-full'
            />
          </label>
          <label>
            <p className='text-lg font-medium'>Brand</p>
            <input
              type='text'
              placeholder='Nike'
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
              }}
              required
              className='my-3 px-3 py-2 border border-gray-300 rounded-md w-full'
            />
          </label>
          <label>
            <p className='text-lg font-medium'>Price</p>
            <p className='text-sm font-normal'>in USD (optional)</p>
            <input
              type='number'
              placeholder='59.99'
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              className='my-3 px-3 py-2 border border-gray-300 rounded-md w-full'
            />
          </label>
          <label>
            <p className='text-lg font-medium'>Link to Clothing</p>
            <input
              type='text'
              placeholder='https://www.ssense.com/en-us/men/product/nike/gray-solo-swoosh-sweatshirt/10205041'
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
              }}
              required
              className='my-3 px-3 py-2 border border-gray-300 rounded-md w-full'
            />
          </label>
          <button
            type='submit'
            className='bg-purple-400 hover:bg-purple-600 text-white py-2 px-4 rounded'
          >
            Submit Clothing
          </button>
        </form>
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

export default SubmitClothing;
