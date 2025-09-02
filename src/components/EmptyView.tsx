import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { FileText } from 'lucide-react-native';
import { useTheme } from '../theme';

interface EmptyViewProps {
  title: string;
  style?: ViewStyle;
}

const EmptyView: React.FC<EmptyViewProps> = ({ title, style }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <FileText size={64} color={colors.gray} style={styles.icon} />
      <Text style={[styles.title, { color: colors.darkGray }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default EmptyView; 