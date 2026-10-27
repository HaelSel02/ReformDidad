<?php
include("conexion.php");

$idReforma = (int)($_GET['id_reforma'] ?? 0);

$usuarioForm=$_POST['usuarioSoli'];
$estadoForm=$_POST['estadoSoli'];
$zonaForm=$_POST['selecZonaReforma'];
$tipoForm=$_POST['selecTipoReforma'];
$metrosForm=$_POST['selecMetrosReforma'];
$jefeForm=$_POST['selecJefeReforma'];
$fechaInicioForm=$_POST['fechaInicioReforma'];
$fechaFinForm=$_POST['fechaFinalizacionReforma'];
$precioForm=$_POST['precioReforma'];
$descForm=$_POST['descReforma'];
$finSoliForm=$_POST['finalizacionSolicitud'];
$checkboxImgAntes=$_POST['checkboxImgAntes'];
$checkboxImgDespues=$_POST['checkboxImgDespues'];
$nombreImgAntes = (isset($_POST['nombreImgAntes']) && preg_match('#^img_reformas/reforma_antes_[0-9]+\.(jpg|jpeg|png)$#i', $_POST['nombreImgAntes'])) ? $_POST['nombreImgAntes'] : '';
$nombreImgDespues = (isset($_POST['nombreImgDespues']) && preg_match('#^img_reformas/reforma_despues_[0-9]+\.(jpg|jpeg|png)$#i', $_POST['nombreImgDespues'])) ? $_POST['nombreImgDespues'] : '';
$estadoFormFinal="$estadoForm";
$jefeFormFinal="$jefeForm";
$fechaInicioFormFinal="$fechaInicioForm";
$fechaFinFormFinal="$fechaFinForm";
$descFormFinal="$descForm";

if ($_FILES['fotoAntesReforma']['size'] > 0) {
    $extensionesPermitidas = array('jpg', 'jpeg', 'png');
    $extensionAntes = pathinfo($_FILES['fotoAntesReforma']['name'], PATHINFO_EXTENSION);
if (!in_array(strtolower($extensionAntes), $extensionesPermitidas) || @getimagesize($_FILES['fotoAntesReforma']['tmp_name']) === false) {
    echo "Solo se permiten archivos JPG, JPEG o PNG.";
    exit;
} else {
    $fotoAntesForm = $_FILES['fotoAntesReforma']['name']; // Nombre del archivo
    $tmpFotoAntesForm = $_FILES['fotoAntesReforma']['tmp_name']; // Archivo temporal
    $nuevoNombreAntes = "reforma_antes_" . $idReforma . '.' . strtolower($extensionAntes);
    $imgAntesBBDD = 'img_reformas/'.$nuevoNombreAntes;
    $imgAntesBBDDFinal = "$imgAntesBBDD";
    $rutaFotoAntesExistente = '../img_reformas/reforma_antes_' . $idReforma . '.*';
    $archivos = glob($rutaFotoAntesExistente);
    foreach ($archivos as $archivo) {
        if (is_file($archivo)) {
            unlink($archivo);
        }
    }
    move_uploaded_file($tmpFotoAntesForm, '../'.$imgAntesBBDD);
}
} else {
    if (empty($nombreImgAntes)) {
        $imgAntesBBDDFinal = null;
    } else {
        $imgAntesBBDDFinal = "$nombreImgAntes";
    }
    
    if ($checkboxImgAntes === 'on') {
        $imgAntesBBDDFinal = null; // Si no se ha subido ninguna imagen, establecer el valor en NULL
        $archivoExistente = "reforma_antes_" . $idReforma . ".*"; // Patrón de búsqueda específico
        $archivos = glob('../img_reformas/' . $archivoExistente);
    
        foreach ($archivos as $archivo) {
            if (is_file($archivo)) {
                unlink($archivo);
            }
        }
    }
}



if ($_FILES['fotoDespuesReforma']['size'] > 0) {
    $extensionesPermitidas = array('jpg', 'jpeg', 'png');
    $extensionDespues = pathinfo($_FILES['fotoDespuesReforma']['name'], PATHINFO_EXTENSION);

if (!in_array(strtolower($extensionDespues), $extensionesPermitidas) || @getimagesize($_FILES['fotoDespuesReforma']['tmp_name']) === false) {
    echo "Solo se permiten archivos JPG, JPEG o PNG.";
    exit;
} else {
    $fotoDespuesForm = $_FILES['fotoDespuesReforma']['name']; // Nombre del archivo
    $tmpFotoDespuesForm = $_FILES['fotoDespuesReforma']['tmp_name']; // Archivo temporal
    $nuevoNombreDespues = "reforma_despues_" . $idReforma . '.' . strtolower($extensionDespues);
    $imgDespuesBBDD = 'img_reformas/'.$nuevoNombreDespues;
    $imgDespuesBBDDFinal = "$imgDespuesBBDD";
    $rutaFotoDespuesExistente = '../img_reformas/reforma_despues_' . $idReforma . '.*';
    $archivos = glob($rutaFotoDespuesExistente);
    
    foreach ($archivos as $archivo) {
        if (is_file($archivo)) {
            unlink($archivo);
        }
    }
    move_uploaded_file($tmpFotoDespuesForm, '../'.$imgDespuesBBDD);

}
} else {
    if (empty($nombreImgDespues)) {
        $imgDespuesBBDDFinal = null;
    } else {
        $imgDespuesBBDDFinal = "$nombreImgDespues";
    }

    if ($checkboxImgDespues === 'on') {
        $imgDespuesBBDDFinal = null; // Si no se ha subido ninguna imagen, establecer el valor en NULL
        $archivoExistente = "reforma_despues_" . $idReforma . ".*"; // Patrón de búsqueda específico
        $archivos = glob('../img_reformas/' . $archivoExistente);
    
        foreach ($archivos as $archivo) {
            if (is_file($archivo)) {
                unlink($archivo);
            }
        }
    }
}

if ($estadoForm == 2) {
    $estadoFormFinal = null;
}

if (empty($descForm)) {
    $descFormFinal = null;
}

if (empty($jefeForm)) {
    $jefeFormFinal = null;
}
if (empty($fechaInicioForm)) {
    $fechaInicioFormFinal = null;
}
if (empty($fechaFinForm)) {
    $fechaFinFormFinal = null;
}

$query = "UPDATE Proyecto_reforma SET usuario_solicitante = ?, reforma_aprobada = ?, zona_reforma = ?, tipo_reforma = ?, metros_aprox_reforma = ?, precio_aprox = ?, jefe_seleccionado = ?, descripcion_reforma = ?, fecha_inicio = ?, fecha_finalizacion = ?, finalizado = ?, foto_antes = ?, foto_despues = ? WHERE id_reforma = ?";
$stmt_update = $conexion->prepare($query);
$stmt_update->bind_param(
    "sissssssssissi",
    $usuarioForm,
    $estadoFormFinal,
    $zonaForm,
    $tipoForm,
    $metrosForm,
    $precioForm,
    $jefeFormFinal,
    $descFormFinal,
    $fechaInicioFormFinal,
    $fechaFinFormFinal,
    $finSoliForm,
    $imgAntesBBDDFinal,
    $imgDespuesBBDDFinal,
    $idReforma
);

if ($stmt_update->execute()) {
    echo "correct";
} else {
    echo "Error: " . $stmt_update->error;
}

$conexion->close();
?>