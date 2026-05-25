package david.sistemas.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void testGuardarYBuscarUsuario() {
        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setNombre("Usuario Test");
        usuario.setEmail("test@ejemplo.com");
        usuario.setRol("USER");

        // Guardar
        Usuario guardado = usuarioRepository.save(usuario);
        
        // Buscar por email
        Usuario encontrado = usuarioRepository.findByEmail("test@ejemplo.com");
        
        // Verificar
        assertThat(encontrado).isNotNull();
        assertThat(encontrado.getNombre()).isEqualTo("Usuario Test");
        assertThat(encontrado.getEmail()).isEqualTo("test@ejemplo.com");
    }
}