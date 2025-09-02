import React, { useState } from 'react';
import { View, Image, Modal, Dimensions, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../theme';

const { width, height } = Dimensions.get('window');

interface PrescriptionGalleryProps {
  images: string[];
  visible: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const PrescriptionGallery: React.FC<PrescriptionGalleryProps> = ({
  images,
  visible,
  onClose,
  initialIndex = 0,
}) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const renderImage = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.fullScreenImage}
        resizeMode="contain"
      />
    </View>
  );

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleClose = () => {
    setCurrentIndex(0);
    onClose();
  };

  const dynamicStyles = {
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    counterContainer: {
      position: 'absolute' as const,
      top: 50,
      left: 20,
      zIndex: 10,
      backgroundColor: colors.overlayLight,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
    },
    navButton: {
      position: 'absolute' as const,
      top: '50%' as any,
      left: 20,
      zIndex: 10,
      backgroundColor: colors.overlayLight,
      borderRadius: 25,
      padding: 10,
      transform: [{ translateY: -25 }],
    },
    navButtonRight: {
      left: undefined,
      right: 20,
    },
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={dynamicStyles.modalOverlay}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X color={colors.white} size={30} />
        </TouchableOpacity>

        {/* Image Counter */}
        <View style={dynamicStyles.counterContainer}>
          <Text style={[styles.counterText, { color: colors.white }]}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            {currentIndex > 0 && (
              <TouchableOpacity style={dynamicStyles.navButton} onPress={goToPrevious}>
                <ChevronLeft color={colors.white} size={30} />
              </TouchableOpacity>
            )}
            {currentIndex < images.length - 1 && (
              <TouchableOpacity style={[dynamicStyles.navButton, styles.navButtonRight]} onPress={goToNext}>
                <ChevronRight color={colors.white} size={30} />
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Image FlatList */}
        <FlatList
          data={images}
          renderItem={renderImage}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(newIndex);
          }}
          initialScrollIndex={currentIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  counterContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 10,
    transform: [{ translateY: -25 }],
  },
  navButtonRight: {
    left: undefined,
    right: 20,
  },
  imageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
});

export default PrescriptionGallery; 