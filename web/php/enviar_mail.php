<?php
// Formulario de contacto. El envío real solo se activa si MAIL_ENABLED=1 y hay SMTP configurado.
require_once __DIR__ . '/includes/bootstrap.php';

function responder($estado, $mensaje)
{
    echo json_encode(array('status' => $estado, 'message' => $mensaje));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder('error', 'Método no permitido');
}

$nombre = isset($_POST['user']) ? trim($_POST['user']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
$mensaje = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : '';

if ($nombre === '' || $mensaje === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($mensaje) > 3000) {
    responder('error', 'Datos no válidos');
}
if (cfg('MAIL_ENABLED', '0') !== '1') {
    responder('error', 'El envío de correos está desactivado en esta demostración');
}
// Límite sencillo: un mensaje cada 60 segundos por sesión
if (isset($_SESSION['ultimo_correo']) && time() - $_SESSION['ultimo_correo'] < 60) {
    responder('error', 'Espera un minuto antes de enviar otro mensaje');
}

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = cfg('SMTP_HOST', 'localhost');
    $mail->SMTPAuth = true;
    $mail->Username = cfg('SMTP_USER', '');
    $mail->Password = cfg('SMTP_PASS', '');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = (int) cfg('SMTP_PORT', 587);
    $mail->CharSet = 'UTF-8';

    $mail->setFrom(cfg('MAIL_FROM', 'contacto@reformdidad.es'), 'ReformDidad');
    $mail->addAddress(cfg('MAIL_TO', 'info@reformdidad.es'), 'ReformDidad');
    $mail->addReplyTo($email, $nombre);

    $mail->isHTML(false);
    $mail->Subject = 'Mensaje de contacto de ReformDidad';
    $mail->Body = "Nombre: $nombre\nCorreo electrónico: $email\nTeléfono: $telefono\nMensaje:\n$mensaje";

    $mail->send();
    $_SESSION['ultimo_correo'] = time();
    responder('success', 'Correo enviado correctamente');
} catch (Exception $e) {
    error_log('Error al enviar el correo: ' . $mail->ErrorInfo);
    responder('error', 'Error al enviar el correo');
}
?>