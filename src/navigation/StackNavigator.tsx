import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, VerifyOtpScreen, UploadPrescriptionScreen } from '../screen';
import SplashScreen from '../screen/SplashScreen';
import Tabs from './Tabs';
import SCREENS from '../constants/screens';
import OrderDetailsScreen from '../screen/OrderDetailsScreen';

const Stack = createStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={SCREENS.SPLASH}>
    <Stack.Screen name={SCREENS.SPLASH} component={SplashScreen} />
    <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
    <Stack.Screen name={SCREENS.VERIFY_OTP} component={VerifyOtpScreen} />
    <Stack.Screen name={SCREENS.TABS} component={Tabs} />
    <Stack.Screen name={SCREENS.UPLOAD_PRESCRIPTION} component={UploadPrescriptionScreen} options={{ presentation: 'modal' }} />
    <Stack.Screen name={SCREENS.ORDER_DETAILS} component={OrderDetailsScreen} />
  </Stack.Navigator>
);

export default StackNavigator; 