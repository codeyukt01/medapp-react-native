import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useTheme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SCREENS from '../constants/screens'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { useAuthStore } from '../store';
import LogoHeader from '../components/LogoHeader';
import { 
  User, 
  Phone, 
  Mail, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Edit,
  Camera,
  CreditCard,
  FileText,
  Heart,
  Star
} from 'lucide-react-native';

const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear local storage
              await AsyncStorage.clear();
              await Keychain.resetGenericPassword();
              
                              // Use the store's logout function which handles SSE disconnection
              logout();
              
              // Navigate to login screen
              navigation.reset({
                index: 0,
                routes: [{ name: SCREENS.LOGIN }],
              });
            } catch (e) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const profileSections = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Order updates and reminders',
          icon: Bell,
          isToggle: true,
          value: notificationsEnabled,
          onToggle: handleNotificationsToggle,
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English',
          icon: Settings,
          onPress: () => Alert.alert('Language', 'Language settings coming soon!'),
        },
      ]
    },
    {
      title: 'Support & Legal',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help with your account',
          icon: HelpCircle,
          onPress: () => navigation.navigate(SCREENS.SUPPORT),
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          icon: Shield,
          onPress: () => Alert.alert('Privacy Policy', 'Privacy policy coming soon!'),
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          subtitle: 'Read our terms of service',
          icon: FileText,
          onPress: () => Alert.alert('Terms of Service', 'Terms of service coming soon!'),
        },
      ]
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LogoHeader title="Profile" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
          <View style={styles.profileInfo}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <User color={colors.onPrimary} size={32} />
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.userType || 'User'}
              </Text>
              <Text style={[styles.userPhone, { color: colors.placeholder }]}>
                {user?.userid || 'Phone number'}
              </Text>
              <Text style={[styles.userType, { color: colors.primary }]}>
                Customer
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <FileText color={colors.primary} size={24} />
            <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.placeholder }]}>Orders</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Heart color={colors.primary} size={24} />
            <Text style={[styles.statNumber, { color: colors.text }]}>8</Text>
            <Text style={[styles.statLabel, { color: colors.placeholder }]}>Favorites</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Star color={colors.primary} size={24} />
            <Text style={[styles.statNumber, { color: colors.text }]}>4.8</Text>
            <Text style={[styles.statLabel, { color: colors.placeholder }]}>Rating</Text>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, { backgroundColor: colors.surface }]}
                  onPress={item.onPress}
                  disabled={item.isToggle}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIcon, { backgroundColor: colors.primary + '20' }]}>
                      <item.icon color={colors.primary} size={20} />
                    </View>
                    <View style={styles.menuText}>
                      <Text style={[styles.menuTitle, { color: colors.text }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.menuSubtitle, { color: colors.placeholder }]}>
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>
                  
                  {item.isToggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={colors.onPrimary}
                    />
                  ) : (
                    <ChevronRight color={colors.placeholder} size={20} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: '#D32F2F' }]}
            onPress={handleLogout}
          >
            <LogOut color="white" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    marginBottom: 4,
  },
  userType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  logoutSection: {
    marginTop: 32,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 