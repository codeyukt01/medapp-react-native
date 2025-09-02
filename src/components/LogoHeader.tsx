import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface LogoHeaderProps {
  title?: string;
}

const LogoHeader: React.FC<LogoHeaderProps> = ({ title }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <Text style={[styles.appName, { color: colors.primary }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default LogoHeader; 