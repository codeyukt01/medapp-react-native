/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import { navigationRef } from './src/utils/navigation';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <StackNavigator />
      <Toast />
    </NavigationContainer>
  );
};

export default App;
