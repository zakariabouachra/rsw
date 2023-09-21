<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Résultat</title>
</head>
<body>
<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $nom_produit = $_POST['nom_produit'];
        $prix_total = floatval($_POST['prix']);

        $quantite = rand(1, 10);

        $prix_total = $prix_total * $quantite;

        $prix_taxe = $prix_total + ($prix_total * 0.08);

        $data = array(
            'nom_produit' => $nom_produit,
            'prix_total' => $prix_taxe
        );

        $data_json = json_encode($data);

        $api_url = 'http://localhost:3000/api-Php';

        $options = array(
            'http' => array(
                'header' => "Content-Type: application/json\r\n",
                'method' => 'POST',
                'content' => $data_json
            )
        );

        $context = stream_context_create($options);

        $response = file_get_contents($api_url, false, $context);
        
    }    

    // URL de l'API Python
    $api_url = 'http://localhost:5000/api-Python';

    // Configuration de la requête POST
    $options = array(
        'http' => array(
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => $data_json
        )
    );

    $context = stream_context_create($options);

    // Effectuer la requête POST
    $response_json = file_get_contents($api_url, false, $context);

    // Vérifier si la réponse a été obtenue avec succès
    if ($response_json !== false) {
        // Afficher la réponse JSON du serveur Python
        $response_data = json_decode($response_json);
        // Afficher le nom du produit et le prix avec taxe
        echo "Nom du Produit : " . $response_data->nom_produit . "<br>";
        echo "Prix Taxe : " . $response_data->prix_total . "<br>";

        // Afficher le nom du client
        echo "Nom du Client : " . $response_data->nom_client . "<br>";

        // Masquer tous les chiffres du numéro de carte de crédit sauf les 4 derniers
        $numero_carte_credit = $response_data->numero_carte_credit;
        $masked_numero_carte_credit = "XXXX-XXXX-XXXX-" . substr($numero_carte_credit, -4);
        echo "Numéro de Carte de Crédit : " . $masked_numero_carte_credit;

    } else {
        // Gérer les erreurs, par exemple :
        echo 'Une erreur s\'est produite lors de la requête POST.';
    }

    ?>
</body>
</html>
