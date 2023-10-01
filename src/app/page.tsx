'use client';

import { DELETE_CONTACT, GET_CONTACT_LIST } from '@/const';
import { useQuery, gql, QueryResult, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { FaPen, FaPlus, FaStar, FaTrash, FaXmark } from 'react-icons/fa6';
import { AiOutlineStar } from 'react-icons/ai';
import AddContactForm from './form/add-contact';
import Swal from 'sweetalert2';

export default function Home() {
  const [index, setIndex] = useState(0);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState<ListContact>();
  const [deleteContactMutation] = useMutation(DELETE_CONTACT);
  const [data, setData] = useState<{
    contact: ListContact[];
    contact_aggregate: JumlahContact;
  }>({
    contact: [],
    contact_aggregate: { aggregate: { count: 0 } },
  });

  const handleEdit = (contact: ListContact) => {
    setAdd(true);
    setEdit(contact);
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

        console.log('Contact delete:', data);
        refetch({ limit: 10, offset: index * 10 });
        Swal.fire('Delete!', '', 'success');
      } catch (error: any) {
        console.error('Error deleting contact:', error.message);
        Swal.fire(
          'Error',
          'An error occurred while deleting the contact.',
          'error'
        );
      }
    } else if (
      result.isDismissed &&
      result.dismiss === Swal.DismissReason.cancel
    ) {
      Swal.fire('Changes are not saved', '', 'info');
    }
  };

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
      offset: index * 10,
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
      refetch({ limit: 10, offset: index * 10 });
    } else {
      setData(dataLocal);
    }
  }, [queryData, index, refetch]);

  const { contact, contact_aggregate } = data;
  const contactList = contact || [];
  const contactCount = contact_aggregate?.aggregate?.count || 0;

  if (loading && !data.contact.length) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className='m-5'>
      <section>
        <h1>Favorite List</h1>
        <p>Such an empty</p>
      </section>

      <hr className='my-5' />

      <section>
        <h1>Contact List</h1>

        <div className='grid gap-2 sm:grid-cols-2 mt-3'>
          <input className='sm:mr-auto' type='text' name='' id='' />
          <button
            className='border rounded-lg sm:ml-auto sm:mr-0'
            onClick={() => setAdd(!add)}
          >
            {add ? <FaXmark /> : <FaPlus />} Contact
          </button>
        </div>

        {add ? <AddContactForm value={edit} /> : null}

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5 my-5'>
          {contactList.map((contact: ListContact) => (
            <div key={contact.id} className='border rounded-lg py-3 px-5'>
              <p>
                {contact.first_name} ({contact.last_name})
              </p>
              <p>{contact.phones[0]?.number ?? '-'}</p>
              <div className='flex gap-1 ml-[-6px] mt-2'>
                <button className='p-2'>
                  <FaStar style={{ fill: 'orange' }} />
                </button>
                <button className='p-2' onClick={() => handleEdit(contact)}>
                  <FaPen style={{ fill: 'blue' }} />
                </button>
                <button className='p-2' onClick={() => handleDelete(contact)}>
                  <FaTrash style={{ fill: 'red' }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='w-fit mx-auto flex gap-3'>
          {Array.from({ length: Math.ceil(contactCount / 10) }, (_, index) => (
            <a
              className='border rounded-lg px-4 py-2 cursor-pointer'
              key={index + 1}
              onClick={() => setIndex(index)}
            >
              {index + 1}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
