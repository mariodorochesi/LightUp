var grid = document.getElementById("grid");
var matrix = [];

$(document).ready(function() {
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
  /*
  var grilla = document.getElementById("grid");
  var selectors = document.getElementById("selectors");
  var gridSizeInput = document.getElementById("grid-size");
  var generateGridButton = document.getElementById("button-generate-grid");
  var resetButton = document.getElementById("reset-grid");
  var startButton = document.getElementById("start-game");
  selectors.style.display = "none";
  gridSizeInput.style.display = "block";
  generateGridButton.style.display = "block";
  grilla.style.display = "none";
  resetButton.style.display = "none";
  startButton.style.display = "none"; */
}

function generateGrid(size) {
  grid.innerHTML = "";
  for (var i = 0; i < size; i++) {
    row = grid.insertRow(i);
    for (var j = 0; j < size; j++) {
      cell = row.insertCell(j);
      var ondrop = document.createAttribute("ondrop");
      var ondragover = document.createAttribute("ondragover");
      ondrop.value = "drop(event)";
      ondragover.value = "allowDrop(event)";
      cell.setAttributeNode(ondrop);
      cell.setAttributeNode(ondragover);
    }
  }
}

function startGame() {
  var table = document.getElementById("grid");
  for (var i = 0, row; (row = table.rows[i]); i++) {
    var fila = [];
    for (var j = 0, col; (col = row.cells[j]); j++) {
      if (!col.innerHTML) {
        col.innerHTML = "E";
        col.style.color = "#fff";
      }
      fila.push(col.innerHTML);
      //console.log(col.innerHTML);
    }
    matrix.push(fila);
  }
  var iter = 0;
  while (iter < 2) {
    verificarReglaUno();
    verificarReglaDos();
    verificarReglaCuatro();
    iter++;
  }
}

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
  console.log("Verificando Regla 1");

  for (var i = 0; i < matrix.length; i++) {
    var row = matrix[i];
    for (var j = 0; j < row.length; j++) {
      if (["1", "2", "3", "4"].includes(row[j])) {
        var cantidad = 0;
        try {
          if (matrix[i + 1][j] == "E") cantidad++;
        } catch (error) {}
        try {
          if (matrix[i - 1][j] == "E") cantidad++;
        } catch (error) {}
        try {
          if (matrix[i][j + 1] == "E") cantidad++;
        } catch (error) {}
        try {
          if (matrix[i][j - 1] == "E") cantidad++;
        } catch (error) {}

        if (parseInt(matrix[i][j]) == cantidad) {
          console.log(i + " " + j);
          if (i == 0) {
            if (!["I", "B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j]))
              insertarBombilla(i + 1, j);
          } else if (i > 0 && i < matrix.length - 1) {
            if (!["I", "B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j]))
              insertarBombilla(i + 1, j);

            if (!["I", "B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j]))
              insertarBombilla(i - 1, j);
          } else {
            if (!["I", "B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j]))
              insertarBombilla(i - 1, j);
          }
          if (j == 0) {
            if (!["I", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1]))
              insertarBombilla(i, j + 1);
          } else if (j > 0 && j < matrix.length - 1) {
            if (!["I", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1]))
              insertarBombilla(i, j + 1);

            if (
              !["I", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1])
            ) {
              insertarBombilla(i, j - 1);
            }
          } else {
            if (!["I", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1]))
              insertarBombilla(i, j - 1);
          }
        }
      }
    }
  }
  dibujarTabla();
}

function verificarReglaDos() {
  console.log("Verificando Regla Dos");
  for (var i = 0; i < matrix.length; i++) {
    var row = matrix[i];
    for (var j = 0; j < row.length; j++) {
      if (["0", "1", "2", "3", "4"].includes(row[j])) {
        var cantidad = 0;
        if (i > 0 && i < matrix.length - 1) {
          if (j > 0 && j < matrix.length - 1) {
            if (matrix[i + 1][j] == "A") cantidad++;
            if (matrix[i - 1][j] == "A") cantidad++;
            if (matrix[i][j + 1] == "A") cantidad++;
            if (matrix[i][j - 1] == "A") cantidad++;
          } else if (j == 0) {
            if (matrix[i + 1][j] == "A") cantidad++;
            if (matrix[i - 1][j] == "A") cantidad++;
            if (matrix[i][j + 1] == "A") cantidad++;
          } else {
            if (matrix[i + 1][j] == "A") cantidad++;
            if (matrix[i - 1][j] == "A") cantidad++;
            if (matrix[i][j - 1] == "A") cantidad++;
          }
        } else if (i == 0) {
          if (j > 0 && j < matrix.length - 1) {
            if (matrix[i + 1][j] == "A") cantidad++;
            if (matrix[i][j + 1] == "A") cantidad++;
            if (matrix[i][j - 1] == "A") cantidad++;
          } else if (j == 0) {
            if (matrix[i + 1][j] == "A") cantidad++;
            if (matrix[i][j + 1] == "A") cantidad++;
          } else {
            if (matrix[i + 1][j] == "A") cantidad++;
            if (matrix[i][j - 1] == "A") cantidad++;
          }
        } else if (i == matrix.length - 1) {
          if (j > 0 && j < matrix.length - 1) {
            if (matrix[i - 1][j] == "A") cantidad++;
            if (matrix[i][j + 1] == "A") cantidad++;
            if (matrix[i][j - 1] == "A") cantidad++;
          } else if (j == 0) {
            if (matrix[i - 1][j] == "A") cantidad++;
            if (matrix[i][j + 1] == "A") cantidad++;
          } else {
            if (matrix[i - 1][j] == "A") cantidad++;
            if (matrix[i][j - 1] == "A") cantidad++;
          }
        }
      }
      if (parseInt(matrix[i][j]) == cantidad) {
        if (i > 0 && i < matrix.length - 1) {
          if (j > 0 && j < matrix.length - 1) {
            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j]))
              escribirX(i + 1, j);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j]))
              escribirX(i - 1, j);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1]))
              escribirX(i, j + 1);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1]))
              escribirX(i, j - 1);
          } else if (j == 0) {
            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j]))
              escribirX(i + 1, j);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j]))
              escribirX(i - 1, j);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1]))
              escribirX(i, j + 1);
          } else {
            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j]))
              escribirX(i + 1, j);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j]))
              escribirX(i - 1, j);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1]))
              escribirX(i, j - 1);
          }
        } else if (i == 0) {
          if (j > 0 && j < matrix.length - 1) {
            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j]))
              escribirX(i + 1, j);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1]))
              escribirX(i, j + 1);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1]))
              escribirX(i, j - 1);
          } else if (j == 0) {
            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j]))
              escribirX(i + 1, j);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1]))
              escribirX(i, j + 1);
          } else {
            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j]))
              escribirX(i + 1, j);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1]))
              escribirX(i, j - 1);
          }
        } else if (i == matrix.length - 1) {
          if (j > 0 && j < matrix.length - 1) {
            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j]))
              escribirX(i - 1, j);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1]))
              escribirX(i, j + 1);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1]))
              escribirX(i, j - 1);
          } else if (j == 0) {
            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j]))
              escribirX(i - 1, j);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1]))
              escribirX(i, j + 1);
          } else {
            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j]))
              escribirX(i - 1, j);

            if (!["A", "B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1]))
              escribirX(i, j - 1);
          }
        }
      }
    }
  }
  dibujarTabla();
}

