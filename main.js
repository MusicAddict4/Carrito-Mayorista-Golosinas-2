const contenedorProductos = document.getElementById("contenedor-productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalPrecio = document.getElementById("total-precio");
const botonVaciar = document.getElementById("boton-vaciar");
const botonComprar = document.getElementById("boton-comprar");

let carrito = [];
let productosDisponibles = []; 

function cargarProductos() {
    fetch("./productos.json")
        .then(response => response.json())
        .then(productos => {
            productosDisponibles = productos; 
            renderizarProductos(productos);
            inicializarEventos(); 
        })
        .catch(error => console.error("Error al cargar productos:", error));
}

function renderizarProductos(arrayDeProductos) {
    contenedorProductos.innerHTML = "";
    arrayDeProductos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-producto");
        tarjeta.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Categoría: ${producto.categoria}</p>
            <p><strong>$${producto.precio}</strong></p>
            <button class="boton-agregar" data-id="${producto.id}">Agregar al pedido</button>
        `;
        contenedorProductos.appendChild(tarjeta);
    });
}

function inicializarEventos() {
    contenedorProductos.addEventListener("click", (e) => {
        if (e.target.classList.contains("boton-agregar")) {
            const idProducto = parseInt(e.target.getAttribute("data-id"));
            agregarAlCarrito(idProducto);
        }
    });

    botonVaciar.addEventListener("click", vaciarCarrito);
    botonComprar.addEventListener("click", finalizarCompra);
}

function agregarAlCarrito(id) {
    const productoEnCarrito = carrito.find(item => item.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        const productoOriginal = productosDisponibles.find(item => item.id === id);
        carrito.push({ ...productoOriginal, cantidad: 1 });
    }

    actualizarInterfazCarrito();
}

function actualizarInterfazCarrito() {
    if (carrito.length === 0) {
        listaCarrito.innerHTML = `<p>El carrito está vacío</p>`;
        totalPrecio.innerText = "0";
        return;
    }

    listaCarrito.innerHTML = "";
    let cuentaTotal = 0;
    
    carrito.forEach(producto => {
        const item = document.createElement("div");
        item.classList.add("item-carrito");
        item.innerHTML = `
            <div> 
                <p><strong>${producto.nombre}</strong></p>
                <small>Cantidad: ${producto.cantidad} x $${producto.precio}</small>
            </div>
            <span>$${producto.precio * producto.cantidad}</span>
        `;
        listaCarrito.appendChild(item);
        cuentaTotal += producto.precio * producto.cantidad;
    });

    totalPrecio.innerText = cuentaTotal;
}

function vaciarCarrito() {
    carrito = [];
    actualizarInterfazCarrito();
}

function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            title: "¡Carrito vacío!",
            text: "Primero hay que añadir golosinas para hacer el pedido",
            icon: "warning",
            confirmButtonColor: "red"
        });
    } else {
        Swal.fire({
            title: "¡Pedido listo!",
            text: "Tu pedido se ha realizado con éxito y mucho esfuerzo!",
            icon: "success",
            confirmButtonColor: "#28a745"
        });
        vaciarCarrito();
    }
}

cargarProductos();