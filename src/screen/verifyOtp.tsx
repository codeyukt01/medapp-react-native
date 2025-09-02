import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, AppState, AppStateStatus, StyleSheet as RNStyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button } from '../components';
import { useTheme } from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import SCREENS from '../constants/screens';
import CONTENT, { DevMode } from '../constants/content';
import { ChevronLeft } from 'lucide-react-native';
import { verifyOtp } from '../api/auth';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store';

const OTP_LENGTH = 6;
const RESEND_OTP_SECONDS = 60;

const VerifyOtpScreen: React.FC = () => {
  const { colors } = useTheme();
  const route = useRoute();
  // @ts-ignore
  const phone = route.params?.phone;
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_OTP_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const lastBackgroundTime = useRef<number | null>(null);
  const inputs = useRef<Array<TextInput | null>>([]);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  // Timer logic
  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resendTimer > 0]);

  // AppState logic for background timer
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/active/) && nextAppState.match(/background|inactive/)) {
        lastBackgroundTime.current = Date.now();
      }
      if (appState.current.match(/background|inactive/) && nextAppState === 'active') {
        if (lastBackgroundTime.current) {
          const elapsed = Math.floor((Date.now() - lastBackgroundTime.current) / 1000);
          setResendTimer((prev) => Math.max(prev - elapsed, 0));
        }
      }
      appState.current = nextAppState;
    };
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, []);

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[idx] = text;
      setOtp(newOtp);
      setError(undefined);
      if (text && idx < OTP_LENGTH - 1) {
        inputs.current[idx + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const validate = () => {
    if (otp.some((d) => d === '')) {
      setError('Please enter the complete OTP');
      return false;
    }
    setError(undefined);
    return true;
  };

  const onVerify = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(undefined);
    try {
      const otpValue = otp.join('');
      const response = await verifyOtp({ phone, otp: otpValue, dev: DevMode });
      // Assume response contains { token, user }
      if (response.token) {
        setToken(response.token);
        await Keychain.setGenericPassword('jwt', response.token);
      }
      if (response?.user) {
        setUser(response.user);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
      }
      navigation.replace(SCREENS.TABS);
    } catch (err: any) {
      setError(err?.message || CONTENT.ERRORS.UNKNOWN);
    } finally {
      setLoading(false);
    }
  };

  const onResend = () => {
    setResendTimer(RESEND_OTP_SECONDS);
    // TODO: Call resend OTP API here
    Alert.alert('OTP', 'OTP resent!');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.headerRow, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft color={colors.text} size={32} />
          </TouchableOpacity>
        </View>
        {/* Main Content */}
        <View style={styles.centerContent}>
          <Text style={[styles.title, { color: colors.text }]}>{CONTENT.UI.VERIFY_OTP_TITLE}</Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>{CONTENT.UI.VERIFY_OTP_SUBTITLE}</Text>
          <Text style={{ color: colors.text, fontWeight: 'bold', marginBottom: 12 }}>{CONTENT.UI.PHONE_LABEL} {phone}</Text>
          <View style={styles.otpRow}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={ref => { inputs.current[idx] = ref; }}
                style={[styles.otpInput, { borderColor: error ? colors.error : colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
                value={digit}
                onChangeText={text => handleChange(text, idx)}
                onKeyPress={e => handleKeyPress(e, idx)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                autoFocus={idx === 0}
                selectionColor={colors.primary}
              />
            ))}
          </View>
          {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
          <TouchableOpacity style={styles.resendContainer} onPress={onResend} disabled={resendTimer > 0}>
            <Text style={[styles.resendText, { color: resendTimer > 0 ? colors.placeholder : colors.text }]}>{CONTENT.UI.RESEND_OTP}{resendTimer > 0 ? ` (${resendTimer}s)` : ''}</Text>
          </TouchableOpacity>
          <Button
            title={loading ? CONTENT.UI.VERIFYING : CONTENT.UI.VERIFY}
            onPress={onVerify}
            disabled={loading}
            style={RNStyleSheet.flatten([styles.verifyBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]) as ViewStyle}
            textStyle={RNStyleSheet.flatten([styles.verifyBtnText, { color: colors.onPrimary }]) as TextStyle}
          />
          <TouchableOpacity style={styles.helpContainer}>
            <Text style={[styles.helpText, { color: colors.error }]}>{CONTENT.UI.HELP}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 8,
    zIndex: 2,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 0,
    marginLeft: 0,
  },
  backArrow: {
    fontSize: 32,
    color: '#222',
    textAlign: 'center',
    lineHeight: 32,
  },
  editBtn: {
    marginRight: 0,
  },
  editText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: '500',
  },
  centerContent: {
    // flex: 1, // Remove flex: 1 to avoid vertical centering
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 8,
  },
  otpInput: {
    width: 44,
    height: 56,
    borderWidth: 1.5,
    borderRadius: 10,
    fontSize: 24,
    marginHorizontal: 4,
  },
  error: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: -8,
    alignSelf: 'flex-start',
  },
  resendContainer: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  resendText: {
    fontSize: 15,
    fontWeight: '500',
  },
  verifyBtn: {
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 8,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verifyBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpContainer: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  helpText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default VerifyOtpScreen; 