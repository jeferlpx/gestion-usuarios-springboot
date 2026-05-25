package david.sistemas.demo.controller;

import david.sistemas.demo.Usuario;
import david.sistemas.demo.UsuarioRepository;
import david.sistemas.demo.dto.AuthRequest;
import david.sistemas.demo.dto.AuthResponse;
import david.sistemas.demo.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public Usuario register(@RequestBody Usuario usuario) {
        // Encriptar contraseña
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        
        // Si no tiene rol, asignar USER por defecto
        if (usuario.getRol() == null || usuario.getRol().isEmpty()) {
            usuario.setRol("USER");
        }
        
        return usuarioRepository.save(usuario);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        System.out.println("=== LOGIN INTENTADO ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Password: " + request.getPassword());
        
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail());
        
        if (usuario == null) {
            System.out.println("Usuario NO encontrado");
            throw new RuntimeException("Usuario no encontrado");
        }
        
        System.out.println("Usuario encontrado: " + usuario.getNombre());
        System.out.println("Password almacenado: " + usuario.getPassword());
        
        // Verificar contraseña con BCrypt
        boolean passwordMatch = passwordEncoder.matches(request.getPassword(), usuario.getPassword());
        System.out.println("¿Coinciden contraseñas? " + passwordMatch);
        
        if (!passwordMatch) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        
        String token = jwtService.generateToken(usuario.getEmail(), usuario.getRol());
        System.out.println("Token generado: " + token);
        
        return new AuthResponse(token, usuario.getEmail(), usuario.getRol());
    }
}