var grid = document.getElementById("grid");
var matrix = [];
var path = [];
var estado_index = 0;
var insertar = false;
var gsize = 0;

$(document).ready(function () {
  console.log("ready!");
});

/* 
  Funcion que permite que un elemento pueda ser
  arrastrado al mantenerlo presionado con el mouse
*/
function allowDrop(ev) {
  ev.preventDefault();
}

/*
  Funcion que se ejecuta cuando un elemento deja de ser 
  arrastrado con el mouse y define que accion se gatilla
*/
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.innerHTML);
}

function dragCasilla(ev) {
  ev.dataTransfer.setData("text", ev.target.innerHTML);
  ev.target.innerHTML = "";
  ev.target.style.backgroundColor = "white";
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.innerHTML = data;
  if (data == "B") {
    ev.target.style.color = "#black";
  } else {
    ev.target.style.color = "#fff";
  }
  ev.target.style.backgroundColor = "#000";
}

/* 
  Funcion que se ejecuta previo a generar la grilla de juego.
  Se encarga de verificar que exista un tamano ingresado, ademas
  de que modifica ciertos componentes de CSS para ocultar objetos
  o hacer un resize a la pantalla.
*/
function preGenerateGrid() {
  // Se obtiene el tamano de la grilla ingresado por teclado
  var tamano = $("#grid-size").val();
  if (!tamano) {
    alert("Debe agregar un tamano para la grilla");
  } else {
    var middleContent = document.getElementsByClassName("middle-content")[0];
    if (tamano >= 15) {
      middleContent.style.top = "50%";
    } else {
      middleContent.style.top = "40%";
    }

    generateGrid(tamano); // Se genera la grilla con el tamano indicado
    var grilla = document.getElementById("grid");
    var selectors = document.getElementById("selectors");
    var gridSizeInput = document.getElementById("grid-size");
    var generateGridButton = document.getElementById("button-generate-grid");
    var resetButton = document.getElementById("reset-grid");
    var startButton = document.getElementById("start-game");
    /* Se oculta el boton de generar grilla y el input del tamano
       Ademas se hace un display a la grilla */
    selectors.style.display = "block";
    gridSizeInput.style.display = "none";
    generateGridButton.style.display = "none";
    resetButton.style.display = "block";
    startButton.style.display = "block";
    grid.style.display = "flex";
  }
}

/* 
  Funcion que se ejecuta cuando se clickea el boton
  reiniciar grilla
*/
function resetGrid() {
  location.reload();
}

/* 
  Funcion que genera una grilla de juego de tamano Size
  ingresado previamente por el input tamano de grilla.
*/
function generateGrid(size) {
  gsize = parseInt(size);
  grid.innerHTML = "";
  for (var i = 0; i < size; i++) {
    row = grid.insertRow(i);
    for (var j = 0; j < size; j++) {
      cell = row.insertCell(j);
      var ondrop = document.createAttribute("ondrop");
      var ondragover = document.createAttribute("ondragover");
      var draggable = document.createAttribute("draggable");
      var ondragstart = document.createAttribute("ondragstart");
      draggable.value = "true";
      ondragstart.value = "dragCasilla(event)";
      ondrop.value = "drop(event)";
      ondragover.value = "allowDrop(event)";
      cell.setAttributeNode(ondrop);
      cell.setAttributeNode(ondragover);
      cell.setAttributeNode(draggable);
      cell.setAttributeNode(ondragstart);
    }
  }
}

/* 
  Funcion que se encarga de generar una representacion
  matricial a partir de la tabla de valores cargadas en
  el drag and drop.

  Posteriormente a crear la matriz procede a ejecutar una 
  iteracion de reglas que estan definidas a continuacion.
*/

