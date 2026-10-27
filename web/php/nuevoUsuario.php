<?php
include("conexion.php");

$user = isset($_POST['user']) ? trim($_POST['user']) : '';
$passwordPlano = isset($_POST['pass']) ? $_POST['pass'] : '';
$password = hash_password($passwordPlano);
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
$dni = isset($_POST['dni']) ? trim($_POST['dni']) : '';

if ($user === '' || strlen($passwordPlano) < 8 || !filter_var($email, FILTER_VALIDATE_EMAIL) || $dni === '') {
    echo "El formulario contiene datos no válidos.";
    exit;
}

// Preparar las declaraciones
$query_verificar_user = $conexion->prepare("SELECT * FROM Usuarios WHERE nombre_usuario = ?");
$query_verificar_email = $conexion->prepare("SELECT * FROM Usuarios WHERE email = ?");
$query_verificar_dni = $conexion->prepare("SELECT * FROM Usuarios WHERE dni_usuario = ?");

$query_verificar_user_empleados = $conexion->prepare("SELECT * FROM Empleados WHERE nombre_empleado = ?");
$query_verificar_email_empleados = $conexion->prepare("SELECT * FROM Empleados WHERE email_empleado = ?");
$query_verificar_dni_empleados = $conexion->prepare("SELECT * FROM Empleados WHERE dni_empleado = ?");
$query_verificar_dni_jefes = $conexion->prepare("SELECT * FROM Jefes WHERE dni_jefe = ?");

// Vincular y ejecutar las declaraciones
$query_verificar_user->bind_param('s', $user);
$query_verificar_user->execute();
$resultado_user = $query_verificar_user->get_result();

$query_verificar_email->bind_param('s', $email);
$query_verificar_email->execute();
$resultado_email = $query_verificar_email->get_result();

$query_verificar_dni->bind_param('s', $dni);
$query_verificar_dni->execute();
$resultado_dni = $query_verificar_dni->get_result();

$query_verificar_user_empleados->bind_param('s', $user);
$query_verificar_user_empleados->execute();
$resultado_user_empleados = $query_verificar_user_empleados->get_result();

$query_verificar_email_empleados->bind_param('s', $email);
$query_verificar_email_empleados->execute();
$resultado_email_empleados = $query_verificar_email_empleados->get_result();

$query_verificar_dni_empleados->bind_param('s', $dni);
$query_verificar_dni_empleados->execute();
$resultado_dni_empleados = $query_verificar_dni_empleados->get_result();

$query_verificar_dni_jefes->bind_param('s', $dni);
$query_verificar_dni_jefes->execute();
$resultado_dni_jefes = $query_verificar_dni_jefes->get_result();

if ($resultado_user && $resultado_email && $resultado_dni && $resultado_user_empleados && $resultado_email_empleados && $resultado_dni_empleados && $resultado_dni_jefes) {
    $row_user = $resultado_user->fetch_assoc();
    $row_email = $resultado_email->fetch_assoc();
    $row_dni = $resultado_dni->fetch_assoc();
    $row_user_empleados = $resultado_user_empleados->fetch_assoc();
    $row_email_empleados = $resultado_email_empleados->fetch_assoc();
    $row_dni_empleados = $resultado_dni_empleados->fetch_assoc();
    $row_dni_jefes = $resultado_dni_jefes->fetch_assoc();

    if (($row_user['nombre_usuario'] == $user || $row_user_empleados['nombre_empleado'] == $user) && ($row_email['email'] == $email || $row_email_empleados['email_empleado'] == $email) && ($row_dni['dni_usuario'] == $dni || $row_dni_empleados['dni_empleado'] == $dni || $row_dni_jefes['dni_jefe'] == $dni)) {
        echo "El usuario, el correo electrónico y/o el DNI / NIE ya existen. Por favor, introduzca otro nombre de usuario, otro correo electrónico y/o DNI / NIE.";
    } elseif ($row_user['nombre_usuario'] == $user || $row_user_empleados['nombre_empleado'] == $user) {
        echo "El usuario ya existe. Por favor, introduzca otro nombre de usuario.";
    } elseif ($row_dni['dni_usuario'] == $dni || $row_dni_empleados['dni_empleado'] == $dni || $row_dni_jefes['dni_jefe'] == $dni) {
        echo "El DNI / NIE ya está registrado a otra cuenta. Por favor, introduzca otro DNI / NIE.";
    } elseif ($row_email['email'] == $email || $row_email_empleados['email_empleado'] == $email) {
        echo "El correo electrónico ya está registrado. Por favor, introduzca otro correo electrónico.";
    } else {
        $query_insert = $conexion->prepare("INSERT INTO Usuarios (nombre_usuario, dni_usuario, email, password, num_tlf, tipo_usuario, cuenta_activa) VALUES (?, ?, ?, ?, ?, '3', '1')");
        $query_insert->bind_param('sssss', $user, $dni, $email, $password, $telefono);
        if ($query_insert->execute()) {
            echo "Usuario registrado con éxito.";
        } else {
            echo "Error al registrar el usuario.";
        }
    }
}

// Cerrar las conexiones
$query_verificar_user->close();
$query_verificar_email->close();
$query_verificar_dni->close();
$query_verificar_user_empleados->close();
$query_verificar_email_empleados->close();
$query_verificar_dni_empleados->close();
$query_verificar_dni_jefes->close();
$conexion->close();

?>
