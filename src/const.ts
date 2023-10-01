import { gql } from '@apollo/client';

const GET_CONTACT_LIST = gql`
  query GetContactList(
    $distinct_on: [contact_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [contact_order_by!]
    $where: contact_bool_exp
  ) {
    contact(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
    contact_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

const GET_PHONE_LIST = gql`
  query GetPhoneList(
    $where: phone_bool_exp
    $distinct_on: [phone_select_column!]
    $limit: Int = 10
    $offset: Int = 0
    $order_by: [phone_order_by!]
  ) {
    phone(
      where: $where
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
    ) {
      contact {
        last_name
        first_name
        id
      }
      number
    }
    phone_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

const ADD_CONTACT = gql`
  mutation AddContactWithPhones(
    $first_name: String!
    $last_name: String!
    $phones: [phone_insert_input!]!
  ) {
    insert_contact(
      objects: {
        first_name: $first_name
        last_name: $last_name
        phones: { data: $phones }
      }
    ) {
      returning {
        first_name
        last_name
        id
        phones {
          number
        }
      }
    }
  }
`;

const DELETE_CONTACT = gql`
  mutation MyMutation($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
`;

export { GET_CONTACT_LIST, GET_PHONE_LIST, ADD_CONTACT, DELETE_CONTACT };
