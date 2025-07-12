import Swal from 'sweetalert2';

// Configuración base para SweetAlert2
export const sweetAlertConfig = {
  customClass: {
    popup: 'rounded-lg shadow-xl',
    confirmButton: 'swal2-confirm-btn bg-red-600 text-white px-4 py-2 rounded-lg font-medium ml-2',
    cancelButton: 'swal2-cancel-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium mr-2',
    input: 'rounded-lg'
  },
  buttonsStyling: false,
  confirmButtonColor: '#ef4444',
  cancelButtonColor: '#6b7280'
};

// Función para confirmar eliminación
export const confirmDelete = async (title: string, text: string) => {
  return await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    ...sweetAlertConfig
  });
};

// Función para mostrar éxito
export const showSuccess = async (title: string, text?: string, timer = 2000) => {
  return await Swal.fire({
    title,
    text,
    icon: 'success',
    timer,
    showConfirmButton: false,
    customClass: {
      popup: 'rounded-lg shadow-xl'
    }
  });
};

// Función para mostrar error
export const showError = async (title: string, text?: string) => {
  return await Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#ef4444',
    customClass: {
      popup: 'rounded-lg shadow-xl',
      confirmButton: 'rounded-lg font-medium'
    }
  });
};

// Función para mostrar información
export const showInfo = async (title: string, text?: string) => {
  return await Swal.fire({
    title,
    text,
    icon: 'info',
    confirmButtonColor: '#3b82f6',
    customClass: {
      popup: 'rounded-lg shadow-xl',
      confirmButton: 'rounded-lg font-medium'
    }
  });
};

export default Swal; 