package com.reserva.api.component;

import com.reserva.api.model.*;
import com.reserva.api.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SedeRepository sedeRepository;
    private final TipoCanchaRepository tipoCanchaRepository;
    private final CanchaRepository canchaRepository;
    private final HorarioRepository horarioRepository; 

    public DataInitializer(SedeRepository sedeRepository, 
                           TipoCanchaRepository tipoCanchaRepository, 
                           CanchaRepository canchaRepository,
                           HorarioRepository horarioRepository) {
        this.sedeRepository = sedeRepository;
        this.tipoCanchaRepository = tipoCanchaRepository;
        this.canchaRepository = canchaRepository;
        this.horarioRepository = horarioRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (sedeRepository.count() > 0 || tipoCanchaRepository.count() > 0 || canchaRepository.count() > 0 || horarioRepository.count() > 0) {
            System.out.println(">> Datos iniciales ya existen. Se limpiarán duplicados de horarios existentes.");
            limpiarHorariosDuplicados();
            return;
        }

        Sede norte = new Sede();
        norte.setNombre("Sede Norte");
        norte.setDireccion("Calle 100 #15-20");
        
        Sede sur = new Sede();
        sur.setNombre("Sede Sur");
        sur.setDireccion("Carrera 50 #10-30");
        
        sedeRepository.saveAll(List.of(norte, sur));

   
        TipoCancha futbol = new TipoCancha();
        futbol.setNombre("Fútbol");
        
        TipoCancha tenis = new TipoCancha();
        tenis.setNombre("Tenis");
        
        tipoCanchaRepository.saveAll(List.of(futbol, tenis));


        Cancha cancha1 = new Cancha();
        cancha1.setNombre("Campín 5");
        cancha1.setDescripcion("Cancha sintética de fútbol 5 con iluminación");
        cancha1.setCapacidad(10);
        cancha1.setImagen("https://link-a-tu-imagen.com/futbol.jpg");
        cancha1.setSede(norte);
        cancha1.setTipo(futbol);

        Cancha cancha2 = new Cancha();
        cancha2.setNombre("Grand Slam 1");
        cancha2.setDescripcion("Cancha de polvo de ladrillo profesional");
        cancha2.setCapacidad(4);
        cancha2.setImagen("https://link-a-tu-imagen.com/tenis.jpg");
        cancha2.setSede(sur);
        cancha2.setTipo(tenis);

        canchaRepository.saveAll(List.of(cancha1, cancha2));


        Horario h1 = new Horario();
        h1.setDiaSemana("Lunes");
        h1.setHoraInicio(LocalTime.of(8, 0));
        h1.setHoraFin(LocalTime.of(9, 0));

        Horario h2 = new Horario();
        h2.setDiaSemana("Lunes");
        h2.setHoraInicio(LocalTime.of(9, 0));
        h2.setHoraFin(LocalTime.of(10, 0));

        Horario h3 = new Horario();
        h3.setDiaSemana("Lunes");
        h3.setHoraInicio(LocalTime.of(10, 0));
        h3.setHoraFin(LocalTime.of(11, 0));

        horarioRepository.saveAll(List.of(h1, h2, h3));

        System.out.println(">> Datos iniciales (Sedes, Tipos, Canchas y Horarios) cargados con éxito.");
    }

    private void limpiarHorariosDuplicados() {
        List<Horario> horarios = horarioRepository.findAll();
        Map<String, Horario> horariosUnicos = new LinkedHashMap<>();

        for (Horario horario : horarios) {
            String key = horario.getDiaSemana() + "|" + horario.getHoraInicio() + "|" + horario.getHoraFin();
            horariosUnicos.putIfAbsent(key, horario);
        }

        Set<Long> idsParaConservar = horariosUnicos.values().stream()
                .map(Horario::getId)
                .collect(Collectors.toSet());

        horarios.stream()
                .filter(h -> !idsParaConservar.contains(h.getId()))
                .forEach(h -> horarioRepository.deleteById(h.getId()));
    }
}