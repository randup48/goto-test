'use client';

import { GET_CONTACT_LIST } from '@/const';
import { useQuery, QueryResult } from '@apollo/client';
import { useEffect, useState } from 'react';
import { FaCircleChevronRight, FaPlus } from 'react-icons/fa6';
import Link from 'next/link';

export default function Home() {
  const [indexed, setIndexed] = useState(0);
  const [data, setData] = useState<{
    contact: ListContact[];
    contact_aggregate: JumlahContact;
  }>({
    contact: [],
    contact_aggregate: { aggregate: { count: 0 } },
  });

  const {
    loading,
    error,
    data: queryData,
    refetch,
  }: QueryResult<{
    contact: ListContact[];
    contact_aggregate: JumlahContact;
  }> = useQuery(GET_CONTACT_LIST, {
    variables: {
      limit: 10,
      offset: indexed * 10,
    },
  });

  useEffect(() => {
    const dataLocal = JSON.parse(localStorage.getItem('dataContactList')!) || {
      contact: [],
      contact_aggregate: { aggregate: { count: 0 } },
    };

    if (queryData) {
      setData(queryData);

      localStorage.setItem('dataContactList', JSON.stringify(queryData));
      refetch({ limit: 10, offset: indexed * 10 });
    } else {
      setData(dataLocal);
    }
  }, [queryData, indexed, refetch]);

  const { contact, contact_aggregate } = data;
  const contactList = contact.map(item => ({ ...item, favorite: false }));
  const contactCount = contact_aggregate?.aggregate?.count || 0;

  if (loading && !data.contact.length) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className='p-5 mx-auto max-w-screen-xl'>
      <section className='mb-5'>
        <h1 className='text-xl font-bold'>Favorite List</h1>
        <p>Such an empty</p>
      </section>

      <section>
        <h1 className='text-xl font-bold'>Contact List</h1>

        <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 mt-3'>
          <input className='sm:mr-auto' type='text' name='' id='' />
          <Link href={'add'}>
            <button
              className='primaryBtn sm:ml-auto'
              // onClick={() => setAdd(!add)}
            >
              <FaPlus /> Contact
            </button>
          </Link>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5 my-5'>
          {contactList.map(contact => (
            <div
              key={contact.id}
              className='grid items-center gap-3 grid-cols-[48px_1fr_auto] mb-3 sm:mb-0 rounded-lg'
            >
              <p className='text-xl font-bold bg-green flex items-center justify-center rounded-full aspect-square'>
                {contact.first_name[0].toUpperCase()}
              </p>
              <div>
                <p className='font-semibold'>
                  {contact.first_name} ({contact.last_name})
                </p>
                <p className='text-sm'>{contact.phones[0]?.number ?? '-'}</p>
              </div>
              <Link href={`${contact.id}`}>
                <button className='w-[48px] h-[48px]'>
                  <p>
                    <FaCircleChevronRight />
                  </p>
                </button>
              </Link>
            </div>
          ))}
        </div>

        <div className='w-fit mx-auto flex gap-3'>
          {Array.from({ length: Math.ceil(contactCount / 10) }, (_, index) => (
            <button
              className={`border ${
                indexed === index ? 'bg-green' : ''
              } rounded-lg px-4 py-2 ${
                indexed === index ? 'cursor-[unset]' : 'cursor-pointer'
              } ${indexed === index ? 'hover:bg-green' : ''}`}
              key={index + 1}
              onClick={() => setIndexed(index)}
            >
              <p className='font-semibold'> {index + 1}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
