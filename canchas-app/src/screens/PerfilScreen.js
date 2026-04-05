import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { logout } from '../api/api';
import { colors, spacing, radius, globalStyles } from '../styles/Theme';

export default function PerfilScreen({ navigation }) {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        try {
            const userData = await SecureStore.getItemAsync('userData');
            if (userData) {
                setUsuario(JSON.parse(userData));
            }
        } catch (error) {
            console.log("Error getting user info:", error);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Cerrar sesión",
            "¿Deseas cerrar sesión? Deberás iniciar sesión nuevamente.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Cerrar sesión", style: "destructive", onPress: async () => {
                    try {
                        await logout();
                        navigation.replace('Login');
                    } catch (error) {
                        console.log("Error logout:", error);
                        navigation.replace('Login');
                    }
                }}
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Mi perfil</Text>
                {usuario && (
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Nombre</Text>
                        <Text style={styles.info}>{usuario.nombre}</Text>
                        <Text style={styles.label}>Correo</Text>
                        <Text style={styles.info}>{usuario.correo}</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.screen,
        padding: spacing.lg,
        justifyContent: 'center',
    },
    card: {
        ...globalStyles.card,
        padding: spacing.xl,
        margin: spacing.md,
        backgroundColor: '#0d1834',
    },
    title: {
        ...globalStyles.sectionTitle,
        fontSize: 32,
        marginBottom: spacing.md,
    },
    infoBlock: {
        marginBottom: spacing.lg,
    },
    label: {
        ...globalStyles.label,
        marginTop: spacing.sm,
    },
    info: {
        fontSize: 18,
        color: colors.secondary,
        marginTop: spacing.xs,
    },
    logoutButton: {
        backgroundColor: colors.danger,
        paddingVertical: spacing.sm,
        borderRadius: radius.rounded,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '800',
    },
});