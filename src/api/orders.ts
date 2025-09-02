import { apiGet, apiPost, apiPut } from './axios';
import { useAuthStore } from '../store';

export async function getOrders() {
  // Get token from Zustand
  const token = useAuthStore.getState().token;
  
  // If no token, throw an error that will be handled by the interceptor
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  return apiGet('api/orders', {});
}

export interface CreateOrderPayload {
  doctorName: string;
  referralName?: string | null;
  couponCode?: string | null;
  patientName: string;
  hospitalAddress: string;
  prescriptionUrls: any; // Should be a file object (for FormData)
}

export interface UpdateOrderPayload {
  doctorName: string;
  referralName?: string | null;
  couponCode?: string | null;
  patientName: string;
  hospitalAddress: string;
  prescriptionUrls: any; // Should be a file object (for FormData)
}

export async function createOrder(payload: CreateOrderPayload) {
  // Get token from Zustand
  const token = useAuthStore.getState().token;
  
  // If no token, throw an error that will be handled by the interceptor
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  // This function assumes payload is a FormData object for file upload
  // If not, you may need to construct FormData here
  return apiPost('api/orders', payload, {});
}

export async function updateOrder(orderId: string, payload: UpdateOrderPayload) {
  // Get token from Zustand
  const token = useAuthStore.getState().token;
  
  // If no token, throw an error that will be handled by the interceptor
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  // This function assumes payload is a FormData object for file upload
  // If not, you may need to construct FormData here
  return apiPut(`api/orders/${orderId}`, payload, {});
}

