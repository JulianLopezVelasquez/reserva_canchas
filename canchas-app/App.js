import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ListaCanchasScreen from './src/screens/ListaCanchasScreen';
import HorariosScreen from './src/screens/HorariosScreen';
import DetalleCanchaScreen from './src/screens/DetalleCanchaScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Seleccionar Sede' }} 
        />

        <Stack.Screen 
          name="ListaCanchas" 
          component={ListaCanchasScreen} 
          options={{ title: 'Canchas Disponibles' }} 
        />

        <Stack.Screen 
          name="Horarios" 
          component={HorariosScreen} 
          options={{ title: 'Horarios' }} 
        />
        <Stack.Screen 
          name="DetalleCancha"
          component={DetalleCanchaScreen} 
          options={{ title: 'Detalle de la Cancha' }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}