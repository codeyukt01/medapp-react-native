import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, OrderScreen, SupportScreen, ProfileScreen } from '../screen';
import { useTheme } from '../theme';
import SCREENS from '../constants/screens';
import { House, ShoppingBag, PlusCircle, LifeBuoy, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const Tabs: React.FC = () => {
  const { colors } = useTheme();
  
  // Create a dummy component for the Create Order tab
  const CreateOrderTab = () => {
    return null; // This component will never be rendered
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.placeholder,
        tabBarStyle: { backgroundColor: colors.background },
        tabBarLabelStyle: { fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          if (route.name === SCREENS.HOME) return <House color={color} size={24} />;
          if (route.name === SCREENS.ORDER) return <ShoppingBag color={color} size={24} />;
          if (route.name === SCREENS.CREATE_ORDER) return <PlusCircle color={color} size={24} />;
          if (route.name === SCREENS.SUPPORT) return <LifeBuoy color={color} size={24} />;
          if (route.name === SCREENS.PROFILE) return <User color={color} size={24} />;
          return null;
        },
      })}
      screenListeners={({ navigation, route }) => ({
        tabPress: (e) => {
          // Handle Create Order tab press
          if (route.name === SCREENS.CREATE_ORDER) {
            e.preventDefault();
            navigation.navigate(SCREENS.UPLOAD_PRESCRIPTION);
          }
        },
      })}
    >
      <Tab.Screen name={SCREENS.HOME} component={HomeScreen} />
      <Tab.Screen name={SCREENS.ORDER} component={OrderScreen} />
      <Tab.Screen name={SCREENS.CREATE_ORDER} component={CreateOrderTab} />
      <Tab.Screen name={SCREENS.SUPPORT} component={SupportScreen} />
      <Tab.Screen name={SCREENS.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default Tabs; 