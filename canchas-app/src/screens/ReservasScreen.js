import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/api';
import { colors, spacing, radius, globalStyles } from '../styles/Theme';

export default function ReservasScreen({ navigation }) {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReservas = useCallback(async () => {
        try {
            const response = await api.get('/reservas/mis-reservas');
            setReservas(response.data);
        } catch (error) {
            console.log("Error fetching reservas:", error);
            Alert.alert("Error", "No se pudieron cargar las reservas");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchReservas();
        }, [fetchReservas])
    );

    useLayoutEffect(() => {
        navigation.setOptions({ title: `Mis Reservas (${reservas.length})` });
    }, [navigation, reservas.length]);

    const cancelarReserva = async (id) => {
        Alert.alert(
            "Confirmar",
            "¿Estás seguro de que quieres cancelar esta reserva?",
            [
                { text: "No", style: "cancel" },
                { text: "Sí", onPress: async () => {
                    try {
                        await api.delete(`/reservas/${id}`);
                        setReservas(reservas.filter(r => r.id !== id));
                        Alert.alert("Éxito", "Reserva cancelada");
                    } catch (error) {
                        Alert.alert("Error", "No se pudo cancelar la reserva");
                    }
                }}
            ]
        );
    };

    const renderReserva = ({ item, index }) => (
        <TouchableOpacity style={styles.reservaItem} onPress={() => navigation.navigate('DetalleReserva', { reserva: item, position: index + 1 })}>
            <Text style={styles.reservaNumber}>Reserva #{index + 1}</Text>
            <Text style={styles.cancha}>Cancha: {item.cancha.nombre}</Text>
            <Text>Fecha: {item.fecha}</Text>
            <Text>Hora: {item.horario.horaInicio} - {item.horario.horaFin}</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={() => cancelarReserva(item.id)}>
                <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando tus reservas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis reservas</Text>
            {reservas.length === 0 ? (
                <View style={styles.emptyBlock}>
                    <Text style={styles.emptyTitle}>Aún no tienes reservas</Text>
                    <Text style={styles.emptyDescription}>Busca una cancha y haz tu primera reserva.</Text>
                </View>
            ) : (
                <FlatList
                    data={reservas}
                    contentContainerStyle={styles.list}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderReserva}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.screen,
        padding: spacing.lg,
    },
    loadingText: {
        color: colors.textMuted,
        fontSize: 16,
        textAlign: 'center',
        marginTop: spacing.xl,
    },
    title: {
        ...globalStyles.sectionTitle,
        marginBottom: spacing.lg,
    },
    list: {
        paddingBottom: spacing.xxl,
    },
    reservaNumber: {
        fontSize: 16,
        fontWeight: '900',
        color: colors.primaryLight,
        marginBottom: spacing.xs,
    },
    reservaItem: {
        ...globalStyles.card,
        padding: spacing.lg,
        marginBottom: spacing.md,
        backgroundColor: '#0d1938',
    },
    cancha: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.primaryLight,
        marginBottom: spacing.xs,
    },
    detalle: {
        color: colors.textMuted,
        marginBottom: spacing.xs,
    },
    cancelButton: {
        backgroundColor: colors.danger,
        padding: spacing.sm,
        borderRadius: radius.rounded,
        marginTop: spacing.sm,
        alignItems: 'center',
    },
    cancelText: {
        color: '#fff',
        fontWeight: '700',
    },
    emptyBlock: {
        marginTop: spacing.xxl,
        alignItems: 'center',
    },
    emptyTitle: {
        color: colors.secondary,
        fontSize: 20,
        fontWeight: '800',
        marginBottom: spacing.xs,
    },
    emptyDescription: {
        color: colors.textMuted,
        fontSize: 15,
        textAlign: 'center',
        maxWidth: '80%',
    },
});