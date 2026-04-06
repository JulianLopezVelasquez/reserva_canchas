package com.reserva.api.controller;

import com.reserva.api.model.Horario;
import com.reserva.api.model.Reserva;
import com.reserva.api.repository.HorarioRepository;
import com.reserva.api.repository.ReservaRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    private final HorarioRepository horarioRepository;
    private final ReservaRepository reservaRepository;

    public HorarioController(HorarioRepository horarioRepository, ReservaRepository reservaRepository) {
        this.horarioRepository = horarioRepository;
        this.reservaRepository = reservaRepository;
    }

    @GetMapping("/cancha/{canchaId}/disponibles")
    public List<Horario> obtenerDisponibles(@PathVariable Long canchaId, @RequestParam String fecha) {
        LocalDate date = LocalDate.parse(fecha);
        List<Horario> allHorarios = horarioRepository.findAll();
        List<Reserva> reservas = reservaRepository.findByCanchaIdAndFecha(canchaId, date);

        // Agrupamos horarios por hora de inicio/fin para evitar duplicados idénticos en la base de datos.
        Map<String, Horario> distinctHorarios = new LinkedHashMap<>();
        for (Horario horario : allHorarios) {
            String key = horario.getDiaSemana() + "|" + horario.getHoraInicio() + "|" + horario.getHoraFin();
            distinctHorarios.putIfAbsent(key, horario);
        }

        Set<String> reservedHorarioKeys = reservas.stream()
                .map(r -> {
                    Horario h = r.getHorario();
                    return h.getDiaSemana() + "|" + h.getHoraInicio() + "|" + h.getHoraFin();
                })
                .collect(Collectors.toSet());

        return distinctHorarios.values().stream()
                .filter(h -> !reservedHorarioKeys.contains(h.getDiaSemana() + "|" + h.getHoraInicio() + "|" + h.getHoraFin()))
                .collect(Collectors.toList());
    }
}