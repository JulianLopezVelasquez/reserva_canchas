package com.reserva.api.controller;

import com.reserva.api.model.Reserva;
import com.reserva.api.repository.ReservaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    private final ReservaRepository reservaRepository;

    public ReservaController(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }


    @PostMapping
    public ResponseEntity<Reserva> crearReserva(@RequestBody Reserva reserva) {

        Reserva nuevaReserva = reservaRepository.save(reserva);
        return ResponseEntity.ok(nuevaReserva);
    }

    @GetMapping("/mis-reservas")
    public List<Reserva> listarMisReservas(@RequestParam String correo) {

        return reservaRepository.findAll().stream()
                .filter(r -> r.getUsuario().getCorreo().equals(correo))
                .collect(Collectors.toList());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarReserva(@PathVariable Long id) {
        if (reservaRepository.existsById(id)) {
            reservaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}