package com.reserva.api.controller;

import com.reserva.api.model.TipoCancha;
import com.reserva.api.repository.TipoCanchaRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api/tipos-cancha")
@CrossOrigin(origins = "*")
public class TipoCanchaController {

    private final TipoCanchaRepository tipoCanchaRepository;

    public TipoCanchaController(TipoCanchaRepository tipoCanchaRepository) {
        this.tipoCanchaRepository = tipoCanchaRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TipoCancha crear(@RequestBody TipoCancha tipoCancha) {
        return tipoCanchaRepository.save(tipoCancha);
    }

    @GetMapping
    public List<TipoCancha> listarTodos() {
        return tipoCanchaRepository.findAll();
    }
}