function startGame() {
  var table = document.getElementById("grid");
  var matrizl = [];
  for (var i = 0; i < gsize + 2; i++) {
    var fila = [];
    for (var j = 0; j < gsize + 2; j++) {
      fila.push("E");
    }
    matrizl.push(fila);
  }
  for (var i = 0, row; (row = table.rows[i]); i++) {
    var fila = [];
    for (var j = 0, col; (col = row.cells[j]); j++) {
      if (!col.innerHTML) {
        col.innerHTML = "E";
        col.style.color = "#fff";
      }
      fila.push(col.innerHTML);
    }
    matrix.push(fila);
  }
  for (var i = 1; i < gsize + 1; i++) {
    var fila = [];
    for (var j = 1; j < gsize + 1; j++) {
      matrizl[i][j] = matrix[i - 1][j - 1];
    }
  }
  matrix = matrizl;
  // Se agrega el estado inicial al Path seguido para la solucion
  path.push(makeCopy(matrix));

  // Aplicar fin de ciclo cuando no avance numero de casillas iluminadas en una iteracion

  var cosi = 0;
  while (cosi < 15 && !ejercicioResuelto()) {
    verificarReglaUno();
    verificarReglaDos();
    verificarReglaTres();
    verificarReglaCuatro();
    verificarReglaCinco();
    verificarReglaSiete();
    verificarReglaOcho();
    cosi++;
  }
  var startButton = document.getElementById("start-game");
  startButton.style.display = "none";
  estado_index = 0;
  dibujarPath(path[estado_index]);
  checkFlechas();
}

/*
  Funcion que se encarga de tomar los valores almacenados
  en la matriz y los convierte a una representacion de 
  objetos HTML que carga en la grilla de juego.
*/

function dibujarTabla() {
  console.log("Dibujando Tabla");
  var table = document.getElementById("grid");
  for (var i = 0; i < matrix.length; i++) {
    var row = matrix[i];
    for (var j = 0; j < row.length; j++) {
      var celda = table.rows[i].cells[j];
      if (["0", "1", "2", "3", "4"].includes(row[j])) {
        celda.style.backgroundColor = "black";
        celda.style.color = "white";
        celda.innerHTML = row[j];
      } else if (row[j] == "I") {
        celda.style.backgroundColor = "yellow";
        celda.innerHTML = "";
      } else if (row[j] == "A") {
        celda.style.backgroundColor = "yellow";
        celda.style.color = "black";
        celda.innerHTML = `<i class="far fa-lightbulb"></i>`;
      } else if (row[j] == "X") {
        celda.style.color = "red";
        celda.innerHTML = "X";
        celda.style.backgroundColor = "white";
      } else if (row[j] == "XI") {
        celda.style.color = "red";
        celda.style.backgroundColor = "yellow";
        celda.innerHTML = "X";
      }
    }
  }
}

/* regla 1: Si el número en un cuadrado negro es igual a la cantidad de espacios 
blancos disponibles adyacentes a este, entonces se inserta una ampolleta en cada uno 
de estos.*/

