<?php
require_once __DIR__ . '/includes/bootstrap.php';
if (!isset($_SESSION["user"])) {
    echo json_encode(array("user" => false));
} else if (isset($_SESSION["user"]) && ($_SESSION["rol"] == 3)) {
    $response = array(
        "user" => $_SESSION['user'],
        "rol" => $_SESSION['rol'],
        "id_user" => $_SESSION['id_user']
    );
    echo json_encode($response);
} else if (isset($_SESSION["user"]) && ($_SESSION["rol"] == 2)){
    $response = array(
        "user" => $_SESSION['user'],
        "rol" => $_SESSION['rol'],
        "id_user" => $_SESSION['id_user'],
        "id_supervisor" => $_SESSION['id_supervisor']
    );
    echo json_encode($response);
} else if (isset($_SESSION["user"]) && ($_SESSION["rol"] == 1)) {
    $response = array(
        "user" => $_SESSION['user'],
        "rol" => $_SESSION['rol']
    );
    echo json_encode($response);
}
?>