'use client';

import { ADD_CONTACT } from '@/const';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useRef, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { AddPageController } from './controller';
import { formFirstLastNameValidator } from '@/function';

const Page = () => {
  const router = useRouter();
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [addContactMutation] = useMutation(ADD_CONTACT);
  const _controllers = new AddPageController();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;

    const validation = formFirstLastNameValidator({
      firstName: firstName,
      lastName: lastName,
    });

    if (validation) {
      try {
        const { data } = await addContactMutation({
          variables: {
            first_name: firstName,
            last_name: lastName,
            phones: phoneNumbers.map(phoneNumber => ({
              number: phoneNumber,
            })),
          },
        });

        console.log('Contact Add:', data);
        if (data) {
          Swal.fire('Add!', '', 'success');
          router.push('/');
        }
      } catch (error: any) {
        console.error('Error add contact:', error.message);
        Swal.fire(
          'Error',
          'An error occurred while adding the contact.',
          'error'
        );
      }
    }
  };
  return (
    <div>
      <p className='text-2xl font-semibold mb-3 mt-5'>Add Contact</p>

      <form onSubmit={handleSubmit}>
        <div className='flex flex-col sm:flex-row gap-3 mb-5'>
          <section className='flex-auto'>
            <p className='text-sm '>Phone</p>

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
              className='px-1 hover:bg-[unset]'
            >
              <p>
                <FaPlus />
              </p>
              <p> Phone Number</p>
            </button>
          </section>
          <section className='flex-auto'>
            <div className=''>
              <p className='text-sm '>First Name</p>

              <input ref={firstNameRef} type='text' name='first_name' />
            </div>
            <div className=''>
              <p className='text-sm '>Last Name</p>

              <input ref={lastNameRef} type='text' name='last_name' />
            </div>
          </section>
        </div>

        <button type='submit' className='primaryBtn'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
