package com.reserva.api.repository;

import com.reserva.api.model.Cancha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CanchaRepository extends JpaRepository<Cancha, Long> {


    List<Cancha> findBySedeId(Long sedeId);
    
    List<Cancha> findByTipoId(Long tipoId);
    
    List<Cancha> findBySedeIdAndTipoId(Long sedeId, Long tipoId);
}