function verificarReglaUno() {
  for (var i = 1; i < matrix.length - 1; i++) {
    var row = matrix[i];
    for (var j = 1; j < row.length - 1; j++) {
      if (["1", "2", "3", "4"].includes(row[j])) {
        var cantidad = 0;
        var cantidad_ampolletas = 0;
        if (matrix[i + 1][j] == "E" && i + 1 < matrix.length - 1) cantidad++;
        if (matrix[i + 1][j] == "A" && i + 1 < matrix.length - 1)
          cantidad_ampolletas++;
        if (matrix[i - 1][j] == "E" && i - 1 >= 1) cantidad++;
        if (matrix[i - 1][j] == "A" && i - 1 >= 1) cantidad_ampolletas++;
        if (matrix[i][j + 1] == "E" && j + 1 < matrix.length - 1) cantidad++;
        if (matrix[i][j + 1] == "A" && j + 1 < matrix.length - 1)
          cantidad_ampolletas++;
        if (matrix[i][j - 1] == "E" && j - 1 >= 1) cantidad++;
        if (matrix[i][j - 1] == "A" && j - 1 >= 1) cantidad_ampolletas++;
        console.log("Posicion " + i + " " + j + " cantidad: " + cantidad);
        if (parseInt(matrix[i][j]) == cantidad + cantidad_ampolletas) {
          if (
            !["X", "XI", "I", "B", "0", "1", "2", "3", "4"].includes(
              matrix[i + 1][j]
            )
          ) {
            insertarBombilla(i + 1, j);
            if (
              !["X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i + 1][j - 1]
              )
            )
              escribirX(i + 1, j - 1);
            if (
              !["X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i + 1][j + 1]
              )
            )
              escribirX(i + 1, j + 1);
          }

          if (
            !["X", "XI", "I", "B", "0", "1", "2", "3", "4"].includes(
              matrix[i - 1][j]
            )
          ) {
            insertarBombilla(i - 1, j);
            if (
              !["X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i - 1][j - 1]
              )
            )
              escribirX(i - 1, j - 1);
            if (
              !["X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i - 1][j + 1]
              )
            )
              escribirX(i - 1, j + 1);
          }

          if (
            !["X", "XI", "I", "B", "0", "1", "2", "3", "4"].includes(
              matrix[i][j + 1]
            )
          ) {
            insertarBombilla(i, j + 1);
            if (
              !["X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i + 1][j + 1]
              )
            )
              escribirX(i + 1, j + 1);
            if (
              !["X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i - 1][j + 1]
              )
            )
              escribirX(i - 1, j + 1);
          }

          if (
            !["X", "XI", "I", "B", "0", "1", "2", "3", "4"].includes(
              matrix[i][j - 1]
            )
          ) {
            insertarBombilla(i, j - 1);
            if (
              !["X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i + 1][j - 1]
              )
            )
              escribirX(i + 1, j - 1);
            if (
              !["X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i - 1][j - 1]
              )
            )
              escribirX(i - 1, j - 1);
          }
        }
      }
    }
  }
  //dibujarTabla();
}

/* 
regla 2: Si la cantidad de ampolletas adyacentes a un bloque es igual al número que tiene 
dentro de esta, entonces el resto de espacios se llenan con una x, bloqueando la 
posibilidad de colocar una ampolleta dentro de estos.
*/

function verificarReglaDos() {
  for (var i = 1; i < matrix.length - 1; i++) {
    var row = matrix[i];
    for (var j = 1; j < row.length - 1; j++) {
      if (["0", "1", "2", "3", "4"].includes(row[j])) {
        var cantidad = 0;
        if (matrix[i + 1][j] == "A") cantidad++;
        if (matrix[i - 1][j] == "A") cantidad++;
        if (matrix[i][j + 1] == "A") cantidad++;
        if (matrix[i][j - 1] == "A") cantidad++;
      }
      if (parseInt(matrix[i][j]) == cantidad) {
        if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j]))
          escribirX(i + 1, j);

        if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j]))
          escribirX(i - 1, j);

        if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1]))
          escribirX(i, j + 1);

        if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1]))
          escribirX(i, j - 1);
      }
    }
  }
}

/* 
regla 3: Si una pared contiene un 3, entonces se llenan con una x los 4 
espacios diagonales a esta.
*/
function verificarReglaTres() {
  for (var i = 1; i < matrix.length - 1; i++) {
    for (var j = 1; j < matrix.length - 1; j++) {
      if (matrix[i][j] == "3") {
        if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j + 1]))
          escribirX(i + 1, j + 1);

        if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j - 1]))
          escribirX(i + 1, j - 1);

        if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j + 1]))
          escribirX(i - 1, j + 1);

        if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j - 1]))
          escribirX(i - 1, j - 1);
      }
      if (matrix[i][j] == "2") {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j])) {
          if (
            !["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j - 1])
          )
            escribirX(i - 1, j - 1);
          if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j + 1]))
            escribirX(i - 1, j + 1);
        }
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j])) {
          if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j - 1]))
            escribirX(i + 1, j - 1);
          if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j + 1]))
            escribirX(i + 1, j + 1);
        }
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1])) {
          if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j + 1]))
            escribirX(i + 1, j + 1);
          if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j + 1]))
            escribirX(i - 1, j + 1);
        }
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1])) {
          if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j - 1]))
            escribirX(i + 1, j - 1);
          if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j - 1]))
            escribirX(i - 1, j - 1);
        }
      }
    }
  }
}

