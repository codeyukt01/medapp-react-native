import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import SCREENS from '../constants/screens';
import OrderCard from '../components/OrderCard';
import { statusColors } from '../constants/orders';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '../components/Button';
import EmptyView from '../components/EmptyView';
import LogoHeader from '../components/LogoHeader';
import Banner from '../components/Banner';
import { getOrders } from '../api/orders';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { colors } = useTheme();
  const [orders, setOrders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Banner data
  const banners = [
    {
      id: '1',
      title: 'Free Delivery',
      subtitle: 'On orders above ₹500',
      image: 'https://picsum.photos/400/200?random=1',
      backgroundColor: colors.success,
    },
    {
      id: '2',
      title: 'Express Delivery',
      subtitle: 'Same day delivery available',
      image: 'https://picsum.photos/400/200?random=2',
      backgroundColor: colors.info,
    },
    {
      id: '3',
      title: 'Special Discount',
      subtitle: '20% off on first order',
      image: 'https://picsum.photos/400/200?random=3',
      backgroundColor: colors.warning,
    },
  ];

  // Function to get orders via API
  const fetchOrdersViaAPI = async () => {
    try {
      console.log('HomeScreen: Fetching recent orders via API...');
      const response = await getOrders(); // Get all orders for home screen
      console.log('HomeScreen: API response:', response);
      setOrders(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('HomeScreen: Error fetching orders via API:', error);
      setOrders([]);
      setLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    console.log('HomeScreen: Component mounted, fetching orders...');
    fetchOrdersViaAPI();
  }, []);



  const onRefresh = async () => {
    setRefreshing(true);
    // Try API as fallback
    await fetchOrdersViaAPI();
    setRefreshing(false);
  };

  const renderOrder = ({ item }: { item: any }) => (
     <OrderCard order={item} statusColors={statusColors} colors={colors} />
  );



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} accessibilityLabel="HomeScreen" testID="HomeScreen">
      <LogoHeader title='Home' />
      
      {/* Banner Carousel */}
      <Banner banners={banners} />

      {/* Main Content */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Orders</Text>

        </View>
        
        {loading && !refreshing ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : orders.length === 0 ? (
          <EmptyView
            title="No Orders Yet"
          />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item.orderid}
            renderItem={renderOrder}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderWidth: 1,
    alignSelf: 'flex-start',
    minHeight: 24,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: '#4CAF50',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyImage: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    maxWidth: 260,
  },
});

export default HomeScreen; 