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
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    header: { marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
    subtitle: { fontSize: 16, color: '#7f8c8d' },
    card: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 15, 
        backgroundColor: '#f8f9fa', 
        borderRadius: 10, 
        marginBottom: 10 
    },
    hora: { fontSize: 16, fontWeight: '600' },
    btn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
    btnOk: { backgroundColor: '#2ecc71' },
    btnNo: { backgroundColor: '#95a5a6' },
    btnText: { color: 'white', fontWeight: 'bold' },
    back: { backgroundColor: '#34495e', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default HorariosScreen;