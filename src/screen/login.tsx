import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextStyle,
  ViewStyle,
  StyleSheet as RNStyleSheet,
} from 'react-native';
import { Button, PhoneInput } from '../components';
import { useTheme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { loginUser } from '../api/auth';
import SCREENS from '../constants/screens';
import CONTENT, { DevMode } from '../constants/content';

const validateIndianPhone = (phone: string): string | undefined => {
  if (!phone) return 'Phone number is required';
  if (!/^[6-9]\d{9}$/.test(phone)) return 'Invalid Indian mobile number';
  return undefined;
};

const LoginScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err = validateIndianPhone(phone);
    setError(err);
    return !err;
  };

  const onLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(undefined);
    try {
      const data = await loginUser({ phone: `+91${phone}`, dev: DevMode });
      // Handle successful login (e.g., save token, navigate)
      navigation.navigate(SCREENS.VERIFY_OTP, { phone: `+91${phone}` });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={24}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.root, { backgroundColor: colors.background }]}>
          {/* Main Content */}
          <View style={styles.centerContent}>
            <Text style={[styles.title, { color: colors.text }]}>
              {CONTENT.UI.WELCOME_TITLE}
            </Text>
            <Text style={[styles.subtitle, { color: colors.placeholder }]}>
              {CONTENT.UI.LOGIN_SUBTITLE}
            </Text>
            <PhoneInput
              value={phone}
              onChangeText={setPhone}
              error={error}
              placeholder="00 0000 0000"
            />
            {error ? (
              <Text
                style={{
                  color: colors.error,
                  marginTop: -8,
                  marginBottom: 8,
                  marginLeft: 4,
                  fontSize: 14,
                }}
              >
                {error}
              </Text>
            ) : null}
            <Button
              title={loading ? CONTENT.UI.SIGNING_IN : CONTENT.UI.SIGNIN}
              onPress={onLogin}
              disabled={loading}
              style={
                RNStyleSheet.flatten([
                  styles.signinBtn,
                  {
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                  },
                ]) as ViewStyle
              }
              textStyle={
                RNStyleSheet.flatten([
                  styles.signinBtnText,
                  { color: colors.onPrimary },
                ]) as TextStyle
              }
            />
            <TouchableOpacity style={styles.helpContainer}>
              <Text style={[styles.helpText, { color: colors.error }]}>
                {CONTENT.UI.HELP}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 8,
    zIndex: 2,
  },
  backArrow: {
    fontSize: 32,
    marginLeft: 0,
  },
  skipBtn: {
    marginRight: 0,
  },
  skipText: {
    fontSize: 16,
  },
  centerContent: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  signinBtn: {
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 8,
    height: 56,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signinBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpContainer: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  helpText: {
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginScreen;
