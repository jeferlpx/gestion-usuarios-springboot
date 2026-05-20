package david.sistemas.demo;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;

@Controller
@RequestMapping("/web/usuarios")
public class UsuarioWebController {

    @Autowired
    private UsuarioService usuarioService;

    // Listar con paginación y búsqueda
    @GetMapping
    public String listarUsuarios(
            @RequestParam(defaultValue = "1") int pagina,
            @RequestParam(required = false) String busqueda,
            Model model) {
        
        Page<Usuario> paginaUsuarios = usuarioService.listarUsuarios(pagina, busqueda);
        
        model.addAttribute("usuarios", paginaUsuarios.getContent());
        model.addAttribute("paginaActual", pagina);
        model.addAttribute("totalPaginas", paginaUsuarios.getTotalPages());
        model.addAttribute("totalUsuarios", paginaUsuarios.getTotalElements());
        model.addAttribute("busqueda", busqueda);
        
        return "index";
    }

    // Mostrar formulario nuevo
    @GetMapping("/nuevo")
    public String mostrarFormularioNuevo(Model model) {
        model.addAttribute("usuario", new Usuario());
        model.addAttribute("titulo", "Nuevo Usuario");
        return "formulario";
    }

    // Guardar con validaciones y foto
    @PostMapping("/guardar")
public String guardarUsuario(
        @Valid @ModelAttribute Usuario usuario,
        BindingResult result,
        @RequestParam(value = "archivo", required = false) MultipartFile archivo,
        RedirectAttributes redirectAttributes,
        Model model) {
    
    if (result.hasErrors()) {
        model.addAttribute("titulo", usuario.getId() == null ? "Nuevo Usuario" : "Editar Usuario");
        return "formulario";
    }
    
    try {
        // Si hay foto, la guardamos
        if (archivo != null && !archivo.isEmpty()) {
            String nombreFoto = guardarFoto(archivo);
            usuario.setFoto(nombreFoto);
        }
        
        usuarioService.guardar(usuario);
        redirectAttributes.addFlashAttribute("success", "Usuario guardado exitosamente");
        
    } catch (Exception e) {
        redirectAttributes.addFlashAttribute("error", "Error al guardar: " + e.getMessage());
        return "redirect:/web/usuarios/nuevo";
    }
    
    return "redirect:/web/usuarios";
}

// Método auxiliar para guardar foto
private String guardarFoto(MultipartFile archivo) throws IOException {
    String nombreOriginal = archivo.getOriginalFilename();
    String extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
    String nombreUnico = UUID.randomUUID().toString() + extension;
    
    Path ruta = Paths.get("uploads/" + nombreUnico);
    Files.createDirectories(ruta.getParent());
    Files.copy(archivo.getInputStream(), ruta, StandardCopyOption.REPLACE_EXISTING);
    
    return nombreUnico;
}

    // Mostrar formulario editar
    @GetMapping("/editar/{id}")
    public String mostrarFormularioEditar(@PathVariable Long id, Model model) {
        Usuario usuario = usuarioService.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        model.addAttribute("usuario", usuario);
        model.addAttribute("titulo", "Editar Usuario");
        return "formulario";
    }

    // Eliminar
    @GetMapping("/eliminar/{id}")
    public String eliminarUsuario(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        usuarioService.eliminar(id);
        redirectAttributes.addFlashAttribute("success", "Usuario eliminado exitosamente");
        return "redirect:/web/usuarios";
    }
}