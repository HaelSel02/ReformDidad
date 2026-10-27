<?php
// Configuración, sesión y utilidades comunes. No abre conexión con la BBDD.
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

/** Lee un ajuste desde variables de entorno o desde includes/config.local.php (no se sube a Git). */
function cfg($clave, $defecto = null)
{
    static $local = null;
    if ($local === null) {
        $ruta = __DIR__ . '/config.local.php';
        $local = is_file($ruta) ? (require $ruta) : array();
    }
    $v = getenv($clave);
    if ($v !== false && $v !== '') {
        return $v;
    }
    return isset($local[$clave]) ? $local[$clave] : $defecto;
}

if (session_status() === PHP_SESSION_NONE) {
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
    session_set_cookie_params(array(
        'lifetime' => 0,
        'path' => '/',
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Lax',
    ));
    session_start();
}

/* ---------- Contraseñas ---------- */

function hash_password($plano)
{
    return password_hash($plano, PASSWORD_DEFAULT);
}

/** Verifica una contraseña. Acepta bcrypt (nuevo) y MD5 (cuentas antiguas, que se migran al entrar). */
function password_ok($plano, $guardado)
{
    if (!is_string($plano) || !is_string($guardado) || $guardado === '') {
        return false;
    }
    if (preg_match('/^\$2[abxy]\$/', $guardado)) {
        return password_verify($plano, $guardado);
    }
    return hash_equals(strtolower($guardado), md5($plano));
}

function password_es_antigua($guardado)
{
    return !preg_match('/^\$2[abxy]\$/', (string) $guardado);
}

/* ---------- Entradas ---------- */

function pagina_actual()
{
    $p = isset($_GET['pagina']) ? (int) $_GET['pagina'] : 1;
    return $p < 1 ? 1 : $p;
}

/**
 * Valida un ORDER BY recibido del navegador. Solo admite "columna ASC|DESC"
 * con columnas de la lista blanca; si no, devuelve el valor por defecto.
 */
function orden_seguro($valor, array $permitidas, $defecto)
{
    if (is_string($valor) && preg_match('/^([A-Za-z_]+(?:\.[A-Za-z_]+)?)\s+(ASC|DESC)$/i', trim($valor), $m)) {
        if (in_array($m[1], $permitidas, true)) {
            return $m[1] . ' ' . strtoupper($m[2]);
        }
    }
    return $defecto;
}

/** Consulta preparada. Devuelve mysqli_result (SELECT), true (INSERT/UPDATE/DELETE) o false si falla. */
function q($conexion, $sql, $tipos = '', array $params = array())
{
    $st = $conexion->prepare($sql);
    if (!$st) {
        error_log('SQL prepare: ' . $conexion->error);
        return false;
    }
    if ($tipos !== '') {
        $st->bind_param($tipos, ...$params);
    }
    if (!$st->execute()) {
        error_log('SQL execute: ' . $st->error);
        return false;
    }
    $res = $st->get_result();
    return $res !== false ? $res : true;
}

/* ---------- Permisos ---------- */

function denegar($codigo, $mensaje)
{
    http_response_code($codigo);
    echo $mensaje;
    exit;
}

/**
 * Política de acceso por script. Por defecto, un endpoint solo es accesible para el administrador (rol 1).
 * 'roles' = roles permitidos (null = público). 'propio' = parámetros que deben coincidir con la sesión
 * (salvo para el administrador): array(array(origen, parametro, clave_de_sesion)).
 */
function aplicar_politica($script)
{
    $publico = array('roles' => null);
    $cliente = array('roles' => array(3));
    $politicas = array(
        'getUsuarios' => $publico,
        'nuevoUsuario' => $publico,
        'checkSession' => $publico,
        'cerrarSesion' => $publico,
        'getReformasGaleria' => $publico,
        'mostrarFAQ' => $publico,
        'enviar_mail' => $publico,
        'mostrarSelectMetrosReforma' => $publico,
        'mostrarSelectTipoReforma' => $publico,
        'mostrarSelectZonaReforma' => $publico,

        'getInfoUsuario' => array('roles' => array(1, 3), 'propio' => array(array('GET', 'id_user', 'id_user'))),
        'getPassUsuario' => array('roles' => array(1, 3), 'propio' => array(array('GET', 'id_user', 'id_user'))),
        'editUser' => array('roles' => array(1, 3), 'propio' => array(array('GET', 'id_user', 'id_user'))),
        'getReformasActualesClientes' => array('roles' => array(3), 'propio' => array(array('GET', 'id_usuario', 'id_user'))),
        'getReformasCalendarioCliente' => array('roles' => array(3), 'propio' => array(array('GET', 'id_usuario', 'id_user'))),
        'getReformasSolicitadasCliente' => array('roles' => array(3), 'propio' => array(array('GET', 'id_usuario', 'id_user'))),
        'getTodosDocumentos' => array('roles' => array(3), 'propio' => array(array('GET', 'id_usuario', 'id_user'))),
        'nuevaReforma' => array('roles' => array(3), 'propio' => array(array('POST', 'usuario', 'id_user'))),
        'nuevaResena' => array('roles' => array(3), 'propio' => array(array('POST', 'idUsuario', 'id_user'))),
        'setDocumentoFavorito' => $cliente,

        'getInformacionEmpleado' => array('roles' => array(2), 'propio' => array(array('GET', 'id_usuario', 'id_user'), array('GET', 'id_supervisor', 'id_supervisor'))),
        'getReformasActualesEmpleado' => array('roles' => array(2), 'propio' => array(array('GET', 'id_supervisor', 'id_supervisor'))),
        'getReformasCalendarioEmpleado' => array('roles' => array(2), 'propio' => array(array('GET', 'id_usuario', 'id_user'), array('GET', 'id_supervisor', 'id_supervisor'))),
        'modificarPassEmpleado' => array('roles' => array(2), 'propio' => array(array('POST', 'id_empleado', 'id_user'))),
    );

    $p = isset($politicas[$script]) ? $politicas[$script] : array('roles' => array(1));
    if ($p['roles'] === null) {
        return;
    }
    if (!isset($_SESSION['user'], $_SESSION['rol'])) {
        denegar(401, 'No autenticado');
    }
    $rol = (int) $_SESSION['rol'];
    if (!in_array($rol, $p['roles'], true)) {
        denegar(403, 'Acceso denegado');
    }
    if ($rol !== 1 && !empty($p['propio'])) {
        foreach ($p['propio'] as $regla) {
            list($origen, $param, $clave) = $regla;
            $fuente = ($origen === 'POST') ? $_POST : $_GET;
            if (isset($fuente[$param]) && (string) $fuente[$param] !== (string) (isset($_SESSION[$clave]) ? $_SESSION[$clave] : '')) {
                denegar(403, 'Acceso denegado');
            }
        }
    }
}

/* ---------- Salidas ---------- */

// Valor que se muestra en los formularios de edición del administrador en lugar de la contraseña real.
define('PASS_SIN_CAMBIOS', 'Sin_cambios_1A');

/** Quita de una fila los datos que nunca deben salir hacia el navegador (hashes y, si es público, datos personales). */
function quitar_secretos(array $fila, $publico = false)
{
    unset($fila['password'], $fila['password_empleado']);
    if ($publico) {
        unset($fila['email'], $fila['dni_usuario'], $fila['num_tlf'], $fila['email_empleado'], $fila['dni_empleado'], $fila['num_tlf_empleado']);
    }
    return $fila;
}
