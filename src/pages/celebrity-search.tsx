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

  return (
    <>
      <Head>
        <title>Celebrity Search - FitDetector</title>
      </Head>

      {authSession ? <AuthNavbar /> : <Navbar />}

      <main className='container mx-auto flex flex-col items-center p-4'>
        <h1 className='m-3 text-2xl font-bold'>Celebrity Search</h1>

        <form className='w-full max-w-md m-2' onSubmit={handleSearchSubmit}>
          <div className='relative'>
            <input
              type='search'
              className='input input-bordered p-4 w-full'
              placeholder='Search celebrities...'
              value={searchQueryInput}
              onChange={(e) => setSearchQueryInput(e.target.value)}
              required
            />
            <button
              type='submit'
              className='btn btn-primary btn-sm absolute right-2 bottom-2 px-4 py-2'
            >
              Search
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
                      <th># Outfits</th>
                      <th># Followers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {celebrities.map((celebrity) => (
                      <Link
                        href={`/celebrities/${celebrity.id}`}
                        key={celebrity.id}
                      >
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
    </>
  );
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
