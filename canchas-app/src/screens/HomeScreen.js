import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const sedes = [
        { id: 1, nombre: "Sede Norte", direccion: "Calle 100 #15-20" },
        { id: 2, nombre: "Sede Sur", direccion: "Carrera 43 #10-05" }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nuestras Sedes</Text>
            <FlatList
                data={sedes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.sedeCard} 
                        onPress={() => navigation.navigate('ListaCanchas', { 
                            sedeId: item.id, 
                            sedeNombre: item.nombre 
                        })}
                    >
                        <Text style={styles.sedeName}>{item.nombre}</Text>
                        <Text style={styles.sedeDir}>{item.direccion}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
    sedeCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 3 },
    sedeName: { fontSize: 18, fontWeight: 'bold', color: '#2ecc71' },
    sedeDir: { fontSize: 14, color: '#7f8c8d', marginTop: 5 }
});

export default HomeScreen;