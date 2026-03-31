package com.reserva.api.controller;

import com.reserva.api.model.Horario;
import com.reserva.api.repository.HorarioRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    private final HorarioRepository horarioRepository;

    public HorarioController(HorarioRepository horarioRepository) {
        this.horarioRepository = horarioRepository;
    }

    @GetMapping("/cancha/{canchaId}")
    public List<Horario> obtenerPorCancha(@PathVariable Long canchaId) {
        System.out.println("DEBUG: Buscando horarios para la cancha: " + canchaId);

        return horarioRepository.findAll(); 
    }

    @GetMapping("/sede/{sedeId}")
    public List<Horario> obtenerPorSede(@PathVariable Long sedeId) {
        return horarioRepository.findAll(); 
    }
}