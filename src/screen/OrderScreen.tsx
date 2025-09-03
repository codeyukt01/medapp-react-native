import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import OrderCard from '../components/OrderCard';
import { statusColors } from '../constants/orders';
import EmptyView from '../components/EmptyView';
import LogoHeader from '../components/LogoHeader';
import SCREENS from '../constants/screens';
import { getOrders } from '../api/orders';

const OrderScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { colors } = useTheme();
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Infinite scroll settings
  const [currentIndex, setCurrentIndex] = useState(0);
  const batchSize = 10; // Load 10 orders at a time

  // Function to get all orders via API
  const fetchOrdersViaAPI = async (page: number) => {
    try {
      if (page !== 1 && page > totalPages) {
        return;
      }
      const response = await getOrders({
        params: { page },
      });
      setTotalPages(response.pages);
      setTotalRecords(response.total);

      // Handle the response - it could be direct array or nested in data property
      const allOrdersData = response.data || response || [];
      setAllOrders([...allOrders, ...allOrdersData]);
      setDisplayedOrders([...allOrders, ...allOrdersData]);
      setCurrentIndex(batchSize);

      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('OrderScreen: Error fetching orders via API:', error);
      setAllOrders([]);
      setDisplayedOrders([]);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more orders for infinite scroll
  const loadMoreOrders = async () => {
    if (loadingMore || page === totalPages) {
      console.log(
        'LoadMore: Skipping - loadingMore:',
        loadingMore,
        'currentIndex:',
        currentIndex,
        'total:',
        allOrders.length,
      );
      return;
    }

    console.log('LoadMore: Loading more orders from index:', currentIndex);
    setLoadingMore(true);
    setPage(page + 1);
    fetchOrdersViaAPI(page + 1);
  };

  // Load orders on component mount
  useEffect(() => {
    console.log('OrderScreen: Component mounted, fetching orders...');
    fetchOrdersViaAPI(page);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setCurrentIndex(batchSize);
    setDisplayedOrders(allOrders.slice(0, batchSize));
    setRefreshing(false);
  };

  // Filter orders based on search term
  const filterOrders = (orders: any[], search: string) => {
    if (!search.trim()) return orders;

    const lowerSearch = search.toLowerCase();
    return orders.filter(
      order =>
        order.patientName?.toLowerCase().includes(lowerSearch) ||
        order.doctorName?.toLowerCase().includes(lowerSearch) ||
        order.orderid?.toLowerCase().includes(lowerSearch) ||
        order.status?.toLowerCase().includes(lowerSearch),
    );
  };

  // Update filtered orders when orders or search term changes
  useEffect(() => {
    const filtered = filterOrders(displayedOrders, searchTerm);
    setFilteredOrders(filtered);
  }, [displayedOrders, searchTerm]);

  const renderOrder = ({ item }: { item: any }) => (
    <OrderCard order={item} statusColors={statusColors} colors={colors} />
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text
            style={[styles.loadingMoreText, { color: colors.textSecondary }]}
          >
            Loading more orders...
          </Text>
        </View>
      );
    }

    if (currentIndex >= allOrders.length && allOrders.length > 0) {
      return (
        <View style={styles.endOfList}>
          <Text style={[styles.endOfListText, { color: colors.textSecondary }]}>
            You've reached the end of the list ({allOrders.length} orders)
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        All Orders
      </Text>
      {allOrders.length > 0 && (
        <Text style={[styles.orderCount, { color: colors.textSecondary }]}>
          {searchTerm
            ? `${filteredOrders.length} of ${displayedOrders.length}`
            : `${displayedOrders.length} of ${allOrders.length}`}{' '}
          order{allOrders.length !== 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LogoHeader title="Orders" />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {renderHeader()}

        {/* Debug Info - Remove this in production */}
        <View style={styles.debugContainer}>
          <Text style={[styles.debugText, { color: colors.textSecondary }]}>
            Debug: Total {allOrders.length}, Displayed {displayedOrders.length},
            Index {currentIndex}
          </Text>
          <Text style={[styles.debugText, { color: colors.textSecondary }]}>
            Has More: {currentIndex < allOrders.length ? 'Yes' : 'No'}, Loading:{' '}
            {loadingMore ? 'Yes' : 'No'}
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.text,
                  flex: 1,
                },
              ]}
              placeholder="Search orders by patient, doctor, or order ID..."
              placeholderTextColor={colors.placeholder}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchTerm('')}
              >
                <Text
                  style={[
                    styles.clearSearchText,
                    { color: colors.textSecondary },
                  ]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading && !refreshing ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : displayedOrders.length === 0 ? (
          <EmptyView title="No Orders Yet" />
        ) : searchTerm && filteredOrders.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text
              style={[styles.noResultsText, { color: colors.textSecondary }]}
            >
              No orders found matching "{searchTerm}"
            </Text>
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => setSearchTerm('')}
            >
              <Text style={[styles.clearSearchText, { color: colors.primary }]}>
                Clear Search
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={searchTerm ? filteredOrders : displayedOrders}
              keyExtractor={item => item.orderid}
              renderItem={renderOrder}
              contentContainerStyle={{ paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={onRefresh}
              removeClippedSubviews={false}
              maxToRenderPerBatch={20}
              windowSize={10}
              initialNumToRender={20}
              onEndReached={loadMoreOrders}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
            />

            {/* Manual Load More Button */}
            {!searchTerm &&
              allOrders.length > 0 &&
              page < totalPages &&
              !loadingMore && (
                <View style={styles.loadMoreButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.loadMoreButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={loadMoreOrders}
                  >
                    <Text
                      style={[
                        styles.loadMoreButtonText,
                        { color: colors.onPrimary },
                      ]}
                    >
                      Load More Orders ({totalRecords - allOrders.length}{' '}
                      remaining)
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  orderCount: {
    fontSize: 14,
    fontWeight: '400',
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    fontSize: 14,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  clearSearchButton: {
    padding: 5,
  },
  clearSearchText: {
    fontSize: 18,
  },
  noResultsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  noResultsText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadingMoreText: {
    marginLeft: 5,
  },
  endOfList: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  endOfListText: {
    fontSize: 14,
  },
  loadMoreButtonContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadMoreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loadMoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  debugContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
  },
});

export default OrderScreen;
