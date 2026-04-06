package com.reserva.api.controller;

import com.reserva.api.model.Sede;
import com.reserva.api.repository.SedeRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sedes")
@CrossOrigin(origins = "*")
public class SedeController {

    private final SedeRepository sedeRepository;

    public SedeController(SedeRepository sedeRepository) {
        this.sedeRepository = sedeRepository;
    }

    @GetMapping
    public List<Sede> listarTodas() {
        return sedeRepository.findAll();
    }

   
    @PostMapping
    public Sede crearSede(@RequestBody Sede sede) {

        return sedeRepository.save(sede);
    }
}