/* 

regla 4: Si un espacio marcado con una x no está iluminado y sólo tiene disponible 
un espacio (horizontal o vertical) para colocar una ampolleta, 
en ese espacio se debe colocar una. Cabe destacar que la posición de este 
espacio puede ser en cualquier distancia, pero no debe estar bloqueado por una pared.
*/

function verificarReglaCuatro() {
  for (var i = 1; i < matrix.length - 1; i++) {
    var row = matrix[i];
    for (var j = 1; j < row.length - 1; j++) {
      if (matrix[i][j] == "X") {
        var contador = 0;
        for (var a = i - 1; a >= 1; a--) {
          if (esBloque(matrix[a][j])) break;
          if (matrix[a][j] == "E") contador++;
        }
        for (var a = i + 1; a < matrix.length - 1; a++) {
          if (esBloque(matrix[a][j])) break;
          if (matrix[a][j] == "E") contador++;
        }

        for (var a = j - 1; a >= 1; a--) {
          if (esBloque(matrix[i][a])) break;
          if (matrix[i][a] == "E") contador++;
        }
        for (var a = j + 1; a < matrix.length - 1; a++) {
          if (esBloque(matrix[i][a])) break;
          if (matrix[i][a] == "E") contador++;
        }
        console.log(+i + " " + j + "contador : " + contador);
        if (contador == 1) {
          for (var a = i - 1; a >= 1; a--) {
            if (esBloque(matrix[a][j])) break;
            if (matrix[a][j] == "E") insertarBombilla(a, j);
          }
          for (var a = i + 1; a < matrix.length - 1; a++) {
            if (esBloque(matrix[a][j])) break;
            if (matrix[a][j] == "E") insertarBombilla(a, j);
          }

          for (var a = j - 1; a >= 1; a--) {
            if (esBloque(matrix[i][a])) break;
            if (matrix[i][a] == "E") insertarBombilla(i, a);
          }
          for (var a = j + 1; a < matrix.length - 1; a++) {
            if (esBloque(matrix[i][a])) break;
            if (matrix[i][a] == "E") insertarBombilla(i, a);
          }
        }
      }
    }
  }
  //dibujarTabla();
}

/* 
  regla 5: Si un espacio está vacío, no iluminado y todas los demás espacios en su fila 
y columna están iluminados, son una pared o están bloqueados, entonces se coloca 
una ampolleta en este espacio.
*/
function verificarReglaCinco() {
  for (var i = 1; i < matrix.length - 1; i++) {
    var row = matrix[i];
    for (var j = 1; j < row.length - 1; j++) {
      if (matrix[i][j] == "E") {
        var contador = 0;
        for (var a = i - 1; a >= 1; a--) {
          if (esBloque(matrix[a][j])) break;
          if (matrix[a][j] == "E") contador++;
        }
        for (var a = i + 1; a < matrix.length - 1; a++) {
          if (esBloque(matrix[a][j])) break;
          if (matrix[a][j] == "E") contador++;
        }

        for (var a = j - 1; a >= 1; a--) {
          if (esBloque(matrix[i][a])) break;
          if (matrix[i][a] == "E") contador++;
        }
        for (var a = j + 1; a < matrix.length - 1; a++) {
          if (esBloque(matrix[i][a])) break;
          if (matrix[i][a] == "E") contador++;
        }
        if (contador == 0 && !esBloque(matrix[i][j])) {
          insertarBombilla(i, j);
        }
      }
    }
  }
  //dibujarTabla();
}

