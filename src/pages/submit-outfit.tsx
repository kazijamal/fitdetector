import type { NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import { api } from '../utils/api';
import { getServerAuthSession } from '../server/auth';
import { fileToBase64 } from '../utils/utils';

import AuthNavbar from '../components/AuthNavbar';

const SubmitOutfit: NextPage = () => {
  const router = useRouter();
  const [celebrityName, setCelebrityName] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const outfitMutation = api.outfit.create.useMutation({
    onSuccess: (data) => {
      router.push(`/outfits/${data.id}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fileInput?.current?.files && fileInput.current.files[0]) {
      const inputPhotoBase64 = await fileToBase64(fileInput.current.files[0]);
      const uploadImageRes = await fetch('/api/image-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: inputPhotoBase64 }),
      });
      const uploadImageResBody = await uploadImageRes.json();
      const image = uploadImageResBody.uploadedImageUrl;
      outfitMutation.mutate({ celebrityName, image, description, source });
    }
  };

  return (
    <>
      <Head>
        <title>Submit Outfit - FitDetector</title>
      </Head>

      <AuthNavbar />

      <main className='container mx-auto flex flex-col items-center min-h-screen py-8 px-4'>
        <h1 className='text-3xl font-bold'>Submit Outfit</h1>

        <form
          className='flex flex-col gap-5 my-5 w-full max-w-md'
          onSubmit={handleSubmit}
        >
          <label>
            <p className='text-xl'>Celebrity Name</p>
            <input
              type='text'
              placeholder='John Doe'
              value={celebrityName}
              onChange={(e) => {
                setCelebrityName(e.target.value);
              }}
              required
              className='input input-bordered w-full mt-3 text-lg'
            />
          </label>
          <label>
            <p className='text-xl'>Image</p>
            <input
              type='file'
              accept='image/*'
              ref={fileInput}
              className='w-full mt-3 file:btn file:mr-3 text-lg'
              required
            />
          </label>
          <label>
            <p className='text-xl'>Description</p>
            <p className='text-sm font-light'>
              Put a question about a particular piece of clothing or any other
              information here (optional)
            </p>
            <textarea
              placeholder='What hoodie is he wearing?'
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className='textarea textarea-bordered w-full mt-3 text-lg'
            />
          </label>
          <label>
            <p className='text-xl'>Source</p>
            <p className='text-sm font-light'>
              Link where you found this image (optional)
            </p>
            <input
              type='text'
              placeholder='https://www.instagram.com/p/abc123/'
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
              }}
              className='input input-bordered w-full mt-3 text-lg'
            />
          </label>
          <button type='submit' className='btn btn-primary'>
            Submit Outfit
          </button>
        </form>
      </main>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const authSession = await getServerAuthSession(ctx);

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

export default SubmitOutfit;
