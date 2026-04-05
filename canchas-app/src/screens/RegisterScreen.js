import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../api/api';
import { colors, spacing, radius, globalStyles } from '../styles/Theme';

export default function RegisterScreen({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        // Validar que todos los campos estén completos
        if (!nombre || !correo || !contrasena || !confirmarContrasena) {
            Alert.alert("Campos incompletos", "Por favor completa todos los campos");
            return;
        }
        
        // Validar nombre
        if (nombre.trim().length < 3) {
            Alert.alert("Nombre inválido", "El nombre debe tener al menos 3 caracteres");
            return;
        }
        
        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            Alert.alert("Correo inválido", "Por favor ingresa un correo electrónico válido");
            return;
        }
        
        // Validar contraseña
        if (contrasena.length < 6) {
            Alert.alert("Contraseña débil", "La contraseña debe tener al menos 6 caracteres");
            return;
        }
        
        // Validar coincidencia de contraseñas
        if (contrasena !== confirmarContrasena) {
            Alert.alert("Contraseñas no coinciden", "Las contraseñas ingresadas no son iguales");
            return;
        }
        
        setLoading(true);
        try {
            const response = await api.post('/auth/register', { nombre, correo, contrasena });
            Alert.alert("¡Registro exitoso!", "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.", [
                { text: "OK", onPress: () => navigation.navigate('Login') }
            ]);
        } catch (error) {
            console.log("Error Register:", error.response?.status);
            const mensajeError = error.response?.data?.message || "El correo ya está registrado o hubo un error. Intenta con otro correo.";
            Alert.alert("Error en el registro", mensajeError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Crear cuenta</Text>
                <Text style={styles.subtitle}>Únete y reserva canchas sin esperas.</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    placeholderTextColor={colors.placeholder}
                    value={nombre}
                    onChangeText={setNombre}
                    autoCapitalize="words"
                />
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
                <TextInput
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor={colors.placeholder}
                    value={confirmarContrasena}
                    onChangeText={setConfirmarContrasena}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={colors.secondary} />
                    ) : (
                        <Text style={styles.buttonText}>Registrarse</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    },
    subtitle: {
        ...globalStyles.sectionSubtitle,
        marginBottom: spacing.lg,
    },
    input: {
        ...globalStyles.input,
        marginBottom: spacing.sm,
    },
    button: {
        ...globalStyles.button,
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },
    buttonText: {
        ...globalStyles.buttonText,
    },
    loginLink: {
        alignItems: 'center',
    },
    linkText: {
        color: colors.accent,
        fontSize: 15,
        fontWeight: '700',
    },
});