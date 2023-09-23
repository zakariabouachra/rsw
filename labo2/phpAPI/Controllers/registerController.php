<?php
session_start();
require_once '../Models/model.php';

$nodejsServerUrl = 'http://localhost:3000/api/receive';

$model = new Model($nodejsServerUrl);

$dataToSend = array(
    'nom' => $_POST['nom'],
    'email' => $_POST['email'],
    'password' => $_POST['password']
);

$response = $model->sendData(json_encode($dataToSend));

$userData = json_decode($response, true);

if (isset($userData['id'])) {
    $_SESSION['user_id'] = $userData['id'];
    $_SESSION['user_nom'] = $userData['nom'];
    $_SESSION['user_email'] = $userData['email'];

    header("Location: ../index.php");
    exit();
} else {
    // Gérez l'erreur ou la réponse du serveur Node.js
    echo "Erreur lors de l'enregistrement : " . $response;
}
?>
