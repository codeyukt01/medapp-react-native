import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SCREENS from '../constants/screens';
import { CheckCircle, Clock, XCircle, Tag, CreditCard, Loader, Truck, Package } from 'lucide-react-native';
import { formatDate } from '../utils/dateFormeter';

interface Order {
  orderid: string;
  orderStatus: string;
  orderDate: string;
  doctorName?: string;
}

interface OrderCardProps {
  order: Order;
  statusColors: Record<string, string>;
  colors: any;
}

const statusIconMap: Record<string, React.ComponentType<{ color: string; size?: number; style?: any }>> = {
  'Completed': CheckCircle,
  'Pending Verification': Clock,
  'Prescription Rejected': XCircle,
  'Price Quoted': Tag,
  'Payment Awaiting': CreditCard,
  'Preparing': Loader,
  'Out for Delivery': Truck,
  'Delivered': Package,
};

const OrderCard: React.FC<OrderCardProps> = ({ order, statusColors, colors }) => {

  const Icon = statusIconMap[order.orderStatus];
  const navigation = useNavigation();
  return (
    <View style={[styles.orderCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}> 
      <View style={[styles.statusBar, { backgroundColor: statusColors[order.orderStatus] || '#222' }]} />
      <View style={styles.orderContent}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={[styles.orderName, { color: colors.text }]}>{`ORD${order.orderid}`}</Text>
            {order.doctorName && (
              <Text style={[styles.doctorName, { color: colors.placeholder }]}>{order.doctorName}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => (navigation as any).navigate(SCREENS.ORDER_DETAILS, { order })}>
            <Text style={[styles.viewLink, { color: colors.info }]}>View</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.orderFooter}>
          <Text style={[styles.orderTime, { color: colors.placeholder }]}>{formatDate(order.orderDate)}</Text>
          <View style={styles.statusRow}>
            {Icon && <Icon color={statusColors[order.orderStatus] || '#222'} size={16} style={{ marginRight: 4 }} />}
            <Text style={[styles.orderStatus, { color: statusColors[order.orderStatus] || '#222' }]}>{order.orderStatus.toUpperCase()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 72,
  },
  statusBar: {
    width: 5,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  orderContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderName: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  doctorName: {
    fontSize: 13,
    marginTop: 2,
  },
  viewLink: {
    fontSize: 15,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  orderTime: {
    fontSize: 13,
  },
  orderStatus: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default OrderCard; 