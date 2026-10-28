# ReformDidad

Aplicación web para una empresa de reformas de viviendas en Valencia. Proyecto final del ciclo de Desarrollo de Aplicaciones Web (DAW, 2024), revisado después para mejorar su seguridad y poder publicarlo como demo.

> **Demo:** _(https://reformdidad.joelgallo.com/)_

## Qué hace

La web tiene una parte pública y tres áreas privadas según el rol del usuario.

| Rol | Qué puede hacer |
|---|---|
| Visitante | Ver la galería de reformas (antes y después), calcular un presupuesto aproximado, leer las preguntas frecuentes y contactar. |
| Cliente | Solicitar reformas (máximo 2 en curso), ver el calendario de sus obras, dejar reseñas, descargar y marcar como favoritos los informes en PDF y editar sus datos. |
| Empleado | Consultar las reformas de su jefe de obra, ver su calendario y cambiar su contraseña. |
| Administrador | Gestionar clientes, empleados, jefes de obra y reformas, aprobar solicitudes y reseñas, subir fotos y generar informes en PDF. |

## Tecnologías

- **Backend:** PHP 8 (mysqli, sesiones), MariaDB / MySQL
- **Frontend:** HTML, CSS, JavaScript, jQuery, Bootstrap
- **Librerías:** [dompdf](https://github.com/dompdf/dompdf) (informes PDF) y [PHPMailer](https://github.com/PHPMailer/PHPMailer) (correo)

## Estructura

```
web/            Sitio completo (esto es lo que se sube al servidor)
  php/          Endpoints del backend
    includes/   Configuración, sesión, permisos y utilidades de seguridad
database/       Script SQL con la estructura y datos de demostración
Dockerfile, docker-compose.yml   Entorno local de pruebas
```

## Cuentas de demostración

Todos los datos son ficticios. La contraseña del administrador es solo para el entorno local o de pruebas.

| Rol | Usuario | Contraseña |
|---|---|---|
| Administrador | `Administrador` | `Admin1234*` |
| Empleado | `empleado_demo1` (también 2 y 3) | `Empleado_Demo1!` |
| Cliente | `Marta_V`, `Carlos_R`… | `Cliente_Demo1!` |

## Ejecutarlo en local

### Opción A: Docker

```bash
docker compose up --build
```

Abre http://localhost:8080. La base de datos se crea e importa sola la primera vez.

### Opción B: XAMPP / WAMP

1. Copia el contenido de `web/` a `htdocs/reformdidad/`.
2. En phpMyAdmin crea una base de datos e importa `database/reformdidad_db.sql`.
3. Copia `web/php/conexion.php` y rellena los datos de la base de datos.
4. Abre http://localhost/reformdidad/.

## Publicarlo en un hosting con PHP y MySQL

1. Crea en el panel del hosting una base de datos y un usuario (anota los tres datos).
2. Importa `database/reformdidad_db.sql` desde phpMyAdmin.
3. Copia `conexion.php` rellénalo y súbelo a `php/`.
4. Sube el contenido de `web/` por FTP/SFTP (por ejemplo con FileZilla) a la carpeta pública (`public_html`).
5. Comprueba que usas PHP 8.x con las extensiones `mysqli`, `gd` y `mbstring`, y que `img_reformas/` y `reportes_reformas/` tienen permisos de escritura.
6. Activa HTTPS (certificado SSL gratuito del hosting) y prueba el login de los tres roles.
7. Para el formulario de contacto, pon `MAIL_ENABLED` a `1` y rellena los datos SMTP del buzón.

## Seguridad

Esta versión corrige los problemas de la entrega original:

- **Contraseñas con bcrypt** (`password_hash`). Las cuentas antiguas con MD5 se migran solas al iniciar sesión.
- **Consultas preparadas** donde entra texto del usuario, y conversión a entero de todos los identificadores. Las ordenaciones (`ORDER BY`) solo aceptan columnas de una lista blanca.
- **Control de acceso por rol en un único sitio** (`includes/bootstrap.php`). Por defecto, un endpoint solo es accesible para el administrador; los clientes y empleados solo pueden consultar y modificar sus propios datos.
- **Login y registro por POST**, con regeneración del ID de sesión y cookies `HttpOnly` y `SameSite`.
- **Ya no se envían al navegador** los hashes de contraseña ni los datos personales (la galería pública exponía emails, DNI y teléfonos).
- **Credenciales fuera del código**: variables de entorno o `config.local.php` (ignorado por Git).
- **Subida de imágenes** validada por contenido, y sin ejecución de PHP en las carpetas de subidas.
- **Correo**: el formulario de contacto ya no puede usarse para enviar spam; los mensajes llegan a la empresa y hay un límite por sesión.

### Pendiente de mejorar

- El JavaScript construye parte del HTML concatenando datos de la base de datos. Habría que escapar esos datos o usar `.text()` para evitar XSS almacenado.
- Falta protección CSRF con token en los formularios y límite de intentos en el login.
- Los acciones de borrado se hacen por GET; lo correcto sería POST con token.
- No hay tests automáticos.
- Mejorar los select, ya que sino podria ser una lista infinita en caso de haber más usuarios.

## Créditos y licencias

dompdf y PHPMailer se distribuyen bajo licencia LGPL; jQuery bajo licencia MIT. Las imágenes y datos de demostración son de ejemplo.

Autor: Joel Gallo
