import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import { MoonLoader } from 'react-spinners';
import Link from 'next/link';

type OutfitCardProps = {
  id: string;
  image: string;
  celebrity: string;
  description: string | null;
};

const MySubmissions: NextPage = () => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
  });

  const { data: outfits } = trpc.useQuery(['outfit.mySubmissions']);

  if (outfits) {
    return (
      <>
        <Head>
          <title>FitDetector</title>
        </Head>

        <main>
          <h1>Outfits you submitted</h1>
          {outfits.map((outfit) => (
            <OutfitCard
              id={outfit.id}
              image={outfit.image}
              celebrity={outfit.celebrity.name}
              description={outfit.description}
              key={outfit.id}
            />
          ))}
        </main>
      </>
    );
  }

  return <MoonLoader />;
};

const OutfitCard = ({ id, image, celebrity, description }: OutfitCardProps) => {
  return (
    <div className='max-w-xs rounded overflow-hidden shadow-lg'>
      <img className='w-full' src={image} />
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>{celebrity}</div>
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

export default MySubmissions;
