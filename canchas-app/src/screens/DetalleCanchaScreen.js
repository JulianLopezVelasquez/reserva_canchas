import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput,
    ScrollView, 
    Alert, 
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Dimensions
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../api/api';
import { colors } from '../styles/Theme';

const { width } = Dimensions.get('window');

const DetalleCanchaScreen = ({ route, navigation }) => {
    const { canchaId } = route.params;
    const [cancha, setCancha] = useState(null);
    const [nota, setNota] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [horarios, setHorarios] = useState([]);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const [cargando, setCargando] = useState(true);


    const getSportStyle = (tipoNombre) => {
        const name = (tipoNombre || "").toLowerCase();
        if (name.includes('ten')) return { icon: 'tennis', color: '#bef264' };
        if (name.includes('fut')) return { icon: 'soccer', color: '#4ade80' };
        if (name.includes('bas')) return { icon: 'basketball', color: '#fb923c' };
        if (name.includes('vol') || name.includes('pad')) return { icon: 'volleyball', color: '#60a5fa' };
        return { icon: 'stadium-variant', color: '#a78bfa' };
    };

    const formatHora = (horaString) => {
        if (!horaString) return '';
        const [h, m] = horaString.split(':');
        return `${parseInt(h, 10)}${parseInt(m, 10) > 0 ? ':' + m : ''}`;
    };

    const buildDateOptions = () => {
        const today = new Date();
        return Array.from({ length: 7 }).map((_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() + index);
            const dateString = date.toISOString().split('T')[0];
            const dayLabel = date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
            return {
                label: dayLabel,
                dayNum: dateString.split('-')[2],
                value: dateString,
            };
        });
    };

    const dateOptions = buildDateOptions();

    const cargarHorarios = async () => {
        try {
            const response = await api.get(`/horarios/cancha/${canchaId}/disponibles`, {
                params: { fecha: selectedDate }
            });
            setHorarios(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            cargarHorarios();
        }, [selectedDate, canchaId])
    );

    useEffect(() => {
        cargarDatos();
    }, [canchaId]);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const response = await api.get(`/canchas/${canchaId}`);
            setCancha(response.data);
            const notaGuardada = await AsyncStorage.getItem(`nota_cancha_${canchaId}`);
            if (notaGuardada) setNota(notaGuardada);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    const guardarNota = async () => {
        try {
            await AsyncStorage.setItem(`nota_cancha_${canchaId}`, nota);
            Alert.alert("Éxito", "Nota personal actualizada.");
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar la nota.");
        }
    };

    const reservar = async () => {
        if (!selectedHorario) return Alert.alert("¡Espera!", "Selecciona un horario.");
        try {
            const reserva = {
                fecha: selectedDate,
                cancha: { id: canchaId },
                horario: { id: selectedHorario.id }
            };
            await api.post('/reservas', reserva);
            Alert.alert("¡Éxito!", "Cancha reservada.");
            setSelectedHorario(null);
            cargarHorarios(); 
        } catch (error) {
            Alert.alert("Error", "No se pudo realizar la reserva.");
        }
    };

    if (cargando) return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.accent} />
        </View>
    );

    const sportStyle = getSportStyle(cancha?.tipo?.nombre);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar barStyle="light-content" />
            

            <View style={styles.headerIconContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" color="#fff" size={30} />
                </TouchableOpacity>
                
                <MaterialCommunityIcons 
                    name={sportStyle.icon} 
                    size={180} 
                    color={sportStyle.color} 
                    style={styles.bgIcon} 
                />
                
                <View style={styles.typeBadge}>
                    <Text style={[styles.typeBadgeText, { color: sportStyle.color }]}>
                        {cancha?.tipo?.nombre}
                    </Text>
                </View>
            </View>

            <View style={styles.contentArea}>
                <Text style={styles.nombre}>{cancha?.nombre}</Text>
                <Text style={styles.sedeText}>📍 {cancha?.sede.nombre}</Text>
                
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionLabel}>FECHA</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 10}}>
                        {dateOptions.map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={[styles.dateItem, selectedDate === option.value && styles.dateItemActive]}
                                onPress={() => setSelectedDate(option.value)}
                            >
                                <Text style={[styles.dateDay, selectedDate === option.value && styles.textActive]}>{option.label}</Text>
                                <Text style={[styles.dateNum, selectedDate === option.value && styles.textActive]}>{option.dayNum}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.headerHorarios}>
                        <Text style={styles.sectionLabel}>HORARIOS LIBRES</Text>
                        <View style={styles.badgeDisp}>
                            <Text style={styles.countBadge}>{horarios.length} DISPONIBLES</Text>
                        </View>
                    </View>
                    <View style={styles.horariosGrid}>
                        {horarios.map((item) => (
                            <TouchableOpacity 
                                key={item.id.toString()}
                                activeOpacity={0.8}
                                style={[
                                    styles.horarioPill, 
                                    selectedHorario?.id === item.id && styles.selectedHorarioPill
                                ]}
                                onPress={() => setSelectedHorario(item)}
                            >
                                <Text style={[styles.horarioTime, selectedHorario?.id === item.id && styles.textBlack]}>
                                    {formatHora(item.horaInicio)} — {formatHora(item.horaFin)}
                                </Text>
                                <Text style={[styles.turnoText, selectedHorario?.id === item.id && styles.textBlack]}>Turno libre</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {horarios.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.noHorarios}>No hay turnos disponibles para hoy</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity 
                    style={[styles.btnReservar, !selectedHorario && styles.btnDisabled]} 
                    onPress={reservar} 
                    disabled={!selectedHorario}
                >
                    <Text style={styles.btnReservarText}>RESERVAR AHORA</Text>
                </TouchableOpacity>

                <View style={styles.notaContainer}>
                    <Text style={styles.sectionLabel}>MI NOTA PRIVADA</Text>
                    <TextInput
                        style={styles.inputNota}
                        multiline
                        placeholder="Escribe recordatorios aquí..."
                        placeholderTextColor="#64748b"
                        value={nota}
                        onChangeText={setNota}
                    />
                    <TouchableOpacity style={styles.btnNota} onPress={guardarNota}>
                        <Text style={styles.btnNotaText}>ACTUALIZAR NOTA</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' },
    headerIconContainer: { 
        width: '100%', 
        height: 250, 
        backgroundColor: '#0f172a', 
        justifyContent: 'center', 
        alignItems: 'center',
        overflow: 'hidden'
    },
    backBtn: { 
        position: 'absolute', 
        top: 50, 
        left: 20, 
        zIndex: 10, 
        padding: 8, 
        backgroundColor: 'rgba(2, 6, 23, 0.5)', 
        borderRadius: 12 
    },
    bgIcon: {
        opacity: 0.2,
        transform: [{ scale: 1.2 }]
    },
    typeBadge: {
        position: 'absolute',
        bottom: 30,
        backgroundColor: 'rgba(2, 6, 23, 0.6)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1e293b'
    },
    typeBadgeText: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2 },
    contentArea: { padding: 20, marginTop: -20, backgroundColor: '#020617', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    nombre: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1 },
    sedeText: { color: colors.accent, fontSize: 15, fontWeight: '700', marginBottom: 25, marginTop: 5 },
    sectionCard: { backgroundColor: '#0f172a', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#1e293b' },
    headerHorarios: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionLabel: { color: '#64748b', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
    badgeDisp: { backgroundColor: 'rgba(34, 197, 94, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    countBadge: { color: colors.accent, fontSize: 9, fontWeight: '900' },
    dateItem: { width: 65, height: 80, backgroundColor: '#1e293b', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: '#334155' },
    dateItemActive: { backgroundColor: colors.accent, borderColor: colors.accent },
    dateDay: { color: '#64748b', fontSize: 10, fontWeight: '800' },
    dateNum: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    textActive: { color: '#000' },
    horariosGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    horarioPill: { 
        width: '48%', 
        backgroundColor: '#1e293b', 
        paddingVertical: 20, 
        borderRadius: 22, 
        marginBottom: 12, 
        alignItems: 'center',
        borderWidth: 1.5, 
        borderColor: '#334155'
    },
    selectedHorarioPill: { backgroundColor: '#fff', borderColor: '#fff' },
    horarioTime: { color: '#fff', fontWeight: '900', fontSize: 18, letterSpacing: -0.5 },
    turnoText: { color: '#64748b', fontSize: 10, fontWeight: '600', marginTop: 4 },
    textBlack: { color: '#000' },
    btnReservar: { backgroundColor: colors.accent, padding: 22, borderRadius: 24, alignItems: 'center', marginTop: 10, elevation: 10, shadowColor: colors.accent, shadowOpacity: 0.4, shadowRadius: 15 },
    btnReservarText: { color: '#000', fontWeight: '900', fontSize: 17, letterSpacing: 1 },
    btnDisabled: { backgroundColor: '#1e293b', opacity: 0.3 },
    emptyContainer: { width: '100%', padding: 20, alignItems: 'center' },
    noHorarios: { color: '#64748b', textAlign: 'center', fontWeight: '600' },
    notaContainer: { marginTop: 20, backgroundColor: '#0f172a', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#1e293b' },
    inputNota: { backgroundColor: '#020617', color: '#fff', padding: 18, borderRadius: 22, height: 110, textAlignVertical: 'top', fontSize: 15, marginTop: 12, marginBottom: 15, borderWidth: 1, borderColor: '#1e293b' },
    btnNota: { borderWidth: 1.5, borderColor: colors.accent, padding: 16, borderRadius: 20, alignItems: 'center' },
    btnNotaText: { color: colors.accent, fontWeight: '900', fontSize: 13 }
});

export default DetalleCanchaScreen;