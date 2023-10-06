import Swal from 'sweetalert2';

type ParamsDelete = {
  dataContact: ListContact;
  method: any;
};

type ParamsEditName = {
  dataContact: {
    id: string;
    firstName: string;
    lastName: string;
  };
  method: any;
};

export class EditPageController {
  deleteContact: (params: ParamsDelete) => Promise<boolean> = async (
    params: ParamsDelete
  ) => {
    const result = await Swal.fire({
      title: `Do you want to delete ${params.dataContact.first_name}?`,
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Delete',
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        const { data } = await params.method;

        console.log('Contact delete:', data);
        if (data) {
          Swal.fire('Delete!', '', 'success');
          return true;
        }
      } catch (error: any) {
        console.error('Error deleting contact:', error.message);
        Swal.fire(
          'Error',
          'An error occurred while deleting the contact.',
          'error'
        );
        return false;
      }
    }
    return false;
  };

  editFirstLastName: (params: ParamsEditName) => Promise<boolean> = async (
    params: ParamsEditName
  ) => {
    try {
      const result = await Swal.fire({
        title: `Do you want to change data?`,
        showCancelButton: true,
        focusCancel: true,
      });

      if (result.isConfirmed) {
        try {
          const { data } = await params.method;

          console.log('Contact edit:', data);
          if (data) {
            Swal.fire('Edit!', '', 'success');
            return true;
          }
        } catch (error: any) {
          console.error('Error deleting contact:', error.message);
          Swal.fire(
            'Error',
            'An error occurred while edit the contact.',
            'error'
          );
          return false;
        }
      }
    } catch (error) {}
    return false;
  };
}
