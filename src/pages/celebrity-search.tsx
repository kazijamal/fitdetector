import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import MoonLoader from 'react-spinners/MoonLoader';

const CelebritySearch: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const utils = trpc.useContext();
  const [query, setQuery] = useState(props.query.q);
  const [searchQueryInput, setSearchQueryInput] = useState(query);

  const {
    data: celebrities,
    isLoading,
    error,
  } = trpc.useQuery(['celebrity.search', { query }]);

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery(searchQueryInput);
    utils.invalidateQueries(['celebrity.search']);
  };

  return (
    <>
      <Head>
        <title>Celebrity Search - FitDetector</title>
      </Head>

      <main>
        <h1>Celebrity Search</h1>

        <form className='w-full max-w-md m-3' onSubmit={handleSearchSubmit}>
          <label className='mb-2 text-sm font-medium text-gray-900 sr-only'>
            Search
          </label>
          <div className='relative'>
            <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
              <svg
                aria-hidden='true'
                className='w-5 h-5 text-gray-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                ></path>
              </svg>
            </div>
            <input
              type='search'
              className='block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-purple-300 focus:border-purple-300'
              placeholder='Search Celebrities...'
              value={searchQueryInput}
              onChange={(e) => setSearchQueryInput(e.target.value)}
            />
            <button
              type='submit'
              className='text-white absolute right-2.5 bottom-2.5 bg-purple-400 hover:bg-purple-600 focus:ring-4 focus:outline-none focus:ring-purple-200 font-medium rounded-lg text-sm px-4 py-2'
            >
              Search
            </button>
          </div>
        </form>

        {isLoading && <MoonLoader />}
        {error && <p>There was an error retrieving recent outfits</p>}
        {celebrities &&
          (celebrities.length ? (
            <ul>
              {celebrities.map((celebrity) => (
                <li key={celebrity.id}>
                  <Link href={`/celebrities/${celebrity.id}`}>
                    <a>{celebrity.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No celebrities found matching your search</p>
          ))}
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  return { props: { query } };
};

export default CelebritySearch;
