package david.sistemas.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Paginación y búsqueda
    public Page<Usuario> listarUsuarios(int pagina, String busqueda) {
    Pageable pageable = PageRequest.of(pagina - 1, 5, Sort.by("id").descending());
    
    if (busqueda != null && !busqueda.isEmpty()) {
        return usuarioRepository.buscarGeneral(busqueda, pageable);
    }
    return usuarioRepository.findAll(pageable);
}

    // Guardar usuario
    public Usuario guardar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Guardar con foto
    //public Usuario guardarConFoto(Usuario usuario, MultipartFile archivo) throws IOException {
      //  if (archivo != null && !archivo.isEmpty()) {
        //    String nombreFoto = guardarFoto(archivo);
          //  usuario.setFoto(nombreFoto);
        //}
        //return usuarioRepository.save(usuario);
    //}

    // Buscar por ID
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    // Eliminar usuario
    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    // Guardar foto en el servidor
    private String guardarFoto(MultipartFile archivo) throws IOException {
        String nombreOriginal = archivo.getOriginalFilename();
        String extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
        String nombreUnico = UUID.randomUUID().toString() + extension;
        
        Path ruta = Paths.get("src/main/resources/static/uploads/" + nombreUnico);
        Files.createDirectories(ruta.getParent());
        Files.copy(archivo.getInputStream(), ruta, StandardCopyOption.REPLACE_EXISTING);
        
        return nombreUnico;
    }
}