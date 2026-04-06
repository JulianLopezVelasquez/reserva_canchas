package com.reserva.api.component;

import com.reserva.api.model.*;
import com.reserva.api.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, 
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        

        crearUsuarioSiNoExiste("Julián López", "julian@admin.com", "admin123");

        crearUsuarioSiNoExiste("Juan Admin", "juan@admin.com", "admin123");

        System.out.println(">> Sistema listo. Base de datos de negocio vacía. Admins verificados.");
    }

    private void crearUsuarioSiNoExiste(String nombre, String correo, String password) {
        if (usuarioRepository.findByCorreo(correo).isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombre(nombre);
            admin.setCorreo(correo);
            admin.setContrasena(passwordEncoder.encode(password)); 
            admin.setRol("ROLE_ADMIN"); 
            usuarioRepository.save(admin);
            System.out.println(" ✅ ACCESO GARANTIZADO PARA: " + correo);
        }
    }
}