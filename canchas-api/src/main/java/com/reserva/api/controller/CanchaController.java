package com.reserva.api.controller;

import com.reserva.api.model.Cancha;
import com.reserva.api.repository.CanchaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/canchas")
@CrossOrigin(origins = "*")
public class CanchaController {

    private final CanchaRepository canchaRepository;

    public CanchaController(CanchaRepository canchaRepository) {
        this.canchaRepository = canchaRepository;
    }

    @GetMapping
    public List<Cancha> listarCanchas(
            @RequestParam(required = false) Long sedeId,
            @RequestParam(required = false) Long tipoId) {
        
        List<Cancha> canchas = canchaRepository.findAll();

        if (sedeId != null) {
            canchas = canchas.stream()
                    .filter(c -> c.getSede() != null && c.getSede().getId().equals(sedeId))
                    .collect(Collectors.toList());
        }

        if (tipoId != null) {
            canchas = canchas.stream()
                    .filter(c -> c.getTipo() != null && c.getTipo().getId().equals(tipoId))
                    .collect(Collectors.toList());
        }

        return canchas;
    }

    @GetMapping("/{id}")
    public Cancha obtenerDetalle(@PathVariable Long id) {
        return canchaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cancha no encontrada"));
    }

    @PostMapping
    public Cancha crearCancha(@RequestBody Cancha cancha) {
        return canchaRepository.save(cancha);
    }
}