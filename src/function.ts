import Swal from 'sweetalert2';

const regex = /^[a-zA-Z\s]+$/;

export const formFirstLastNameValidator = ({
  firstName,
  lastName,
}: {
  firstName?: string;
  lastName?: string;
}) => {
  if (firstName && lastName) {
    if (regex.test(firstName) && regex.test(lastName)) {
      return true;
    } else {
      Swal.fire('Error!', 'First or Last Name should be alphabet.', 'warning');
      return false;
    }
  } else {
    Swal.fire('Error!', `First or Last Name shouldn't be empty.`, 'warning');
    return false;
  }
};

export const isIdInArray = ({ array, id }: { array: number[]; id: number }) => {
  return array.includes(id);
};
