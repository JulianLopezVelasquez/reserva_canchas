import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput,
    Image, 
    ScrollView, 
    Alert, 
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { colors, spacing, radius, globalStyles } from '../styles/Theme';

const DetalleCanchaScreen = ({ route, navigation }) => {
    const { canchaId } = route.params;
    const [cancha, setCancha] = useState(null);
    const [nota, setNota] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [horarios, setHorarios] = useState([]);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const [cargando, setCargando] = useState(true);

    const buildDateOptions = () => {
        const today = new Date();
        return Array.from({ length: 7 }).map((_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() + index);
            const dateString = date.toISOString().split('T')[0];
            const dayLabel = date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
            return {
                label: `${dayLabel} ${dateString.slice(5)}`,
                value: dateString,
            };
        });
    };

    const dateOptions = buildDateOptions();

    useEffect(() => {
        cargarDatos();
    }, [canchaId]);

    useEffect(() => {
        if (cancha) {
            setSelectedHorario(null);
            cargarHorarios();
        }
    }, [selectedDate, cancha]);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const response = await api.get(`/canchas/${canchaId}`);
            setCancha(response.data);

            const notaGuardada = await AsyncStorage.getItem(`nota_cancha_${canchaId}`);
            if (notaGuardada) setNota(notaGuardada);
        } catch (error) {
            console.error("Error al cargar detalle:", error);
        } finally {
            setCargando(false);
        }
    };

    const cargarHorarios = async () => {
        try {
            const response = await api.get(`/horarios/cancha/${canchaId}/disponibles`, {
                params: { fecha: selectedDate }
            });
            setHorarios(response.data);
        } catch (error) {
            console.error("Error cargando horarios:", error);
        }
    };

    const guardarNota = async () => {
        try {
            await AsyncStorage.setItem(`nota_cancha_${canchaId}`, nota);
            Alert.alert("Éxito", "Nota personal guardada.");
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar la nota.");
        }
    };

    const reservar = async () => {
        if (!selectedHorario) {
            Alert.alert("Horario requerido", "Selecciona un horario antes de reservar.");
            return;
        }

        try {
            const reserva = {
                fecha: selectedDate,
                cancha: { id: canchaId },
                horario: { id: selectedHorario.id }
            };
            await api.post('/reservas', reserva);
            Alert.alert("¡Reserva exitosa!", "Tu cancha ha sido reservada correctamente.", [
                { text: "OK", onPress: () => {
                    setSelectedHorario(null);
                    cargarHorarios();
                }}
            ]);
        } catch (error) {
            console.error("Error:", error);
            const mensajeError = error.response?.data?.message || "No se pudo crear la reserva. Intenta de nuevo.";
            Alert.alert("Error en la reserva", mensajeError);
        }
    };

    if (cargando) return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );

    if (!cancha) return (
        <View style={styles.center}>
            <Text>Error cargando cancha.</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: cancha.imagen }} style={styles.imagen} />
            <View style={styles.info}>
                <Text style={styles.nombre}>{cancha.nombre}</Text>
                <Text style={styles.desc}>{cancha.descripcion}</Text>
                <Text style={styles.tipo}>Deporte: {cancha.tipo.nombre}</Text>
                <Text style={styles.sedeBadge}>📍 {cancha.sede.nombre}</Text>

                <View style={styles.fechaContainer}>
                    <Text style={styles.fechaLabel}>Seleccionar Fecha:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateSelector}>
                        {dateOptions.map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.dateButton,
                                    selectedDate === option.value && styles.dateButtonActive
                                ]}
                                onPress={() => setSelectedDate(option.value)}
                            >
                                <Text style={[
                                    styles.dateButtonText,
                                    selectedDate === option.value && styles.dateButtonTextActive
                                ]}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.horariosContainer}>
                    <Text style={styles.horariosTitle}>Horarios Disponibles:</Text>
                    {horarios.length === 0 ? (
                        <Text style={styles.noHorarios}>No hay horarios disponibles para esta fecha.</Text>
                    ) : (
                        horarios.map((item) => (
                            <TouchableOpacity 
                                key={item.id.toString()}
                                style={[
                                    styles.horarioCard,
                                    selectedHorario?.id === item.id && styles.selectedHorarioCard
                                ]}
                                onPress={() => setSelectedHorario(item)}
                            >
                                <Text style={styles.horarioText}>{item.horaInicio} - {item.horaFin}</Text>
                                <Text style={styles.reservarText}>{selectedHorario?.id === item.id ? 'Seleccionado' : 'Elegir'}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                <TouchableOpacity style={[styles.btnGuardar, !selectedHorario && styles.btnDisabled]} onPress={reservar} disabled={!selectedHorario}>
                    <Text style={styles.btnText}>Reservar Horario Seleccionado</Text>
                </TouchableOpacity>

                <View style={styles.notaContainer}>
                    <Text style={styles.notaLabel}>Mi Nota Personal (Privada):</Text>
                    <TextInput
                        style={styles.input}
                        multiline
                        placeholder="Ej: Esta cancha tiene buena sombra..."
                        value={nota}
                        onChangeText={setNota}
                    />
                    <TouchableOpacity style={styles.btnGuardar} onPress={guardarNota}>
                        <Text style={styles.btnText}>Guardar Nota</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...globalStyles.screen,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagen: {
        width: '100%',
        height: 260,
    },
    info: {
        ...globalStyles.card,
        margin: spacing.md,
        padding: spacing.lg,
        backgroundColor: '#101938',
    },
    nombre: {
        fontSize: 30,
        fontWeight: '900',
        color: colors.primaryLight,
    },
    desc: {
        fontSize: 16,
        color: colors.textMuted,
        marginVertical: spacing.sm,
        lineHeight: 24,
    },
    tipo: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.accent,
    },
    sedeBadge: {
        fontSize: 14,
        color: colors.textMuted,
        marginTop: spacing.xs,
        fontWeight: '600',
    },
    fechaContainer: {
        marginTop: spacing.lg,
        padding: spacing.md,
        backgroundColor: '#0d1d44',
        borderRadius: radius.rounded,
        borderWidth: 1,
        borderColor: colors.border,
    },
    fechaLabel: {
        fontWeight: '700',
        marginBottom: spacing.xs,
        color: colors.secondary,
    },
    fechaInput: {
        ...globalStyles.input,
    },
    dateSelector: {
        paddingVertical: spacing.sm,
    },
    dateButton: {
        marginRight: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.rounded,
        backgroundColor: '#0b1430',
        borderWidth: 1,
        borderColor: '#252f55',
    },
    dateButtonActive: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    dateButtonText: {
        color: colors.textMuted,
        fontWeight: '700',
    },
    dateButtonTextActive: {
        color: colors.background,
    },
    horariosContainer: {
        marginTop: spacing.lg,
    },
    selectedHorarioCard: {
        borderColor: colors.primary,
        backgroundColor: '#15254e',
    },
    btnDisabled: {
        opacity: 0.5,
    },

    horariosTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: spacing.sm,
        color: colors.secondary,
    },
    noHorarios: {
        textAlign: 'center',
        color: colors.textMuted,
        fontStyle: 'italic',
    },
    horarioCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0d1a3e',
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderRadius: radius.rounded,
        borderWidth: 1,
        borderColor: 'rgba(148,163,184,0.15)',
    },
    horarioText: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.secondary,
    },
    reservarText: {
        color: colors.primary,
        fontWeight: '800',
    },
    notaContainer: {
        marginTop: spacing.lg,
        padding: spacing.md,
        backgroundColor: '#0d1d44',
        borderRadius: radius.rounded,
        borderWidth: 1,
        borderColor: colors.border,
    },
    notaLabel: {
        fontWeight: '700',
        marginBottom: spacing.xs,
        color: colors.secondary,
    },
    input: {
        ...globalStyles.input,
        height: 110,
        textAlignVertical: 'top',
        marginBottom: spacing.sm,
    },
    btnGuardar: {
        ...globalStyles.button,
        backgroundColor: colors.accent,
        padding: spacing.sm,
    },
    btnText: {
        ...globalStyles.buttonText,
    },
});

export default DetalleCanchaScreen;