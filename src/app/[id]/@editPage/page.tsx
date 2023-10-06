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
import { formFirstLastNameValidator, isIdInArray } from '@/function';

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

  const handleDeleteContact = async (contact: ListContact) => {
    const result = await Swal.fire({
      icon: 'question',
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

        console.log('Contact delete:', data);
        if (data) {
          Swal.fire('Delete!', '', 'success');
          router.push('/');
        }
      } catch (error: any) {
        console.error('Error delete contact:', error.message);
        Swal.fire(
          'Error',
          'An error occurred while deleting the contact.',
          'error'
        );
        return false;
      }
    }
  };

  const handleEditFirstLastName = async (e: React.FormEvent) => {
    e.preventDefault();
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const validation = formFirstLastNameValidator({
      firstName: firstName,
      lastName: lastName,
    });

    if (validation) {
      try {
        const result = await Swal.fire({
          title: `Do you want to change data?`,
          showCancelButton: true,
          focusCancel: true,
        });

        if (result.isConfirmed) {
          try {
            const { data } = await editContactMutation({
              variables: {
                id: params.id,
                _set: {
                  first_name: firstName,
                  last_name: lastName,
                },
              },
            });

            console.log('Contact edit:', data);
            if (data) {
              Swal.fire('Edit!', '', 'success');
              setEdit(false);
            }
          } catch (error: any) {
            console.error('Error edit contact:', error.message);
            Swal.fire(
              'Error',
              'An error occurred while editing the contact.',
              'error'
            );
          }
        }
      } catch (error: any) {
        console.error('Error editing contact:', error.message);
        Swal.fire(
          'Error',
          'An error occurred while editing the contact.',
          'error'
        );
      }
    }
  };

  const handleAddRemoveFavorite = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: `Do you want to ${contact?.favorite ? 'unfavorite' : 'favorite'} ${
        contact?.first_name
      }?`,
      showCancelButton: true,
      // confirmButtonColor: 'yellow',
      confirmButtonText: 'Yes',
      focusCancel: true,
    });

    if (result.isConfirmed) {
      const favContactsLocal: number[] =
        JSON.parse(localStorage.getItem('favContact')!) || [];

      if (
        !isIdInArray({
          array: favContactsLocal,
          id: parseInt(params.id),
        })
      ) {
        favContactsLocal.push(parseInt(params.id));
        console.log('a', favContactsLocal);
        localStorage.setItem('favContact', JSON.stringify(favContactsLocal));
        Swal.fire('Favorite!', '', 'success');
        setContact(prevContact => {
          if (prevContact) {
            return { ...prevContact, favorite: !prevContact.favorite };
          }
          return prevContact;
        });
      } else {
        localStorage.setItem(
          'favContact',
          JSON.stringify(favContactsLocal.filter(item => item !== contact?.id))
        );
        Swal.fire('Unfavorite!', '', 'success');
        setContact(prevContact => {
          if (prevContact) {
            return { ...prevContact, favorite: !prevContact.favorite };
          }
          return prevContact;
        });
      }
    }
  };

  const handleSavePhoneNumber = async () => {};

  useEffect(() => {
    const favContactsLocal =
      JSON.parse(localStorage.getItem('favContact')!) || [];
    const checkFavorite = isIdInArray({
      array: favContactsLocal,
      id: parseInt(params.id),
    });

    if (data) {
      setContact({ ...data.contact_by_pk, favorite: checkFavorite });
      setPhoneNumbers(
        data.contact_by_pk.phones.map(item => ({
          number: item.number,
          delete: false,
        }))
      );
    }
  }, [data, params.id]);

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
            onClick={handleAddRemoveFavorite}
            className='icon bg-yellow-200 !rounded-full hover:bg-yellow-300'
          >
            <FaStar
              className={contact?.favorite ? 'fill-brown' : 'fill-white'}
            />
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
            onClick={() => handleDeleteContact(contact!)}
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
                className='px-1 hover:bg-[unset]'
              >
                <p>
                  <FaPlus />
                </p>
                <p> Phone Number</p>
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
