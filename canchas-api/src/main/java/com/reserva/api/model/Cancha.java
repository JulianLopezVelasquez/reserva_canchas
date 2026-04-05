package com.reserva.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Cancha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre; 
    private String descripcion; 
    private int capacidad; 
    private String imagen; 

    @ManyToOne
    @JoinColumn(name = "sede_id")
    private Sede sede; 

    @ManyToOne
    @JoinColumn(name = "tipo_id")
    private TipoCancha tipo; 
}