import React, { useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    FlatList, 
    ActivityIndicator, 
    RefreshControl,
    StatusBar,
    ImageBackground
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../styles/Theme';
import api from '../api/api';

const HomeScreen = ({ navigation }) => {
    const [sedes, setSedes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [refrescando, setRefrescando] = useState(false);

    const uniqueByKey = (items, keyFn) => Array.from(new Map(items.map(item => [keyFn(item), item])).values());

    const cargarSedes = async () => {
        try {
            const response = await api.get('/sedes');
            setSedes(uniqueByKey(response.data, item => `${item.nombre}|${item.direccion}`));
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
            setRefrescando(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            cargarSedes();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefrescando(true);
        cargarSedes();
    }, []);

    const getSedeImage = (id) => {
        const images = [
            'https://larazon.co/wp-content/uploads/2024/02/Villa-Olimpica.jpeg',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfCBzzWkHxbPksHbgpQbLEZ9B-BetCNy3J1w&s',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS417VHn5dyxjLsL3-F-XRsIBgkA-ZN2ybeTA&s',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSToIrXRm--DTtqcJrcL9eUGrR4FfkNIQnMA&s'
        ];
        return images[id % images.length];
    };

    if (cargando) return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.accent} />
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <Text style={styles.title}>Sedes</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{sedes.length} UBICACIONES</Text>
                </View>
            </View>
            
            <Text style={styles.subtitle}>Encuentra la cancha ideal en tu ubicación favorita.</Text>
            
            <FlatList
                data={sedes}
                contentContainerStyle={styles.list}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refrescando}
                        onRefresh={onRefresh}
                        colors={[colors.accent]} 
                        tintColor={colors.accent} 
                    />
                }
                renderItem={({ item, index }) => (
                    <TouchableOpacity 
                        activeOpacity={0.9}
                        style={styles.cardContainer} 
                        onPress={() => navigation.navigate('ListaCanchas', { 
                            sedeId: item.id, 
                            sedeNombre: item.nombre 
                        })}
                    >
                        <ImageBackground 
                            source={{ uri: getSedeImage(item.id || index) }} 
                            style={styles.sedeCard}
                            imageStyle={styles.imageStyle}
                        >
                            <View style={styles.gradientOverlay}>
                                <View style={styles.sedeInfo}>
                                    <Text style={styles.sedeName}>{item.nombre}</Text>
                                    <View style={styles.locationRow}>
                                        <Text style={styles.pinIcon}>📍</Text>
                                        <Text style={styles.sedeDir}>{item.direccion}</Text>
                                    </View>
                                </View>
                                <View style={styles.arrowContainer}>
                                    <Text style={styles.arrow}>→</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617', paddingHorizontal: 20, paddingTop: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' },
    title: { fontSize: 34, fontWeight: '900', color: '#fff', letterSpacing: -1 },
    badge: { backgroundColor: 'rgba(34, 197, 94, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(34, 197, 94, 0.3)' },
    badgeText: { color: colors.accent, fontSize: 10, fontWeight: '900' },
    subtitle: { fontSize: 15, color: '#94a3b8', fontWeight: '500', marginBottom: 25 },
    list: { paddingBottom: 40 },
    cardContainer: { marginBottom: 20, borderRadius: 24, backgroundColor: '#0f172a', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 15, elevation: 10 },
    sedeCard: { height: 180, width: '100%', overflow: 'hidden' },
    imageStyle: { borderRadius: 24, resizeMode: 'cover' },
    gradientOverlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.45)', flexDirection: 'row', alignItems: 'flex-end', padding: 20 },
    sedeInfo: { flex: 1 },
    sedeName: { fontSize: 26, fontWeight: '900', color: '#fff', textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    pinIcon: { fontSize: 14, marginRight: 6 },
    sedeDir: { fontSize: 14, color: '#f1f5f9', fontWeight: '600' },
    arrowContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', shadowColor: colors.accent, shadowOpacity: 0.6, shadowRadius: 10, elevation: 5 },
    arrow: { color: '#000', fontSize: 22, fontWeight: 'bold' }
});

export default HomeScreen;