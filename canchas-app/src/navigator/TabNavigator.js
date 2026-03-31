import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'; 
import ReservasScreen from '../screens/ReservasScreen';
import PerfilScreen from '../screens/PerfilScreen'; 

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: true }}>
            <Tab.Screen name="Explorar" component={HomeScreen} options={{ title: 'Canchas' }} />
            <Tab.Screen name="Mis Reservas" component={ReservasScreen} />
            <Tab.Screen name="Perfil" component={PerfilScreen} />
        </Tab.Navigator>
    );
};

export default TabNavigator;