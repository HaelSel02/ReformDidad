<?php
include("conexion.php");

$idReforma = (int)(isset($_POST['idReforma']) ? $_POST['idReforma'] : 0);
$idUsuario = (int)$_SESSION['id_user'];

// Solo se puede reseñar una reforma propia
$propia = q($conexion, "SELECT 1 FROM Proyecto_reforma WHERE id_reforma = ? AND usuario_solicitante = ?", 'ii', array($idReforma, $idUsuario));
if (!($propia instanceof mysqli_result) || $propia->num_rows === 0) {
    echo "error";
    exit;
}
$comentario = $_POST['comentarioReseña'];
$valoracion = $_POST['cantidadValoracion'];

$query_insert = "INSERT INTO Reseñas (usuario_reseña, proyecto_reseñado, comentario_reseña, puntuacion) VALUES (?, ?, ?, ?)";
if ($stmt = $conexion->prepare($query_insert)) {
    $stmt->bind_param("iiss", $idUsuario, $idReforma, $comentario, $valoracion);
    
    if ($stmt->execute()) {
        echo "correct";
    } else {
        echo "error";
    }
    
    $stmt->close();
} else {
    echo "error";
}

$conexion->close();
?>
