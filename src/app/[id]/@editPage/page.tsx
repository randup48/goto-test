'use client';

import { DELETE_CONTACT, GET_CONTACT_DETAIL } from '@/const';
import { QueryResult, useMutation, useQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FaPen, FaPlus, FaSdCard, FaTrash, FaXmark } from 'react-icons/fa6';
import Swal from 'sweetalert2';

type Props = {};

const Page = () => {
  const params: { id: string } = useParams();
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [contact, setContact] = useState<ListContact>();
  const [deleteContactMutation] = useMutation(DELETE_CONTACT);
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);

  const {
    loading,
    error,
    data,
  }: QueryResult<{
    contact_by_pk: ListContact;
  }> = useQuery(GET_CONTACT_DETAIL, {
    variables: {
      id: parseInt(params.id),
    },
  });

  useEffect(() => {
    if (data) {
      setContact(data.contact_by_pk);
      setPhoneNumbers(data.contact_by_pk.phones.map(item => item.number));
    }
  }, [data]);

  const handlePhoneNumberChange = (index: number, value: string) => {
    const updatedPhoneNumbers = [...phoneNumbers];
    updatedPhoneNumbers[index] = value;
    setPhoneNumbers(updatedPhoneNumbers);
  };

  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, '']);
  };

  const handleRemovePhoneNumber = (index: number) => {
    const updatedPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updatedPhoneNumbers);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    try {
      // const { data } = await addContactMutation({
      //   variables: {
      //     first_name: firstName,
      //     last_name: lastName,
      //     phones: phoneNumbers.map(phoneNumber => ({
      //       number: phoneNumber,
      //     })),
      //   },
      // });

      // if (data) {
      //   Swal.fire('Contact Added!', '', 'success');
      //   router.push('/');
      // }
      console.log('Contact added:', data);
    } catch (error: any) {
      console.error('Error adding contact:', error.message);
      Swal.fire(
        'Error',
        'An error occurred while deleting the contact.',
        error.message
      );
    }
  };

  const handleSavePhoneNumber = async () => {};

  if (loading) return <p>Load detail data...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <div className='grid gap-7 items-center grid-cols-2 mb-7 '>
        <p className='w-[80px] bg-green text-3xl font-bold bg-green-800 flex items-center justify-center rounded-full aspect-square'>
          {contact?.first_name[0]?.toUpperCase() ?? 'x-x'}
        </p>

        <section className='flex gap-3 ml-auto'>
          <button
            onClick={() => {
              setEdit(!edit);
            }}
            className='icon bg-blue-400 !rounded-full hover:bg-blue-500'
          >
            {edit ? (
              <FaXmark className='fill-white' />
            ) : (
              <FaPen className='fill-white' />
            )}
          </button>
          <button
            onClick={() => handleDelete(contact!)}
            className='icon bg-red-400 !rounded-full hover:bg-red-500'
          >
            <FaTrash className='fill-white' />
          </button>
        </section>
      </div>

      <div className='flex flex-col sm:flex-row gap-3 mb-5'>
        <section className='flex-auto'>
          <p className='text-sm '>Phone</p>

          {!edit ? (
            <>
              {contact?.phones.map((phone, index) => (
                <p key={index} className='text-xl font-medium'>
                  • {phone?.number ?? 'x-x'}
                </p>
              ))}
            </>
          ) : (
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

                  <div className='flex gap-1'>
                    <button
                      type='button'
                      onClick={() => handleSavePhoneNumber()}
                    >
                      <FaSdCard />
                    </button>
                    {phoneNumber === '' && (
                      <button
                        type='button'
                        onClick={() => handleRemovePhoneNumber(index)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
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
        </section>

        <form onSubmit={handleSubmit} className='flex-auto'>
          <section>
            <div className=''>
              <p className='text-sm '>First Name</p>

              {!edit ? (
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
            <div className=''>
              <p className='text-sm '>Last Name</p>

              {!edit ? (
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
            {edit && (
              <button type='submit' className='primaryBtn mt-5'>
                Submit
              </button>
            )}
          </section>
        </form>
      </div>
    </div>
  );
};

export default Page;
