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
$typecolor = array(
    "Acier"=>"#e0ebeb",
    "Combat"=>"#b33c00",
    "Dragon"=>"#6600cc",
    "Eau"=>"#0099ff",
    "Électrik"=>"#ffcc00",
    "Fée"=>"#ff66ff",
    "Feu"=>"#ff3300",
    "Glace"=>"#66ffff",
    "Insecte"=>"#33cc33",
    "Normal"=>"#b3b3b3",
    "Plante"=>"#009933",
    "Poison"=>"#800060",
    "Psy"=>"#ff66cc",
    "Roche"=>"#e6e600",
    "Sol"=>"#999900",
    "Spectre"=>"#751aff",
    "Ténèbres"=>"#663300",
    "Vol"=>"#6666ff",
);
$data = json_decode(file_get_contents("http://localhost:3000/pokemons"), true);
echo "<div class='col col-sm-12'>";

foreach($data as $pokemon){
    ?>
       <div class="col-md-4 box-pokemon">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <center><a href="#">
                        <img src="<?php echo $pokemon['img'] ?>" width="60%" height="30%" alt="Image <?php echo $pokemon['name']?>">
                        </a></center>
                </div>
                <div class="panel-body ">
                    <div class="text-center">
                    <p style="color:#808080">
                        No.<?= $pokemon['idnational']?>
                    </p>
                    <p >
                        <a style="color:#333333" href="<?php ?>"><b><?php echo $pokemon['name'];?></b>
                        </a>
                    </p>
                    <p>
                        <?php if(isset($pokemon['type']) && $pokemon['type']!=null){?>
                        <span class="type" style="border-radius: 5px 10px 0 5px;padding:3px;background: <?php echo $typecolor[$pokemon['type']] ?>"><?php echo $pokemon['type'];?></span>
                        <?php }?>
                        <?php if(isset($pokemon['type2']) && $pokemon['type2']!=null){?>
                        <span class="type" style=" border-radius: 5px 10px 0 5px;padding:3px; background: <?php echo $typecolor[$pokemon['type2']] ?>"><?php echo $pokemon['type2'];?></span>
                        <?php }?>
                    </p>
                    </div>
                    
                    <table class="table">
                     
                    <?php
                       // var_dump($pokemon);
                    $evolutions = $pokemon['evolutions'];
                    
                    foreach($evolutions as $evolution){?>
                        <tr>
                        <?php
                        if($evolution['evolutionName'] != null){?>
                        <td style="background:#f2f2f2">
                    <span><?php echo $evolution['evolutionName']  ?>  </span>
                            </td>
                        <?php } 
                        
                     if($evolution['niveauEvolution'] != null){?>
                            <td>
                    <span> <?php echo $evolution['niveauEvolution']  ?>  </span>
                            </td>
                        <?php } ?>
                    </tr>
                    <?php } ?>
                    </table>
                </div>
            </div> 
           
        </div>
      
      
<?php } 
echo '</div>';

?>
</div>
            <script src="../web/js/jquery.min.js"></script>
            <script src="../web/js/bootstrap.js"></script>
            <script src="../web/DataTables/datatables.min.js"></script>
            <script src="../web/js/script.js"></script>

    </body>
</html>