'use client';

import { DELETE_CONTACT, GET_CONTACT_DETAIL } from '@/const';
import { QueryResult, useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaPen, FaTrash } from 'react-icons/fa6';
import Swal from 'sweetalert2';

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [contact, setContact] = useState<ListContact>();
  const [deleteContactMutation] = useMutation(DELETE_CONTACT);
  const {
    loading,
    error,
    data: queryData,
    refetch,
  }: QueryResult<{
    contact_by_pk: ListContact;
  }> = useQuery(GET_CONTACT_DETAIL, {
    variables: {
      id: parseInt(params.id),
    },
  });

  const handleDelete = async (contact: ListContact) => {
    const result = await Swal.fire({
      title: `Do you want to delete ${contact.first_name}?`,
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Delete',
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        const { data } = await deleteContactMutation({
          variables: {
            id: contact.id,
          },
        });

        router.push('/');

        console.log('Contact delete:', data);
        Swal.fire('Delete!', '', 'success');
      } catch (error: any) {
        console.error('Error deleting contact:', error.message);
        Swal.fire(
          'Error',
          'An error occurred while deleting the contact.',
          'error'
        );
      }
    }
  };

  useEffect(() => {
    if (queryData) {
      setContact(queryData.contact_by_pk);
      refetch({ id: params.id });
    }
  }, [params.id, queryData, refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className='m-5 mx-auto max-w-screen-lg'>
      <Link href={'/'}>
        <button className='mb-3'>
          <FaChevronLeft /> Back
        </button>
      </Link>
      <div
        key={contact?.id ?? 'x-x'}
        className='grid gap-7 items-center grid-cols-2 mb-7 '
      >
        <p className='w-[80px] text-3xl font-bold bg-yellow-100 flex items-center justify-center rounded-full aspect-square'>
          {contact?.first_name[0]?.toUpperCase() ?? 'x-x'}
        </p>
        <div className='flex gap-3 ml-auto'>
          <button className='icon bg-blue-400 !rounded-full hover:bg-blue-500'>
            <FaPen className='fill-white' />
          </button>
          <button
            onClick={() => handleDelete(contact!)}
            className='icon bg-red-400 !rounded-full hover:bg-red-500'
          >
            <FaTrash className='fill-white' />
          </button>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-y-3'>
        <div className=''>
          <p className='text-sm text-gray-400'>First Name</p>
          <p className='text-xl'>{contact?.first_name ?? 'x-x'}</p>
        </div>
        <div className=''>
          <p className='text-sm text-gray-400'>Last Name</p>
          <p className='text-xl'>{contact?.last_name ?? 'x-x'}</p>
        </div>
        <div className=''>
          <p className='text-sm text-gray-400'>Phone</p>
          {contact?.phones.map((phone, index) => (
            <p key={index} className='text-xl'>
              - {phone?.number ?? 'x-x'}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
