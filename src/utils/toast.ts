import Toast from 'react-native-toast-message';

export const showToast = {
  success: (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 50,
      props: {
        style: {
          backgroundColor: '#4CAF50',
        },
      },
    });
  },
  
  error: (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      topOffset: 50,
      props: {
        style: {
          backgroundColor: '#F44336',
        },
      },
    });
  },
  
  info: (message: string) => {
    Toast.show({
      type: 'info',
      text1: 'Info',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 50,
      props: {
        style: {
          backgroundColor: '#2196F3',
        },
      },
    });
  },
  
  warning: (message: string) => {
    Toast.show({
      type: 'warning',
      text1: 'Warning',
      text2: message,
      position: 'top',
      visibilityTime: 3500,
      topOffset: 50,
      props: {
        style: {
          backgroundColor: '#FF9800',
        },
      },
    });
  },
}; 