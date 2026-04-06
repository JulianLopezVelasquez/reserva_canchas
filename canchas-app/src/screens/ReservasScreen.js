import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
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
        navigation.setOptions({ 
            title: `Mis Reservas (${reservas.length})`,
            headerStyle: { backgroundColor: '#020617' },
            headerTintColor: '#fff'
        });
    }, [navigation, reservas.length]);

    const cancelarReserva = async (id) => {
        Alert.alert(
            "Confirmar Cancelación",
            "¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.",
            [
                { text: "No, mantener", style: "cancel" },
                { 
                    text: "Sí, cancelar", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/reservas/${id}`);
                            setReservas(reservas.filter(r => r.id !== id));
                            Alert.alert("Éxito", "Tu reserva ha sido cancelada correctamente.");
                        } catch (error) {
                            Alert.alert("Error", "No se pudo cancelar la reserva en este momento.");
                        }
                    }
                }
            ]
        );
    };

    const renderReserva = ({ item, index }) => (
        <TouchableOpacity 
            activeOpacity={0.9}
            style={styles.reservaCard} 
            onPress={() => navigation.navigate('DetalleReserva', { reserva: item, position: index + 1 })}
        >
            <View style={styles.cardHeader}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>#{index + 1}</Text>
                </View>
                <View style={styles.tipoBadge}>
                    <Text style={styles.tipoBadgeText}>{item.cancha.tipo.nombre}</Text>
                </View>
            </View>

            <View style={styles.mainInfo}>
                <View>
                    <Text style={styles.canchaNombre}>{item.cancha.nombre}</Text>
                    <Text style={styles.fechaText}>{item.fecha}</Text>
                </View>
                <MaterialIcons name="sports-soccer" size={32} color="rgba(255,255,255,0.1)" />
            </View>
            
            <View style={styles.infoRow}>
                <MaterialIcons name="access-time" size={16} color={colors.accent} />
                <Text style={styles.infoText}>
                    {item.horario.horaInicio.slice(0, 5)} - {item.horario.horaFin.slice(0, 5)}
                </Text>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => cancelarReserva(item.id)}
            >
                <MaterialIcons name="event-busy" size={18} color="#ef4444" />
                <Text style={styles.cancelText}>CANCELAR RESERVA</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.mainTitle}>Mis Reservas</Text>
            
            {reservas.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="event-note" size={80} color="#1e293b" />
                    <Text style={styles.emptyTitle}>Sin reservas activas</Text>
                    <Text style={styles.emptyDescription}>
                        Parece que aún no tienes planes. ¡Busca una cancha y empieza a jugar!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={reservas}
                    contentContainerStyle={styles.list}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderReserva}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#020617',
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 20,
        letterSpacing: -1,
    },
    list: {
        paddingBottom: 40,
    },
    reservaCard: {
        backgroundColor: '#0f172a',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    badge: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: '#64748b',
        fontWeight: '900',
        fontSize: 12,
    },
    tipoBadge: {
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.2)',
    },
    tipoBadgeText: {
        color: colors.accent,
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    mainInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    canchaNombre: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
    },
    fechaText: {
        color: '#64748b',
        fontWeight: '700',
        fontSize: 14,
        marginTop: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        color: '#cbd5e1',
        marginLeft: 6,
        fontWeight: '600',
        fontSize: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#1e293b',
        marginVertical: 12,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        color: '#ef4444',
        fontWeight: '900',
        marginLeft: 8,
        fontSize: 12,
        letterSpacing: 1,
    },
    emptyContainer: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
        marginTop: 20,
    },
    emptyDescription: {
        color: '#64748b',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 40,
    },
});