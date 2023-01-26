import Link from 'next/link';
import { signIn } from 'next-auth/react';

const Navbar = () => {
  return (
    <nav className='navbar bg-base-200 no-animation'>
      <div className='navbar-start'>
        <Link href='/' className='btn btn-ghost normal-case text-xl'>

          <span className='text-secondary'>Fit</span>Detector
        </Link>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal p-0'></ul>
      </div>
      <div className='navbar-end'>
        <a onClick={() => signIn()} className='btn'>
          Sign In
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
