'use client';

import Link from 'next/link';
import React from 'react';
import { FaChevronLeft } from 'react-icons/fa6';

const Page = () => {
  return (
    <section>
      <Link href={'/'}>
        <button className='mb-3 ml-[-18px] hover:bg-[unset]'>
          <p>
            <FaChevronLeft />
          </p>
          <p>Back</p>
        </button>
      </Link>
    </section>
  );
};

export default Page;
