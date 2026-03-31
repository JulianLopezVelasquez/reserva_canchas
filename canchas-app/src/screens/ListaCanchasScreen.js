import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../api/api';

const ListaCanchasScreen = ({ route, navigation }) => {
    const { sedeId, sedeNombre } = route.params;
    const [canchas, setCanchas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarCanchas = async () => {
            try {

                const response = await api.get('/canchas', {
                    params: { sedeId: sedeId }
                });
                setCanchas(response.data);
            } catch (error) {
                console.error("Error cargando canchas:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarCanchas();
    }, [sedeId]);

    if (cargando) return <ActivityIndicator size="large" color="#2ecc71" style={{flex:1}} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Canchas en {sedeNombre}</Text>
            <FlatList
                data={canchas}
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
                ListEmptyComponent={<Text style={styles.empty}>No hay canchas en esta sede.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#fff' },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    card: { flexDirection: 'row', marginBottom: 15, backgroundColor: '#f9f9f9', borderRadius: 10, overflow: 'hidden', elevation: 2 },
    img: { width: 100, height: 100 },
    info: { padding: 10, justifyContent: 'center' },
    nombre: { fontSize: 16, fontWeight: 'bold' },
    tipo: { color: '#666', marginTop: 5 },
    empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default ListaCanchasScreen;