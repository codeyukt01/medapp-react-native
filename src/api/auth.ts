import { apiPost } from './axios';

export interface LoginPayload {
  phone: string;
  dev: boolean;
}

export async function loginUser(payload: LoginPayload) {
  // Adjust endpoint and payload as per your backend
  console.log(payload);
  return apiPost('/auth/login', payload);
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
  dev: boolean;
}

export async function verifyOtp(payload: VerifyOtpPayload) {
  return apiPost('/auth/verifyotp', payload);
} 