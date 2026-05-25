# 🚀 Sistema de Gestión de Usuarios

[![Java](https://img.shields.io/badge/Java-21-orange)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-brightgreen)](https://spring.io/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-9.0-blue)](https://mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-25.0-blue)](https://docker.com/)

## 📋 Descripción

Aplicación web completa para gestión de usuarios con **autenticación JWT**, **CRUD completo**, **subida de fotos**, **paginación**, **búsqueda** y **chat en tiempo real** con UI moderna estilo WhatsApp.

---

## ✨ Características

### Gestión de Usuarios
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Subida de fotos de perfil
- ✅ Paginación (5 usuarios por página)
- ✅ Búsqueda por nombre/email
- ✅ Autenticación JWT
- ✅ Roles: ADMIN / USER

### Chat en Tiempo Real
- ✅ Mensajes instantáneos
- ✅ Selector de emojis
- ✅ Indicador de escritura
- ✅ Avatares por usuario (colores únicos)
- ✅ Scroll automático
- ✅ Diseño tipo WhatsApp/Telegram

### DevOps
- ✅ Docker + docker-compose
- ✅ Pruebas unitarias (JUnit + Mockito)
- ✅ Documentación completa

---

## 🛠️ Tecnologías

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Java | 21 | Lenguaje principal |
| Spring Boot | 4.0 | Framework |
| Spring Security | 6.x | Autenticación |
| JWT | 0.12.6 | Tokens |
| Spring Data JPA | - | ORM |
| WebSockets (STOMP) | - | Chat en tiempo real |
| MySQL | 9.0 | Base de datos |
| Maven | - | Gestor de dependencias |

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19 | Biblioteca UI |
| Bootstrap | 5.3 | Estilos |
| Axios | - | Cliente HTTP |
| SockJS + STOMP.js | - | WebSocket cliente |
| Emoji Picker | - | Selector de emojis |

---

## 🚀 Instalación y Ejecución

### Requisitos previos
- Java 21
- MySQL 8+
- Node.js 18+
- Maven 3.8+

### Backend

```bash
# Clonar repositorio
git clone https://github.com/jeferlpx/gestion-usuarios-springboot.git
cd gestion-usuarios-springboot

# Configurar MySQL
CREATE DATABASE demo_db;

# Configurar application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/demo_db
spring.datasource.username=root
spring.datasource.password=tu_contraseña

# Construir y ejecutar
mvn clean package
java -jar target/demo-0.0.1-SNAPSHOT.jar
