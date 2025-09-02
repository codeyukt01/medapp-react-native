import { NavigationContainerRef, StackActions } from '@react-navigation/native';
import { createRef } from 'react';
import SCREENS from '../constants/screens';

// Create a global navigation reference
export const navigationRef = createRef<NavigationContainerRef<any>>();

// Function to navigate to login screen
export function navigateToLogin() {
  if (navigationRef.current) {
    navigationRef.current.reset({
      index: 0,
      routes: [{ name: SCREENS.LOGIN }],
    });
  }
}

// Function to logout and navigate to login
export function logoutAndNavigateToLogin() {
  if (navigationRef.current) {
    navigationRef.current.reset({
      index: 0,
      routes: [{ name: SCREENS.LOGIN }],
    });
  }
} 