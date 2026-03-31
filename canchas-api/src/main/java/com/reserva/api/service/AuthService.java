package com.reserva.api.service;

import com.reserva.api.model.Usuario;
import com.reserva.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService; 

    public AuthService(UsuarioRepository usuarioRepository, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    public Usuario registrar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Optional<String> validarYGenerarToken(String correo, String clave) {
        return usuarioRepository.findByCorreo(correo)
                .filter(user -> user.getContrasena().equals(clave))
                .map(user -> jwtService.generarToken(user.getCorreo())); 
    }

    public Object validar(String correo, String contrasena) {

        throw new UnsupportedOperationException("Unimplemented method 'validar'");
    }
}