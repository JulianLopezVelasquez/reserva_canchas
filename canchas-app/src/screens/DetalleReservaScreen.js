import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, radius, globalStyles } from '../styles/Theme';
import api from '../api/api';

const DetalleReservaScreen = ({ route, navigation }) => {
    const { reserva, position } = route.params;

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
            <View style={styles.card}>
                <Text style={styles.title}>Reserva #{position ?? reserva.id}</Text>
                <Text style={styles.info}>Cancha: {reserva.cancha.nombre}</Text>
                <Text style={styles.info}>Sede: {reserva.cancha.sede.nombre}</Text>
                <Text style={styles.info}>Fecha: {reserva.fecha}</Text>
                <Text style={styles.info}>Horario: {reserva.horario.horaInicio} - {reserva.horario.horaFin}</Text>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelar}>
                    <Text style={styles.cancelText}>Cancelar Reserva</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...globalStyles.screen,
        padding: spacing.lg,
    },
    card: {
        ...globalStyles.card,
        padding: spacing.lg,
        backgroundColor: '#0f1c45',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: colors.primaryLight,
        marginBottom: spacing.md,
    },
    info: {
        fontSize: 16,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    cancelButton: {
        backgroundColor: colors.danger,
        paddingVertical: spacing.sm,
        borderRadius: radius.rounded,
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    cancelText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
});

export default DetalleReservaScreen;