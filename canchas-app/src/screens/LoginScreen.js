import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../api/api';
import { colors, spacing, radius, globalStyles } from '../styles/Theme';

export default function LoginScreen({ navigation }) {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    useEffect(() => {
        const checkToken = async () => {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                navigation.replace('Main');
            }
        };
        checkToken();
    }, []);

    const handleLogin = async () => {
        // Validaciones básicas
        if (!correo || !contrasena) {
            Alert.alert("Campos requeridos", "Por favor completa tu correo y contraseña");
            return;
        }
        
        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            Alert.alert("Correo inválido", "Por favor ingresa un correo electrónico válido");
            return;
        }
        
        if (contrasena.length < 6) {
            Alert.alert("Contraseña inválida", "La contraseña debe tener al menos 6 caracteres");
            return;
        }

        try {
            const response = await api.post('/auth/login', { correo, contrasena });
            const token = response.data.token;
            const usuario = response.data.usuario;

            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userData', JSON.stringify(usuario));
            
            navigation.replace('Main'); 
        } catch (error) {
            console.log("Error Login:", error.response?.status);
            const mensajeError = error.response?.data?.message || "Credenciales incorrectas. Verifica tu correo y contraseña.";
            Alert.alert("Error de inicio de sesión", mensajeError);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Bienvenido</Text>
                <Text style={styles.subtitle}>Accede y reserva tu cancha preferida en segundos.</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Correo electrónico" 
                    placeholderTextColor={colors.placeholder}
                    value={correo}
                    onChangeText={setCorreo}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Contraseña" 
                    placeholderTextColor={colors.placeholder}
                    value={contrasena}
                    onChangeText={setContrasena}
                    secureTextEntry 
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>Crear una cuenta nueva</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.screen,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    card: {
        ...globalStyles.card,
        padding: spacing.xl,
        borderRadius: radius.rounded,
        backgroundColor: '#0d1834',
    },
    title: {
        ...globalStyles.sectionTitle,
        fontSize: 34,
        marginBottom: spacing.xs,
        color: colors.secondary,
    },
    subtitle: {
        ...globalStyles.sectionSubtitle,
        marginBottom: spacing.lg,
        lineHeight: 22,
    },
    input: {
        ...globalStyles.input,
        marginBottom: spacing.sm,
        color: colors.text,
    },
    button: {
        ...globalStyles.button,
        marginTop: spacing.md,
    },
    buttonText: {
        ...globalStyles.buttonText,
    },
    registerLink: {
        marginTop: spacing.md,
        alignItems: 'center',
    },
    linkText: {
        color: colors.accent,
        fontSize: 15,
        fontWeight: '700',
    },
});