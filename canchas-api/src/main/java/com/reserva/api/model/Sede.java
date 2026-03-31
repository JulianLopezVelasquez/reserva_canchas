package com.reserva.api.model;

import jakarta.persistence.*; 
import lombok.Getter;        
import lombok.Setter;        

@Entity
@Getter @Setter
public class Sede {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String direccion;
}