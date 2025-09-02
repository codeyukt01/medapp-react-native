import React from 'react';
import { TextInput as RNTextInput, StyleSheet, View, Text, TextInputProps } from 'react-native';
import { useTheme } from '../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

const TextInput: React.FC<Props> = ({ label, error, style, ...rest }) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginVertical: 8 }}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          { backgroundColor: colors.surface, color: colors.text, borderColor: error ? colors.error : colors.primary },
          style,
        ]}
        placeholderTextColor={colors.placeholder}
        {...rest}
      />
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default TextInput; 