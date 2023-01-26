const criptomonedasSelect = document.querySelector(`#criptomonedas`);
const monedasSelect = document.querySelector(`#moneda`);
const formulario = document.querySelector(`#formulario`);
const resultado = document.querySelector(`#resultado`);

const objBusqueda = {
    moneda: ``,
    criptomoneda: ``,
}

//Crear un promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

document.addEventListener(`DOMContentLoaded`, () =>{
    consultarCriptomonedas();

    formulario.addEventListener(`submit`, submitFormulario);

    criptomonedasSelect.addEventListener(`change`, leerValor);
    monedasSelect.addEventListener(`change`, leerValor);
})

function consultarCriptomonedas(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=15&tsym=USD`;

    fetch (url)
        .then( respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement(`option`);
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option)
    })
}


function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
    
}

function submitFormulario(e) {
    e.preventDefault();

    //Validar
    const {moneda, criptomonedas} = objBusqueda;

    if(moneda === `` || criptomonedas ===``){
        mostrarAlerta(`Ambos campos son obligatorios`);
    }

    //Consultar la API con los resultados
    consultarAPI();
}

function mostrarAlerta(msg){
    
    const existeError = document.querySelector(`.error`);

    if(!existeError){
        const divMensaje = document.createElement(`div`);
        divMensaje.classList.add(`error`);
    
        //mensaje de error
        divMensaje.textContent = msg;
    
        formulario.appendChild(divMensaje);
    
        setTimeout(()=>{
            divMensaje.remove();
        },3000);
    }
  
}
function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion =>{
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacionHTML(cotizacion) {
    
    limpiarHTML();
    
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement(`p`);
    precio.classList.add(`precio`);
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement(`p`);
    precioAlto.innerHTML = `<p>Precio más alto del dia: <span>${HIGHDAY}</span></p>`
    
    const precioBajo = document.createElement(`p`);
    precioBajo.innerHTML = `<p>Precio más bajo del dia: <span>${LOWDAY}</span></p>`
    
    const ultimas24Horas = document.createElement(`p`);
    ultimas24Horas.innerHTML = `<p>Variación de ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`
    
    const ultimaActualizacion = document.createElement(`p`);
    ultimaActualizacion.innerHTML = `<p>Ultima actualización: <span>${LASTUPDATE}</span></p>`

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimas24Horas);
    resultado.appendChild(ultimaActualizacion);
};

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}