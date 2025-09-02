const CONTENT = {
  KEYS: {
    JWT: 'jwt',
    USER: 'user',
  },
  ERRORS: {
    PHONE_REQUIRED: 'Phone number is required',
    PHONE_INVALID: 'Invalid Indian mobile number',
    LOGIN_FAILED: 'Login failed. Please try again.',
    OTP_INCOMPLETE: 'Please enter the complete OTP',
    NO_RESPONSE: 'No response from server',
    TIMEOUT: 'Request timed out',
    UNKNOWN: 'An unknown error occurred',
  },
  UI: {
    VERIFY_OTP_TITLE: 'Verify OTP',
    VERIFY_OTP_SUBTITLE: 'Enter the 6-digit code sent to your phone',
    WELCOME_TITLE: 'Welcome back!',
    LOGIN_SUBTITLE: 'Enter your registered phone number\nto log in',
    SIGNIN: 'Sign in',
    SIGNING_IN: 'Signing in...',
    VERIFY: 'Verify',
    VERIFYING: 'Verifying...',
    HELP: 'Help?',
    RESEND_OTP: 'Resend OTP',
    PHONE_LABEL: 'Phone:',
  },
};

  export const DevMode = true; // Set to false in production


export default CONTENT; 