function verificarReglaCuatro() {
  console.log("Verificando Regla 3");
  for (var i = 0; i < matrix.length; i++) {
    var row = matrix[i];
    for (var j = 0; j < row.length; j++) {
      if (matrix[i][j] == "X") {
        var contador = 0;
        for (var a = i - 1; a >= 0; a--) {
          if (["B", "0", "1", "2", "3", "4"].includes(matrix[a][j])) break;
          if (matrix[a][j] == "E") contador++;
        }
        for (var a = i + 1; a < matrix.length; a++) {
          if (["B", "0", "1", "2", "3", "4"].includes(matrix[a][j])) break;
          if (matrix[a][j] == "E") contador++;
        }

        for (var a = j - 1; a >= 0; a--) {
          if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][a])) break;
          if (matrix[a][j] == "E") contador++;
        }
        for (var a = j + 1; a < matrix.length; a++) {
          if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][a])) break;
          if (matrix[a][j] == "E") contador++;
        }
        if (contador == 1) {
          console.log("Deberia insertar en " + i + " " + j);
          for (var a = i - 1; a >= 0; a--) {
            if (["B", "0", "1", "2", "3", "4"].includes(matrix[a][j])) break;
            if (matrix[a][j] == "E") insertarBombilla(a, j);
          }
          for (var a = i + 1; a < matrix.length; a++) {
            if (["B", "0", "1", "2", "3", "4"].includes(matrix[a][j])) break;
            if (matrix[a][j] == "E") insertarBombilla(a, j);
          }

          for (var a = j - 1; a >= 0; a--) {
            if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][a])) break;
            if (matrix[i][a] == "E") insertarBombilla(i, a);
          }
          for (var a = j + 1; a < matrix.length; a++) {
            if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][a])) break;
            if (matrix[i][a] == "E") insertarBombilla(i, a);
          }
        }
      }
    }
  }
  dibujarTabla();
}

