import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { useTheme } from '../theme';

const { width } = Dimensions.get('window');

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: string;
}

interface BannerProps {
  banners: BannerItem[];
}

const Banner: React.FC<BannerProps> = ({ banners }) => {
  const { colors } = useTheme();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Scroll to current banner
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentBannerIndex * width,
        animated: true,
      });
    }
  }, [currentBannerIndex]);

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentBannerIndex(newIndex);
        }}
      >
        {banners.map((banner, index) => (
          <View key={banner.id} style={[styles.bannerContainer, { width }]}>
            <View style={[styles.banner, { backgroundColor: banner.backgroundColor }]}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
              </View>
              <Image source={{ uri: banner.image }} style={styles.bannerImage} />
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* Banner Indicators */}
      <View style={styles.indicators}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === currentBannerIndex ? colors.primary : colors.placeholder,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 160,
    marginBottom: 16,
  },
  bannerContainer: {
    height: 160,
  },
  banner: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  bannerImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 12,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default Banner; 