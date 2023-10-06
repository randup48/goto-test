'use client';

import { DELETE_CONTACT, EDIT_CONTACT, GET_CONTACT_DETAIL } from '@/const';
import { QueryResult, useMutation, useQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  FaPen,
  FaPlus,
  FaSdCard,
  FaStar,
  FaTrash,
  FaXmark,
} from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { EditPageController } from './controller';

type Props = {};

const Page = () => {
  const params: { id: string } = useParams();
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [contact, setContact] = useState<ListContact>();
  const [deleteContactMutation] = useMutation(DELETE_CONTACT);
  const [editContactMutation] = useMutation(EDIT_CONTACT);
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<
    { number: string; delete: boolean }[]
  >([{ number: '', delete: true }]);
  const _controllers = new EditPageController();

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

  const handlePhoneNumberChange = (index: number, value: string) => {
    const updatedPhoneNumbers = [...phoneNumbers];
    updatedPhoneNumbers[index].number = value;
    setPhoneNumbers(updatedPhoneNumbers);
  };

  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, { number: '', delete: true }]);
  };

  const handleRemovePhoneNumber = (index: number) => {
    const updatedPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updatedPhoneNumbers);
  };

  const handleDelete = async (contact: ListContact) => {
    const deleteContact: boolean = await _controllers.deleteContact({
      dataContact: contact,
      method: deleteContactMutation({
        variables: {
          id: contact.id,
        },
      }),
    });
    if (deleteContact) router.push('/');
  };

  const handleEditFirstLastName = async (e: React.FormEvent) => {
    e.preventDefault();
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    if (firstName && lastName && firstName.length && lastName.length) {
      const editContact: boolean = await _controllers.editFirstLastName({
        dataContact: {
          id: params.id,
          firstName: firstName!,
          lastName: lastName!,
        },
        method: editContactMutation({
          variables: {
            id: params.id,
            _set: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        }),
      });

      if (editContact) {
        setEdit(false);
      }
    } else {
      const result = await Swal.fire({
        icon: 'error',
        title: `First and Last Name Required`,
      });
    }
  };

  const handleSavePhoneNumber = async () => {};

  useEffect(() => {
    if (data) {
      setContact(data.contact_by_pk);
      setPhoneNumbers(
        data.contact_by_pk.phones.map(item => ({
          number: item.number,
          delete: false,
        }))
      );
    }
  }, [data]);

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
            onClick={() => handleDelete(contact!)}
            className='icon bg-yellow-200 !rounded-full hover:bg-yellow-300'
          >
            <FaStar className='fill-white' />
          </button>
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
                    value={phoneNumber.number}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handlePhoneNumberChange(index, e.target.value)
                    }
                  />

                  <div className='flex gap-1'>
                    <button
                      type='button'
                      className='p-2'
                      onClick={() => handleSavePhoneNumber()}
                    >
                      <FaSdCard className='fill-green' />
                    </button>
                    {phoneNumber.delete && (
                      <button
                        type='button'
                        className='p-2'
                        onClick={() => handleRemovePhoneNumber(index)}
                      >
                        <FaTrash className='fill-red-500' />
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

        <form onSubmit={handleEditFirstLastName} className='flex-auto'>
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