function verificarReglaSiete() {
  for (var i = 1; i < matrix.length - 1; i++) {
    for (var j = 1; j < matrix.length - 1; j++) {
      if (matrix[i][j] == "2") {
        if (matrix[i - 1][j - 1] == "1") {
          if (
            ["B", "0", "1", "2", "3", "4", "I", "XI", "X", "A"].includes(
              matrix[i + 1][j]
            )
          ) {
            if (
              !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i][j + 1]
              )
            ) {
              insertarBombilla(i, j + 1);
            }
          }
          if (
            ["B", "0", "1", "2", "3", "4", "I", "XI", "X", "A"].includes(
              matrix[i][j + 1]
            )
          ) {
            if (
              !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i + 1][j]
              )
            ) {
              insertarBombilla(i + 1, j);
            }
          }
        }
        if (matrix[i - 1][j + 1] == "1") {
          if (
            ["B", "0", "1", "2", "3", "4", "I", "XI", "X", "A"].includes(
              matrix[i + 1][j]
            )
          ) {
            if (
              !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i][j - 1]
              )
            ) {
              insertarBombilla(i, j - 1);
            }
          }
          if (
            ["B", "0", "1", "2", "3", "4", "I", "XI", "X", "A"].includes(
              matrix[i][j - 1]
            )
          ) {
            if (
              !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i + 1][j]
              )
            ) {
              insertarBombilla(i + 1, j);
            }
          }
        }
        if (matrix[i + 1][j - 1] == "1") {
          if (
            ["B", "0", "1", "2", "3", "4", "I", "XI", "X", "A"].includes(
              matrix[i - 1][j]
            )
          ) {
            if (
              !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i][j + 1]
              )
            ) {
              insertarBombilla(i, j + 1);
            }
          }
          if (
            ["B", "0", "1", "2", "3", "4", "I", "XI", "X", "A"].includes(
              matrix[i][j + 1]
            )
          ) {
            if (
              !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i - 1][j]
              )
            ) {
              insertarBombilla(i - 1, j);
            }
          }
        }
        if (matrix[i + 1][j + 1] == "1") {
          if (
            ["B", "0", "1", "2", "3", "4", "I", "XI", "X", "A"].includes(
              matrix[i - 1][j]
            )
          ) {
            if (
              !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i][j - 1]
              )
            ) {
              insertarBombilla(i, j - 1);
            }
          }
          if (
            ["B", "0", "1", "2", "3", "4", "I", "XI", "X", "A"].includes(
              matrix[i][j - 1]
            )
          ) {
            if (
              !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
                matrix[i - 1][j]
              )
            ) {
              insertarBombilla(i - 1, j);
            }
          }
        }
      }
    }
  }
}

function verificarReglaOcho() {
  for (var i = 1; i < matrix.length - 1; i++) {
    for (var j = 1; j < matrix.length - 1; j++) {
      if (matrix[i][j] == "3") {
        if (matrix[i - 1][j - 1] == "1") {
          if (
            !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
              matrix[i][j + 1]
            )
          ) {
            insertarBombilla(i, j + 1);
          }
          if (
            !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
              matrix[i + 1][j]
            )
          ) {
            insertarBombilla(i + 1, j);
          }
        }
        if (matrix[i - 1][j + 1] == "1") {
          if (
            !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
              matrix[i][j - 1]
            )
          ) {
            insertarBombilla(i, j - 1);
          }
          if (
            !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
              matrix[i + 1][j]
            )
          ) {
            insertarBombilla(i + 1, j);
          }
        }
        if (matrix[i + 1][j - 1] == "1") {
          if (
            !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
              matrix[i][j + 1]
            )
          ) {
            insertarBombilla(i, j + 1);
          }
          if (
            !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
              matrix[i - 1][j]
            )
          ) {
            insertarBombilla(i - 1, j);
          }
        }
        if (matrix[i + 1][j + 1] == "1") {
          if (
            !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
              matrix[i][j - 1]
            )
          ) {
            insertarBombilla(i, j - 1);
          }
          if (
            !["A", "I", "X", "XI", "B", "0", "1", "2", "3", "4"].includes(
              matrix[i - 1][j]
            )
          ) {
            insertarBombilla(i - 1, j);
          }
        }
      }
    }
  }
}

