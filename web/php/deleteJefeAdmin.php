<?php
include("conexion.php");

$idJefe = (int)($_GET['idJefe'] ?? 0);

$query_verificar = "SELECT COUNT(*) as reformas FROM Proyecto_reforma WHERE jefe_seleccionado = '$idJefe'";
$resultado_verificacion = $conexion->query($query_verificar);

if ($resultado_verificacion) {
    $row = $resultado_verificacion->fetch_assoc();
    if ($row['reformas'] > 0) {
        $query_verificar_en_curso = "SELECT COUNT(*) as reformas_en_curso FROM Proyecto_reforma WHERE jefe_seleccionado = '$idJefe' AND reforma_aprobada = 1 AND finalizado = 0";
        $resultado_verificacion_en_curso = $conexion->query($query_verificar_en_curso);

        if ($resultado_verificacion_en_curso) {
            $row_en_curso = $resultado_verificacion_en_curso->fetch_assoc();
            if ($row_en_curso['reformas_en_curso'] > 0) {
                echo "error_eliminar";
            } else {
                // Si no hay reformas en curso, actualizamos el campo del jefe
                $query_actualizar = "UPDATE Jefes SET jefe_activo = '0' WHERE id_jefe = '$idJefe'";
                if ($conexion->query($query_actualizar) === TRUE) {
                    // Actualizar el campo supervisor_empleado a NULL para los empleados que tienen a este jefe
                    $query_actualizar_empleados = "UPDATE Empleados SET supervisor_empleado = null WHERE supervisor_empleado = '$idJefe'";
                    if ($conexion->query($query_actualizar_empleados) === TRUE) {
                        // Actualizar el campo jefe_seleccionado a NULL en Proyecto_reforma para reformas no finalizadas y no aprobadas
                        $query_actualizar_proyectos = "UPDATE Proyecto_reforma SET jefe_seleccionado = null WHERE jefe_seleccionado = '$idJefe' AND reforma_aprobada IS NULL AND finalizado = 0";
                        if ($conexion->query($query_actualizar_proyectos) === TRUE) {
                            echo "inactivo";
                        } else {
                            echo "error_actualizar_proyectos"; // . $conexion->error
                        }
                    } else {
                        echo "error_actualizar_empleados"; // . $conexion->error
                    }
                } else {
                    echo "error"; // . $conexion->error
                }
            }
        } else {
            echo "error"; // . $conexion->error
        }
    } else {
        $query_actualizar_empleados = "UPDATE Empleados SET supervisor_empleado = null WHERE supervisor_empleado = '$idJefe'";
        if ($conexion->query($query_actualizar_empleados) === TRUE) {
            $query_eliminar_jefe = "DELETE FROM Jefes WHERE id_jefe = '$idJefe'";
            if ($conexion->query($query_eliminar_jefe) === TRUE) {
                echo "eliminado";
            } else {
                echo "error"; // . $conexion->error
            }
        } else {
            echo "error"; // . $conexion->error
        }
    }
} else {
    echo "error"; // . $conexion->error
}

$conexion->close();
?>
