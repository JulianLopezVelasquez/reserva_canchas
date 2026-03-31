package com.reserva.api.model;

import jakarta.persistence.*;

@Entity
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


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public int getCapacidad() { return capacidad; }
    public void setCapacidad(int capacidad) { this.capacidad = capacidad; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; } 

    public Sede getSede() { return sede; }
    public void setSede(Sede sede) { this.sede = sede; }

    public TipoCancha getTipo() { return tipo; }
    public void setTipo(TipoCancha tipo) { this.tipo = tipo; }
}