package com.reserva.api.controller;

import com.reserva.api.dto.LoginRequest;
import com.reserva.api.dto.AuthResponse;
import com.reserva.api.model.Usuario;
import com.reserva.api.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            var tokenOpt = authService.validarYGenerarToken(request.getCorreo(), request.getContrasena());
            
            if (tokenOpt.isPresent()) {
                Usuario usuario = authService.getUsuarioByCorreo(request.getCorreo()).orElse(null);
                return ResponseEntity.ok(new AuthResponse(tokenOpt.get(), usuario));
            } else {
                return ResponseEntity.status(401).body("Correo o contraseña incorrectos");
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error en el inicio de sesión: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = authService.registrar(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al registrar usuario: " + e.getMessage());
        }
    }
}