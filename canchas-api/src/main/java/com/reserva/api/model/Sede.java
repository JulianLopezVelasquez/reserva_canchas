package com.reserva.api.model;

import jakarta.persistence.*; 
import lombok.Data;

@Entity
@Data
public class Sede {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String direccion;
}