package david.sistemas.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class UsuarioServiceTest {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void testGuardarUsuario() {
        // Limpiar datos previos
        usuarioRepository.deleteAll();
        
        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setNombre("Usuario Service Test");
        usuario.setEmail("service@ejemplo.com");
        usuario.setRol("USER");
        
        // Guardar
        Usuario guardado = usuarioService.guardar(usuario);
        
        // Verificar
        assertThat(guardado).isNotNull();
        assertThat(guardado.getId()).isNotNull();
        assertThat(guardado.getNombre()).isEqualTo("Usuario Service Test");
        assertThat(guardado.getEmail()).isEqualTo("service@ejemplo.com");
        
        // Verificar que existe en la base de datos
        Usuario encontrado = usuarioRepository.findByEmail("service@ejemplo.com");
        assertThat(encontrado).isNotNull();
    }
}