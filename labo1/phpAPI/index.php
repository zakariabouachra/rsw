<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulaire Produit</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        Formulaire Produit
                    </div>
                    <div class="card-body">
                        <form action="main.php" method="POST">
                            <div class="mb-3">
                                <label for="nom_produit" class="form-label">Nom du Produit :</label>
                                <input type="text" class="form-control" id="nom_produit" name="nom_produit" required>
                            </div>
                            <div class="mb-3">
                                <label for="prix" class="form-label">Prix :</label>
                                <input type="number" class="form-control" id="prix" name="prix" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
</body>
</html>
