<?php
session_start();
require_once '../Models/model.php';

$pythonServerUrl = 'http://localhost:5000/login';

$model = new Model($pythonServerUrl);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $dataToSend = array(
        'email' => $_POST['email'],
        'password' => $_POST['password']
    );

    try {
        $response = $model->sendData(json_encode($dataToSend));
        $userData = json_decode($response, true);
        if (isset($userData['id'])) {
            $_SESSION['user_id'] = $userData['id'];
            $_SESSION['user_nom'] = $userData['user_nom'];
            $_SESSION['user_email'] = $userData['user_email'];
            
            header("location: ../index.php");
            exit;
            
        } else {
            $_SESSION['message'] = $userData['message'];
            header("location: ../Views/login.php");
            exit;
        }
    } catch (Exception $e) {
        echo "Erreur lors de la connexion : " . $e->getMessage();
    }
    
}
?>
