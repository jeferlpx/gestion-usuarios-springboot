import React, { useState, useEffect } from 'react';
import api from '../services/api';
import UsuarioForm from './UsuarioForm';

function UsuarioLista() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [busqueda, setBusqueda] = useState('');
    const [error, setError] = useState('');

    const cargarUsuarios = async (pagina = 1, busquedaTexto = '') => {
    setLoading(true);
    setError('');
    try {
        // Usar el endpoint que ahora es público
        const response = await api.get(`/web/usuarios/api?pagina=${pagina}&busqueda=${busquedaTexto}`);
        setUsuarios(response.data.content || []);
        setPaginaActual(response.data.number + 1);
        setTotalPaginas(response.data.totalPages);
        setTotalUsuarios(response.data.totalElements);
    } catch (error) {
        console.error('Error detallado:', error);
        setError(`Error cargando usuarios: ${error.response?.status || error.message}`);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        cargarUsuarios(paginaActual, busqueda);
    }, [paginaActual, busqueda]);

    const eliminarUsuario = async (id) => {
        if (window.confirm('¿Eliminar este usuario?')) {
            try {
                await api.delete(`/usuarios/${id}`);
                cargarUsuarios(paginaActual, busqueda);
            } catch (error) {
                setError('Error eliminando usuario');
            }
        }
    };

    const handleBuscar = (e) => {
        e.preventDefault();
        setPaginaActual(1);
        cargarUsuarios(1, busqueda);
    };

    if (loading) return <div className="text-center mt-5">Cargando...</div>;

    return (
        <div className="container mt-4">
            <h2>Gestión de Usuarios</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <UsuarioForm onUsuarioCreado={() => cargarUsuarios(paginaActual, busqueda)} 
                         usuarioEditando={usuarioEditando} 
                         setUsuarioEditando={setUsuarioEditando} />
            
            {/* Barra de búsqueda */}
            <form onSubmit={handleBuscar} className="mb-3">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Buscar por nombre o email..."
                           value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                    <button type="submit" className="btn btn-primary">Buscar</button>
                    <button type="button" className="btn btn-secondary" onClick={() => {
                        setBusqueda('');
                        setPaginaActual(1);
                        cargarUsuarios(1, '');
                    }}>Limpiar</button>
                </div>
            </form>
            
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Foto</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>
                                    {usuario.foto ? (
                                        <img src={`http://localhost:8080/uploads/${usuario.foto}`} 
                                             width="40" height="40" className="rounded-circle" alt="foto"
                                             onError={(e) => { e.target.style.display = 'none'; }} />
                                    ) : (
                                        <i className="fas fa-user-circle fa-2x text-secondary"></i>
                                    )}
                                </td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.email}</td>
                                <td>
                                    <span className={`badge ${usuario.rol === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}>
                                        {usuario.rol || 'USER'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => setUsuarioEditando(usuario)}>
                                        ✏️ Editar
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => eliminarUsuario(usuario.id)}>
                                        🗑️ Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Paginación */}
            {totalPaginas > 1 && (
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPaginaActual(1)}>Primera</button>
                        </li>
                        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>Anterior</button>
                        </li>
                        <li className="page-item active">
                            <span className="page-link">Página {paginaActual} de {totalPaginas}</span>
                        </li>
                        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente</button>
                        </li>
                        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPaginaActual(totalPaginas)}>Última</button>
                        </li>
                    </ul>
                </nav>
            )}
            
            <div className="text-muted mt-2">
                Total de usuarios: {totalUsuarios}
            </div>
        </div>
    );
}

export default UsuarioLista;