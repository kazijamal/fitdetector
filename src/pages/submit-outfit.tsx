import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { useState, useRef } from 'react';
import { trpc } from '../utils/trpc';

const SubmitOutfit: NextPage = () => {
  // const outfitMutation = trpc.useMutation(['outfit.create'], {
  //   onSuccess: (data) => {
  //     console.log(data);
  //   },
  // });

  const [name, setName] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || '');
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fileInput?.current?.files && fileInput.current.files[0]) {
      const outfitPhotoBase64 = await fileToBase64(fileInput.current.files[0]);
      const uploadImageRes = await fetch('/api/image-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: outfitPhotoBase64 }),
      });
      const uploadImageResBody = await uploadImageRes.json();
      const outfitPhoto = uploadImageResBody.uploadedImageUrl;
      // outfitMutation.mutate({ name, outfitPhoto });
    }
  };

  return (
    <>
      <Head>
        <title>FitDetector</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='container mx-auto flex flex-col items-center justify-center min-h-screen p-4'>
        <Link href='/'>
          <a>
            <h1 className='text-6xl font-extrabold text-gray-700 m-2'>
              <span className='text-purple-300'>Fit</span>Detector
            </h1>
          </a>
        </Link>
        <p className='text-lg text-gray-600 m-2 text-center'>
          Find out what clothes your favorite celebrities are wearing
        </p>

        <form className='flex flex-col gap-5 m-5' onSubmit={handleSubmit}>
          <label>
            <p className='text-lg font-medium'>Name</p>
            <input
              type='text'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
              className='my-3 px-3 py-2 border border-gray-300 rounded-md w-full'
            />
          </label>
          <label>
            <p className='text-lg font-medium'>Outfit Photo</p>
            <input
              type='file'
              accept='image/*'
              ref={fileInput}
              className='my-3 px-3 py-2 border border-gray-300 rounded-md w-full'
              required
            />
          </label>
          <button
            type='submit'
            className='bg-purple-400 hover:bg-purple-600 text-white py-2 px-4 rounded'
          >
            Submit Outfit
          </button>
        </form>
      </main>
    </>
  );
};

export default SubmitOutfit;
