import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';

const SubmitOutfit: NextPage = () => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
  });

  const outfitMutation = trpc.useMutation(['protected-outfit.create'], {
    onSuccess: (data) => {
      router.push('/');
    },
  });

  const [celebrityName, setCelebrityName] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');
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
      const image = uploadImageResBody.uploadedImageUrl;
      outfitMutation.mutate({ celebrityName, image, description, source });
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
            <h1 className='text-6xl font-extrabold text-gray-700 m-5'>
              <span className='text-purple-300'>Fit</span>Detector
            </h1>
          </a>
        </Link>

        <h2 className='text-2xl font-bold text-gray-700'>Submit Outfit</h2>

        <form className='flex flex-col gap-5 m-5' onSubmit={handleSubmit}>
          <label>
            <p className='text-lg font-medium'>Celebrity Name</p>
            <input
              type='text'
              placeholder='John Doe'
              value={celebrityName}
              onChange={(e) => {
                setCelebrityName(e.target.value);
              }}
              required
              className='my-3 px-3 py-2 border border-gray-300 rounded-md w-full'
            />
          </label>
          <label>
            <p className='text-lg font-medium'>Image</p>
            <input
              type='file'
              accept='image/*'
              ref={fileInput}
              className='my-3 px-3 py-2 border border-gray-300 rounded-md w-full'
              required
            />
          </label>
          <label>
            <p className='text-lg font-medium'>Description</p>
            <p className='text-sm font-normal'>
              Put a question about a particular piece of clothing here
              (optional)
            </p>
            <textarea
              placeholder='What hoodie is he wearing?'
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className='my-3 px-3 py-2 border border-gray-300 rounded-md w-full'
            />
          </label>
          <label>
            <p className='text-lg font-medium'>Source</p>
            <p className='text-sm font-normal'>
              Link where you found this image (optional)
            </p>
            <input
              type='text'
              placeholder='https://www.instagram.com/p/abc123/'
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
              }}
              className='my-3 px-3 py-2 border border-gray-300 rounded-md w-full'
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
