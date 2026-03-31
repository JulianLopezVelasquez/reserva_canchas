package com.reserva.api.controller;

import com.reserva.api.model.TipoCancha;
import com.reserva.api.repository.TipoCanchaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tipos-cancha")
@CrossOrigin(origins = "*")
public class TipoCanchaController {

    private final TipoCanchaRepository tipoCanchaRepository;

    public TipoCanchaController(TipoCanchaRepository tipoCanchaRepository) {
        this.tipoCanchaRepository = tipoCanchaRepository;
    }

    @GetMapping
    public List<TipoCancha> listarTodos() {
        return tipoCanchaRepository.findAll();
    }
}