<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h1>Bienvenue</h1>
        <?php
    
        if (isset($_SESSION['user_nom']) && isset($_SESSION['user_email'])) {

            $nomUtilisateur = $_SESSION['user_nom'];
            $emailUtilisateur = $_SESSION['user_email'];
            
            echo "<p>Welcome, $nomUtilisateur</p>";
            echo "<p>Email: $emailUtilisateur</p>";
        } else {
            header("Location: login.php");
            exit();
        }
        ?>

        <a href="Views/logout.php" class="btn btn-danger">Se déconnecter</a>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap/dist/js/bootstrap.min.js"></script>
</body>
</html>
