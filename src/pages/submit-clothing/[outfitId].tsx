import type { NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { getAuthSession } from '../../server/common/get-server-session';

import AuthNavbar from '../../components/AuthNavbar';

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

      <AuthNavbar />

      <main className='container mx-auto flex flex-col items-center min-h-screen py-8 px-4'>
        <h1 className='text-3xl font-bold'>Submit Clothing</h1>

        <form
          className='flex flex-col gap-5 my-5 w-full max-w-md'
          onSubmit={handleSubmit}
        >
          <label>
            <p className='text-xl'>Clothing Type</p>
            <input
              type='text'
              placeholder='Jacket'
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
              required
              className='input input-bordered w-full mt-3 text-lg'
            />
          </label>
          <label>
            <p className='text-xl'>Brand</p>
            <input
              type='text'
              placeholder='Nike'
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
              }}
              required
              className='input input-bordered w-full mt-3 text-lg'
            />
          </label>
          <label>
            <p className='text-xl'>Price</p>
            <p className='text-sm font-light'>in USD (optional)</p>
            <input
              type='number'
              placeholder='129.99'
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              className='input input-bordered w-full mt-3 text-lg'
            />
          </label>
          <label>
            <p className='text-xl'>Link to Clothing</p>
            <input
              type='text'
              placeholder='https://www.nike.com/t/sportswear-tech-fleece-mens-full-zip-hoodie-5ZtTtk'
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
              }}
              required
              className='input input-bordered w-full mt-3 text-lg'
            />
          </label>
          <button type='submit' className='btn btn-primary'>
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
