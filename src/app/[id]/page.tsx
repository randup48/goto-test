'use client';

import { DELETE_CONTACT, GET_CONTACT_DETAIL } from '@/const';
import { QueryResult, useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaPen, FaPlus, FaTrash } from 'react-icons/fa6';
import Swal from 'sweetalert2';

const Page = ({ params }: { params: { id: string } }) => {
  // const router = useRouter();
  // const [contact, setContact] = useState<ListContact>();
  // const [edit, setEdit] = useState(false);
  // const [deleteContactMutation] = useMutation(DELETE_CONTACT);
  // const firstNameRef = useRef<HTMLInputElement | null>(null);
  // const lastNameRef = useRef<HTMLInputElement | null>(null);
  // const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  // const {
  //   loading,
  //   error,
  //   data: queryData,
  //   refetch,
  // }: QueryResult<{
  //   contact_by_pk: ListContact;
  // }> = useQuery(GET_CONTACT_DETAIL, {
  //   variables: {
  //     id: parseInt(params.id),
  //   },
  // });

  // const handlePhoneNumberChange = (index: number, value: string) => {
  //   const updatedPhoneNumbers = [...phoneNumbers];
  //   updatedPhoneNumbers[index] = value;
  //   setPhoneNumbers(updatedPhoneNumbers);
  // };

  // const handleAddPhoneNumber = () => {
  //   setPhoneNumbers([...phoneNumbers, '']);
  // };

  // const handleRemovePhoneNumber = (index: number) => {
  //   const updatedPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
  //   setPhoneNumbers(updatedPhoneNumbers);
  // };

  // const handleDelete = async (contact: ListContact) => {
  //   const result = await Swal.fire({
  //     title: `Do you want to delete ${contact.first_name}?`,
  //     showCancelButton: true,
  //     confirmButtonColor: 'red',
  //     confirmButtonText: 'Delete',
  //     focusCancel: true,
  //   });

  //   if (result.isConfirmed) {
  //     try {
  //       const { data } = await deleteContactMutation({
  //         variables: {
  //           id: contact.id,
  //         },
  //       });

  //       router.push('/');

  //       console.log('Contact delete:', data);
  //       Swal.fire('Delete!', '', 'success');
  //     } catch (error: any) {
  //       console.error('Error deleting contact:', error.message);
  //       Swal.fire(
  //         'Error',
  //         'An error occurred while deleting the contact.',
  //         'error'
  //       );
  //     }
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Handle form submission (e.g., send data to server)
  //   console.log('Form submitted:', {
  //     id: params.id,
  //     first_name: firstNameRef.current?.value,
  //     last_name: lastNameRef.current?.value,
  //   });
  // };

  // useEffect(() => {
  //   if (params.id !== 'add' && queryData) {
  //     setContact(queryData.contact_by_pk);
  //     refetch({ id: params.id });
  //   }
  // }, [params.id, queryData, refetch]);

  // if (loading && params.id !== 'add') return <p>Load detail data...</p>;
  // if (error && params.id !== 'add') return <p>Error: {error.message}</p>;
  return (
    <section>
      <Link href={'/'}>
        <button className='mb-3 ml-[-18px]'>
          <p>
            <FaChevronLeft />
          </p>
          <p>Back</p>
        </button>
      </Link>
      {/* {params.id === 'add' ? (
        <p className='text-2xl font-semibold mb-3 mt-5'>Add Contact</p>
      ) : (
        <div className='grid gap-7 items-center grid-cols-2 mb-7 '>
          <p className='w-[80px] text-white text-3xl font-bold bg-green-800 flex items-center justify-center rounded-full aspect-square'>
            {contact?.first_name[0]?.toUpperCase() ?? 'x-x'}
          </p>

          <div className='flex gap-3 ml-auto'>
            <button
              onClick={() => {
                setEdit(true);
              }}
              className='icon bg-blue-400 !rounded-full hover:bg-blue-500'
            >
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
      )}
      <form onSubmit={handleSubmit} className='grid gap-3'>
        <div className='grid grid-cols-2'>
          <div className=''>
            <p className='text-sm '>First Name</p>
            {!edit && params.id !== 'add' ? (
              <p className='text-xl font-medium'>
                {contact?.first_name ?? 'x-x'}
              </p>
            ) : (
              <input
                ref={firstNameRef}
                type='text'
                name='first_name'
                defaultValue={contact?.first_name}
              />
            )}
          </div>
          <div className='row-span-3'>
            <p className='text-sm '>Phone</p>
            {contact?.phones.map((phone, index) => (
              <p key={index} className='text-xl font-medium'>
                • {phone?.number ?? 'x-x'}
              </p>
            ))}
            {params.id === 'add' && (
              <>
                {phoneNumbers.map((phoneNumber, index) => (
                  <div key={index} className='flex gap-1 items-center'>
                    <input
                      className='mb-1'
                      name='number'
                      type='number'
                      value={phoneNumber}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handlePhoneNumberChange(index, e.target.value)
                      }
                    />
                    {index > 0 && (
                      <button
                        type='button'
                        onClick={() => handleRemovePhoneNumber(index)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type='button'
                  onClick={handleAddPhoneNumber}
                  className='px-1'
                >
                  <FaPlus /> Phone Number
                </button>
              </>
            )}
          </div>
          <div className=''>
            <p className='text-sm '>Last Name</p>
            {!edit && params.id !== 'add' ? (
              <p className='text-xl font-medium'>
                {contact?.last_name ?? 'x-x'}
              </p>
            ) : (
              <input
                ref={lastNameRef}
                type='text'
                name='last_name'
                defaultValue={contact?.last_name}
              />
            )}
          </div>
          {(edit || params.id === 'add') && (
            <div className='flex gap-3'>
              {params.id !== 'add' && (
                <button
                  onClick={() => setEdit(false)}
                  type='reset'
                  className='outlineBtn'
                >
                  Cancel
                </button>
              )}
              <button type='submit' className='primaryBtn'>
                Submit
              </button>
            </div>
          )}
        </div>
      </form> */}
    </section>
  );
};

export default Page;
