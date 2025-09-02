import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useTheme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

import Header from '../components/Header';
import PrescriptionGallery from '../components/PrescriptionGallery';
import { ChevronLeft, Phone, FileText } from 'lucide-react-native';
import SCREENS from '../constants/screens';
import { statusColors } from '../constants/orders';
import { formatDate } from '../utils/dateFormeter';
import { showToast } from '../utils/toast';

const OrderDetailsScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const [order, setOrder] = useState(route.params.order);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleEdit = () => {
    navigation.navigate(SCREENS.UPLOAD_PRESCRIPTION, {
      doctor: order.doctorName,
      referral: order.referralName,
      coupon: order.couponCode,
      patient: order.patientName,
      hospital: order.hospitalAddress,
      image: order.prescriptionUrls,
      orderId: order.orderid,
      order, // Pass the full order object as well
    });
  };

  const handleCallSupport = () => {
    showToast.info('Contact support at +91-XXXXXXXXXX');
  };







  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'Completed': '#4CAF50',
      'Pending Verification': '#FF9800',
      'Prescription Rejected': '#F44336',
      'Price Quoted': '#2196F3',
      'Payment Awaiting': '#9C27B0',
      'Preparing': '#FF9800',
      'Out for Delivery': '#2196F3',
      'Delivered': '#4CAF50',
    };
    return statusColors[status] || '#666';
  };

  const getStatusBackgroundColor = (status: string) => {
    const statusBackgroundColors: Record<string, string> = {
      'Completed': '#E8F5E8',
      'Pending Verification': '#FFF3E0',
      'Prescription Rejected': '#FFEBEE',
      'Price Quoted': '#E3F2FD',
      'Payment Awaiting': '#F3E5F5',
      'Preparing': '#FFF3E0',
      'Out for Delivery': '#E3F2FD',
      'Delivered': '#E8F5E8',
    };
    return statusBackgroundColors[status] || '#F5F5F5';
  };

  const renderPrescriptionImage = () => {
    if (!order.prescriptionUrls || (Array.isArray(order.prescriptionUrls) && order.prescriptionUrls.length === 0)) {
      return (
        <View style={styles.noImageContainer}>
          <FileText color={colors.placeholder} size={24} />
          <Text style={[styles.noImageText, { color: colors.placeholder }]}>No prescription attached</Text>
        </View>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <Text style={[styles.receiptTitle, { color: colors.text }]}>Prescription</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {Array.isArray(order.prescriptionUrls) ? order.prescriptionUrls.map((url: string, index: number) => (
            <View key={index} style={styles.imageWrapper}>
              <Image 
                source={{ uri: url }} 
                style={styles.prescriptionImage}
                resizeMode="cover"
              />
            </View>
          )) : (
            <View style={styles.imageWrapper}>
              <Image 
                source={{ uri: order.prescriptionUrls }} 
                style={styles.prescriptionImage}
                resizeMode="cover"
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setGalleryVisible(true);
  };

  const closeModal = () => {
    setGalleryVisible(false);
  };

  const renderImageItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity 
      onPress={() => openModal(index)}
      style={styles.imageWrapper}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item }} 
        style={styles.prescriptionImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header 
        title={`ORD${order.orderid}`}
        onBack={() => navigation.goBack()} 
        color={colors.text} 
        backgroundColor={colors.background}
        rightComponent={
          <View style={styles.headerRightContainer}>
            <View style={[styles.headerStatusBadge, { backgroundColor: getStatusBackgroundColor(order.orderStatus) }]}>
              {/* Clock icon removed as per new_code, but keeping the style */}
              <Text style={[styles.headerStatusText, { color: getStatusColor(order.orderStatus) }]}>
                {order.orderStatus.toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity onPress={handleCallSupport} style={styles.headerSupportButton}>
              <Phone color={colors.primary} size={20} />
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Order Details - Receipt Style */}
        <View style={[styles.receiptContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.text }]}>Order Date</Text>
            <Text style={[styles.receiptValue, { color: colors.text }]}>{formatDate(order.orderDate)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.text }]}>Patient Name</Text>
            <Text style={[styles.receiptValue, { color: colors.text }]}>{order.patientName}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.text }]}>Doctor Name</Text>
            <Text style={[styles.receiptValue, { color: colors.text }]}>{order.doctorName}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.text }]}>Hospital</Text>
            <Text style={[styles.receiptValue, { color: colors.text }]}>{order.hospitalAddress}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.text }]}>Referral</Text>
            <Text style={[styles.receiptValue, { color: colors.text }]}>{order.referralName || 'Not specified'}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.text }]}>Coupon Code</Text>
            <Text style={[styles.receiptValue, { color: colors.text }]}>{order.couponCode || 'Not specified'}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.text }]}>Prescription Status</Text>
            <Text style={[styles.receiptValue, { color: getStatusColor(order.prescriptionStatus) }]}>{order.prescriptionStatus}</Text>
          </View>
        </View>

        {/* Prescription Images */}
        <View style={styles.section}>
          <Text style={[styles.receiptTitle, { color: colors.text }]}>Prescription</Text>
          {order.prescriptionUrls && order.prescriptionUrls.length > 0 ? (
            <FlatList
              data={order.prescriptionUrls}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.prescriptionImagesContainer}
            />
          ) : (
            <View style={styles.noPrescriptionContainer}>
              <FileText color={colors.placeholder} size={24} />
              <Text style={[styles.noPrescriptionText, { color: colors.placeholder }]}>
                No prescription uploaded
              </Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]} 
            onPress={handleEdit}
          >
            {/* Edit icon removed as per new_code, but keeping the style */}
            <Text style={[styles.actionButtonText, { color: colors.onPrimary }]}>Edit Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Prescription Gallery Modal */}
      <PrescriptionGallery
        images={order.prescriptionUrls || []}
        visible={galleryVisible}
        onClose={closeModal}
        initialIndex={selectedImageIndex}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerSupportButton: {
    padding: 8,
    borderRadius: 6,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  receiptContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  imageContainer: {
    marginBottom: 12,
  },
  imageScroll: {
    marginTop: 8,
  },
  imageWrapper: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prescriptionImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
  },
  noImageContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 8,
  },
  noImageText: {
    fontSize: 14,
    marginTop: 8,
  },
  actionButtons: {
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalImageList: {
    width: '100%',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  prescriptionImagesContainer: {
    paddingVertical: 8,
  },
  noPrescriptionContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 8,
  },
  noPrescriptionText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default OrderDetailsScreen; 