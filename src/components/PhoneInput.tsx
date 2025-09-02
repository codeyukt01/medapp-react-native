import React from 'react';
import { View, TextInput, StyleSheet, Text, Image, ViewStyle, TextStyle, ImageSourcePropType } from 'react-native';
import { useTheme } from '../theme';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  placeholder?: string;
}

const IN_FLAG: ImageSourcePropType = require('../assets/flag_in.png'); // Place a PNG flag in src/assets/flag_in.png

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChangeText, error, style, inputStyle, placeholder }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { borderColor: error ? colors.error : colors.border, backgroundColor: colors.inputBackground }, style]}>
      <Image source={IN_FLAG} style={styles.flagImg} resizeMode="contain" />
      <Text style={[styles.code, { color: colors.text }]} >+91</Text>
      <TextInput
        style={[styles.input, { color: colors.text } , inputStyle]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="phone-pad"
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        maxLength={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 12,
    minHeight: 60,
  },
  flagImg: {
    width: 32,
    height: 24,
    marginRight: 12,
    borderRadius: 3,
  },
  code: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 22,
    padding: 0,
    height: 32,
  },
});

export default PhoneInput; 