import Swal from 'sweetalert2';

type ParamsAdd = {
  method: any;
};

export class AddPageController {
  addContact: (params: ParamsAdd) => Promise<boolean> = async (
    params: ParamsAdd
  ) => {
    try {
      const { data } = await params.method;

      console.log('Contact Add:', data);
      if (data) {
        Swal.fire('Add!', '', 'success');
        return true;
      }
    } catch (error: any) {
      console.error('Error add contact:', error.message);
      Swal.fire(
        'Error',
        'An error occurred while adding the contact.',
        'error'
      );
      return false;
    }
    return false;
  };
}
