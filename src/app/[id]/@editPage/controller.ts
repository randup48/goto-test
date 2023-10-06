import Swal from 'sweetalert2';

type ParamsDelete = {
  first_name: string;
  method: any;
};

type ParamsEditName = {
  method: any;
};

export class EditPageController {
  deleteContact: (params: ParamsDelete) => Promise<boolean> = async (
    params: ParamsDelete
  ) => {
    const result = await Swal.fire({
      icon: 'question',
      title: `Do you want to delete ${params.first_name}?`,
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
    } catch (error: any) {
      console.error('Error editing contact:', error.message);
      Swal.fire(
        'Error',
        'An error occurred while editing the contact.',
        'error'
      );
      return false;
    }
    return false;
  };
}
