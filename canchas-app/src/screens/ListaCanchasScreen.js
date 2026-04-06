import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    TouchableOpacity, 
    ActivityIndicator, 
    ScrollView, 
    TextInput, 
    RefreshControl,
    StatusBar 
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../api/api';
import { colors } from '../styles/Theme';

const ListaCanchasScreen = ({ route, navigation }) => {
    const { sedeId, sedeNombre } = route.params;
    const [canchas, setCanchas] = useState([]);
    const [canchasFiltradas, setCanchasFiltradas] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filtroTipo, setFiltroTipo] = useState(null);
    const [busqueda, setBusqueda] = useState('');


    const getSportStyle = (tipoNombre) => {
        const name = (tipoNombre || "").toLowerCase();
        if (name.includes('ten')) return { icon: 'tennis', color: '#bef264' };
        if (name.includes('fut')) return { icon: 'soccer', color: '#4ade80' };
        if (name.includes('bas')) return { icon: 'basketball', color: '#fb923c' };
        if (name.includes('vol') || name.includes('pad')) return { icon: 'volleyball', color: '#60a5fa' };
        return { icon: 'stadium-variant', color: '#a78bfa' };
    };

    const uniqueByKey = (items, keyFn) => Array.from(new Map(items.map(item => [keyFn(item), item])).values());

    const cargarDatos = async () => {
        try {
            if (!refreshing) setCargando(true);
            const params = { sedeId };
            if (filtroTipo !== null) params.tipoId = filtroTipo;

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
            setRefreshing(false); 
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [sedeId, filtroTipo]);

    useEffect(() => {
        filtrarCanchas();
    }, [busqueda, canchas]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        cargarDatos();
    }, [sedeId, filtroTipo]);

    const filtrarCanchas = () => {
        let resultado = canchas;
        if (busqueda.trim()) {
            resultado = resultado.filter(cancha => 
                cancha.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
        }
        setCanchasFiltradas(resultado);
    };

    if (cargando && !refreshing) return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.accent} />
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.headerBlock}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
                    <MaterialIcons name="arrow-back-ios" size={14} color={colors.accent} />
                    <Text style={styles.backText}>VOLVER</Text>
                </TouchableOpacity>
                <Text style={styles.header}>Canchas en {sedeNombre}</Text>
                <Text style={styles.subtitle}>Selecciona una disciplina para continuar.</Text>
            </View>

            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={22} color="#64748b" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nombre..."
                    placeholderTextColor="#64748b"
                    value={busqueda}
                    onChangeText={setBusqueda}
                />
                {busqueda !== '' && (
                    <TouchableOpacity onPress={() => setBusqueda('')}>
                        <MaterialIcons name="close" size={20} color="#64748b" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ height: 50, marginBottom: 15 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtros}>
                    <TouchableOpacity 
                        style={[styles.filtroBtn, !filtroTipo && styles.filtroActivo]} 
                        onPress={() => setFiltroTipo(null)}
                    >
                        <Text style={[styles.filtroText, !filtroTipo && styles.filtroTextActivo]}>TODOS</Text>
                    </TouchableOpacity>
                    {tipos.map(tipo => (
                        <TouchableOpacity 
                            key={tipo.id} 
                            style={[styles.filtroBtn, filtroTipo === tipo.id && styles.filtroActivo]} 
                            onPress={() => setFiltroTipo(tipo.id)}
                        >
                            <Text style={[styles.filtroText, filtroTipo === tipo.id && styles.filtroTextActivo]}>
                                {tipo.nombre.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={canchasFiltradas}
                contentContainerStyle={styles.list}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.accent]}
                        tintColor={colors.accent}
                    />
                }
                renderItem={({ item }) => {
                    const sport = getSportStyle(item.tipo.nombre);
                    return (
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            style={styles.card}
                            onPress={() => navigation.navigate('DetalleCancha', { canchaId: item.id })}
                        >

                            <View style={[styles.iconContainer, { backgroundColor: '#1e293b' }]}>
                                <MaterialCommunityIcons name={sport.icon} size={40} color={sport.color} />
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.nombre} numberOfLines={1}>{item.nombre}</Text>
                                <View style={styles.tagRow}>
                                    <View style={[styles.typeTag, { borderColor: sport.color + '40', borderWidth: 1 }]}>
                                        <Text style={[styles.typeTagText, { color: sport.color }]}>{item.tipo.nombre}</Text>
                                    </View>
                                    <Text style={styles.capacidad}>👥 {item.capacidad}</Text>
                                </View>
                            </View>

                            <View style={styles.arrowIcon}>
                                <MaterialIcons name="chevron-right" size={24} color="#334155" />
                            </View>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="emoticon-sad-outline" size={50} color="#1e293b" />
                        <Text style={styles.empty}>
                            {busqueda ? 'No hay resultados para tu búsqueda.' : 'No hay canchas disponibles.'}
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617', paddingTop: 50, paddingHorizontal: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' },
    headerBlock: { marginBottom: 25 },
    backLink: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    backText: { color: colors.accent, fontSize: 10, fontWeight: '900', marginLeft: 5 },
    header: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -1 },
    subtitle: { fontSize: 14, color: '#64748b', fontWeight: '600', marginTop: 4 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        borderRadius: 20,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, color: '#fff', paddingVertical: 14, fontSize: 15, fontWeight: '600' },
    filtros: { paddingRight: 20, alignItems: 'center' },
    filtroBtn: {
        backgroundColor: '#0f172a',
        paddingHorizontal: 18,
        borderRadius: 14,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#1e293b',
        height: 38,
        justifyContent: 'center'
    },
    filtroActivo: { backgroundColor: colors.accent, borderColor: colors.accent },
    filtroText: { color: '#64748b', fontWeight: '800', fontSize: 11 },
    filtroTextActivo: { color: '#000' },
    list: { paddingBottom: 40, flexGrow: 1 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        borderRadius: 24,
        marginBottom: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    iconContainer: { 
        width: 75, 
        height: 75, 
        borderRadius: 18, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    info: { flex: 1, paddingHorizontal: 15, justifyContent: 'center' },
    nombre: { fontSize: 18, fontWeight: '900', color: '#fff', marginBottom: 4 },
    tagRow: { flexDirection: 'row', alignItems: 'center' },
    typeTag: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginRight: 10
    },
    typeTagText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
    capacidad: { color: '#64748b', fontSize: 12, fontWeight: '700' },
    arrowIcon: { paddingRight: 5 },
    emptyContainer: { marginTop: 60, alignItems: 'center' },
    empty: { textAlign: 'center', color: '#334155', fontWeight: '700', fontSize: 15, marginTop: 15 },
});

export default ListaCanchasScreen;