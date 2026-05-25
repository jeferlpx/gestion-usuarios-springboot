import React, { useState, useEffect } from 'react';
import api from '../services/api';

function UsuarioForm({ onUsuarioCreado, usuarioEditando, setUsuarioEditando }) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('USER');
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (usuarioEditando) {
            setNombre(usuarioEditando.nombre);
            setEmail(usuarioEditando.email);
            setRol(usuarioEditando.rol || 'USER');
            setPassword('');
            if (usuarioEditando.foto) {
                setFotoPreview(`http://localhost:8080/uploads/${usuarioEditando.foto}`);
            }
            setIsEditing(true);
        } else {
            resetForm();
        }
    }, [usuarioEditando]);

    const resetForm = () => {
        setNombre('');
        setEmail('');
        setPassword('');
        setRol('USER');
        setFoto(null);
        setFotoPreview(null);
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('email', email);
            formData.append('rol', rol);
            if (password) formData.append('password', password);
            if (foto) formData.append('foto', foto);

            if (isEditing && usuarioEditando) {
                await api.put(`/usuarios/${usuarioEditando.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setSuccess('Usuario actualizado exitosamente');
                setUsuarioEditando(null);
            } else {
                await api.post('/usuarios', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setSuccess('Usuario creado exitosamente');
                resetForm();
            }
            if (onUsuarioCreado) onUsuarioCreado();
        } catch (err) {
            console.error('Error:', err);
            setError('Error al procesar el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header bg-success text-white">
                <h5 className="mb-0">{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h5>
            </div>
            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3">
                            <input type="text" className="form-control" placeholder="Nombre" 
                                   value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        </div>
                        <div className="col-md-3">
                            <input type="email" className="form-control" placeholder="Email" 
                                   value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="col-md-2">
                            <input type="password" className="form-control" placeholder="Contraseña" 
                                   value={password} onChange={(e) => setPassword(e.target.value)} 
                                   required={!isEditing} />
                            {isEditing && <small className="text-muted">Dejar vacío para no cambiar</small>}
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" value={rol} onChange={(e) => setRol(e.target.value)}>
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <input type="file" className="form-control" accept="image/*" 
                                   onChange={handleFileChange} />
                        </div>
                        {fotoPreview && (
                            <div className="col-md-12 mt-2">
                                <img src={fotoPreview} width="80" height="80" className="rounded-circle" alt="preview" />
                            </div>
                        )}
                        <div className="col-md-12 mt-2">
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? 'Procesando...' : (isEditing ? 'Actualizar' : 'Crear')}
                            </button>
                            {isEditing && (
                                <button type="button" className="btn btn-secondary ms-2" onClick={() => setUsuarioEditando(null)}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UsuarioForm;