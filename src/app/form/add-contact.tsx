import { ADD_CONTACT } from '@/const';
import { useMutation, useQuery } from '@apollo/client';
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa6';

const AddContactForm = ({ value }: { value?: ListContact }) => {
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const [firstName, setFirstName] = useState<string | undefined>();
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const [lastName, setLastName] = useState<string | undefined>();
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [isValid, setIsValid] = useState(true);
  const [addContactMutation] = useMutation(ADD_CONTACT);

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
    // Handle form submission (e.g., send data to server)
    // console.log('Form submitted:', {
    //   first_name: firstNameRef.current?.value,
    //   last_name: lastNameRef.current?.value,
    //   phones: phoneNumbers.map(phoneNumber => ({
    //     number: phoneNumber,
    //   })),
    // });
    setIsValid(true);
    const regex = /^[a-zA-Z\s]+$/;

    // Validate first name
    const firstName = firstNameRef.current?.value;
    if (!(firstName && regex.test(firstName))) {
      setIsValid(false);
      return;
    }

    // Validate last name
    const lastName = lastNameRef.current?.value;
    if (!(lastName && regex.test(lastName))) {
      setIsValid(false);
      return;
    }

    try {
      if (value === undefined) {
        const { data } = await addContactMutation({
          variables: {
            first_name: firstName,
            last_name: lastName,
            phones: phoneNumbers.map(phoneNumber => ({
              number: phoneNumber,
            })),
          },
        });

        console.log('Contact added:', data);
      } else {
      }
    } catch (error: any) {
      console.error('Error adding contact:', error.message);
    }
  };

  useEffect(() => {
    setFirstName(value?.first_name);
    setLastName(value?.last_name);
    setPhoneNumbers(value?.phones.map(phone => phone.number) ?? ['']);
  }, [value]);

  return (
    <form onSubmit={handleSubmit} className='border mt-5 p-5'>
      <h1>Add New Contact</h1>
      <br />
      <div className='grid sm:grid-cols-2  gap-3 '>
        <label>
          First Name:
          <div className=''>
            <input
              name='first_name'
              type='text'
              ref={firstNameRef}
              value={firstName}
            />
            {!isValid && (
              <p style={{ color: 'red' }}>Name can only contain letters.</p>
            )}
          </div>
        </label>
        <label>
          Last Name:
          <div className=''>
            <input
              name='last_name'
              type='text'
              ref={lastNameRef}
              value={lastName}
            />
            {!isValid && (
              <p style={{ color: 'red' }}>Name can only contain letters.</p>
            )}
          </div>
        </label>
        <label>
          Phone Numbers:
          {phoneNumbers.map((phoneNumber, index) => (
            <div key={index} className='flex gap-1 items-center'>
              <input
                className='mb-1'
                name='number'
                type='number'
                value={phoneNumber}
                disabled={value ? true : false}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handlePhoneNumberChange(index, e.target.value)
                }
              />
              {!value && index > 0 && (
                <button
                  type='button'
                  onClick={() => handleRemovePhoneNumber(index)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          {!value && (
            <button
              type='button'
              onClick={handleAddPhoneNumber}
              className='px-1'
            >
              <FaPlus /> Phone Number
            </button>
          )}
        </label>
      </div>
      <button className='ml-auto mr-0 border rounded-lg ' type='submit'>
        Submit
      </button>
    </form>
  );
};

export default AddContactForm;
