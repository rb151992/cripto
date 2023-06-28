//crear selectores
const moneda = document.querySelector('#moneda');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const selectCripto = document.querySelector('#criptomonedas');


//crear eventos 



const objBusqueda = {

    moneda:'',
    criptomoneda: ''

};


const obtenerCripto = criptomoneda => new Promise(resolve=>{

resolve(criptomoneda)


})

document.addEventListener('DOMContentLoaded', ()=>{

consultarCripto();


moneda.addEventListener('input',obtenerValores)
selectCripto.addEventListener('change',obtenerValores)
formulario.addEventListener('submit',cotizar)

})



function consultarCripto(){
    //url del top list del market cap del API
    
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

   fetch(url) 
    .then(respuesta => respuesta.json())//consulta fue exitosa
    .then(resultado => obtenerCripto(resultado.Data))
    .then(criptomonedas => selectCriptomonedas(criptomonedas))
    .catch(error=>console.log(error))
}

function selectCriptomonedas(criptomonedas){

criptomonedas.forEach(cripto=> {
    
    const {Name, FullName} = cripto.CoinInfo;
    const option = document.createElement('option')
    option.textContent = FullName
    option.value = Name;
    //insertar en el html NECESITO
    selectCripto.appendChild(option)

});


}


function obtenerValores(e){


    objBusqueda[e.target.name] = e.target.value;

}

function cotizar(e){
    e.preventDefault();

// consultar los valores guardados en el objeto

const{moneda, criptomoneda} = objBusqueda;

if(moneda=== '' || criptomoneda===''){

mostrarError('los campos mostrados son obligatorios')
return;
}

consultarAPI();

}

function mostrarError(mensaje){

    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');

    //mostrar mensaje de error 
    divMensaje.textContent = mensaje;

    //insertar en el html 
    formulario.appendChild(divMensaje)

    // bloque de error va a desaparecer luego de 5 segundos 

    setTimeout(()=>{

        divMensaje.remove();
    },5000);
}

function limpiarHTML(){

    while(resultado.firstChild){

        resultado.removeChild(resultado.firstChild)    
    }
}

function mostrarResultado(cotizacion){

    limpiarHTML();

    const {CHANGEPCT24HOUR, PRICE, HIGHDAY, LOWDAY, LASTUPDATE} = cotizacion;

    const ult24Horas = document.createElement('p');
    ult24Horas.innerHTML = `<p>Variacion ultimas 24 horas:${CHANGEPCT24HOUR}</p>`
   
    const precio = document.createElement('p');
    precio.innerHTML = `<p>El precio es:${PRICE}</p>`
    
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>El precio mas alto del dia es:${HIGHDAY}</p>`
    
    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>El precio mas bajo del dia es:${LOWDAY}</p>`

    const ultAct = document.createElement('p');
    ultAct.innerHTML = `<p>La ultima actualizacion es:${LASTUPDATE}</p>`


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ult24Horas);
    resultado.appendChild(ultAct);

    formulario.appendChild(resultado);





}

function mostrarSpinner(){

    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner')

    //mostrar en el HTML

    spinner.innerHTML = `
    
    <div class = "bounce1"></div>
    <div class = "bounce2"></div>
    <div class = "bounce3"></div>

    `;

    //mostrar en el html

    resultado.appendChild(spinner)

}

function consultarAPI(){

    const {moneda,criptomoneda} = objBusqueda;


    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    
    mostrarSpinner();
    
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizar => {

            mostrarResultado(cotizar.DISPLAY[criptomoneda][moneda])
        })


}