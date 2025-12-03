import Swal from 'sweetalert2'

export const useSwal = () => {
  const showAlert = async (options) => {
    return await Swal.fire(options)
  }

  const showSuccess = async (message) => {
    return await showAlert({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 1500,
      showConfirmButton: false,
    })
  }

  const showError = async (message) => {
    return await showAlert({
      icon: 'error',
      title: 'Failed',
      text: message,
      timer: 1500,
      showConfirmButton: false,
    })
  }

  const showInfo = async (message) => {
    return await showAlert({
      icon: 'info',
      title: 'Info',
      text: message,
      timer: 1500,
      showConfirmButton: false,
    })
  }

  const showConfirmation = async (message) => {
    return await Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })
  }

  return { showSuccess, showError, showConfirmation, showInfo }
}
