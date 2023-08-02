let paises = [];
let numeroJugada = 0;
let paisOrigen = undefined;
let paisDestino = undefined;
let historialPaises = [];

let btnReset = document.getElementById("btnReset");
let idPaisOrigen = document.getElementById("idPaisOrigen");
let idPaisDestino = document.getElementById("idPaisDestino");
let idNumeroJugada = document.getElementById("idNumeroJugada");
let idHistorialPaises = document.getElementById("historialPaises");
let cajaBanderas = document.getElementById("cajaBanderas");
let idVictoria = document.getElementById("victoria");
let idBanderaVictoria = document.getElementById("banderaVictoria");

buscarPaises();

function buscarPaises() {

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let strRespuesta = xhr.responseText;
            let arrayPaises = JSON.parse(strRespuesta);

            for (let pais of arrayPaises) {
                paises.push(new Pais(pais.cca3, pais.name.common, pais.flags.png, pais.borders));
            }
        }
    }

    xhr.open("GET", "https://restcountries.com/v3.1/all");
    xhr.send();

}

class Pais {
    constructor(codigo, nombre, bandera, fronteras) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.bandera = bandera;
        this.fronteras = fronteras;
    }
}

function visitar(codigo) {

    cajaBanderas.innerHTML = "";
    
    let pais = getPaisByCodigo(codigo);
    paisOrigen = pais;
    historialPaises.push(pais.nombre);

    if(pais.nombre === paisDestino.nombre){
        idVictoria.innerHTML = "HAS GANADO";

        let bandera = paisDestino.bandera;
        idBanderaVictoria.src = bandera;
        idBanderaVictoria.hidden = false;
    } else{
        
        let fila = document.createElement("div");

        for (let frontera of pais.fronteras) {
            let btnPais = document.createElement("button");
            btnPais.classList.add("btn", "btn-success", "m-2");
            let paisFrontera = getPaisByCodigo(frontera);
            
            btnPais.innerHTML = `${paisFrontera.nombre}`

            let imagen = document.createElement("img");
            imagen.className = "imagenBandera";
            imagen.setAttribute("src",  paisFrontera.bandera);
            imagen.setAttribute("alt", `Bandera de ${paisFrontera.nombre}`);
            btnPais.append(imagen);

            btnPais.addEventListener("click", () => {
                numeroJugada += 1;
                visitar(frontera);
            });

            fila.appendChild(btnPais);
        }
        cajaBanderas.appendChild(fila);
    }

    refreshView();
}

function getPaisByCodigo(codigo) {
    for (let pais of paises) {
        if (pais.codigo === codigo) {
            return pais;
        }
    }
}

function getPaisAleatorio() {
    let encontrado = false;
    let pais = undefined;
    while (!encontrado) {
        pais = paises[Math.floor(Math.random() * paises.length)];
        encontrado = pais.fronteras;
    }

    return pais;
}

function getHistorialPaises(){
    let paisesVisitados = `ORIGEN: ${historialPaises[0]}, `;
    for(let i = 1; i < historialPaises.length; i++){
        paisesVisitados += `${i} ${historialPaises[i]}, `
    }
    return paisesVisitados.substring(0, paisesVisitados.length - 2);
}

function reset() {
    numeroJugada = 0;
    paisOrigen = getPaisAleatorio();

    do {
        paisDestino = getPaisAleatorio();
    } while(paisOrigen.nombre === paisDestino.nombre);
    
    historialPaises = [];
    visitar(paisOrigen.codigo);

    idVictoria.innerHTML = "";
    idBanderaVictoria.src = "";
    idBanderaVictoria.hidden = true;

    refreshView();
}

function refreshView() {
    idPaisOrigen.innerHTML = paisOrigen.nombre;
    idPaisDestino.innerHTML = paisDestino.nombre;
    idNumeroJugada.innerHTML = numeroJugada;
    idHistorialPaises.innerHTML = getHistorialPaises();
}

// ******************************************************
// 
// Añadimos listeners
// 
// ******************************************************

btnReset.addEventListener("click", () => {
    reset();
});