function insertarBombilla(i, j) {
  matrix[i][j] = "A";
  console.log("Insertando en " + i + " " + j);
  console.log(matrix);
  if (i == 0) {
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j])) {
      for (var a = i + 1; a < matrix.length; a++) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[a][j])) break;
        escribirBombilla(a, j);
      }
    }
  } else if (i > 0 && i < matrix.length - 1) {
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i + 1][j])) {
      for (var a = i + 1; a < matrix.length; a++) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[a][j])) break;
        escribirBombilla(a, j);
      }
    }
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j])) {
      for (var a = i - 1; a >= 0; a--) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[a][j])) break;
        escribirBombilla(a, j);
      }
    }
  } else {
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i - 1][j])) {
      for (var a = i - 1; a >= 0; a--) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[a][j])) break;
        escribirBombilla(a, j);
      }
    }
  }
  if (j == 0) {
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1])) {
      for (var a = j + 1; a < matrix.length; a++) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][a])) break;
        escribirBombilla(i, a);
      }
    }
  } else if (j > 0 && j < matrix.length - 1) {
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i][j + 1])) {
      for (var a = j + 1; a < matrix.length; a++) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][a])) break;
        escribirBombilla(i, a);
      }
    }
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1])) {
      for (var a = j - 1; a >= 0; a--) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][a])) break;
        escribirBombilla(i, a);
      }
    }
  } else {
    if (!["B", "0", "1", "2", "3", "4"].includes(matrix[i][j - 1])) {
      for (var a = j - 1; a >= 0; a--) {
        if (["B", "0", "1", "2", "3", "4"].includes(matrix[i][a])) break;
        escribirBombilla(i, a);
      }
    }
  }
  dibujarTabla();
}

function escribirBombilla(i, j) {
  console.log("Escribiendo en " + i + " " + j);
  console.log(matrix[i][j]);
  if (matrix[i][j] == "X") {
    console.log("Si estoy escribiendo");
    matrix[i][j] = "XI";
  } else {
    console.log("no estoy escrbieno");
    matrix[i][j] = "I";
  }
  console.log(matrix);
}

function escribirX(i, j) {
  if (matrix[i][j] == "I") {
    matrix[i][j] = "XI";
  } else {
    matrix[i][j] = "X";
  }
}
