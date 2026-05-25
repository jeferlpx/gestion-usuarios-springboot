package david.sistemas.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    @PostMapping
public Usuario crear(
        @RequestParam("nombre") String nombre,
        @RequestParam("email") String email,
        @RequestParam("password") String password,
        @RequestParam("rol") String rol,
        @RequestParam(value = "foto", required = false) MultipartFile foto) throws IOException {
    
    Usuario usuario = new Usuario();
    usuario.setNombre(nombre);
    usuario.setEmail(email);
    usuario.setPassword(new BCryptPasswordEncoder().encode(password));
    usuario.setRol(rol);
    
    if (foto != null && !foto.isEmpty()) {
        String nombreFoto = guardarFoto(foto);
        usuario.setFoto(nombreFoto);
    }
    
    return usuarioRepository.save(usuario);
}

    @GetMapping("/email/{email}")
    public Usuario buscarPorEmail(@PathVariable String email) {
        return usuarioRepository.findByEmail(email);
    }

    @PutMapping("/{id}")
public Usuario actualizar(
        @PathVariable Long id,
        @RequestParam("nombre") String nombre,
        @RequestParam("email") String email,
        @RequestParam(value = "password", required = false) String password,
        @RequestParam("rol") String rol,
        @RequestParam(value = "foto", required = false) MultipartFile foto) throws IOException {
    
    Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    
    usuario.setNombre(nombre);
    usuario.setEmail(email);
    usuario.setRol(rol);
    
    if (password != null && !password.isEmpty()) {
        usuario.setPassword(new BCryptPasswordEncoder().encode(password));
    }
    
    if (foto != null && !foto.isEmpty()) {
        String nombreFoto = guardarFoto(foto);
        usuario.setFoto(nombreFoto);
    }
    
    return usuarioRepository.save(usuario);
}

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
    }

    @PostMapping("/{id}/foto")
    public String subirFoto(@PathVariable Long id, @RequestParam("foto") MultipartFile archivo) throws IOException {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        String nombreFoto = guardarFoto(archivo);
        usuario.setFoto(nombreFoto);
        usuarioRepository.save(usuario);
        
        return nombreFoto;
    }

    private String guardarFoto(MultipartFile archivo) throws IOException {
        String nombreOriginal = archivo.getOriginalFilename();
        String extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
        String nombreUnico = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
        
        Path ruta = Paths.get("uploads/" + nombreUnico);
        Files.createDirectories(ruta.getParent());
        Files.copy(archivo.getInputStream(), ruta, StandardCopyOption.REPLACE_EXISTING);
        
        return nombreUnico;
    }
}