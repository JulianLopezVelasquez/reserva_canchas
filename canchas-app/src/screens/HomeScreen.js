import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { colors, spacing, radius, globalStyles } from '../styles/Theme';
import api from '../api/api';

const HomeScreen = ({ navigation }) => {
    const [sedes, setSedes] = useState([]);
    const [cargando, setCargando] = useState(true);

    const uniqueByKey = (items, keyFn) => Array.from(new Map(items.map(item => [keyFn(item), item])).values());

    useEffect(() => {
        const cargarSedes = async () => {
            try {
                const response = await api.get('/sedes');
                setSedes(uniqueByKey(response.data, item => `${item.nombre}|${item.direccion}`));
            } catch (error) {
                console.error("Error cargando sedes:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarSedes();
    }, []);

    if (cargando) return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sedes</Text>
            <Text style={styles.subtitle}>Selecciona una ubicación y encuentra la cancha ideal.</Text>
            <FlatList
                data={sedes}
                contentContainerStyle={styles.list}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.sedeCard} 
                        onPress={() => navigation.navigate('ListaCanchas', { 
                            sedeId: item.id, 
                            sedeNombre: item.nombre 
                        })}
                    >
                        <View style={styles.sedeInfo}>
                            <Text style={styles.sedeName}>{item.nombre}</Text>
                            <Text style={styles.sedeDir}>{item.direccion}</Text>
                        </View>
                        <View style={styles.sedeMarker} />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...globalStyles.screen,
        padding: spacing.lg,
    },
    list: {
        paddingTop: spacing.sm,
        paddingBottom: spacing.xxl,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    title: {
        ...globalStyles.sectionTitle,
        marginBottom: spacing.xs,
        letterSpacing: 0.5,
    },
    subtitle: {
        ...globalStyles.sectionSubtitle,
        marginBottom: spacing.lg,
        maxWidth: '90%',
    },
    sedeCard: {
        ...globalStyles.card,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        marginBottom: spacing.md,
        backgroundColor: '#111e3a',
    },
    sedeInfo: {
        flex: 1,
    },
    sedeName: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.primaryLight,
    },
    sedeDir: {
        fontSize: 14,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    sedeMarker: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.accent,
    },
});

export default HomeScreen;