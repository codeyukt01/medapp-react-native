import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../theme';

interface HeaderProps {
  title: string;
  onBack: () => void;
  color: string;
  backgroundColor?: string;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, color, backgroundColor, rightComponent }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.header, { borderColor: colors.border }, backgroundColor ? { backgroundColor } : null]}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <ArrowLeft color={color} size={24} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color }]}>{title}</Text>
      {rightComponent && (
        <View style={styles.rightComponent}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  rightComponent: {
    marginLeft: 'auto',
  },
});

export default Header; 