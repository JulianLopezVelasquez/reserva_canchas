import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    Button, 
    Image, 
    ScrollView, 
    Alert, 
    TouchableOpacity 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

const DetalleCanchaScreen = ({ route, navigation }) => {
    const { canchaId } = route.params;
    const [cancha, setCancha] = useState(null);
    const [nota, setNota] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const response = await api.get(`/canchas/${canchaId}`);
            setCancha(response.data);

            const notaGuardada = await AsyncStorage.getItem(`nota_cancha_${canchaId}`);
            if (notaGuardada) setNota(notaGuardada);
        } catch (error) {
            console.error("Error al cargar detalle:", error);
        }
    };

    const guardarNota = async () => {
        try {
            await AsyncStorage.setItem(`nota_cancha_${canchaId}`, nota);
            Alert.alert("Éxito", "Nota personal guardada en el dispositivo.");
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar la nota.");
        }
    };

    if (!cancha) return <View style={styles.center}><Text>Cargando detalle...</Text></View>;

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: cancha.imagen }} style={styles.imagen} />
            <View style={styles.info}>
                <Text style={styles.nombre}>{cancha.nombre}</Text>
                <Text style={styles.desc}>{cancha.descripcion}</Text>
                <Text style={styles.tipo}>Deporte: {cancha.tipo.nombre}</Text>
                <Text style={styles.sedeBadge}>📍 {cancha.sede.nombre}</Text>

                <View style={styles.notaContainer}>
                    <Text style={styles.notaLabel}>Mi Nota Personal (Privada):</Text>
                    <TextInput
                        style={styles.input}
                        multiline
                        placeholder="Ej: Esta cancha tiene buena sombra..."
                        value={nota}
                        onChangeText={setNota}
                    />
                    <Button title="Guardar Nota" onPress={guardarNota} color="#2ecc71" />
                </View>

                <TouchableOpacity 
                    style={styles.btnReserva}
                    onPress={() => navigation.navigate('Horarios', { 
                        canchaId: cancha.id,
                        canchaNombre: cancha.nombre,
                        sedeNombre: cancha.sede.nombre 
                    })}
                >
                    <Text style={styles.btnText}>Ver Horarios Disponibles</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    imagen: { width: '100%', height: 220 },
    info: { padding: 20 },
    nombre: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50' },
    desc: { fontSize: 16, color: '#7f8c8d', marginVertical: 10 },
    tipo: { fontSize: 14, fontWeight: 'bold', color: '#3498db' },
    sedeBadge: { fontSize: 14, color: '#e67e22', marginTop: 5, fontWeight: '600' },
    notaContainer: { marginTop: 25, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
    notaLabel: { fontWeight: 'bold', marginBottom: 8, color: '#34495e' },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, height: 80, textAlignVertical: 'top', marginBottom: 10 },
    btnReserva: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 12, marginTop: 25, alignItems: 'center', elevation: 3 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default DetalleCanchaScreen;