function insertarBombilla(i, j) {
  if (i < 1 || i >= matrix.length - 1 || j < 1 || j >= matrix.length - 1)
    return;
  insertar = false;
  total = 0;
  if (i == 1) {
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j])) {
      for (var a = i + 1; a < matrix.length - 1; a++) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[a][j])) break;
        total += escribirBombilla(a, j);
      }
    }
  } else if (i > 1 && i < matrix.length - 2) {
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j])) {
      for (var a = i + 1; a < matrix.length; a++) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[a][j])) break;
        total += escribirBombilla(a, j);
      }
    }
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j])) {
      for (var a = i - 1; a >= 0; a--) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[a][j])) break;
        total += escribirBombilla(a, j);
      }
    }
  } else {
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j])) {
      for (var a = i - 1; a >= 0; a--) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[a][j])) break;
        total += escribirBombilla(a, j);
      }
    }
  }
  if (j == 1) {
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1])) {
      for (var a = j + 1; a < matrix.length; a++) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][a])) break;
        total += escribirBombilla(i, a);
      }
    }
  } else if (j > 1 && j < matrix.length - -2) {
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1])) {
      for (var a = j + 1; a < matrix.length; a++) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][a])) break;
        total += escribirBombilla(i, a);
      }
    }
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1])) {
      for (var a = j - 1; a >= 0; a--) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][a])) break;
        total += escribirBombilla(i, a);
      }
    }
  } else {
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1])) {
      for (var a = j - 1; a >= 0; a--) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][a])) break;
        total += escribirBombilla(i, a);
      }
    }
  }
  if (total > 0) {
    matrix[i][j] = "A";
    path.push(makeCopy(matrix));
  } else if (matrix[i][j] != "A") {
    matrix[i][j] = "A";
    path.push(makeCopy(matrix));
  }

  //dibujarTabla();
}

/* 
  Funcion auxiliar uqe permite escribir una I para iluminar
  un cuadrado a partir de la luz recibida por una bombilla.
  Toma en consideracion que si el espacio etar marcado con una X
  entonces debe escribir una XI.
*/
function escribirBombilla(i, j) {
  if (matrix[i][j] == "I" || matrix[i][j] == "XI") return 0;
  if (matrix[i][j] == "X" || matrix[i][j] == "XI") {
    matrix[i][j] = "XI";
  } else {
    matrix[i][j] = "I";
  }
  return 1;
}

/* 
  Funcion auxiliar que permite escribir una X para marcar una
  casilla. Toma en consideracion que si el espacio ya se encuentra
  ilumunado entonces debe escribir un XI.
*/

function escribirX(i, j) {
  if (i < 1 || i >= matrix.length - 1 || j < 1 || j >= matrix.length - 1)
    return;
  var escribe_x = false;
  if (matrix[i][j] != "XI" && matrix[i][j] != "X") {
    escribe_x = true;
  }
  if (matrix[i][j] == "XI" || matrix[i][j] == "X") return;
  if (matrix[i][j] == "I" || matrix[i][j] == "XI") {
    matrix[i][j] = "XI";
  } else {
    matrix[i][j] = "X";
  }
  if (escribe_x) path.push(makeCopy(matrix));
}

/* 
  Funcion que retorna true si un elemento
  es un bloque. En caso contrario retorna False
*/
function esBloque(elemento) {
  if (
    elemento == "B" ||
    elemento == "0" ||
    elemento == "1" ||
    elemento == "2" ||
    elemento == "3" ||
    elemento == "4"
  )
    return true;
  return false;
}

