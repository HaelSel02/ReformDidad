<?php
include("conexion.php");

$idUsuario = (int)(isset($_GET['id_user']) ? $_GET['id_user'] : 0);
$prePass = isset($_POST['prepass']) ? $_POST['prepass'] : '';

$r = q($conexion, "SELECT password FROM Usuarios WHERE id_usuario = ?", 'i', array($idUsuario));
$row = ($r instanceof mysqli_result) ? $r->fetch_assoc() : null;

echo ($row && password_ok($prePass, $row['password'])) ? "true" : "false";

$conexion->close();
?>