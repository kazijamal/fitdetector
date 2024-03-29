import Link from 'next/link';
import { signOut } from 'next-auth/react';

const AuthNavbar = () => {
  return (
    <nav className='navbar bg-base-200 no-animation'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <label tabIndex={0} className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52'
          >
            <li>
              <Link href='/following'>Following</Link>
            </li>
            <li>
              <Link href='/my-submissions'>Your Submissions</Link>
            </li>
            <li>
              <Link href='/api/auth/signout'>Sign Out</Link>
            </li>
          </ul>
        </div>
        <Link href='/' className='btn btn-ghost normal-case text-xl'>
          <span className='text-secondary'>Fit</span>Detector
        </Link>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal p-0'>
          <li>
            <Link href='/following'>Following</Link>
          </li>
          <li>
            <Link href='/my-submissions'>Your Submissions</Link>
          </li>
          <li>
            <a onClick={() => signOut()}>Sign Out</a>
          </li>
        </ul>
      </div>
      <div className='navbar-end'>
        <Link href='/submit-outfit' className='btn'>
          Submit an Outfit
        </Link>
      </div>
    </nav>
  );
};

export default AuthNavbar;