function estaBloqueado(elemento) {
  if (elemento == "X" || elemento == "XI") {
    return true;
  }
  return false;
}

/*
  Funcion que permite determinar si el ejercicio ha sido resuelto o no.
  Lo logra al contar cuantas casillas que no sean bloque no se encuentran
  iluminadas. Si la cantidad es 0, entonces el ejericicio ha sido resuelto.
*/
function ejercicioResuelto() {
  var cont = 0;
  for (var i = 0; i < matrix.length; i++) {
    var row = matrix[i];
    for (var j = 0; j < row.length; j++) {
      if (!bloqueIluminado(matrix[i][j]) && !esBloque(matrix[i][j])) cont++;
    }
  }
  if (cont == 0) {
    console.log("El Ejercicio ha sido resuelto!");
    return true;
  }
  return false;
}

function bloqueIluminado(elemento) {
  if (elemento == "XI" || elemento == "I" || elemento == "A") return true;
  return false;
}

function makeCopy(original) {
  var newMatrix = [];

  for (var i = 0; i < original.length; i++) {
    var row = [];
    for (var j = 0; j < original.length; j++) {
      row.push(matrix[i][j]);
    }
    newMatrix.push(row);
  }
  return newMatrix;
}

function dibujarPath(estado) {
  var table = document.getElementById("grid");
  for (var i = 1; i < estado.length - 1; i++) {
    var row = estado[i];
    for (var j = 1; j < row.length - 1; j++) {
      var celda = table.rows[i - 1].cells[j - 1];
      if (["0", "1", "2", "3", "4"].includes(row[j])) {
        celda.style.backgroundColor = "black";
        celda.style.color = "white";
        celda.innerHTML = row[j];
      } else if (row[j] == "B") {
        celda.style.backgroundColor = "black";
        celda.style.color = "white";
        celda.innerHTML = "";
      } else {
        celda.style.backgroundColor = "white";
        celda.style.color = "black";
        celda.innerHTML = "";
      }
    }
  }
  for (var i = 1; i < estado.length - 1; i++) {
    var row = estado[i];
    for (var j = 1; j < row.length - 1; j++) {
      var celda = table.rows[i - 1].cells[j - 1];
      if (["0", "1", "2", "3", "4"].includes(row[j])) {
        celda.style.backgroundColor = "black";
        celda.style.color = "white";
        celda.innerHTML = row[j];
      } else if (row[j] == "I") {
        celda.style.backgroundColor = "yellow";
        celda.innerHTML = "";
      } else if (row[j] == "A") {
        celda.style.backgroundColor = "yellow";
        celda.style.color = "black";
        celda.innerHTML = `<i class="far fa-lightbulb"></i>`;
      } else if (row[j] == "X") {
        celda.style.color = "red";
        celda.innerHTML = "X";
        celda.style.backgroundColor = "white";
      } else if (row[j] == "XI") {
        celda.style.color = "red";
        celda.style.backgroundColor = "yellow";
        celda.innerHTML = "X";
      }
    }
  }
}

function nextState() {
  estado_index++;
  dibujarPath(path[estado_index]);
  checkFlechas();
}

function previousState() {
  estado_index--;
  if (estado_index < 0) estado_index = 0;
  dibujarPath(path[estado_index]);
  checkFlechas();
}

function checkFlechas() {
  var leftArrow = document.getElementById("left-arrow");
  var rightArrow = document.getElementById("right-arrow");
  leftArrow.style.display = "flex";
  rightArrow.style.display = "flex";
  if (estado_index == 0) leftArrow.style.display = "none";
  else leftArrow.style.display = "flex";

  if (estado_index == path.length - 1) rightArrow.style.display = "none";
  else rightArrow.style.display = "flex";
}
