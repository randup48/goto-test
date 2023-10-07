'use client';

import { GET_CONTACT_LIST, GET_PHONE_LIST } from '@/const';
import { useQuery, QueryResult } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import {
  FaCircleChevronRight,
  FaMagnifyingGlass,
  FaPlus,
} from 'react-icons/fa6';
import Link from 'next/link';
import { isIdInArray } from '@/function';
import Swal from 'sweetalert2';

export default function Home() {
  const [indexed, setIndexed] = useState(0);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<{
    contact: ListContact[];
    contact_aggregate: JumlahContact;
  }>({
    contact: [],
    contact_aggregate: { aggregate: { count: 0 } },
  });

  const {
    loading: loadAllContact,
    error: errorAllContact,
    data: dataAllContact,
    refetch: refetchAllContact,
  }: QueryResult<{
    contact: ListContact[];
    contact_aggregate: JumlahContact;
  }> = useQuery(GET_CONTACT_LIST);

  const {
    loading: loadSearch,
    error: errorSearch,
    data: dataSearch,
    refetch: refetchSearch,
  }: QueryResult<{
    phone: SearchContact[];
    phone_aggregate: JumlahContact;
  }> = useQuery(GET_PHONE_LIST);

  const handleSearch = async () => {
    const favContactsLocal =
      JSON.parse(localStorage.getItem('favContact')!) || [];

    try {
      const fetch1 = await refetchSearch({
        where: {
          contact: {
            first_name: {
              _like: `%${searchRef.current?.value ?? ''}%`,
            },
          },
        },
      });
      const fetch2 = await refetchSearch({
        where: {
          contact: {
            last_name: {
              _like: `%${searchRef.current?.value ?? ''}%`,
            },
          },
        },
      });

      const mergeFetch: {
        phone: SearchContact[];
        phone_aggregate: JumlahContact;
      } = {
        phone: [...fetch1.data.phone, ...fetch2.data.phone],
        phone_aggregate: {
          aggregate: {
            count:
              fetch1.data.phone_aggregate.aggregate.count +
              fetch2.data.phone_aggregate.aggregate.count,
          },
        },
      };

      console.log('mergeFetch', mergeFetch);

      const modifiedDataSearch: ListContact[] = mergeFetch.phone.map(item => ({
        id: item.contact.id,
        created_at: item.contact.created_at,
        first_name: item.contact.first_name,
        last_name: item.contact.last_name,
        phones: item.contact.phones,
        favorite: isIdInArray({
          array: favContactsLocal,
          id: item.contact.id,
        })
          ? true
          : false,
      }));

      if (searchRef.current?.value) {
        setData({
          contact: modifiedDataSearch,
          contact_aggregate: mergeFetch.phone_aggregate ?? {
            aggregate: { count: 0 },
          },
        });
      } else {
        setData({
          contact: fetch1.data.phone.map(item => ({
            id: item.contact.id,
            created_at: item.contact.created_at,
            first_name: item.contact.first_name,
            last_name: item.contact.last_name,
            phones: item.contact.phones,
            favorite: isIdInArray({
              array: favContactsLocal,
              id: item.contact.id,
            })
              ? true
              : false,
          })),
          contact_aggregate: fetch1.data.phone_aggregate,
        });
      }
    } catch (error) {
      console.error('Error search data:', error);
      Swal.fire(
        'Error',
        'An error occurred while searching the contact.',
        'error'
      );
    }

    console.log('fetch', fetch);
  };

  useEffect(() => {
    const dataLocal = JSON.parse(localStorage.getItem('dataContactList')!) || {
      contact: [],
      contact_aggregate: { aggregate: { count: 0 } },
    };
    const favContactsLocal =
      JSON.parse(localStorage.getItem('favContact')!) || [];

    if (dataAllContact) {
      const modifiedContact = dataAllContact.contact.map(item => ({
        ...item,
        favorite: isIdInArray({ array: favContactsLocal, id: item.id })
          ? true
          : false,
      }));
      const favContact: number[] = modifiedContact
        .filter(contact => contact.favorite)
        .map(contact => contact.id);

      setData({
        contact: modifiedContact,
        contact_aggregate: dataAllContact.contact_aggregate,
      });

      localStorage.setItem('dataContactList', JSON.stringify(dataAllContact));
      localStorage.setItem('favContact', JSON.stringify(favContact));
      refetchAllContact({ limit: 10, offset: indexed * 10 });
    } else {
      setData(dataLocal);
    }
  }, [indexed, dataAllContact, refetchAllContact]);

  const { contact, contact_aggregate } = data;
  const contactList = contact;
  const contactCount = contact_aggregate?.aggregate?.count || 0;

  if (loadAllContact) return <p>Loading...</p>;
  if (errorAllContact) return <p>Error: {errorAllContact.message}</p>;
  return (
    <div className='p-5 mx-auto max-w-screen-xl'>
      <section className='flex w-fit mx-auto mb-5'>
        <input
          className='px-5 py-3 rounded-lg sm:w-full'
          ref={searchRef}
          type='text'
          name=''
          id=''
          placeholder='Search...'
        />
        <button className='aspect-square  border' onClick={handleSearch}>
          <FaMagnifyingGlass />
        </button>
      </section>

      <section className='mb-5'>
        <h1 className='text-xl font-bold'>Favorite List</h1>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5 my-5'>
          {contactList.filter(contact => contact.favorite).length ? (
            contactList
              .filter(contact => contact.favorite)
              .map(contact => (
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
                    <p className='text-sm'>
                      {contact.phones[0]?.number ?? '-'}
                    </p>
                  </div>
                  <Link href={`${contact.id}`}>
                    <button className='w-[48px] h-[48px]'>
                      <p>
                        <FaCircleChevronRight />
                      </p>
                    </button>
                  </Link>
                </div>
              ))
          ) : (
            <p>such an empty space</p>
          )}
        </div>
      </section>

      <section>
        <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 mt-3'>
          <h1 className='text-xl font-bold'>Contact List</h1>
          <Link href={'add'} className='w-fit sm:ml-auto'>
            <button
              className='primaryBtn'
              // onClick={() => setAdd(!add)}
            >
              <FaPlus /> Contact
            </button>
          </Link>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5 my-5'>
          {contactList.filter(contact => !contact.favorite).length ? (
            contactList
              .filter(contact => !contact.favorite)
              .map((contact, index) => (
                <div
                  key={index}
                  className='grid items-center gap-3 grid-cols-[48px_1fr_auto] mb-3 sm:mb-0 rounded-lg'
                >
                  <p className='text-xl font-bold bg-green flex items-center justify-center rounded-full aspect-square'>
                    {contact.first_name[0]?.toUpperCase() ?? '-'}
                  </p>
                  <div>
                    <p className='font-semibold'>
                      {contact.first_name} ({contact.last_name})
                    </p>
                    <p className='text-sm'>
                      {contact.phones[0]?.number ?? '-'}
                    </p>
                  </div>
                  <Link href={`${contact.id}`}>
                    <button className='w-[48px] h-[48px]'>
                      <p>
                        <FaCircleChevronRight />
                      </p>
                    </button>
                  </Link>
                </div>
              ))
          ) : (
            <p>such an empty space</p>
          )}
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
