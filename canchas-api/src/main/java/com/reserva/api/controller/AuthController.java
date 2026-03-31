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
        return authService.validarYGenerarToken(request.getCorreo(), request.getContrasena())
                .map(token -> ResponseEntity.ok(new AuthResponse(token))) 
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/register")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = authService.registrar(usuario);
        return ResponseEntity.ok(nuevoUsuario);
    }
}