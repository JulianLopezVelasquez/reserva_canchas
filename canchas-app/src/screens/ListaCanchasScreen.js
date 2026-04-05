import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../api/api';
import { colors, spacing, radius, globalStyles } from '../styles/Theme';

const ListaCanchasScreen = ({ route, navigation }) => {
    const { sedeId, sedeNombre } = route.params;
    const [canchas, setCanchas] = useState([]);
    const [canchasFiltradas, setCanchasFiltradas] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const uniqueByKey = (items, keyFn) => Array.from(new Map(items.map(item => [keyFn(item), item])).values());

    useEffect(() => {
        cargarDatos();
    }, [sedeId, filtroTipo]);

    useEffect(() => {
        filtrarCanchas();
    }, [busqueda, canchas]);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const params = { sedeId };
            if (filtroTipo !== null) {
                params.tipoId = filtroTipo;
            }
            const [canchasRes, tiposRes] = await Promise.all([
                api.get('/canchas', { params }),
                api.get('/tipos-cancha')
            ]);
            setCanchas(uniqueByKey(canchasRes.data, item => `${item.nombre}|${item.sede?.id}|${item.tipo?.id}`));
            setTipos(uniqueByKey(tiposRes.data, item => item.nombre));
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setCargando(false);
        }
    };

    const filtrarCanchas = () => {
        let resultado = canchas;
        
        if (busqueda.trim()) {
            resultado = resultado.filter(cancha => 
                cancha.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                cancha.descripcion.toLowerCase().includes(busqueda.toLowerCase())
            );
        }
        
        setCanchasFiltradas(resultado);
    };

    if (cargando) return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerBlock}>
                <Text style={styles.header}>Canchas en {sedeNombre}</Text>
                <Text style={styles.subtitle}>Filtra por deporte y encuentra tu horario ideal.</Text>
            </View>

            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar cancha..."
                    placeholderTextColor={colors.textMuted}
                    value={busqueda}
                    onChangeText={setBusqueda}
                />
                {busqueda !== '' && (
                    <TouchableOpacity onPress={() => setBusqueda('')}>
                        <MaterialIcons name="close" size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtros}>
                <TouchableOpacity 
                    style={[styles.filtroBtn, !filtroTipo && styles.filtroActivo]} 
                    onPress={() => setFiltroTipo(null)}
                >
                    <Text style={[styles.filtroText, !filtroTipo && styles.filtroTextActivo]}>Todos</Text>
                </TouchableOpacity>
                {tipos.map(tipo => (
                    <TouchableOpacity 
                        key={tipo.id} 
                        style={[styles.filtroBtn, filtroTipo === tipo.id && styles.filtroActivo]} 
                        onPress={() => setFiltroTipo(tipo.id)}
                    >
                        <Text style={[styles.filtroText, filtroTipo === tipo.id && styles.filtroTextActivo]}>{tipo.nombre}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <FlatList
                data={canchasFiltradas}
                contentContainerStyle={styles.list}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.card}
                        onPress={() => navigation.navigate('DetalleCancha', { canchaId: item.id })}
                    >
                        <Image source={{ uri: item.imagen }} style={styles.img} />
                        <View style={styles.info}>
                            <Text style={styles.nombre}>{item.nombre}</Text>
                            <Text style={styles.tipo}>{item.tipo.nombre} • Capacidad: {item.capacidad}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.empty}>
                    {busqueda ? 'No se encontraron canchas con ese nombre.' : 'No hay canchas disponibles.'}
                </Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...globalStyles.screen,
        paddingTop: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    headerBlock: {
        marginBottom: spacing.md,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    header: {
        ...globalStyles.sectionTitle,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...globalStyles.sectionSubtitle,
        maxWidth: '84%',
    },
    filtros: {
        paddingVertical: spacing.sm,
    },
    filtroBtn: {
        backgroundColor: '#0f1a3d',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.rounded,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: '#243257',
    },
    filtroActivo: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    filtroText: {
        color: colors.text,
        fontWeight: '700',
    },
    filtroTextActivo: {
        color: colors.background,
    },
    list: {
        paddingBottom: spacing.xxl,
    },
    card: {
        ...globalStyles.card,
        flexDirection: 'row',
        overflow: 'hidden',
        marginBottom: spacing.md,
        borderColor: 'rgba(148,163,184,0.12)',
        backgroundColor: '#0d1a35',
    },
    img: {
        width: 130,
        height: 110,
    },
    info: {
        flex: 1,
        padding: spacing.md,
        justifyContent: 'center',
    },
    nombre: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.secondary,
    },
    tipo: {
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    empty: {
        textAlign: 'center',
        marginTop: spacing.xl,
        color: colors.textMuted,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f1a3d',
        borderRadius: radius.rounded,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#243257',
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    searchInput: {
        flex: 1,
        color: colors.text,
        paddingVertical: spacing.md,
        fontSize: 16,
    },
});

export default ListaCanchasScreen;