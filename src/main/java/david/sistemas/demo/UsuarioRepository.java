package david.sistemas.demo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Búsqueda por nombre (contiene, ignorando mayúsculas)
    Page<Usuario> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
    
    // Búsqueda por email exacto
    Usuario findByEmail(String email);
    
    // Búsqueda general en nombre y email
    @Query("SELECT u FROM Usuario u WHERE LOWER(u.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :busqueda, '%'))")
    Page<Usuario> buscarGeneral(@Param("busqueda") String busqueda, Pageable pageable);
    
    // Contar usuarios por rol
    long countByRol(String rol);
}