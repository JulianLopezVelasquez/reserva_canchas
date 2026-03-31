package com.reserva.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "cancha_id")
    private Cancha cancha;

    @ManyToOne
    @JoinColumn(name = "horario_id")
    private Horario horario;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario; 
}