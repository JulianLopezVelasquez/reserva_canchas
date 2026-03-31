import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../api/api';

export default function LoginScreen({ navigation }) {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    useEffect(() => {
        const limpiarCaché = async () => {
            await SecureStore.deleteItemAsync('userToken');
        };
        limpiarCaché();
    }, []);

    const handleLogin = async () => {
        if (!correo || !contrasena) {
            Alert.alert("Error", "Por favor llena todos los campos");
            return;
        }
        try {
            const response = await api.post('/auth/login', { correo, contrasena });
            const token = response.data.token;
            

            await SecureStore.setItemAsync('userToken', token);
            
            navigation.replace('Home'); 
        } catch (error) {
            console.log("Error Login:", error.response?.status);
            Alert.alert("Error", "Credenciales incorrectas o error de conexión");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CanchasApp</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Correo electrónico" 
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput 
                style={styles.input} 
                placeholder="Contraseña" 
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry 
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#2ecc71' },
    input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
    button: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});