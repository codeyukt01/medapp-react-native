import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SCREENS from '../constants/screens';
import { useAuthStore } from '../store';
import { useTheme } from '../theme';

const SplashScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check for token in Keychain
        const credentials = await Keychain.getGenericPassword();
        const token = credentials ? credentials.password : null;

        if (token) {
          // Set token in Zustand
          setToken(token);

          // Get and set user data from AsyncStorage
          const userString = await AsyncStorage.getItem('user');
          if (userString) {
            const userData = JSON.parse(userString);
            setUser(userData);
          }

          navigation.replace(SCREENS.TABS);
        } else {
          navigation.replace(SCREENS.LOGIN);
        }
      } catch (e) {
        console.error('Error checking auth state:', e);
        navigation.replace(SCREENS.LOGIN);
      }
    };

    checkAuthState();
  }, [navigation, setToken, setUser]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen; 