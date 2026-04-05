package com.reserva.api.controller;

import com.reserva.api.model.Reserva;
import com.reserva.api.model.Usuario;
import com.reserva.api.repository.ReservaRepository;
import com.reserva.api.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;

    public ReservaController(ReservaRepository reservaRepository, UsuarioRepository usuarioRepository) {
        this.reservaRepository = reservaRepository;
        this.usuarioRepository = usuarioRepository;
    }


    @PostMapping
    public ResponseEntity<Reserva> crearReserva(@RequestBody Reserva reserva, Authentication authentication) {
        String correo = authentication.getName();
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        reserva.setUsuario(usuario);
        Reserva nuevaReserva = reservaRepository.save(reserva);
        return ResponseEntity.ok(nuevaReserva);
    }

    @GetMapping("/mis-reservas")
    public List<Reserva> listarMisReservas(Authentication authentication) {
        String correo = authentication.getName();
        return reservaRepository.findAll().stream()
                .filter(r -> r.getUsuario().getCorreo().equals(correo))
                .collect(Collectors.toList());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarReserva(@PathVariable Long id, Authentication authentication) {
        String correo = authentication.getName();
        Reserva reserva = reservaRepository.findById(id).orElse(null);
        if (reserva != null && reserva.getUsuario().getCorreo().equals(correo)) {
            reservaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}