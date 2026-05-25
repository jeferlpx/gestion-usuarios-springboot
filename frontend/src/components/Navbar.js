import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail');
    const userRol = localStorage.getItem('userRol');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">Gestión Usuarios</Link>
                <div className="navbar-nav ms-auto">
                    <Link className="nav-link" to="/chat">💬 Chat</Link>
                    <Link className="nav-link" to="/">📋 Usuarios</Link>
                    <span className="nav-link text-light">
                        👤 {userEmail} ({userRol})
                    </span>
                    <button className="btn btn-danger btn-sm ms-2" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;