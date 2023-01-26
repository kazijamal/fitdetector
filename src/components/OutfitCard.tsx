import Link from 'next/link';
import { Outfit, Celebrity } from '@prisma/client';

type OutfitCardProps = {
  outfit: Outfit & {
    celebrity: Celebrity;
  };
};

const OutfitCard = ({ outfit }: OutfitCardProps) => {
  return (
    <div className='card card-normal max-w-sm shadow-lg bg-base-200'>
      <img className='' src={outfit.image} alt='' />
      <div className='card-body'>
        <h2 className='card-title'>{outfit.celebrity.name}</h2>
        {outfit.description && <p className=''>{outfit.description}</p>}
        <p>Submitted on {outfit.createdAt.toLocaleString()}</p>
        <div className='card-actions justify-end pt-3'>
          <Link href={`/outfits/${outfit.id}`} className='btn btn-primary'>
            View Outfit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OutfitCard;
