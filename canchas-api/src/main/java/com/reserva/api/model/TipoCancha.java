package com.reserva.api.model;

import jakarta.persistence.*; 
import lombok.Data;

@Entity
@Data
public class TipoCancha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre; 
}