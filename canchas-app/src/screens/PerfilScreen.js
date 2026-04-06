import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { logout } from '../api/api';
import { colors, spacing, radius, globalStyles } from '../styles/Theme';

export default function PerfilScreen({ navigation }) {
    const [usuario, setUsuario] = useState(null);
    const [taps, setTaps] = useState(0); 

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

    const handleSecretTap = () => {
        const nextTap = taps + 1;
        setTaps(nextTap);

        if (nextTap === 5) {
            setTaps(0);
            if (usuario?.rol === 'ROLE_ADMIN') {
                navigation.navigate('AdminPanel');
            } else {
                Alert.alert("Acceso denegado", "Solo el administrador puede entrar.");
            }
        }

        setTimeout(() => setTaps(0), 2000);
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
            <StatusBar barStyle="light-content" />
            <View style={styles.contentArea}>
                <TouchableOpacity 
                    onPress={handleSecretTap} 
                    activeOpacity={1}
                    style={styles.headerBlock}
                >
                    <Text style={styles.title}>Mi Perfil</Text>
                    <View style={styles.divider} />
                </TouchableOpacity>

                <View style={styles.profileCard}>
                    {usuario && (
                        <View style={styles.infoBlock}>
                            <View style={styles.dataGroup}>
                                <Text style={styles.label}>NOMBRE COMPLETO</Text>
                                <Text style={styles.info}>{usuario.nombre}</Text>
                            </View>

                            <View style={styles.dataGroup}>
                                <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                                <Text style={styles.info}>{usuario.correo}</Text>
                            </View>

                            <View style={styles.dataGroup}>
                                <Text style={styles.label}>NIVEL DE ACCESO</Text>
                                <View style={styles.roleBadge}>
                                    <Text style={styles.roleText}>
                                        {usuario.rol || 'USER'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.versionText}>Versión 1.0.4 — Reserva Canchas</Text>
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
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -1,
    },
    divider: {
        width: 40,
        height: 4,
        backgroundColor: colors.accent,
        marginTop: 10,
        borderRadius: 2,
    },
    profileCard: {
        backgroundColor: '#0f172a',
        borderRadius: 30,
        padding: 30,
        borderWidth: 1,
        borderColor: '#1e293b',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    infoBlock: {
        marginBottom: 20,
    },
    dataGroup: {
        marginBottom: 25,
    },
    label: {
        color: '#64748b',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    info: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '700',
    },
    roleBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.2)',
    },
    roleText: {
        color: colors.accent,
        fontSize: 12,
        fontWeight: '900',
    },
    logoutButton: {
        backgroundColor: '#ef4444',
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
    },
    logoutText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 15,
        letterSpacing: 1,
    },
    versionText: {
        textAlign: 'center',
        color: '#334155',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 30,
    }
});