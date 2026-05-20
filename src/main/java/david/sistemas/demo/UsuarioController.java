package david.sistemas.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Listar todos (API)
    @GetMapping
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    // Crear usuario (API)
    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Buscar por email (API)
    @GetMapping("/email/{email}")
    public Usuario buscarPorEmail(@PathVariable String email) {
        return usuarioRepository.findByEmail(email);
    }

    // Buscar por nombre - Método corregido
    @GetMapping("/nombre/{nombre}")
    public List<Usuario> buscarPorNombre(@PathVariable String nombre) {
        // Ahora usamos findAll() y filtramos, o creamos un método específico
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getNombre().toLowerCase().contains(nombre.toLowerCase()))
                .toList();
    }

    // Eliminar usuario (API)
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
    }
}