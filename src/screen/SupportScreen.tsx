import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useTheme } from '../theme';
import LogoHeader from '../components/LogoHeader';
import { Phone, Mail, MessageCircle, HelpCircle, FileText, Clock, MapPin, Star } from 'lucide-react-native';

const SupportScreen: React.FC = () => {
  const { colors } = useTheme();

  const handleCallSupport = () => {
    Alert.alert(
      'Call Support',
      'Would you like to call our support team?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL('tel:+91-XXXXXXXXXX') }
      ]
    );
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@medapp.com?subject=Support Request');
  };

  const handleWhatsAppSupport = () => {
    Linking.openURL('whatsapp://send?phone=+91XXXXXXXXXX&text=Hi, I need help with my order.');
  };

  const handleLiveChat = () => {
    Alert.alert(
      'Live Chat',
      'Live chat feature coming soon! For now, please use call or email support.',
      [{ text: 'OK' }]
    );
  };

  const supportOptions = [
    {
      id: 'call',
      title: 'Call Support',
      subtitle: 'Speak with our team',
      icon: Phone,
      color: '#4CAF50',
      onPress: handleCallSupport,
    },
    {
      id: 'email',
      title: 'Email Support',
      subtitle: 'Send us an email',
      icon: Mail,
      color: '#2196F3',
      onPress: handleEmailSupport,
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      subtitle: 'Chat on WhatsApp',
      icon: MessageCircle,
      color: '#25D366',
      onPress: handleWhatsAppSupport,
    },
    {
      id: 'livechat',
      title: 'Live Chat',
      subtitle: 'Chat with us online',
      icon: HelpCircle,
      color: '#FF9800',
      onPress: handleLiveChat,
    },
  ];

  const quickHelp = [
    {
      title: 'How to upload prescription?',
      description: 'Take a photo or upload from gallery, fill details and submit.',
    },
    {
      title: 'Order tracking',
      description: 'Check your order status in the Orders tab.',
    },
    {
      title: 'Payment methods',
      description: 'We accept all major cards and UPI payments.',
    },
    {
      title: 'Delivery time',
      description: 'Standard delivery: 2-3 days, Express: Same day.',
    },
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+91-XXXXXXXXXX',
      color: '#4CAF50',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'support@medapp.com',
      color: '#2196F3',
    },
    {
      icon: Clock,
      title: 'Support Hours',
      value: '24/7 Available',
      color: '#FF9800',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Mumbai, Maharashtra',
      color: '#9C27B0',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LogoHeader title="Support" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Support Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Get Help</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.placeholder }]}>
            Choose how you'd like to contact us
          </Text>
          
          <View style={styles.optionsGrid}>
            {supportOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionCard, { backgroundColor: colors.surface }]}
                onPress={option.onPress}
              >
                <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                  <option.icon color="white" size={24} />
                </View>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  {option.title}
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.placeholder }]}>
                  {option.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Help */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Help</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.placeholder }]}>
            Common questions and answers
          </Text>
          
          <View style={styles.helpContainer}>
            {quickHelp.map((help, index) => (
              <View key={index} style={[styles.helpItem, { backgroundColor: colors.surface }]}>
                <View style={styles.helpHeader}>
                  <HelpCircle color={colors.primary} size={20} />
                  <Text style={[styles.helpTitle, { color: colors.text }]}>
                    {help.title}
                  </Text>
                </View>
                <Text style={[styles.helpDescription, { color: colors.placeholder }]}>
                  {help.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.placeholder }]}>
            Reach out to us anytime
          </Text>
          
          <View style={styles.contactContainer}>
            {contactInfo.map((contact, index) => (
              <View key={index} style={[styles.contactItem, { backgroundColor: colors.surface }]}>
                <View style={[styles.contactIcon, { backgroundColor: contact.color }]}>
                  <contact.icon color="white" size={20} />
                </View>
                <View style={styles.contactDetails}>
                  <Text style={[styles.contactTitle, { color: colors.text }]}>
                    {contact.title}
                  </Text>
                  <Text style={[styles.contactValue, { color: colors.placeholder }]}>
                    {contact.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* App Rating */}
        <View style={styles.section}>
          <View style={[styles.ratingCard, { backgroundColor: colors.surface }]}>
            <View style={styles.ratingHeader}>
              <Star color={colors.primary} size={24} />
              <Text style={[styles.ratingTitle, { color: colors.text }]}>
                Rate Our App
              </Text>
            </View>
            <Text style={[styles.ratingDescription, { color: colors.placeholder }]}>
              Help us improve by rating your experience
            </Text>
            <TouchableOpacity 
              style={[styles.ratingButton, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Rating', 'App rating feature coming soon!')}
            >
              <Text style={[styles.ratingButtonText, { color: colors.onPrimary }]}>
                Rate Now
              </Text>
            </TouchableOpacity>
          </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  optionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  helpContainer: {
    gap: 12,
  },
  helpItem: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  helpDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 28,
  },
  contactContainer: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
  },
  ratingCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  ratingButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ratingButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SupportScreen; 