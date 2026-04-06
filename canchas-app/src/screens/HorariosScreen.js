import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    ActivityIndicator, 
    Alert, 
    TouchableOpacity,
    StatusBar 
} from 'react-native';
import api from '../api/api';
import { colors, spacing, radius, globalStyles } from '../styles/Theme';

const HorariosScreen = ({ route, navigation }) => {
    const { 
        canchaId, 
        canchaNombre = "Cancha", 
        sedeNombre = "Sede" 
    } = route.params || {};

    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatHora = (horaString) => {
        if (!horaString) return '';
        const [h, m] = horaString.split(':');
        return `${parseInt(h, 10)}${parseInt(m, 10) > 0 ? ':' + m : ''}`;
    };

    useEffect(() => {
        if (canchaId) {
            cargarHorarios();
        } else {
            Alert.alert("Error", "No se recibió el ID de la cancha.");
            navigation.goBack();
        }
    }, [canchaId]);

    const cargarHorarios = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/horarios/cancha/${canchaId}`);
            setHorarios(response.data);
        } catch (error) {
            console.error("Error al cargar horarios:", error);
            if (error.response && error.response.status === 403) {
                Alert.alert("Error 403", "Revisa que /api/horarios/** esté en permitAll en tu SecurityConfig.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.title}>{canchaNombre}</Text>
                <View style={styles.locationBadge}>
                    <Text style={styles.subtitle}>📍 {sedeNombre}</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            ) : (
                <FlatList
                    data={horarios}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <View style={[styles.card, !item.disponible && styles.cardOcupada]}>
                            <View style={styles.timeInfo}>
                                <Text style={[styles.hora, !item.disponible && styles.textMuted]}>
                                    {formatHora(item.horaInicio)} — {formatHora(item.horaFin)}
                                </Text>
                                <Text style={styles.turnoLabel}>
                                    {item.disponible ? "Turno disponible" : "No disponible"}
                                </Text>
                            </View>
                            
                            <TouchableOpacity 
                                style={[styles.btn, item.disponible ? styles.btnOk : styles.btnNo]}
                                disabled={!item.disponible}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.btnText, item.disponible ? styles.textBlack : styles.textWhite]}>
                                    {item.disponible ? "RESERVAR" : "OCUPADO"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.empty}>No hay horarios configurados para esta cancha.</Text>
                        </View>
                    }
                />
            )}

            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>VOLVER</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        marginBottom: 25,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -0.5,
    },
    locationBadge: {
        marginTop: 5,
        alignSelf: 'flex-start',
    },
    subtitle: {
        fontSize: 14,
        color: colors.accent,
        fontWeight: '700',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginBottom: 12,
        backgroundColor: '#0f172a',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    cardOcupada: {
        opacity: 0.6,
        borderColor: 'transparent',
    },
    timeInfo: {
        flex: 1,
    },
    hora: {
        fontSize: 20,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -0.5,
    },
    turnoLabel: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    textMuted: {
        color: '#475569',
    },
    btn: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        minWidth: 110,
        alignItems: 'center',
    },
    btnOk: {
        backgroundColor: colors.accent,
    },
    btnNo: {
        backgroundColor: '#1e293b',
    },
    btnText: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    textBlack: {
        color: '#000',
    },
    textWhite: {
        color: '#64748b',
    },
    back: {
        backgroundColor: '#0f172a',
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    backText: {
        color: '#fff',
        fontWeight: '800',
        letterSpacing: 1,
        fontSize: 13,
    },
    emptyState: {
        marginTop: 50,
        alignItems: 'center',
    },
    empty: {
        textAlign: 'center',
        color: '#64748b',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default HorariosScreen;