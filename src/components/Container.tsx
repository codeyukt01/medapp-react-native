import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Container: React.FC<ContainerProps> = ({ children, style }) => {
  const { colors } = useTheme();
  return <View style={[styles.container, { backgroundColor: colors.background }, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
});

export default Container; 