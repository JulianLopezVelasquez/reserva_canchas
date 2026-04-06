import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
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
        if (!correo || !contrasena) {
            Alert.alert("Campos requeridos", "Por favor completa tu correo y contraseña");
            return;
        }

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
            <StatusBar barStyle="light-content" />
            <View style={styles.contentArea}>
                <View style={styles.headerBlock}>
                    <Text style={styles.title}>Bienvenido</Text>
                    <Text style={styles.subtitle}>Accede y reserva tu cancha preferida en segundos.</Text>
                </View>

                <View style={styles.formCard}>
                    <Text style={styles.inputLabel}>CORREO ELECTRÓNICO</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="ejemplo@correo.com" 
                        placeholderTextColor="#64748b"
                        value={correo}
                        onChangeText={setCorreo}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.inputLabel}>CONTRASEÑA</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="••••••••" 
                        placeholderTextColor="#64748b"
                        value={contrasena}
                        onChangeText={setContrasena}
                        secureTextEntry 
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>ENTRAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.linkText}>¿No tienes cuenta? <Text style={styles.linkHighlight}>Regístrate</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
        paddingHorizontal: 25,
        justifyContent: 'center',
    },
    contentArea: {
        width: '100%',
    },
    headerBlock: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '600',
        lineHeight: 22,
    },
    formCard: {
        backgroundColor: '#0f172a',
        borderRadius: 30,
        padding: 25,
        borderWidth: 1,
        borderColor: '#1e293b',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    inputLabel: {
        color: colors.accent,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#020617',
        borderRadius: 18,
        padding: 16,
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    button: {
        backgroundColor: colors.accent,
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
        elevation: 8,
        shadowColor: colors.accent,
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1,
    },
    registerLink: {
        marginTop: 25,
        alignItems: 'center',
    },
    linkText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
    },
    linkHighlight: {
        color: colors.accent,
        fontWeight: '800',
    },
});