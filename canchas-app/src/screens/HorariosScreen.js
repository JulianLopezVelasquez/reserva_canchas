import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    ActivityIndicator, 
    Alert, 
    TouchableOpacity 
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
            <View style={styles.header}>
                <Text style={styles.title}>{canchaNombre}</Text>
                <Text style={styles.subtitle}>📍 {sedeNombre}</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#2ecc71" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={horarios}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.hora}>{item.horaInicio} - {item.horaFin}</Text>
                            <TouchableOpacity 
                                style={[styles.btn, item.disponible ? styles.btnOk : styles.btnNo]}
                                disabled={!item.disponible}
                            >
                                <Text style={styles.btnText}>
                                    {item.disponible ? "Reservar" : "Ocupado"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.empty}>No hay horarios disponibles.</Text>}
                />
            )}

            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>VOLVER</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...globalStyles.screen,
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        color: colors.primaryLight,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    card: {
        ...globalStyles.card,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        marginBottom: spacing.sm,
        backgroundColor: '#0f1a3d',
        borderColor: 'rgba(148,163,184,0.16)',
    },
    hora: {
        fontSize: 17,
        fontWeight: '800',
        color: colors.secondary,
    },
    btn: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.rounded,
    },
    btnOk: {
        backgroundColor: colors.accent,
    },
    btnNo: {
        backgroundColor: '#34415e',
    },
    btnText: {
        color: '#fff',
        fontWeight: '700',
    },
    back: {
        backgroundColor: '#15264d',
        padding: spacing.sm,
        borderRadius: radius.rounded,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    empty: {
        textAlign: 'center',
        marginTop: spacing.xl,
        color: colors.textMuted,
    },
});

export default HorariosScreen;