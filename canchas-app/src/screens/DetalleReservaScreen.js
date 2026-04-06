import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { colors, spacing, radius, globalStyles } from '../styles/Theme';
import api from '../api/api';

const DetalleReservaScreen = ({ route, navigation }) => {
    const { reserva, position } = route.params;

    const formatHora = (horaString) => {
        if (!horaString) return '';
        const [h, m] = horaString.split(':');
        return `${parseInt(h, 10)}${parseInt(m, 10) > 0 ? ':' + m : ''}`;
    };

    const cancelar = async () => {
        Alert.alert(
            "Confirmar",
            "¿Estás seguro de que quieres cancelar esta reserva?",
            [
                { text: "No", style: "cancel" },
                { text: "Sí", onPress: async () => {
                    try {
                        await api.delete(`/reservas/${reserva.id}`);
                        Alert.alert("Éxito", "Reserva cancelada.");
                        navigation.goBack();
                    } catch (error) {
                        Alert.alert("Error", "No se pudo cancelar la reserva.");
                    }
                }}
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.contentArea}>
                <Text style={styles.title}>Reserva #{position ?? reserva.id}</Text>
                
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionLabel}>DETALLES DEL TURNO</Text>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Cancha</Text>
                        <Text style={styles.infoValue}>{reserva.cancha.nombre}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Sede</Text>
                        <Text style={styles.infoValue}>📍 {reserva.cancha.sede.nombre}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Fecha</Text>
                        <Text style={styles.infoValue}>{reserva.fecha}</Text>
                    </View>

                    <View style={styles.horarioContainer}>
                        <Text style={styles.horarioText}>
                            {formatHora(reserva.horario.horaInicio)} — {formatHora(reserva.horario.horaFin)}
                        </Text>
                        <Text style={styles.turnoStatus}>Turno Reservado</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.cancelButton} onPress={cancelar}>
                    <Text style={styles.cancelText}>CANCELAR RESERVA</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>VOLVER</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#020617',
        padding: 20
    },
    contentArea: {
        flex: 1,
        justifyContent: 'center'
    },
    title: { 
        fontSize: 32, 
        fontWeight: '900', 
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30
    },
    sectionCard: { 
        backgroundColor: '#0f172a', 
        borderRadius: 24, 
        padding: 20, 
        marginBottom: 25, 
        borderWidth: 1, 
        borderColor: '#1e293b',
        elevation: 5
    },
    sectionLabel: { 
        color: '#64748b', 
        fontSize: 10, 
        fontWeight: '900', 
        letterSpacing: 1.5,
        marginBottom: 20,
        textAlign: 'center'
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)'
    },
    infoLabel: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600'
    },
    infoValue: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700'
    },
    horarioContainer: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.accent
    },
    horarioText: {
        color: colors.accent,
        fontSize: 24,
        fontWeight: '900'
    },
    turnoStatus: {
        color: '#64748b',
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        marginTop: 4
    },
    cancelButton: { 
        backgroundColor: '#ef4444', 
        padding: 20, 
        borderRadius: 22, 
        alignItems: 'center', 
        elevation: 8,
        shadowColor: '#ef4444',
        shadowOpacity: 0.3,
        shadowRadius: 10
    },
    cancelText: { 
        color: '#fff', 
        fontWeight: '900', 
        fontSize: 16,
        letterSpacing: 1
    },
    backButton: {
        marginTop: 20,
        padding: 15,
        alignItems: 'center'
    },
    backButtonText: {
        color: '#64748b',
        fontWeight: '800',
        fontSize: 12,
        letterSpacing: 1
    }
});

export default DetalleReservaScreen;