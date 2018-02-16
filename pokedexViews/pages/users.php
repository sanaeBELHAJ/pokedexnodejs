<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>Pokedex</title>
        <link rel="stylesheet" href="../web/css/bootstrap.css">
        <link rel="stylesheet" href="../web/DataTables/datatables.min.css">
        <link rel="stylesheet" href="../web/css/style.css">
    </head>
<body>
  <div class="container">
 <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar4">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="../">
                    <img src="https://static.planetminecraft.com/files/resource_media/screenshot/1241/Pokeball_3838458.jpg" alt="logo" style="width:10%">
        </a>
      </div>
      <div id="navbar4" class="navbar-collapse collapse">
        <ul class="nav navbar-nav">
          <li class="active"><a href="pokemons.php">Pokémons</a></li>
          <li> <a class="" href="users.php">
                    Liste de tous les utilisateurs
                </a>
          </li>
         
        </ul>
      </div>
      <!--/.nav-collapse -->
    </div>
    <!--/.container-fluid -->
  </nav>
    
<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$data = json_decode(file_get_contents("http://localhost:3000/users"), true);
echo "<table class='table'><thead>"
. "<tr>"
        . "<th>Nom</th>"
        . "<th>mail</th></thead><tbody>";

foreach($data as $user){
    echo '<tr>';
        echo "<td>";
        echo $user['fullName'];
        echo "</td>";
        echo "<td>";
        echo $user['email'];
        echo "</td>";
    echo '</tr>';
}
echo '</tbody></tabel>';

?>
</div>
            <script src="../web/js/jquery.min.js"></script>
            <script src="../web/js/bootstrap.js"></script>
            <script src="../web/DataTables/datatables.min.js"></script>
            <script src="../web/js/script.js"></script>

    </body>
</html>