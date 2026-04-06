import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert, 
    ActivityIndicator, 
    StatusBar, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView 
} from 'react-native';
import api from '../api/api';
import { colors, spacing, radius, globalStyles } from '../styles/Theme';

export default function RegisterScreen({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!nombre || !correo || !contrasena || !confirmarContrasena) {
            Alert.alert("Campos incompletos", "Por favor completa todos los campos");
            return;
        }

        if (nombre.trim().length < 3) {
            Alert.alert("Nombre inválido", "El nombre debe tener al menos 3 caracteres");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            Alert.alert("Correo inválido", "Por favor ingresa un correo electrónico válido");
            return;
        }

        if (contrasena.length < 6) {
            Alert.alert("Contraseña débil", "La contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (contrasena !== confirmarContrasena) {
            Alert.alert("Contraseñas no coinciden", "Las contraseñas ingresadas no son iguales");
            return;
        }
        
        setLoading(true);
        try {
            await api.post('/auth/register', { nombre, correo, contrasena });
            Alert.alert("¡Registro exitoso!", "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.", [
                { text: "OK", onPress: () => navigation.navigate('Login') }
            ]);
        } catch (error) {
            console.log("Error Register:", error.response?.status);
            const mensajeError = error.response?.data?.message || "El correo ya está registrado o hubo un error. Intenta con otro correo.";
            Alert.alert("Error en el registro", mensajeError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.headerBlock}>
                    <Text style={styles.title}>Crear cuenta</Text>
                    <Text style={styles.subtitle}>Únete y reserva canchas sin esperas.</Text>
                </View>

                <View style={styles.formCard}>
                    <Text style={styles.inputLabel}>NOMBRE COMPLETO</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Tu nombre"
                        placeholderTextColor="#64748b"
                        value={nombre}
                        onChangeText={setNombre}
                        autoCapitalize="words"
                    />

                    <Text style={styles.inputLabel}>CORREO ELECTRÓNICO</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ejemplo@correo.com"
                        placeholderTextColor="#64748b"
                        value={correo}
                        onChangeText={setCorreo}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.inputLabel}>CONTRASEÑA</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mínimo 6 caracteres"
                        placeholderTextColor="#64748b"
                        value={contrasena}
                        onChangeText={setContrasena}
                        secureTextEntry
                    />

                    <Text style={styles.inputLabel}>CONFIRMAR CONTRASEÑA</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Repite tu contraseña"
                        placeholderTextColor="#64748b"
                        value={confirmarContrasena}
                        onChangeText={setConfirmarContrasena}
                        secureTextEntry
                    />

                    <TouchableOpacity 
                        style={[styles.button, loading && styles.buttonDisabled]} 
                        onPress={handleRegister} 
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.buttonText}>REGISTRARSE</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.linkText}>¿Ya tienes cuenta? <Text style={styles.linkHighlight}>Inicia sesión</Text></Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingVertical: 40,
    },
    headerBlock: {
        marginBottom: 35,
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '600',
    },
    formCard: {
        backgroundColor: '#0f172a',
        borderRadius: 30,
        padding: 25,
        borderWidth: 1,
        borderColor: '#1e293b',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    inputLabel: {
        color: colors.accent,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#020617',
        borderRadius: 18,
        padding: 16,
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 18,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    button: {
        backgroundColor: colors.accent,
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
        elevation: 8,
        shadowColor: colors.accent,
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1,
    },
    loginLink: {
        marginTop: 25,
        alignItems: 'center',
    },
    linkText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
    },
    linkHighlight: {
        color: colors.accent,
        fontWeight: '800',
    },
});