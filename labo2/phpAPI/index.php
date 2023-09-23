<?php
session_start();

if (isset($_SESSION['user_id'])) {

    $nomUtilisateur = $_SESSION['user_nom'];
    $emailUtilisateur = $_SESSION['user_email'];

    include "Views/welcome.php";

} else {

    header("Location: Views/login.php");
    exit();
}
?>
