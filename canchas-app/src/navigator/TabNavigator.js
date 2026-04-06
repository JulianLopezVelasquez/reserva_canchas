import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/Theme';

import HomeScreen from '../screens/HomeScreen';
import ListaCanchasScreen from '../screens/ListaCanchasScreen';
import DetalleCanchaScreen from '../screens/DetalleCanchaScreen';
import ReservasScreen from '../screens/ReservasScreen';
import DetalleReservaScreen from '../screens/DetalleReservaScreen';
import PerfilScreen from '../screens/PerfilScreen';
import AdminPanel from '../screens/AdminPanel';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const globalStackOptions = {
    headerShown: true,
    headerTitle: '',
    headerStyle: {
        backgroundColor: '#020617',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
    },
    headerTintColor: '#fff',
    cardStyle: { backgroundColor: '#020617' }
};

const CanchasStack = () => (
  <Stack.Navigator screenOptions={globalStackOptions}>
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Sedes' }} />
    <Stack.Screen name="ListaCanchas" component={ListaCanchasScreen} options={{ title: 'Canchas Disponibles' }} />
    <Stack.Screen name="DetalleCancha" component={DetalleCanchaScreen} options={{ title: 'Detalle de la Cancha' }} />
  </Stack.Navigator>
);

const ReservasStack = () => (
  <Stack.Navigator screenOptions={globalStackOptions}>
    <Stack.Screen name="Reservas" component={ReservasScreen} options={{ title: 'Mis Reservas' }} />
    <Stack.Screen name="DetalleReserva" component={DetalleReservaScreen} options={{ title: 'Detalle de Reserva' }} />
  </Stack.Navigator>
);

const PerfilStack = () => (
  <Stack.Navigator screenOptions={globalStackOptions}>
    <Stack.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil' }} />
    <Stack.Screen name="AdminPanel" component={AdminPanel} options={{ title: 'Admin' }} />
  </Stack.Navigator>
);

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarStyle: { 
                    paddingBottom: 6, 
                    height: 64, 
                    backgroundColor: colors.surface, 
                    borderTopColor: 'transparent',
                    elevation: 0 
                },
                tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'CanchasTab') {
                        iconName = 'sports-soccer';
                    } else if (route.name === 'ReservasTab') {
                        iconName = 'book-online';
                    } else if (route.name === 'PerfilTab') {
                        iconName = 'person';
                    }

                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="CanchasTab" component={CanchasStack} options={{ title: 'Canchas' }} />
            <Tab.Screen name="ReservasTab" component={ReservasStack} options={{ title: 'Mis Reservas' }} />
            <Tab.Screen name="PerfilTab" component={PerfilStack} options={{ title: 'Perfil' }} />
        </Tab.Navigator>
    );
};

export default TabNavigator;