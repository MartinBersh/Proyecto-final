

const menu = document.querySelector(".hamburguesa");
const navegacion =  document.querySelector(".navegacion");
const imagenes = document.querySelectorAll("img");

document.addEventListener("DOMContentLoaded",()=>{
    eventos();
});

const eventos = () =>{
    menu.addEventListener("click",abrirMenu);
}

const abrirMenu = () =>{
    navegacion.classList.remove("ocultar");
    botonCerrar();
}   

const botonCerrar = () =>{
    const btnCerrar = document.createElement("p");
    const overlay = document.createElement("div");
    overlay.classList.add("pantalla-completa");
    const body = document.querySelector("body");
    if(document.querySelectorAll(".pantalla-completa").length > 0 )return;
    body.appendChild(overlay);
    btnCerrar.textContent = "x";
    btnCerrar.classList.add("btn-cerrar");

    while(navegacion.children[5]){
        navegacion.removeChild(navegacion.children[5]); 
    }
    navegacion.appendChild(btnCerrar);
    cerrarMenu(btnCerrar,overlay);
}   

const observer = new IntersectionObserver((entries, observer)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                const imagen = entry.target;
                imagen.src = imagen.dataset.src;
                observer.unobserve(imagen);
            }
        });
});

imagenes.forEach(imagen=>{
    observer.observe(imagen);
});

const cerrarMenu = (boton,overlay) =>{
    boton.addEventListener("click",()=>{
        navegacion.classList.add("ocultar")
        overlay.remove();
    });

    overlay.onclick = function(){
        overlay.remove();
        navegacion.classList.add("ocultar");
    }
}


//===================================//

const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', e => { fetchData() });
cards.addEventListener('click', e => { addCarrito(e) });
items.addEventListener('click', e => { btnAumentarDisminuir(e) })

const fetchData = async () => {
    const res = await fetch('api.json');
    const data = await res.json()
    pintarCards(data)
}

const pintarCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('button').dataset.id = item.id
        templateCard.querySelector('img').setAttribute("src", item.imagen)

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = item => {
    const producto = {
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = { ...producto }
    
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
}

const pintarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío con innerHTML</th>
        `
        return
    }
    
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

}

const btnAumentarDisminuir = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
    }
    e.stopPropagation()
}