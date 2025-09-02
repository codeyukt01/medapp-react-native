import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useTheme } from '../theme';
import { Camera, Image as ImageIcon, Upload, X, CheckCircle, AlertCircle } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin';
import Header from '../components/Header';
import PrescriptionGallery from '../components/PrescriptionGallery';
import { createOrder, updateOrder } from '../api/orders';
import { showToast } from '../utils/toast';

const UploadPrescriptionScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [doctor, setDoctor] = useState('');
  const [referral, setReferral] = useState('');
  const [coupon, setCoupon] = useState('');
  const [patient, setPatient] = useState('');
  const [hospital, setHospital] = useState('');
  const [image, setImage] = useState<string | null>('');
  const [isEditing, setIsEditing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);

  // Validation error state
  const [errors, setErrors] = useState<{
    doctor?: string;
    patient?: string;
    hospital?: string;
    image?: string;
  }>({});

  // Populate form with existing data if editing
  useEffect(() => {
    if (route.params) {
      const { doctor: editDoctor, referral: editReferral, coupon: editCoupon, patient: editPatient, hospital: editHospital, image: editImage, orderId: editOrderId } = route.params;
      
      if (editDoctor) {
        setDoctor(editDoctor);
        setIsEditing(true);
      }
      if (editReferral) setReferral(editReferral);
      if (editCoupon) setCoupon(editCoupon);
      if (editPatient) setPatient(editPatient);
      if (editHospital) setHospital(editHospital);
      if (editImage) {
        // Handle both single image and array of images
        if (Array.isArray(editImage) && editImage.length > 0) {
          setImage(editImage[0]); // Use first image if it's an array
        } else if (typeof editImage === 'string') {
          setImage(editImage);
        }
      }
      if (editOrderId) setOrderId(editOrderId);
    }
  }, [route.params]);

  const scanFromCamera = async () => {
    try {
      const { scannedImages } = await DocumentScanner.scanDocument({
        responseType: ResponseType.ImageFilePath,
        maxNumDocuments: 1,
        croppedImageQuality: 0.8,
      });
      if (scannedImages && scannedImages.length > 0) {
        setImage(scannedImages[0]);
        if (errors.image) setErrors(prev => ({ ...prev, image: undefined }));
      }
    } catch (e) {
      // handle cancel or error
    }
  };

  const scanFromGallery = async () => {
    try {
      const { scannedImages } = await DocumentScanner.scanDocument({
        responseType: ResponseType.ImageFilePath,
        maxNumDocuments: 1,
        croppedImageQuality: 0.8,
      });
      if (scannedImages && scannedImages.length > 0) {
        setImage(scannedImages[0]);
        if (errors.image) setErrors(prev => ({ ...prev, image: undefined }));
      }
    } catch (e) {
      // handle cancel or error
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => setImage(null) }
      ]
    );
  };

  const openGallery = () => {
    if (image) {
      setGalleryVisible(true);
    }
  };

  const closeGallery = () => {
    setGalleryVisible(false);
  };

  const uploadPrescription = async () => {
    // Validation on submit click
    let newErrors: typeof errors = {};
    if (!doctor.trim()) newErrors.doctor = "Doctor's name is required";
    if (!patient.trim()) newErrors.patient = "Patient name is required";
    if (!hospital.trim()) newErrors.hospital = "Hospital address is required";
    if (!image) newErrors.image = "Prescription photo is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const payload: any = {
      doctorName: doctor.trim(),
      patientName: patient.trim(),
      hospitalAddress: hospital.trim(),
      prescriptionUrls: [image],
    };
    if (referral.trim()) {
      payload.referralName = referral.trim();
    }
    if (coupon.trim()) {
      payload.couponCode = coupon.trim();
    }

    try {
      if (isEditing && orderId) {
        await updateOrder(orderId, payload);
        showToast.success('Order updated successfully!');
      } else {
        await createOrder(payload);
        showToast.success('Prescription uploaded successfully!');
      }
      navigation.goBack();
    } catch (error: any) {
      showToast.error(error?.message || 'Failed to upload prescription.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    error?: string,
    isRequired: boolean = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label} {isRequired && <Text style={{ color: colors.error }}>*</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          { 
            color: colors.text, 
            borderColor: error ? colors.error : colors.border,
            backgroundColor: colors.surface
          }
        ]}
        value={value}
        onChangeText={text => {
          onChangeText(text);
          if (error) setErrors(prev => ({ ...prev, [label.toLowerCase().replace(/\s+/g, '')]: undefined }));
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
      />
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle color={colors.error} size={12} />
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header 
        title={isEditing ? "Edit Order" : "Create Order"} 
        onBack={() => navigation.goBack()} 
        color={colors.text} 
        backgroundColor={colors.background} 
      />
      <KeyboardAwareScrollView 
        contentContainerStyle={styles.container} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        
        {/* Form Section */}
        <View style={styles.formSection}>
          {renderInputField(
            "Doctor's Name",
            doctor,
            setDoctor,
            "Enter doctor's name",
            errors.doctor,
            true
          )}

          {renderInputField(
            "Patient Name",
            patient,
            setPatient,
            "Enter patient name",
            errors.patient,
            true
          )}

          {renderInputField(
            "Hospital Address",
            hospital,
            setHospital,
            "Enter hospital address",
            errors.hospital,
            true
          )}

          {renderInputField(
            "Referral Name",
            referral,
            setReferral,
            "Enter referral name (optional)",
            undefined,
            false
          )}

          {renderInputField(
            "Coupon Code",
            coupon,
            setCoupon,
            "Enter coupon code (optional)",
            undefined,
            false
          )}
        </View>

        {/* Image Upload Section */}
        <View style={styles.imageSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Prescription Photo <Text style={{ color: colors.error }}>*</Text>
          </Text>
          
          {!image ? (
            <View style={[styles.uploadContainer, { backgroundColor: colors.surface }]}>
              <Upload color={colors.primary} size={24} />
              <Text style={[styles.uploadTitle, { color: colors.text }]}>
                Upload Prescription
              </Text>
              
              <View style={styles.uploadButtons}>
                <TouchableOpacity 
                  style={[styles.uploadButton, { backgroundColor: colors.primary }]} 
                  onPress={scanFromCamera}
                >
                  <Camera color={colors.onPrimary} size={16} />
                  <Text style={[styles.uploadButtonText, { color: colors.onPrimary }]}>
                    Camera
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.uploadButton, { backgroundColor: colors.primary }]} 
                  onPress={scanFromGallery}
                >
                  <ImageIcon color={colors.onPrimary} size={16} />
                  <Text style={[styles.uploadButtonText, { color: colors.onPrimary }]}>
                    Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={[styles.imagePreviewContainer, { backgroundColor: colors.surface }]}>
              <View style={styles.imagePreviewHeader}>
                <View style={styles.imagePreviewInfo}>
                  <CheckCircle color={colors.primary} size={16} />
                  <Text style={[styles.imagePreviewTitle, { color: colors.text }]}>
                    Image Uploaded
                  </Text>
                </View>
                <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
                  <X color={colors.error} size={16} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={openGallery} activeOpacity={0.8}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
              </TouchableOpacity>
            </View>
          )}
          
          {errors.image && (
            <View style={styles.errorContainer}>
              <AlertCircle color={colors.error} size={12} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.image}
              </Text>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              { 
                backgroundColor: isSubmitting ? colors.placeholder : colors.primary,
                opacity: isSubmitting ? 0.7 : 1
              }
            ]}
            onPress={uploadPrescription}
            disabled={isSubmitting}
          >
            <Text style={[styles.submitText, { color: colors.onPrimary }]}>
              {isSubmitting ? 'Processing...' : (isEditing ? 'Update Order' : 'Submit Order')}
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>

      {/* Prescription Gallery Modal */}
      <PrescriptionGallery
        images={image ? [image] : []}
        visible={galleryVisible}
        onClose={closeGallery}
        initialIndex={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    flex: 1,
  },
  imageSection: {
    marginBottom: 20,
  },
  uploadContainer: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  uploadButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  imagePreviewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  imagePreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    padding: 2,
  },
  imagePreview: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  submitSection: {
    marginTop: 4,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitText: {
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
});

export default UploadPrescriptionScreen; 