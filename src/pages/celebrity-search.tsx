import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { getAuthSession } from '../server/common/get-server-session';
import MoonLoader from 'react-spinners/MoonLoader';

import AuthNavbar from '../components/AuthNavbar';
import Navbar from '../components/Navbar';

const CelebritySearch: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ authSession, query }) => {
  const utils = trpc.useContext();
  const [searchQuery, setSearchQuery] = useState(query.q);
  const [searchQueryInput, setSearchQueryInput] = useState(searchQuery);

  const {
    data: celebrities,
    isLoading,
    error,
  } = trpc.useQuery(['celebrity.search', { query: searchQuery }]);

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(searchQueryInput);
    utils.invalidateQueries(['celebrity.search']);
  };

  return <>
    <Head>
      <title>Celebrity Search - FitDetector</title>
    </Head>

    {authSession ? <AuthNavbar /> : <Navbar />}

    <main className='container mx-auto flex flex-col items-center p-4'>
      <h1 className='m-3 text-2xl font-bold text-center'>Celebrity Search</h1>

      <form
        className='w-full max-w-md m-2 form-control'
        onSubmit={handleSearchSubmit}
      >
        <div className='input-group'>
          <input
            type='text'
            className='input input-bordered w-full text-lg'
            placeholder='Search celebrities...'
            value={searchQueryInput}
            onChange={(e) => setSearchQueryInput(e.target.value)}
            required
          />
          <button className='btn btn-square' type='submit'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </button>
        </div>
      </form>

      <div className='m-5'>
        {isLoading && <MoonLoader />}
        {error && <p>There was an error retrieving recent outfits</p>}
        {celebrities &&
          (celebrities.length ? (
            <div className='overflow-x-auto'>
              <p className='text-center mb-4'>
                Click a celebrity to view their page
              </p>
              <table className='table w-full'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Rating</th>
                    <th>Outfits</th>
                    <th>Followers</th>
                  </tr>
                </thead>
                <tbody className='bg-base-200'>
                  {celebrities.map((celebrity) => (
                    <Link href={`/celebrities/${celebrity.id}`} key={celebrity.id} legacyBehavior>
                      <tr className='hover'>
                        <td>{celebrity.name}</td>
                        <td>{celebrity.rating ? celebrity.rating : 'N/A'}</td>
                        <td>{celebrity._count.outfits}</td>
                        <td>{celebrity._count.followers}</td>
                      </tr>
                    </Link>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No celebrities found matching your search</p>
          ))}
      </div>
    </main>
  </>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;
  const authSession = await getAuthSession(ctx);

  return {
    props: {
      authSession,
      query,
    },
  };
};

export default CelebritySearch;
