import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, 
    Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
    StatusBar
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/api';
import { globalStyles, colors, spacing } from '../styles/Theme';

export default function AdminPanel({ navigation }) {

    const [loading, setLoading] = useState(false);
    const [sedes, setSedes] = useState([]);
    const [tipos, setTipos] = useState([]);

    const [nuevoTipoNombre, setNuevoTipoNombre] = useState('');

    const [nombreSede, setNombreSede] = useState('');
    const [direccionSede, setDireccionSede] = useState('');

    const [nombreCancha, setNombreCancha] = useState('');
    const [descCancha, setDescCancha] = useState('');
    const [sedeSeleccionada, setSedeSeleccionada] = useState(null);
    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [resSedes, resTipos] = await Promise.all([
                api.get('/sedes'),
                api.get('/tipos-cancha')
            ]);
            setSedes(resSedes.data);
            setTipos(resTipos.data);
            
            if (resSedes.data.length > 0) setSedeSeleccionada(resSedes.data[0].id);
            if (resTipos.data.length > 0) setTipoSeleccionado(resTipos.data[0].id);
        } catch (e) {
            console.error("Error cargando selectores", e);
        }
    };

    const handleCrearTipo = async () => {
        if (!nuevoTipoNombre) return Alert.alert("Error", "Escribe el nombre del deporte");
        setLoading(true);
        try {
            await api.post('/tipos-cancha', { nombre: nuevoTipoNombre });
            Alert.alert("Éxito", "Deporte añadido al sistema");
            setNuevoTipoNombre('');
            await cargarDatos(); 
        } catch (e) {
            Alert.alert("Error", "No se pudo crear el deporte");
        } finally { setLoading(false); }
    };

    const handleCrearSede = async () => {
        if (!nombreSede || !direccionSede) return Alert.alert("Error", "Llena los datos de la sede");
        setLoading(true);
        try {
            await api.post('/sedes', { nombre: nombreSede, direccion: direccionSede });
            Alert.alert("Éxito", "Sede creada correctamente");
            setNombreSede(''); setDireccionSede('');
            await cargarDatos();
        } catch (e) {
            Alert.alert("Error", "No se pudo crear la sede");
        } finally { setLoading(false); }
    };

    const handleCrearCancha = async () => {
        if (!nombreCancha || !sedeSeleccionada || !tipoSeleccionado) {
            return Alert.alert("Error", "Faltan datos de la cancha");
        }
        
        setLoading(true);

        const tipoEncontrado = tipos.find(t => t.id === tipoSeleccionado);
        const nombreDeporte = tipoEncontrado 
            ? tipoEncontrado.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() 
            : '';
        
        let urlImagen = "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1000"; 

        if (nombreDeporte.includes('futbol') || nombreDeporte.includes('soccer')) {
            urlImagen = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000";
        } 
        else if (nombreDeporte.includes('tenis') || nombreDeporte.includes('tennis')) {
            urlImagen = "https://images.unsplash.com/photo-1595435064212-36263f6844b9?q=80&w=1000";
        } 
        else if (nombreDeporte.includes('basket') || nombreDeporte.includes('baloncesto')) {
            urlImagen = "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1000";
        } 
        else if (nombreDeporte.includes('padel') || nombreDeporte.includes('padel')) {
            urlImagen = "https://images.unsplash.com/photo-1626245923985-05517228801d?q=80&w=1000";
        }

        try {
            await api.post('/canchas', {
                nombre: nombreCancha,
                descripcion: descCancha,
                capacidad: 12,
                imagen: urlImagen, 
                sede: { id: sedeSeleccionada },
                tipo: { id: tipoSeleccionado }
            });
            Alert.alert("Éxito", `Cancha guardada`);
            setNombreCancha(''); setDescCancha('');
        } catch (e) { 
            Alert.alert("Error", "No se pudo guardar la cancha"); 
        } finally { setLoading(false); }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.header}>
                    <Text style={styles.headerSubtitle}>Gestión Administrativa</Text>
                    <Text style={styles.headerTitle}>Panel Maestro</Text>
                </View>

                <View style={styles.glassCard}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.emojiIcon}></Text>
                        <Text style={styles.cardTitle}>Deportes</Text>
                    </View>
                    <TextInput 
                        style={styles.modernInput} 
                        placeholder="Nombre del deporte" 
                        placeholderTextColor="#64748b" 
                        value={nuevoTipoNombre} 
                        onChangeText={setNuevoTipoNombre} 
                    />
                    <TouchableOpacity style={[styles.btnAction, {backgroundColor: '#3b82f6'}]} onPress={handleCrearTipo} activeOpacity={0.7}>
                        <Text style={styles.btnActionText}>Añadir Deporte</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.glassCard}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.emojiIcon}></Text>
                        <Text style={styles.cardTitle}>Sedes</Text>
                    </View>
                    <TextInput style={styles.modernInput} placeholder="Nombre de la sede" placeholderTextColor="#64748b" value={nombreSede} onChangeText={setNombreSede} />
                    <TextInput style={styles.modernInput} placeholder="Dirección" placeholderTextColor="#64748b" value={direccionSede} onChangeText={setDireccionSede} />
                    <TouchableOpacity style={[styles.btnAction, {backgroundColor: '#8b5cf6'}]} onPress={handleCrearSede} activeOpacity={0.7}>
                        <Text style={styles.btnActionText}>Crear Sede</Text>
                    </TouchableOpacity>
                </View>


                <View style={[styles.glassCard, styles.featuredCard]}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.emojiIcon}></Text>
                        <Text style={[styles.cardTitle, {color: colors.accent}]}>Nueva Cancha</Text>
                    </View>
                    
                    <View style={styles.inputWrapper}>
                        <Text style={styles.miniLabel}>Identificador</Text>
                        <TextInput style={styles.modernInput} placeholder="Nombre de la cancha" placeholderTextColor="#64748b" value={nombreCancha} onChangeText={setNombreCancha} />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.miniLabel}>Descripción</Text>
                        <TextInput style={[styles.modernInput, styles.textArea]} placeholder="Detalles adicionales..." placeholderTextColor="#64748b" value={descCancha} onChangeText={setDescCancha} multiline />
                    </View>
                    
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.miniLabel}>Deporte</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker 
                                    selectedValue={tipoSeleccionado} 
                                    onValueChange={setTipoSeleccionado} 
                                    style={styles.pickerControl}
                                    dropdownIconColor={colors.accent}
                                    mode="dropdown"
                                >
                                    {tipos.map(t => (
                                        <Picker.Item key={t.id} label={t.nombre} value={t.id} color={Platform.OS === 'ios' ? '#fff' : '#ffffff'} style={{backgroundColor: '#1e293b'}} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.miniLabel}>Sede</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker 
                                    selectedValue={sedeSeleccionada} 
                                    onValueChange={setSedeSeleccionada} 
                                    style={styles.pickerControl}
                                    dropdownIconColor={colors.accent}
                                    mode="dropdown"
                                >
                                    {sedes.map(s => (
                                        <Picker.Item key={s.id} label={s.nombre} value={s.id} color={Platform.OS === 'ios' ? '#fff' : '#ffffff'} style={{backgroundColor: '#1e293b'}} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.btnMain} onPress={handleCrearCancha} disabled={loading} activeOpacity={0.8}>
                        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnMainText}>GUARDAR CANCHA</Text>}
                    </TouchableOpacity>
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
    header: { marginBottom: 25, alignItems: 'center' },
    headerSubtitle: { color: '#94a3b8', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
    headerTitle: { fontSize: 32, fontWeight: '900', color: '#fff' },
    
    glassCard: { 
        backgroundColor: '#1e293b', 
        padding: 20, 
        borderRadius: 24, 
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5
    },
    featuredCard: {
        borderColor: colors.accent + '50',
        borderWidth: 1.5,
        backgroundColor: '#0f172a',
    },
    cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    emojiIcon: { fontSize: 20, marginRight: 10 },
    cardTitle: { fontSize: 18, fontWeight: '800', color: '#f8fafc' },
    
    miniLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6, marginLeft: 4 },
    inputWrapper: { marginBottom: 15 },
    modernInput: { 
        backgroundColor: '#0f172a', 
        color: '#fff', 
        padding: 16, 
        borderRadius: 16, 
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#334155'
    },
    textArea: { height: 80, textAlignVertical: 'top' },
    
    row: { flexDirection: 'row', marginBottom: 15 },
    column: { flex: 1 },
    
    pickerWrapper: { 
        backgroundColor: '#1e293b', 
        borderRadius: 16, 
        borderWidth: 1, 
        borderColor: '#334155',
        overflow: 'hidden',
        justifyContent: 'center'
    },
    pickerControl: { 
        color: '#fff', 
        height: Platform.OS === 'ios' ? 120 : 55,
        width: '100%'
    },
    
    btnAction: { 
        padding: 16, 
        borderRadius: 16, 
        alignItems: 'center', 
        marginTop: 5,
    },
    btnActionText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    
    btnMain: { 
        backgroundColor: colors.accent, 
        padding: 20, 
        borderRadius: 18, 
        alignItems: 'center', 
        marginTop: 10,
        shadowColor: colors.accent,
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 8
    },
    btnMainText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 0.5 }
});